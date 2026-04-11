'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';

const CreateNotesPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoggedIn) {
    return <SignInRequired title="Create notes requires sign in" />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      setIsSaving(false);
      setError('Failed to save note. Please try again.');
      return;
    }

    router.push('/posts');
    router.refresh();
  };

  return (
    <AppShell title="Create Note">
      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="note-title" className="mb-1 block text-sm font-semibold">
              Title
            </label>
            <input
              id="note-title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm outline-none ring-[var(--app-accent)]/40 transition focus:ring-2"
              placeholder="e.g. Guest arrival checklist"
            />
          </div>

          <div>
            <label htmlFor="note-content" className="mb-1 block text-sm font-semibold">
              Content
            </label>
            <textarea
              id="note-content"
              required
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="h-48 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm outline-none ring-[var(--app-accent)]/40 transition focus:ring-2"
              placeholder="Write all planning details here..."
            />
          </div>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save note'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/posts')}
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

export default CreateNotesPage;
