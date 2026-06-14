import { getEnvVar } from './env';

/**
 * Optional shared store backed by Upstash Redis (REST API).
 *
 * OPT-IN: returns null unless both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are
 * set. When configured, the rate limiter and response cache use it so limits/cache are shared
 * across serverless instances instead of being per-instance memory. Without it, they fall
 * back to the in-process implementations — no behavior change on deploys without the vars.
 *
 * Upstash REST docs: https://upstash.com/docs/redis/features/restapi
 */

export interface SharedStore {
  /** Atomically increments `key`, setting a TTL on first write. Returns the new count. */
  incrWithExpiry(key: string, ttlSeconds: number): Promise<number | null>;
  get(key: string): Promise<string | null>;
  setEx(key: string, value: string, ttlSeconds: number): Promise<void>;
}

interface UpstashResult {
  result?: unknown;
  error?: string;
}

function makeUpstashStore(url: string, token: string): SharedStore {
  const base = url.replace(/\/$/, '');

  async function pipeline(commands: unknown[][]): Promise<UpstashResult[]> {
    const res = await fetch(`${base}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });
    if (!res.ok) {
      throw new Error(`Upstash request failed with status ${res.status}`);
    }
    return (await res.json()) as UpstashResult[];
  }

  return {
    async incrWithExpiry(key, ttlSeconds) {
      // INCR, then set the TTL only if the key has none yet (NX) — keeps the window fixed.
      const out = await pipeline([
        ['INCR', key],
        ['EXPIRE', key, ttlSeconds, 'NX'],
      ]);
      const count = out?.[0]?.result;
      return typeof count === 'number' ? count : null;
    },
    async get(key) {
      const out = await pipeline([['GET', key]]);
      const value = out?.[0]?.result;
      return value == null ? null : String(value);
    },
    async setEx(key, value, ttlSeconds) {
      await pipeline([['SET', key, value, 'EX', ttlSeconds]]);
    },
  };
}

/** Returns the shared store when configured, else null (callers fall back to in-memory). */
export function getSharedStore(): SharedStore | null {
  const url = getEnvVar('UPSTASH_REDIS_REST_URL');
  const token = getEnvVar('UPSTASH_REDIS_REST_TOKEN');
  if (!url || !token) return null;
  return makeUpstashStore(url, token);
}
