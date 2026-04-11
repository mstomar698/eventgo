'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch, { revalidate } from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { BiPlus, BiTrashAlt } from 'react-icons/bi';

interface ThemeWithId {
  _id: string;
  title: string;
  date: string;
  events: string[];
}

function confirmThemeDelete(id: unknown) {
  const confirmation = window.confirm('Do you want to remove this theme?');
  if (confirmation) {
    revalidate(id);
  }
}

function ThemeCard(props: ThemeWithId) {
  const fetchId = {
    theme: props,
  };

  useFetch('/themes', {
    id: fetchId,
    method: 'DELETE',
    query: {
      id: props._id,
    },
    onResolve() {
      revalidate('GET /themes');
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
          onClick={() => confirmThemeDelete(fetchId)}
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
  const { data, loadingFirst, error } = useFetch<ThemeWithId[]>('/themes', {
    default: [],
  });

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
          {data.length} themes in your library
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
        {data.map((theme) => (
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
    <AppShell
      title="Themes"
      subtitle="Create and reuse curated themes for birthdays, community events, and workshops."
    >
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <ThemesList />
      </section>
    </AppShell>
  );
};

export default ThemesPage;
