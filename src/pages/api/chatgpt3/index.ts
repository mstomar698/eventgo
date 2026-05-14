import type { NextApiRequest, NextApiResponse } from 'next';
import { getEnvVar, getFirstEnvVar } from '@/lib/env';
import { generateGeminiText } from '@/lib/gemini';
import { sendError, sendSuccess, ERROR_CODES } from '@/lib/api-utils';
import { AIQuerySchema } from '@/lib/schemas';

const VALID_OCCASIONS = [
  'birthday',
  'wedding',
  'corporate',
  'community',
  'other',
] as const;
const DEFAULT_COLORS = ['#14b8a6', '#8b5cf6', '#f97316', '#22c55e'];

function extractJson(text: string): any | null {
  const t = text.trim();
  // Direct parse
  try {
    return JSON.parse(t);
  } catch {}
  // Strip markdown fences
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {}
  }
  // Extract first {...} block
  const block = t.match(/\{[\s\S]*\}/);
  if (block) {
    try {
      return JSON.parse(block[0]);
    } catch {}
  }
  return null;
}

function toStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
}

function buildTheme(raw: any, fallbackTitle: string) {
  return {
    title:
      typeof raw?.title === 'string' && raw.title.trim()
        ? raw.title.trim()
        : fallbackTitle,
    description: typeof raw?.description === 'string' ? raw.description.trim() : '',
    occasion: VALID_OCCASIONS.includes(raw?.occasion) ? raw.occasion : 'other',
    mood: toStringArray(raw?.mood),
    colorPalette: toStringArray(raw?.colorPalette).filter((c) =>
      /^#[0-9a-fA-F]{3,6}$/.test(c)
    ).length
      ? toStringArray(raw?.colorPalette).filter((c) => /^#[0-9a-fA-F]{3,6}$/.test(c))
      : DEFAULT_COLORS,
    events: toStringArray(raw?.events),
    decor: toStringArray(raw?.decor),
    music: toStringArray(raw?.music),
    food: toStringArray(raw?.food),
    budgetEstimate:
      typeof raw?.budgetEstimate === 'number' && raw.budgetEstimate > 0
        ? Math.round(raw.budgetEstimate)
        : undefined,
    budgetNotes:
      typeof raw?.budgetNotes === 'string' && raw.budgetNotes.trim()
        ? raw.budgetNotes.trim()
        : undefined,
    checklist: toStringArray(raw?.checklist),
    timeline: Array.isArray(raw?.timeline)
      ? raw.timeline
          .filter(
            (p: any) =>
              p && typeof p.phase === 'string' && typeof p.daysBefore === 'number'
          )
          .map((p: any) => ({
            phase: String(p.phase).trim(),
            daysBefore: Number(p.daysBefore),
            tasks: toStringArray(p.tasks),
          }))
      : [],
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
      sendError(res, 500, {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'GEMINI_API_KEY not configured',
      });
      return;
    }

    const prompt = `Create an event theme for: "${query}".
Return ONLY valid JSON, no markdown, no extra text:
{"title":"...","description":"one sentence","occasion":"birthday|wedding|corporate|community|other","mood":["tag1","tag2"],"colorPalette":["#hex1","#hex2","#hex3"],"events":["activity1","activity2","activity3"],"decor":["item1","item2","item3"],"music":["genre1","genre2"],"food":["item1","item2","item3"],"budgetEstimate":500,"checklist":["task1","task2","task3","task4"],"timeline":[{"phase":"Planning","daysBefore":30,"tasks":["task1","task2"]},{"phase":"Preparation","daysBefore":7,"tasks":["task1","task2"]},{"phase":"Day Of","daysBefore":0,"tasks":["task1","task2"]}]}`;

    const raw = await generateGeminiText({
      apiKey,
      prompt,
      model: getEnvVar('GEMINI_MODEL') ?? 'gemini-2.0-flash',
      maxOutputTokens: 600,
    });

    const parsed = extractJson(raw);
    const theme = buildTheme(parsed, query);

    // Also build a readable text summary for history/notes
    const summary = `Theme: ${theme.title}\n${theme.description}\nMood: ${theme.mood.join(', ')}\nActivities: ${theme.events.join(', ')}\nDecor: ${theme.decor.join(', ')}\nMusic: ${theme.music.join(', ')}\nFood: ${theme.food.join(', ')}${theme.budgetEstimate ? `\nBudget: $${theme.budgetEstimate}` : ''}`;

    sendSuccess(res, { recommendation: summary, theme });
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
