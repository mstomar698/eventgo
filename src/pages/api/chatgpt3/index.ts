// import type { NextApiRequest, NextApiResponse } from 'next';
// import fetch from 'node-fetch';

// interface Recommendation {
//   data: string;
// }

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { query } = req.query;
//   console.log('from apipage3' + query);
//   const apiUrl = 'https://api.openai.com/v1/completions';
//   const prompt = `Recommend some themes for ${query} \n\n`;
//   console.log('from apipage3' + prompt);
//   // const maxTokens = 60;
//   // const n = 1;
//   // const model = 'text-babbage-001'; // NOTE: use davinci-002 later//and curie-001 text-babbage-001
//   // const apiKey = process.env.OPENAI_API_KEY;

//   // const response = await fetch(apiUrl, {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     Authorization: `Bearer ${apiKey}`,
//   //   },
//   //   body: JSON.stringify({
//   //     prompt,
//   //     max_tokens: maxTokens,
//   //     n: n,
//   //     model: model,
//   //   }),
//   // });

//   // const data: any = await response.json();
//   const data = 'prompt as string';
//   const recommendation: any = data;
//   // const recommendation: Recommendation = data.choices[0].text.trim();
//   // //   console.log(data);
//   // console.log(recommendation);
//   res.status(200).json({ recommendation: 'recommendation' });
//   return recommendation;
// }
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
    const prompt = `Recommend some themes for ${query} \n\n`;
    const recommendation = await fetchLegacyCompletion({
      apiKey,
      prompt,
      maxTokens: 60,
    });
    return res.status(200).json({ recommendation });
  } catch (error) {
    return res.status(502).json({
      message: error instanceof Error ? error.message : 'AI provider request failed',
    });
  }
}
