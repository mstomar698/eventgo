'use client';

import { FormEvent, useState } from 'react';
import { BiCheck, BiX } from 'react-icons/bi';

interface QueryWorkspaceProps {
  endpoint: string;
  placeholder: string;
  actionLabel: string;
  responseKey: 'recommendation' | 'info';
  responseHeading: string;
  description?: string;
  examples?: string[];
}

interface HistoryItem {
  query: string;
  response: string;
}

const QueryWorkspace = ({
  endpoint,
  placeholder,
  actionLabel,
  responseKey,
  responseHeading,
  description,
  examples = [],
}: QueryWorkspaceProps) => {
  const [query, setQuery] = useState('');
  const [responseText, setResponseText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [saveMessage, setSaveMessage] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    setResponseText(null);

    const response = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      setIsLoading(false);
      setError('Failed to fetch AI response.');
      return;
    }

    const data = await response.json();

    const content = data?.data?.[responseKey] ?? data?.[responseKey];
    if (typeof content !== 'string' || !content.trim()) {
      setIsLoading(false);
      setError('AI response was empty.');
      return;
    }

    setResponseText(content);
    setHistory((prev) => [...prev, { query, response: content }]);
    setIsLoading(false);
  };

  const handleSaveToNotes = async () => {
    if (!responseText || !query) return;

    setSaveStatus('loading');
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: query,
          content: responseText,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSaveStatus('success');
        setSaveMessage('Saved to notes');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveMessage('Failed to save');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setSaveMessage('Error saving note');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8 space-y-6">
      {description && <p className="text-xs text-[var(--app-muted)]">{description}</p>}

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          title="Query"
          type="text"
          required
          className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm outline-none ring-[var(--app-accent)]/40 transition focus:ring-2"
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
        >
          {isLoading ? 'Generating...' : actionLabel}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      {responseText ? (
        <div className="mt-5 space-y-3">
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
      ) : null}

      {!responseText && !isLoading && !error && examples.length > 0 ? (
        <div className="mt-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)]">
            Example prompts
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1 text-xs text-[var(--app-muted)] transition hover:text-[var(--app-text)]"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {history.length > 0 && (
        <div className="border-t border-[var(--app-border)] pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)] mb-3">
            Session History
          </p>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-[var(--app-border)]/50 bg-[var(--app-elevated)]/50 p-3"
              >
                <p className="text-xs font-semibold text-[var(--app-text)]">
                  {item.query}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-[var(--app-muted)]">
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
