import { describe, it, expect, beforeEach } from 'vitest';
import { cacheKey, getCached, setCached, _cacheStore } from '../cache';

beforeEach(() => _cacheStore.clear());

describe('cacheKey', () => {
  it('normalizes parts to a stable, case-insensitive, trimmed key', () => {
    expect(cacheKey('venues', 'Gemini', '  Birthday Party ')).toBe(
      'venues|gemini|birthday party'
    );
  });
});

// No UPSTASH_* env in tests → get/setCached use the in-memory store.
describe('get/set', () => {
  it('returns a stored value before expiry', async () => {
    await setCached('k', 'hello', 1000, 1_000_000);
    expect(await getCached('k', 1_000_500)).toBe('hello');
  });

  it('returns undefined for a missing key', async () => {
    expect(await getCached('nope')).toBeUndefined();
  });

  it('expires entries after the TTL and evicts them', async () => {
    await setCached('k', 'hello', 1000, 1_000_000);
    expect(await getCached('k', 1_000_000 + 1001)).toBeUndefined();
    expect(_cacheStore.has('k')).toBe(false); // lazily deleted on read
  });

  it('overwrites an existing key with a fresh TTL', async () => {
    await setCached('k', 'old', 1000, 1_000_000);
    await setCached('k', 'new', 1000, 1_000_000);
    expect(await getCached('k', 1_000_500)).toBe('new');
  });
});
