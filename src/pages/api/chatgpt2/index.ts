import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvVar, getFirstEnvVar } from '@/lib/env';
import { generateGeminiText } from '@/lib/gemini';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { AIQuerySchema } from '@/lib/schemas';
import { enforceRateLimit, aiRateLimit } from '@/lib/rate-limit';
import { cacheKey, getCached, setCached } from '@/lib/cache';
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
    const { query } = AIQuerySchema.parse(req.query);

    const apiKey = getFirstEnvVar('GEMINI_API_KEY', 'GOOGLE_GEMINI_API_KEY');
    if (!apiKey) {
      sendError(res, 500, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'GEMINI_API_KEY not configured',
      });
      return;
    }

    const model = getEnvVar('GEMINI_MODEL') ?? 'gemini-2.0-flash';
    const key = cacheKey('chatgpt2', model, query);
    const cached = await getCached(key);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      sendSuccess(res, { recommendation: cached });
      return;
    }

    const prompt = `Suggest 3 distinct event ideas for: "${query}".
For each idea provide:
- Name (bold heading)
- Format & venue type
- 3 key activities
- Rough budget range
Keep total response under 220 words. Use this structure exactly:

**Idea 1: [Name]**
Format: [venue/format]
Activities: [activity 1], [activity 2], [activity 3]
Budget: [range]

**Idea 2: [Name]**
...`;

    const recommendation = await generateGeminiText({
      apiKey,
      prompt,
      model,
      maxOutputTokens: 400,
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
