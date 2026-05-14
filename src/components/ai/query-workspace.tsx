'use client';

import { FormEvent, useState } from 'react';
import { BiCheck, BiX, BiPlus } from 'react-icons/bi';
import { useRouter } from 'next/navigation';

interface ThemeData {
  title: string;
  description?: string;
  occasion?: string;
  mood?: string[];
  colorPalette?: string[];
  events?: string[];
  decor?: string[];
  music?: string[];
  food?: string[];
  budgetEstimate?: number;
  budgetNotes?: string;
  checklist?: string[];
  timeline?: Array<{ phase: string; daysBefore: number; tasks: string[] }>;
}

interface QueryWorkspaceProps {
  endpoint: string;
  placeholder: string;
  actionLabel: string;
  responseKey: 'recommendation' | 'info';
  responseHeading: string;
  description?: string;
  examples?: string[];
  mode?: 'theme' | 'text';
}

interface HistoryItem {
  query: string;
  response: string;
}

const Tag = ({ label }: { label: string }) => (
  <span className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-0.5 text-xs text-[var(--app-muted)]">
    {label}
  </span>
);

const QueryWorkspace = ({
  endpoint,
  placeholder,
  actionLabel,
  responseKey,
  responseHeading,
  description,
  examples = [],
  mode = 'text',
}: QueryWorkspaceProps) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [responseText, setResponseText] = useState<string | null>(null);
  const [themeData, setThemeData] = useState<ThemeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [saveMessage, setSaveMessage] = useState('');
  const [createStatus, setCreateStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    setResponseText(null);
    setThemeData(null);
    setCreateStatus('idle');

    const response = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      setIsLoading(false);
      setError('Failed to fetch AI response.');
      return;
    }

    const data = await response.json();
    const payload = data?.data ?? data;

    if (mode === 'theme' && payload?.theme) {
      setThemeData(payload.theme as ThemeData);
      const summary =
        typeof payload[responseKey] === 'string' ? payload[responseKey] : '';
      setResponseText(summary || `Theme: ${payload.theme.title}`);
      setHistory((prev) => [
        ...prev,
        { query, response: `Theme: ${payload.theme.title}` },
      ]);
    } else {
      const content = payload?.[responseKey];
      if (typeof content !== 'string' || !content.trim()) {
        setIsLoading(false);
        setError('AI response was empty. Try a more specific prompt.');
        return;
      }
      setResponseText(content);
      setHistory((prev) => [...prev, { query, response: content }]);
    }

    setIsLoading(false);
  };

  const handleSaveToNotes = async () => {
    if (!responseText || !query) return;
    setSaveStatus('loading');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: query,
          content: responseText,
          date: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setSaveStatus('success');
        setSaveMessage('Saved to notes');
      } else {
        setSaveStatus('error');
        setSaveMessage('Failed to save');
      }
    } catch {
      setSaveStatus('error');
      setSaveMessage('Error saving note');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleCreateTheme = async () => {
    if (!themeData) return;
    setCreateStatus('loading');
    try {
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...themeData, date: new Date().toISOString() }),
      });
      if (res.ok) {
        const data = await res.json();
        setCreateStatus('success');
        setTimeout(() => router.push(`/themes/${data.data._id}/edit`), 800);
      } else {
        const data = await res.json().catch(() => null);
        // If title already exists, append timestamp and retry
        if (
          data?.error?.message?.includes('duplicate') ||
          data?.error?.message?.includes('E11000')
        ) {
          const retryRes = await fetch('/api/themes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...themeData,
              title: `${themeData.title} (${new Date().toLocaleTimeString()})`,
              date: new Date().toISOString(),
            }),
          });
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            setCreateStatus('success');
            setTimeout(() => router.push(`/themes/${retryData.data._id}/edit`), 800);
            return;
          }
        }
        setCreateStatus('error');
        setTimeout(() => setCreateStatus('idle'), 3000);
      }
    } catch {
      setCreateStatus('error');
      setTimeout(() => setCreateStatus('idle'), 3000);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm outline-none ring-[var(--app-accent)]/40 transition focus:ring-2 text-[var(--app-text)]';

  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8 space-y-6">
      {description && <p className="text-xs text-[var(--app-muted)]">{description}</p>}

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          title="Query"
          type="text"
          required
          className={inputClass}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
        >
          {isLoading ? 'Generating...' : actionLabel}
        </button>
      </form>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {/* Theme mode: structured preview */}
      {mode === 'theme' && themeData && (
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)] mb-1">
                  Generated Theme
                </p>
                <h3 className="text-base font-semibold">{themeData.title}</h3>
                {themeData.occasion && (
                  <span className="text-xs capitalize text-[var(--app-accent)]">
                    {themeData.occasion}
                  </span>
                )}
              </div>
              {themeData.colorPalette && themeData.colorPalette.length > 0 && (
                <div className="flex gap-1.5">
                  {themeData.colorPalette.slice(0, 5).map((c) => (
                    <span
                      key={c}
                      style={{ backgroundColor: c }}
                      className="h-5 w-5 rounded border border-[var(--app-border)]"
                      title={c}
                    />
                  ))}
                </div>
              )}
            </div>

            {themeData.description && (
              <p className="text-sm text-[var(--app-muted)]">{themeData.description}</p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              {themeData.mood && themeData.mood.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                    Mood
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {themeData.mood.map((m) => (
                      <Tag key={m} label={m} />
                    ))}
                  </div>
                </div>
              )}
              {themeData.events && themeData.events.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                    Activities
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {themeData.events.map((a) => (
                      <Tag key={a} label={a} />
                    ))}
                  </div>
                </div>
              )}
              {themeData.decor && themeData.decor.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                    Decor
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {themeData.decor.map((d) => (
                      <Tag key={d} label={d} />
                    ))}
                  </div>
                </div>
              )}
              {themeData.music && themeData.music.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                    Music
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {themeData.music.map((m) => (
                      <Tag key={m} label={m} />
                    ))}
                  </div>
                </div>
              )}
              {themeData.food && themeData.food.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                    Food & Drinks
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {themeData.food.map((f) => (
                      <Tag key={f} label={f} />
                    ))}
                  </div>
                </div>
              )}
              {themeData.budgetEstimate && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                    Budget
                  </p>
                  <p className="text-sm">
                    ${themeData.budgetEstimate.toLocaleString()}
                    {themeData.budgetNotes ? ` — ${themeData.budgetNotes}` : ''}
                  </p>
                </div>
              )}
            </div>

            {themeData.checklist && themeData.checklist.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                  Checklist ({themeData.checklist.length} items)
                </p>
                <ul className="space-y-0.5">
                  {themeData.checklist.slice(0, 4).map((c, i) => (
                    <li key={i} className="text-xs text-[var(--app-muted)]">
                      • {c}
                    </li>
                  ))}
                  {themeData.checklist.length > 4 && (
                    <li className="text-xs text-[var(--app-muted)]">
                      …and {themeData.checklist.length - 4} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {themeData.timeline && themeData.timeline.length > 0 && (
              <div>
                <p className="mb-1 text-xs font-semibold text-[var(--app-muted)]">
                  Timeline ({themeData.timeline.length} phases)
                </p>
                <div className="flex flex-wrap gap-2">
                  {themeData.timeline.map((p, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-0.5 text-xs text-[var(--app-muted)]"
                    >
                      {p.phase}{' '}
                      {p.daysBefore === 0 ? '(day of)' : `(${p.daysBefore}d before)`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreateTheme}
              disabled={createStatus === 'loading' || createStatus === 'success'}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
            >
              <BiPlus size={16} />
              {createStatus === 'success'
                ? '✓ Theme created! Opening editor…'
                : createStatus === 'loading'
                  ? 'Creating…'
                  : 'Save as My Theme'}
            </button>
            <button
              onClick={handleSaveToNotes}
              disabled={saveStatus === 'loading'}
              className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)] disabled:opacity-50"
            >
              {saveStatus === 'success' ? '✓ Saved to notes' : 'Save to notes'}
            </button>
          </div>
          {createStatus === 'error' && (
            <p className="text-xs text-red-400">
              Failed to create theme. Please try again.
            </p>
          )}
        </div>
      )}

      {/* Text mode: plain response */}
      {mode === 'text' && responseText && (
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)]">
              {responseHeading}
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--app-text)]">
              {responseText}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveToNotes}
              disabled={saveStatus === 'loading'}
              className="flex-1 rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)] disabled:opacity-50"
            >
              {saveStatus === 'success' ? '✓ Saved to notes' : 'Save to notes'}
            </button>
          </div>
          {saveStatus !== 'idle' && (
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                saveStatus === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : saveStatus === 'error'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {saveStatus === 'success' && <BiCheck size={14} />}
              {saveStatus === 'error' && <BiX size={14} />}
              {saveMessage}
            </div>
          )}
        </div>
      )}

      {/* Example prompts */}
      {!responseText && !themeData && !isLoading && !error && examples.length > 0 && (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)]">
            {mode === 'theme' ? 'Try these theme ideas' : 'Example prompts'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 text-xs text-[var(--app-muted)] transition hover:border-[var(--app-accent)] hover:text-[var(--app-text)]"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Session history */}
      {history.length > 0 && (
        <div className="border-t border-[var(--app-border)] pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)] mb-3">
            Session History
          </p>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer rounded-lg border border-[var(--app-border)]/50 bg-[var(--app-elevated)]/50 p-3 transition hover:border-[var(--app-border)]"
                onClick={() => setQuery(item.query)}
              >
                <p className="text-xs font-semibold text-[var(--app-text)]">
                  {item.query}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--app-muted)]">
                  {item.response}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryWorkspace;
