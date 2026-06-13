import { describe, it, expect, beforeEach } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  consume,
  getClientKey,
  enforceRateLimit,
  aiRateLimit,
  flowsRateLimit,
  _store,
  type RateLimitRule,
} from '../rate-limit';

const RULE: RateLimitRule = {
  windowMs: 1000,
  max: 3,
  code: 'TEST',
  message: 'slow down',
};

beforeEach(() => _store.clear());

describe('consume', () => {
  it('allows requests up to max, then blocks', () => {
    const now = 1_000_000;
    expect(consume('k', RULE, now).allowed).toBe(true);
    expect(consume('k', RULE, now).allowed).toBe(true);
    expect(consume('k', RULE, now).allowed).toBe(true);
    const fourth = consume('k', RULE, now);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it('decrements remaining as requests are consumed', () => {
    const now = 1_000_000;
    expect(consume('k', RULE, now).remaining).toBe(2);
    expect(consume('k', RULE, now).remaining).toBe(1);
    expect(consume('k', RULE, now).remaining).toBe(0);
  });

  it('resets after the window elapses', () => {
    const now = 1_000_000;
    consume('k', RULE, now);
    consume('k', RULE, now);
    consume('k', RULE, now);
    expect(consume('k', RULE, now).allowed).toBe(false);
    // Past the window → fresh budget
    const later = now + RULE.windowMs + 1;
    expect(consume('k', RULE, later).allowed).toBe(true);
  });

  it('keeps separate budgets per key', () => {
    const now = 1_000_000;
    consume('a', RULE, now);
    consume('a', RULE, now);
    consume('a', RULE, now);
    expect(consume('a', RULE, now).allowed).toBe(false);
    expect(consume('b', RULE, now).allowed).toBe(true);
  });

  it('reports retryAfter in seconds', () => {
    const r = consume('k', RULE, 1_000_000);
    expect(r.retryAfterSeconds).toBe(1); // 1000ms window → 1s
  });

  it('allows flowsRateLimit.max autosaves then blocks the next', () => {
    const now = 1_000_000;
    let last;
    for (let i = 0; i < flowsRateLimit.max; i++) {
      last = consume('flow', flowsRateLimit, now);
    }
    expect(last?.allowed).toBe(true);
    expect(consume('flow', flowsRateLimit, now).allowed).toBe(false);
  });
});

describe('getClientKey', () => {
  it('uses the left-most x-forwarded-for address', () => {
    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
      socket: {},
    } as unknown as NextApiRequest;
    expect(getClientKey(req)).toBe('1.2.3.4');
  });

  it('falls back to the socket remote address', () => {
    const req = {
      headers: {},
      socket: { remoteAddress: '9.9.9.9' },
    } as unknown as NextApiRequest;
    expect(getClientKey(req)).toBe('9.9.9.9');
  });

  it('returns "unknown" when nothing is available', () => {
    const req = { headers: {}, socket: {} } as unknown as NextApiRequest;
    expect(getClientKey(req)).toBe('unknown');
  });
});

function mockReqRes(ip: string) {
  const headers: Record<string, string> = {};
  let statusCode = 0;
  let body: unknown;
  const req = {
    headers: { 'x-forwarded-for': ip },
    socket: {},
  } as unknown as NextApiRequest;
  const res = {
    setHeader: (k: string, v: string) => {
      headers[k] = v;
    },
    status: (c: number) => {
      statusCode = c;
      return res;
    },
    json: (p: unknown) => {
      body = p;
      return res;
    },
  } as unknown as NextApiResponse;
  return { req, res, getStatus: () => statusCode, getBody: () => body, headers };
}

describe('enforceRateLimit', () => {
  it('allows the first request and sets RateLimit headers', () => {
    const { req, res, headers, getStatus } = mockReqRes('1.1.1.1');
    const ok = enforceRateLimit(req, res, RULE);
    expect(ok).toBe(true);
    expect(headers['RateLimit-Limit']).toBe('3');
    expect(headers['RateLimit-Remaining']).toBe('2');
    expect(getStatus()).toBe(0); // no error sent
  });

  it('sends a 429 with Retry-After once the limit is exceeded', () => {
    const ip = '2.2.2.2';
    for (let i = 0; i < RULE.max; i++) {
      const { req, res } = mockReqRes(ip);
      expect(enforceRateLimit(req, res, RULE)).toBe(true);
    }
    const { req, res, getStatus, getBody, headers } = mockReqRes(ip);
    const ok = enforceRateLimit(req, res, RULE);
    expect(ok).toBe(false);
    expect(getStatus()).toBe(429);
    expect(headers['Retry-After']).toBeDefined();
    expect(getBody()).toMatchObject({ success: false, error: { code: 'TEST' } });
  });

  it('namespaces by rule code so different rules do not share a budget', () => {
    const ip = '3.3.3.3';
    // Exhaust the test RULE
    for (let i = 0; i < RULE.max; i++) {
      const { req, res } = mockReqRes(ip);
      enforceRateLimit(req, res, RULE);
    }
    // A different rule (aiRateLimit) for the same IP is unaffected
    const { req, res } = mockReqRes(ip);
    expect(enforceRateLimit(req, res, aiRateLimit)).toBe(true);
  });
});
