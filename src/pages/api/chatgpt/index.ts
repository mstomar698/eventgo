import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvVar, getFirstEnvVar } from '@/lib/env';
import { generateGeminiText } from '@/lib/gemini';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { AIQuerySchema } from '@/lib/schemas';
import logger from '@/lib/logger';
import retry from 'async-retry';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info(
    {
      method: req.method,
      url: req.url,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    },
    'API request'
  );

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    sendError(res, 405, {
      code: ERROR_CODES.METHOD_NOT_ALLOWED,
      message: 'Method not allowed',
    });
    return;
  }

  try {
    const { query } = AIQuerySchema.parse(req.query);
    const apiKey = getFirstEnvVar('GEMINI_API_KEY', 'GOOGLE_GEMINI_API_KEY');
    if (!apiKey) {
      logger.error('GEMINI_API_KEY not configured');
      sendError(res, 500, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'GEMINI_API_KEY is not configured',
      });
      return;
    }

    const prompt = `Explain ${query} for an event planner in practical, concise detail. Include examples where useful.`;
    logger.info({ query: query.substring(0, 100) }, 'Generating AI response');

    const startTime = Date.now();
    const recommendation = await retry(
      async (bail) => {
        try {
          return await generateGeminiText({
            apiKey,
            prompt,
            model: getEnvVar('GEMINI_MODEL') ?? 'gemini-2.0-flash',
            maxOutputTokens: 450,
          });
        } catch (error) {
          logger.warn(
            { error: error instanceof Error ? error.message : 'Unknown' },
            'AI call failed, retrying'
          );
          // Bail on validation errors, retry on network/server errors
          if (error instanceof Error && error.message.includes('validation')) {
            bail(error);
          }
          throw error;
        }
      },
      { retries: 2, minTimeout: 1000, maxTimeout: 5000 }
    );
    const duration = Date.now() - startTime;

    logger.info(
      { duration, tokens: Math.ceil(prompt.length / 4) },
      'AI response generated'
    );
    sendSuccess(res, { recommendation });
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      'API error'
    );
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
