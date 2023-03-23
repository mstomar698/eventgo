import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

interface Recommendation {
  data: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  console.log(query);
  const apiUrl = 'https://api.openai.com/v1/completions';
  const prompt = `Recommend ideas about events to organize for ${query}\n\n`;
  const maxTokens = 600;
  const n = 1;
  const model = 'text-babbage-001'; // NOTE: use davinci-002 later//and curie-001 text-babbage-001
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      max_tokens: maxTokens,
      n: n,
      model: model,
    }),
  });

  const data: any = await response.json();
  const recommendation: Recommendation = data.choices[0].text.trim();
  //   console.log(data);
  console.log(recommendation);
  res.status(200).json({ recommendation: recommendation });
  return recommendation;
}
