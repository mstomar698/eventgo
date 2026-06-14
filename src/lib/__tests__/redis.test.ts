import { describe, it, expect, vi, afterEach } from 'vitest';
import { getSharedStore } from '../redis';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
});

function configure() {
  process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'tok';
}

describe('getSharedStore', () => {
  it('returns null when not configured (feature off)', () => {
    expect(getSharedStore()).toBeNull();
  });

  it('returns null if only one var is set', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io';
    expect(getSharedStore()).toBeNull();
  });
});

describe('SharedStore via Upstash REST', () => {
  it('incrWithExpiry pipelines INCR + EXPIRE NX and returns the count', async () => {
    configure();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ result: 4 }, { result: 1 }],
    });
    vi.stubGlobal('fetch', fetchMock);

    const store = getSharedStore()!;
    const count = await store.incrWithExpiry('rl:key', 60);
    expect(count).toBe(4);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.upstash.io/pipeline');
    expect(init.headers.Authorization).toBe('Bearer tok');
    expect(JSON.parse(init.body)).toEqual([
      ['INCR', 'rl:key'],
      ['EXPIRE', 'rl:key', 60, 'NX'],
    ]);
  });

  it('get returns the value, or null when absent', async () => {
    configure();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ result: 'hello' }] })
    );
    expect(await getSharedStore()!.get('cache:x')).toBe('hello');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ result: null }] })
    );
    expect(await getSharedStore()!.get('cache:missing')).toBeNull();
  });

  it('setEx issues SET ... EX', async () => {
    configure();
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [{ result: 'OK' }] });
    vi.stubGlobal('fetch', fetchMock);

    await getSharedStore()!.setEx('cache:x', 'v', 900);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual([
      ['SET', 'cache:x', 'v', 'EX', 900],
    ]);
  });

  it('throws on a non-ok response (callers catch and fall back)', async () => {
    configure();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(getSharedStore()!.get('k')).rejects.toThrow();
  });
});
