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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    sendError(res, 405, {
      code: ERROR_CODES.METHOD_NOT_ALLOWED,
      message: 'Method not allowed',
    });
    return;
  }

  if (!enforceRateLimit(req, res, aiRateLimit)) return;

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

    // Try rule-based suggestions first
    const parsedInput = parseQueryForSuggestions(query);
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

    const prompt = AI_PROMPTS.venues(query);
    const recommendation = await generateGeminiText({
      apiKey,
      prompt,
      model: getEnvVar('GEMINI_MODEL') ?? 'gemini-2.0-flash',
      maxOutputTokens: 500,
    });
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
