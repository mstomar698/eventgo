import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvVar, getFirstEnvVar } from '@/lib/env';
import { generateGeminiText } from '@/lib/gemini';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { AIQuerySchema } from '@/lib/schemas';
import {
  getRuleBasedVenueSuggestions,
  parseQueryForSuggestions,
  AI_PROMPTS,
} from '@/lib/suggestions';
import { enforceRateLimit, aiRateLimit } from '@/lib/rate-limit';
import { cacheKey, getCached, setCached } from '@/lib/cache';
import {
  searchFoursquareVenues,
  formatVenueResults,
  scoreVenues,
} from '@/lib/venues-provider';
import { withApiLogging } from '@/lib/with-logging';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    sendError(res, 405, {
      code: ERROR_CODES.METHOD_NOT_ALLOWED,
      message: 'Method not allowed',
    });
    return;
  }

  if (!(await enforceRateLimit(req, res, aiRateLimit))) return;

  try {
    // If no query provided, return a friendly usage response instead of an error.
    const rawQuery = (req.query && (req.query as any).query) || '';
    if (!rawQuery) {
      sendSuccess(res, {
        info: 'Provide a `query` parameter to get venue recommendations. Example: /api/venues?query=small+birthday+party+in+urban+area',
      });
      return;
    }

    const { query } = AIQuerySchema.parse({ query: String(rawQuery) });

    const parsedInput = parseQueryForSuggestions(query);

    // Prefer real venue data when the Foursquare integration is configured.
    // Returns null when no key is set or the request fails → fall through below.
    const foursquare = await searchFoursquareVenues({
      query,
      near: parsedInput.location,
    });
    if (foursquare) {
      const ranked = scoreVenues(foursquare);
      res.setHeader('X-Venue-Source', 'foursquare');
      sendSuccess(res, {
        recommendation: formatVenueResults(ranked, parsedInput.location),
        venues: ranked,
      });
      return;
    }

    // Try rule-based suggestions next
    const ruleBased = parsedInput.location
      ? getRuleBasedVenueSuggestions(
          parsedInput.location,
          parsedInput.headcount,
          parsedInput.budget?.toString()
        )
      : null;
    if (ruleBased) {
      sendSuccess(res, { recommendation: ruleBased });
      return;
    }

    // Fall back to AI
    const apiKey = getFirstEnvVar('GEMINI_API_KEY', 'GOOGLE_GEMINI_API_KEY');
    if (!apiKey) {
      sendError(res, 500, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'GEMINI_API_KEY is not configured',
      });
      return;
    }

    const model = getEnvVar('GEMINI_MODEL') ?? 'gemini-2.0-flash';
    const key = cacheKey('venues', model, query);
    const cached = await getCached(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      sendSuccess(res, { recommendation: cached });
      return;
    }

    const prompt = AI_PROMPTS.venues(query);
    const recommendation = await generateGeminiText({
      apiKey,
      prompt,
      model,
      maxOutputTokens: 500,
    });

    await setCached(key, recommendation);
    res.setHeader('X-Cache', 'MISS');
    sendSuccess(res, { recommendation });
  } catch (error) {
    if (error instanceof Error) {
      sendError(res, 400, { code: ERROR_CODES.VALIDATION_ERROR, message: error.message });
    } else {
      sendError(res, 502, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'AI provider request failed',
      });
    }
  }
}
export default withApiLogging(handler);
