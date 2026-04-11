'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormEvent, useMemo, useState } from 'react';

const parseEventTags = (input: string): string[] =>
  input
    .split(',')
    .map((event) => event.trim())
    .filter(Boolean);

const CreateThemePage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [eventsInput, setEventsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedEvents = useMemo(() => parseEventTags(eventsInput), [eventsInput]);

  if (!isLoggedIn) {
    return <SignInRequired title="Create themes requires sign in" />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (parsedEvents.length === 0) {
      setError('Add at least one event/activity tag.');
      return;
    }

    setIsSaving(true);

    const response = await fetch('/api/themes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        events: parsedEvents,
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      setIsSaving(false);
      setError('Failed to save theme. Please try again.');
      return;
    }

    router.push('/themes');
    router.refresh();
  };

  return (
    <AppShell title="Create Theme">
      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="theme-title" className="mb-1 block text-sm font-semibold">
              Theme title
            </label>
            <input
              id="theme-title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm outline-none ring-[var(--app-accent)]/40 transition focus:ring-2"
              placeholder="e.g. Tropical Sunset Celebration"
            />
          </div>

          <div>
            <label htmlFor="theme-events" className="mb-1 block text-sm font-semibold">
              Activity tags (comma separated)
            </label>
            <input
              id="theme-events"
              type="text"
              required
              value={eventsInput}
              onChange={(event) => setEventsInput(event.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm outline-none ring-[var(--app-accent)]/40 transition focus:ring-2"
              placeholder="e.g. icebreaker, quiz, music, photo booth"
            />
            {parsedEvents.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {parsedEvents.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--app-border)] bg-[var(--app-elevated)] px-2 py-1 text-xs text-[var(--app-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save theme'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/themes')}
              className="rounded-lg border border-[var(--app-border)] px-5 py-2.5 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
};

export default CreateThemePage;
