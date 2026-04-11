interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    message?: string;
  };
}

const DEFAULT_MODEL = 'gemini-2.0-flash';

export const generateGeminiText = async ({
  apiKey,
  prompt,
  model = DEFAULT_MODEL,
  maxOutputTokens = 400,
  temperature = 0.6,
}: {
  apiKey: string;
  prompt: string;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
}): Promise<string> => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
        maxOutputTokens,
      },
    }),
  });

  const data = (await response.json()) as GeminiGenerateContentResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? `Gemini request failed with status ${response.status}`
    );
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    const reason = data.candidates?.[0]?.finishReason;
    throw new Error(
      reason ? `Gemini returned no text (${reason})` : 'Gemini returned no text'
    );
  }

  return text;
};
