import retry from 'async-retry';

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
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_RETRIES = 2;

/**
 * Calls the Gemini generateContent API with a per-attempt timeout and bounded retries.
 *
 * Reliability is centralized here so every caller behaves consistently:
 * - Each attempt is aborted after `timeoutMs` (a hung request no longer blocks forever).
 * - Transient failures (network errors, timeouts, HTTP 5xx, 429) are retried with backoff.
 * - Deterministic failures (HTTP 4xx other than 429, empty/blocked output) fail fast — no
 *   point retrying a request that will always be rejected the same way.
 */
export const generateGeminiText = async ({
  apiKey,
  prompt,
  model = DEFAULT_MODEL,
  maxOutputTokens = 400,
  temperature = 0.6,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retries = DEFAULT_RETRIES,
}: {
  apiKey: string;
  prompt: string;
  model?: string;
  maxOutputTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  retries?: number;
}): Promise<string> => {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  return retry(
    async (bail): Promise<string> => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature, maxOutputTokens },
          }),
        });
      } catch (err) {
        // Network failure or timeout abort — retryable.
        if (err instanceof Error && err.name === 'AbortError') {
          throw new Error('Gemini request timed out');
        }
        throw err;
      } finally {
        clearTimeout(timer);
      }

      const data = (await response
        .json()
        .catch(() => ({}))) as GeminiGenerateContentResponse;

      if (!response.ok) {
        const message =
          data.error?.message ?? `Gemini request failed with status ${response.status}`;
        // Client errors other than 429 are deterministic — don't retry.
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          bail(new Error(message));
          return ''; // bail() has already rejected; stop this attempt
        }
        throw new Error(message);
      }

      const text = data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('')
        .trim();

      if (!text) {
        const reason = data.candidates?.[0]?.finishReason;
        // Empty/blocked output is deterministic for this prompt — fail fast.
        bail(
          new Error(
            reason ? `Gemini returned no text (${reason})` : 'Gemini returned no text'
          )
        );
        return ''; // bail() has already rejected; stop this attempt
      }

      return text;
    },
    { retries, minTimeout: 500, maxTimeout: 4000 }
  );
};
