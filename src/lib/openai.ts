interface OpenAICompletionResponse {
  choices?: Array<{ text?: string }>;
  error?: { message?: string };
}

const OPENAI_COMPLETIONS_URL = 'https://api.openai.com/v1/completions';
const DEFAULT_MODEL = 'text-babbage-001';

export const fetchLegacyCompletion = async ({
  apiKey,
  prompt,
  maxTokens = 60,
  model = DEFAULT_MODEL,
}: {
  apiKey: string;
  prompt: string;
  maxTokens?: number;
  model?: string;
}): Promise<string> => {
  const response = await fetch(OPENAI_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      max_tokens: maxTokens,
      n: 1,
      model,
    }),
  });

  const data = (await response.json()) as OpenAICompletionResponse;
  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `OpenAI request failed with status ${response.status}`
    );
  }

  const text = data.choices?.[0]?.text?.trim();
  if (!text) {
    throw new Error('OpenAI response did not include completion text');
  }
  return text;
};
