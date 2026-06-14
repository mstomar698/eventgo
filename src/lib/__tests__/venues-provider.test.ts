import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  mapFoursquarePlace,
  formatVenueResults,
  searchFoursquareVenues,
  scoreVenues,
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
        fsq_place_id: 'abc123',
        name: 'Grand Hall',
        latitude: 40.74,
        longitude: -73.99,
        distance: 215,
        location: { formatted_address: '1 Main St', locality: 'Springfield' },
        categories: [{ name: 'Event Space' }],
      })
    ).toEqual({
      name: 'Grand Hall',
      category: 'Event Space',
      address: '1 Main St',
      locality: 'Springfield',
      latitude: 40.74,
      longitude: -73.99,
      distance: 215,
      fsqId: 'abc123',
    });
  });

  it('falls back to location.address when formatted_address is absent', () => {
    expect(
      mapFoursquarePlace({ name: 'X', location: { address: '5 Side St' } }).address
    ).toBe('5 Side St');
  });

  it('applies safe defaults for a sparse place', () => {
    expect(mapFoursquarePlace({})).toMatchObject({
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

describe('scoreVenues', () => {
  it('ranks a closer, event-appropriate venue above a far, generic one', () => {
    const ranked = scoreVenues([
      { name: 'Far Shop', category: 'Hardware Store', distance: 5000 },
      { name: 'Near Hall', category: 'Event Hall', distance: 100 },
    ]);
    expect(ranked[0].name).toBe('Near Hall');
    expect(ranked[0].fitScore!).toBeGreaterThan(ranked[1].fitScore!);
  });

  it('assigns every venue a 0–100 fitScore', () => {
    const ranked = scoreVenues([{ name: 'A', category: 'Cafe', distance: 0 }]);
    expect(ranked[0].fitScore).toBeGreaterThanOrEqual(0);
    expect(ranked[0].fitScore).toBeLessThanOrEqual(100);
  });

  it('does not crash when distances are absent', () => {
    const ranked = scoreVenues([{ name: 'A' }, { name: 'B', category: 'Banquet Hall' }]);
    expect(ranked).toHaveLength(2);
    // category bonus still applies
    expect(ranked[0].name).toBe('B');
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
    expect(result).toMatchObject([{ name: 'Grand Hall', category: 'Hall' }]);
    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain('near=Springfield');
    // Uses the current Places API auth (Bearer + version header).
    const calledInit = fetchMock.mock.calls[0][1] as { headers: Record<string, string> };
    expect(calledInit.headers.Authorization).toBe('Bearer test-key');
    expect(calledInit.headers['X-Places-Api-Version']).toBeDefined();
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
