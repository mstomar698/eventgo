import { getEnvVar } from './env';

/**
 * Real venue data via the Foursquare Places API.
 *
 * This is OPT-IN: if `FOURSQUARE_API_KEY` is not set, `searchFoursquareVenues` returns null
 * and callers fall back to the existing rule-based / AI-text suggestions. So the feature is
 * inactive (and harmless) until a key is provided — no behavior change on deploys without it.
 *
 * Uses the current Places API (places-api.foursquare.com, Bearer auth, dated version header);
 * the legacy api.foursquare.com/v3 endpoint is deprecated.
 * Docs: https://docs.foursquare.com/fsq-developers-places/reference/place-search
 */

export interface VenueResult {
  name: string;
  category?: string;
  address?: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  /** Metres from the searched location, when Foursquare provides it. */
  distance?: number;
  fsqId?: string;
}

interface FoursquarePlace {
  fsq_place_id?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  location?: {
    formatted_address?: string;
    address?: string;
    locality?: string;
    region?: string;
  };
  categories?: Array<{ name?: string }>;
}

interface FoursquareResponse {
  results?: FoursquarePlace[];
}

const ENDPOINT = 'https://places-api.foursquare.com/places/search';
const API_VERSION = '2025-06-17';
const DEFAULT_TIMEOUT_MS = 8000;

/** Maps a raw Foursquare place to our trimmed VenueResult. */
export function mapFoursquarePlace(place: FoursquarePlace): VenueResult {
  return {
    name: place.name ?? 'Unnamed venue',
    category: place.categories?.[0]?.name,
    address: place.location?.formatted_address ?? place.location?.address,
    locality: place.location?.locality ?? place.location?.region,
    latitude: place.latitude,
    longitude: place.longitude,
    distance: place.distance,
    fsqId: place.fsq_place_id,
  };
}

/** Renders venue results into the `recommendation` text the UI already displays. */
export function formatVenueResults(results: VenueResult[], near?: string): string {
  const header = near ? `Venues near ${near}:` : 'Venues matching your search:';
  const lines = results.map((v, i) => {
    const parts = [v.category, v.address ?? v.locality].filter(Boolean).join(' — ');
    return `${i + 1}. **${v.name}**${parts ? ` (${parts})` : ''}`;
  });
  return [header, ...lines].join('\n');
}

/**
 * Searches Foursquare for venues. Returns null when the integration is not configured or the
 * request fails — callers should treat null as "fall through to the existing suggestions".
 */
export async function searchFoursquareVenues(opts: {
  query: string;
  near?: string;
  limit?: number;
  timeoutMs?: number;
}): Promise<VenueResult[] | null> {
  const key = getEnvVar('FOURSQUARE_API_KEY');
  if (!key) return null; // not configured → caller falls back

  const params = new URLSearchParams({
    query: opts.query,
    limit: String(opts.limit ?? 5),
  });
  if (opts.near) params.set('near', opts.near);

  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    opts.timeoutMs ?? DEFAULT_TIMEOUT_MS
  );
  try {
    const response = await fetch(`${ENDPOINT}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${key}`,
        'X-Places-Api-Version': API_VERSION,
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json().catch(() => ({}))) as FoursquareResponse;
    const results = (data.results ?? []).map(mapFoursquarePlace);
    return results.length > 0 ? results : null;
  } catch {
    // Network error / timeout / abort — fall back silently.
    return null;
  } finally {
    clearTimeout(timer);
  }
}
