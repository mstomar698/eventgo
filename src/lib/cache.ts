/**
 * Tiny in-process TTL cache for idempotent, expensive responses (e.g. AI suggestions).
 *
 * Purpose: identical prompts shouldn't pay the Gemini cost/latency twice within a short
 * window. This trades a little response variety for cost and speed — acceptable for the
 * suggestion endpoints.
 *
 * NOTE ON SERVERLESS: like the rate limiter, this is per-instance memory. On Vercel each
 * instance has its own cache, so the hit rate is lower than a shared cache (Redis/Upstash)
 * would give, but it still removes duplicate calls within a single warm instance.
 */

interface Entry {
  value: string;
  expiresAt: number;
}

const store = new Map<string, Entry>();
const MAX_ENTRIES = 500;
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Exposed for tests.
export const _cacheStore = store;

/** Builds a stable cache key from parts (e.g. namespace, model, normalized query). */
export function cacheKey(...parts: string[]): string {
  return parts.map((p) => p.trim().toLowerCase()).join('|');
}

/** Returns the cached value if present and unexpired, else undefined. */
export function getCached(key: string, now: number = Date.now()): string | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= now) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

/** Stores a value under `key` for `ttlMs`. Evicts the oldest entry when full. */
export function setCached(
  key: string,
  value: string,
  ttlMs: number = DEFAULT_TTL_MS,
  now: number = Date.now()
): void {
  if (store.size >= MAX_ENTRIES && !store.has(key)) {
    // Map preserves insertion order — delete the oldest entry.
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key, { value, expiresAt: now + ttlMs });
}
