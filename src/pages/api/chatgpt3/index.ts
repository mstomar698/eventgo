import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvVar, getFirstEnvVar } from '@/lib/env';
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
    const prompt = `Recommend event themes for "${query}". Return a concise shortlist where each theme includes vibe, decor direction, and one activity idea.`;
    const recommendation = await generateGeminiText({
      apiKey,
      prompt,
      model: getEnvVar('GEMINI_MODEL') ?? 'gemini-2.0-flash',
      maxOutputTokens: 450,
    });
    return res.status(200).json({ recommendation });
  } catch (error) {
    return res.status(502).json({
      message: error instanceof Error ? error.message : 'AI provider request failed',
    });
  }
}
