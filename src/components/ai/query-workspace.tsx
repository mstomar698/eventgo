'use client';

import { FormEvent, useState } from 'react';

interface QueryWorkspaceProps {
  endpoint: string;
  placeholder: string;
  actionLabel: string;
  responseKey: 'recommendation' | 'info';
  responseHeading: string;
}

const QueryWorkspace = ({
  endpoint,
  placeholder,
  actionLabel,
  responseKey,
  responseHeading,
}: QueryWorkspaceProps) => {
  const [query, setQuery] = useState('');
  const [responseText, setResponseText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    const content = data[responseKey];
    if (typeof content !== 'string' || !content.trim()) {
      setIsLoading(false);
      setError('AI response was empty.');
      return;
    }

    setResponseText(content);
    setIsLoading(false);
  };

  return (
    <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8">
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
          className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Generating...' : actionLabel}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

      {responseText ? (
        <div className="mt-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)]">
            {responseHeading}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--app-text)]">
            {responseText}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default QueryWorkspace;
