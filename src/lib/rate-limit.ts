import type { NextApiRequest, NextApiResponse } from 'next';
import { sendError } from './api-utils';
import { getSharedStore } from './redis';

/**
 * Lightweight, dependency-free fixed-window rate limiter for Next.js API routes.
 *
 * The previous implementation exported `express-rate-limit` middleware, which does not
 * compose with Next.js pages-API handlers (no `(req, res, next)` chain, no `req.ip`).
 * This version is a plain function you call at the top of a handler.
 *
 * NOTE ON SERVERLESS: the store below is in-process memory. On a single long-lived server
 * it enforces limits correctly. On serverless/multi-instance platforms (e.g. Vercel) each
 * instance keeps its own counter, so this provides best-effort, per-instance throttling and
 * basic abuse protection — not a globally exact limit. For strict global limits, back this
 * with a shared store (Redis/Upstash) behind the same interface. Tracked in epic #11.
 */

export interface RateLimitRule {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Max requests allowed per IP per window. */
  max: number;
  /** Error code returned when the limit is exceeded. */
  code: string;
  /** Human-readable message returned when the limit is exceeded. */
  message: string;
}

// General API rate limiter: 100 requests / 15 minutes.
export const generalRateLimit: RateLimitRule = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  code: 'RATE_LIMIT_EXCEEDED',
  message: 'Too many requests, please try again later.',
};

// Planner autosave limiter: generous (120/min) so debounced saves are never blocked,
// but a script hammering /api/flows is throttled.
export const flowsRateLimit: RateLimitRule = {
  windowMs: 60 * 1000,
  max: 120,
  code: 'FLOWS_RATE_LIMIT_EXCEEDED',
  message: 'Too many save requests, please slow down.',
};

// Stricter limiter for AI endpoints: 10 requests / minute.
export const aiRateLimit: RateLimitRule = {
  windowMs: 60 * 1000,
  max: 10,
  code: 'AI_RATE_LIMIT_EXCEEDED',
  message: 'AI request limit exceeded, please wait before trying again.',
};

// Auth limiter: 5 attempts / 15 minutes.
export const authRateLimit: RateLimitRule = {
  windowMs: 15 * 60 * 1000,
  max: 5,
  code: 'AUTH_RATE_LIMIT_EXCEEDED',
  message: 'Too many authentication attempts, please try again later.',
};

interface WindowState {
  count: number;
  resetAt: number;
}

// key -> window state. Exported only so tests can reset it.
export const _store = new Map<string, WindowState>();

// Avoid unbounded growth: sweep expired entries when the map gets large.
const SWEEP_THRESHOLD = 5000;

function sweep(now: number) {
  for (const [key, state] of _store) {
    if (state.resetAt <= now) _store.delete(key);
  }
}

export interface ConsumeResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

/**
 * In-memory fixed-window accounting. Records one hit for `key` under `rule` at time `now`.
 * Exposed for unit testing; also the fallback when no shared store is configured.
 */
export function consumeInMemory(
  key: string,
  rule: RateLimitRule,
  now: number
): ConsumeResult {
  if (_store.size > SWEEP_THRESHOLD) sweep(now);

  const existing = _store.get(key);
  let state: WindowState;
  if (!existing || existing.resetAt <= now) {
    state = { count: 0, resetAt: now + rule.windowMs };
  } else {
    state = existing;
  }

  state.count += 1;
  _store.set(key, state);

  const allowed = state.count <= rule.max;
  const remaining = Math.max(0, rule.max - state.count);
  const retryAfterSeconds = Math.max(0, Math.ceil((state.resetAt - now) / 1000));

  return {
    allowed,
    limit: rule.max,
    remaining,
    resetAt: state.resetAt,
    retryAfterSeconds,
  };
}

/**
 * Records one hit for `key` under `rule`. Uses the shared Redis store when configured (so
 * limits are global across instances), otherwise the in-memory window. Falls back to memory
 * if the shared store errors, so a Redis outage degrades gracefully rather than failing open.
 */
export async function consume(
  key: string,
  rule: RateLimitRule,
  now: number
): Promise<ConsumeResult> {
  const store = getSharedStore();
  if (store) {
    try {
      const ttlSeconds = Math.ceil(rule.windowMs / 1000);
      const count = await store.incrWithExpiry(`rl:${key}`, ttlSeconds);
      if (count !== null) {
        return {
          allowed: count <= rule.max,
          limit: rule.max,
          remaining: Math.max(0, rule.max - count),
          resetAt: now + rule.windowMs,
          retryAfterSeconds: ttlSeconds,
        };
      }
    } catch {
      // Shared store unavailable → fall back to the in-memory window.
    }
  }
  return consumeInMemory(key, rule, now);
}

/**
 * Derives a client identifier from the request. Prefers the left-most address in
 * `x-forwarded-for` (the original client behind proxies), falling back to the socket.
 */
export function getClientKey(req: NextApiRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0].trim();
  }
  if (Array.isArray(fwd) && fwd.length > 0) {
    return fwd[0];
  }
  return req.socket?.remoteAddress ?? 'unknown';
}

/**
 * Enforces `rule` for the current request. Sets `RateLimit-*` headers and, when the limit
 * is exceeded, sends a standard 429 error response and returns `false`. Returns `true` when
 * the request is allowed and the handler should continue.
 *
 * Usage:
 *   if (!(await enforceRateLimit(req, res, aiRateLimit))) return;
 */
export async function enforceRateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  rule: RateLimitRule,
  namespace?: string
): Promise<boolean> {
  const key = `${namespace ?? rule.code}:${getClientKey(req)}`;
  const result = await consume(key, rule, Date.now());

  res.setHeader('RateLimit-Limit', String(result.limit));
  res.setHeader('RateLimit-Remaining', String(result.remaining));
  res.setHeader('RateLimit-Reset', String(result.retryAfterSeconds));

  if (!result.allowed) {
    res.setHeader('Retry-After', String(result.retryAfterSeconds));
    sendError(res, 429, { code: rule.code, message: rule.message });
    return false;
  }
  return true;
}
