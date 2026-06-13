import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateGeminiText } from '../gemini';

function mockResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

const okBody = {
  candidates: [{ content: { parts: [{ text: 'hello world' }] } }],
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('generateGeminiText', () => {
  it('returns the joined, trimmed text on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockResponse(200, okBody));
    vi.stubGlobal('fetch', fetchMock);

    const text = await generateGeminiText({ apiKey: 'k', prompt: 'hi' });
    expect(text).toBe('hello world');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('fails fast on a 4xx client error without retrying', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockResponse(400, { error: { message: 'bad key' } }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      generateGeminiText({ apiKey: 'k', prompt: 'hi', retries: 2 })
    ).rejects.toThrow('bad key');
    expect(fetchMock).toHaveBeenCalledTimes(1); // no retry on deterministic 4xx
  });

  it('retries on a 5xx then succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(503, { error: { message: 'overloaded' } }))
      .mockResolvedValue(mockResponse(200, okBody)); // any retry succeeds
    vi.stubGlobal('fetch', fetchMock);

    const text = await generateGeminiText({ apiKey: 'k', prompt: 'hi', retries: 2 });
    expect(text).toBe('hello world');
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2); // retried after the 503
  });

  it('fails fast when the model returns no text (blocked/empty)', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(mockResponse(200, { candidates: [{ finishReason: 'SAFETY' }] }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      generateGeminiText({ apiKey: 'k', prompt: 'hi', retries: 2 })
    ).rejects.toThrow(/no text \(SAFETY\)/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('treats a 429 as retryable', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(mockResponse(429, { error: { message: 'rate limited' } }))
      .mockResolvedValue(mockResponse(200, okBody)); // any retry succeeds
    vi.stubGlobal('fetch', fetchMock);

    const text = await generateGeminiText({ apiKey: 'k', prompt: 'hi', retries: 2 });
    expect(text).toBe('hello world');
    expect(fetchMock.mock.calls.length).toBeGreaterThanOrEqual(2); // 429 was retried
  });
});
