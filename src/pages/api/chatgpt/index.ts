import type { NextApiRequest, NextApiResponse } from 'next';
import { getFirstEnvVar, getEnvVar } from '@/lib/env';
import { generateGeminiText } from '@/lib/gemini';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const query = req.query.query;
  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ message: 'query is required' });
  }

  const apiKey = getFirstEnvVar('GEMINI_API_KEY', 'GOOGLE_GEMINI_API_KEY');
  if (!apiKey) {
    return res.status(500).json({
      message: 'GEMINI_API_KEY is not configured',
    });
  }

  try {
    const prompt = `Explain ${query} for an event planner in practical, concise detail. Include examples where useful.`;
    const info = await generateGeminiText({
      apiKey,
      prompt,
      model: getEnvVar('GEMINI_MODEL') ?? 'gemini-2.0-flash',
      maxOutputTokens: 450,
    });
    return res.status(200).json({ info });
  } catch (error) {
    return res.status(502).json({
      message: error instanceof Error ? error.message : 'AI provider request failed',
    });
  }
}
