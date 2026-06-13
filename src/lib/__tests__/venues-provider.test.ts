import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  mapFoursquarePlace,
  formatVenueResults,
  searchFoursquareVenues,
} from '../venues-provider';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.FOURSQUARE_API_KEY;
});

describe('mapFoursquarePlace', () => {
  it('maps a full place', () => {
    expect(
      mapFoursquarePlace({
        name: 'Grand Hall',
        location: { formatted_address: '1 Main St', locality: 'Springfield' },
        categories: [{ name: 'Event Space' }],
      })
    ).toEqual({
      name: 'Grand Hall',
      category: 'Event Space',
      address: '1 Main St',
      locality: 'Springfield',
    });
  });

  it('applies safe defaults for a sparse place', () => {
    expect(mapFoursquarePlace({})).toEqual({
      name: 'Unnamed venue',
      category: undefined,
      address: undefined,
      locality: undefined,
    });
  });
});

describe('formatVenueResults', () => {
  it('renders a numbered list with a location header', () => {
    const out = formatVenueResults(
      [{ name: 'Grand Hall', category: 'Event Space', address: '1 Main St' }],
      'Springfield'
    );
    expect(out).toContain('Venues near Springfield:');
    expect(out).toContain('1. **Grand Hall** (Event Space — 1 Main St)');
  });
});

describe('searchFoursquareVenues', () => {
  it('returns null when no API key is configured (feature off)', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await searchFoursquareVenues({ query: 'hall' });
    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled(); // never hits the network without a key
  });

  it('returns mapped results when configured and the API responds', async () => {
    process.env.FOURSQUARE_API_KEY = 'test-key';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ name: 'Grand Hall', categories: [{ name: 'Hall' }] }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await searchFoursquareVenues({ query: 'hall', near: 'Springfield' });
    expect(result).toEqual([
      { name: 'Grand Hall', category: 'Hall', address: undefined, locality: undefined },
    ]);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('near=Springfield');
  });

  it('returns null on a non-ok response (caller falls back)', async () => {
    process.env.FOURSQUARE_API_KEY = 'test-key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
    );
    expect(await searchFoursquareVenues({ query: 'hall' })).toBeNull();
  });

  it('returns null on a network error', async () => {
    process.env.FOURSQUARE_API_KEY = 'test-key';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')));
    expect(await searchFoursquareVenues({ query: 'hall' })).toBeNull();
  });

  it('returns null when results are empty', async () => {
    process.env.FOURSQUARE_API_KEY = 'test-key';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ results: [] }) })
    );
    expect(await searchFoursquareVenues({ query: 'hall' })).toBeNull();
  });
});
