'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch, { revalidate } from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiPlus, BiTrashAlt } from 'react-icons/bi';

interface ThemeWithId {
  _id: string;
  title: string;
  date: string;
  events: string[];
}

function confirmThemeDelete(id: string, setDeleteId: (id: string) => void) {
  const confirmation = window.confirm('Do you want to remove this theme?');
  if (confirmation) {
    setDeleteId(id);
  }
}

function ThemeCard(props: ThemeWithId) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useFetch('/themes', {
    id: deleteId,
    method: 'DELETE',
    query: {
      id: deleteId,
    },
    onResolve() {
      revalidate('GET /themes');
      setDeleteId(null);
    },
  });

  return (
    <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold">{props.title}</h3>
        <button
          title="delete-theme"
          type="button"
          className="rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-muted)] transition hover:text-red-400"
          onClick={() => confirmThemeDelete(props._id, setDeleteId)}
        >
          <BiTrashAlt size={16} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {props.events.map((event) => (
          <span
            key={`${props._id}-${event}`}
            className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-muted)]"
          >
            {event}
          </span>
        ))}
      </div>
    </article>
  );
}

function ThemesList() {
  const {
    data: response,
    loadingFirst,
    error,
  } = useFetch<{ data?: ThemeWithId[] }>('/themes', {
    default: { data: [] },
  });

  const themes = Array.isArray(response?.data) ? response.data : [];

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading themes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Failed to load themes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--app-muted)]">
          {themes.length} themes in your library
        </p>
        <Link
          href="/themes/create"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <BiPlus size={18} />
          Add theme
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {themes.map((theme) => (
          <ThemeCard {...theme} key={`theme-${theme._id}`} />
        ))}
      </div>
    </div>
  );
}

const ThemesPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Theme library requires sign in" />;
  }

  return (
    <AppShell title="Themes">
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <ThemesList />
      </section>
    </AppShell>
  );
};

export default ThemesPage;
