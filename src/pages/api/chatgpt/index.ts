import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvVar } from '@/lib/env';
import { fetchLegacyCompletion } from '@/lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const query = req.query.query;
  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ message: 'query is required' });
  }

  const apiKey = getEnvVar('OPENAI_API_KEY');
  if (!apiKey) {
    return res.status(500).json({ message: 'OPENAI_API_KEY is not configured' });
  }

  try {
    const prompt = `What is ${query} describe in great detail?\n\n`;
    const info = await fetchLegacyCompletion({ apiKey, prompt, maxTokens: 60 });
    return res.status(200).json({ info });
  } catch (error) {
    return res.status(502).json({
      message: error instanceof Error ? error.message : 'AI provider request failed',
    });
  }
}
