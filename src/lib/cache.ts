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

import { getSharedStore } from './redis';

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

/** In-memory get — also the fallback when no shared store is configured. */
export function getCachedInMemory(
  key: string,
  now: number = Date.now()
): string | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= now) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

/** In-memory set — also the fallback when no shared store is configured. */
export function setCachedInMemory(
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

/**
 * Returns the cached value if present and unexpired. Uses the shared Redis store when
 * configured, else in-memory. Falls back to memory if the shared store errors.
 */
export async function getCached(
  key: string,
  now: number = Date.now()
): Promise<string | undefined> {
  const sharedStore = getSharedStore();
  if (sharedStore) {
    try {
      const value = await sharedStore.get(`cache:${key}`);
      return value ?? undefined;
    } catch {
      // fall through to in-memory
    }
  }
  return getCachedInMemory(key, now);
}

/** Stores a value under `key` for `ttlMs`. Writes to the shared store when configured. */
export async function setCached(
  key: string,
  value: string,
  ttlMs: number = DEFAULT_TTL_MS,
  now: number = Date.now()
): Promise<void> {
  const sharedStore = getSharedStore();
  if (sharedStore) {
    try {
      await sharedStore.setEx(`cache:${key}`, value, Math.ceil(ttlMs / 1000));
      return;
    } catch {
      // fall through to in-memory
    }
  }
  setCachedInMemory(key, value, ttlMs, now);
}
