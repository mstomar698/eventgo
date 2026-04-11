'use client';

import AppShell from '@/components/layout/app-shell';
import CalendarPage from '@/features/planner/calendar';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch, { revalidate } from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiCalendar, BiPlus, BiTrashAlt } from 'react-icons/bi';

interface PostWithId {
  _id: string;
  title: string;
  date: string;
  content: string;
}

function confirmPostDelete(id: string, setDeleteId: (id: string) => void) {
  const confirmation = window.confirm('Do you want to remove this note?');
  if (confirmation) {
    setDeleteId(id);
  }
}

function PostCard(props: PostWithId) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useFetch('/posts', {
    id: deleteId,
    method: 'DELETE',
    query: {
      id: deleteId,
    },
    onResolve() {
      revalidate('GET /posts');
      setDeleteId(null);
    },
  });

  return (
    <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-semibold">{props.title}</h3>
        <button
          title="delete-post"
          type="button"
          className="rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-muted)] transition hover:text-red-400"
          onClick={() => confirmPostDelete(props._id, setDeleteId)}
        >
          <BiTrashAlt size={16} />
        </button>
      </div>
      <p className="mt-3 line-clamp-5 text-sm text-[var(--app-muted)]">{props.content}</p>
    </article>
  );
}

function PostsList() {
  const { data, loadingFirst, error } = useFetch<PostWithId[]>('/posts', {
    default: [],
  });

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading notes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Failed to load notes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--app-muted)]">
          {data.length} notes in this workspace
        </p>
        <Link
          href="/posts/create"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <BiPlus size={18} />
          Add note
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((post) => (
          <PostCard {...post} key={`post-${post._id}`} />
        ))}
      </div>
    </div>
  );
}

const NotesPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Notes access requires sign in" />;
  }

  return (
    <AppShell
      title="Notes & Schedule"
      subtitle="Capture decisions and maintain an event-aware calendar side by side."
    >
      <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
          <PostsList />
        </section>
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
          <div className="mb-3 flex items-center gap-2">
            <BiCalendar className="text-[var(--app-accent)]" size={18} />
            <h2 className="text-sm font-semibold">Event calendar</h2>
          </div>
          <CalendarPage />
        </section>
      </div>
    </AppShell>
  );
};

export default NotesPage;
