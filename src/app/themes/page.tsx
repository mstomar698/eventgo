'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import ConfirmModal from '@/components/ui/confirm-modal';
import useFetch, { revalidate } from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiPlus, BiTrashAlt, BiRocket } from 'react-icons/bi';

interface ThemeWithId {
  _id: string;
  title: string;
  date: string;
  description?: string;
  occasion?: string;
  mood?: string[];
  colorPalette?: string[];
  decor?: string[];
  music?: string[];
  food?: string[];
  events: string[];
}

interface Template {
  _id: string;
  name: string;
  category: string;
  description: string;
  headcount: number;
  isPublic?: boolean;
}

function ThemeCard(props: ThemeWithId) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setDeleteId(props._id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold">{props.title}</h3>
              {props.occasion && (
                <span className="rounded-full bg-[var(--app-accent)]/20 px-2 py-0.5 text-xs capitalize text-[var(--app-accent)]">
                  {props.occasion}
                </span>
              )}
            </div>
            {props.description && (
              <p className="mt-1 line-clamp-2 text-xs text-[var(--app-muted)]">
                {props.description}
              </p>
            )}
          </div>
          <button
            title="delete-theme"
            type="button"
            className="shrink-0 rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-muted)] transition hover:text-red-400"
            onClick={handleDelete}
          >
            <BiTrashAlt size={16} />
          </button>
        </div>

        {props.colorPalette && props.colorPalette.length > 0 && (
          <div className="mt-3 flex gap-1.5">
            {props.colorPalette.map((color) => (
              <span
                key={color}
                style={{ backgroundColor: color }}
                className="h-4 w-4 rounded-full border border-[var(--app-border)]"
                title={color}
              />
            ))}
          </div>
        )}

        {props.mood && props.mood.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {props.mood.map((m) => (
              <span
                key={m}
                className="rounded-full bg-[var(--app-surface)] px-2 py-0.5 text-xs text-[var(--app-muted)] italic"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 space-y-1.5">
          {props.events.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wide mb-1">
                Activities
              </p>
              <div className="flex flex-wrap gap-1">
                {props.events.map((event) => (
                  <span
                    key={`${props._id}-${event}`}
                    className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-0.5 text-xs text-[var(--app-muted)]"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>
          )}
          {props.decor && props.decor.length > 0 && (
            <p className="text-xs text-[var(--app-muted)]">
              <span className="font-medium">Decor:</span>{' '}
              {props.decor.slice(0, 3).join(', ')}
              {props.decor.length > 3 ? '…' : ''}
            </p>
          )}
          {props.music && props.music.length > 0 && (
            <p className="text-xs text-[var(--app-muted)]">
              <span className="font-medium">Music:</span>{' '}
              {props.music.slice(0, 3).join(', ')}
              {props.music.length > 3 ? '…' : ''}
            </p>
          )}
          {props.food && props.food.length > 0 && (
            <p className="text-xs text-[var(--app-muted)]">
              <span className="font-medium">Food:</span>{' '}
              {props.food.slice(0, 3).join(', ')}
              {props.food.length > 3 ? '…' : ''}
            </p>
          )}
        </div>
      </article>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete theme"
        message="This action cannot be undone. Are you sure you want to delete this theme?"
        confirmLabel="Delete"
        danger
        isLoading={false}
      />
    </>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold">{template.name}</h3>
          <p className="mt-1 text-xs text-[var(--app-muted)] capitalize">
            {template.category} • Up to {template.headcount} people
          </p>
        </div>
        <BiRocket className="text-[var(--app-accent)]" size={20} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-[var(--app-muted)]">
        {template.description}
      </p>
      <Link
        href={`/templates/${template._id}/use`}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
      >
        Use Template
      </Link>
    </article>
  );
}

function StarterTemplatesList() {
  const {
    data: response,
    loadingFirst,
    error,
  } = useFetch<{ data?: Template[] }>('/templates', {
    default: { data: [] },
  });

  const templates = Array.isArray(response?.data) ? response.data : [];
  const starterTemplates = templates.filter((t) => t.isPublic !== false);

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading templates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Failed to load templates.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--app-text)]">
            Starter Templates
          </h2>
          <p className="mt-1 text-xs text-[var(--app-muted)]">
            {starterTemplates.length} ready-to-use templates
          </p>
        </div>
      </div>
      {starterTemplates.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {starterTemplates.map((template) => (
            <TemplateCard key={template._id} template={template} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-6 text-center text-sm text-[var(--app-muted)]">
          No starter templates available
        </div>
      )}
    </div>
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
        <div>
          <h2 className="text-lg font-semibold text-[var(--app-text)]">Your Themes</h2>
          <p className="mt-1 text-xs text-[var(--app-muted)]">
            {themes.length} custom themes in your library
          </p>
        </div>
        <Link
          href="/themes/create"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <BiPlus size={18} />
          Add theme
        </Link>
      </div>
      {themes.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {themes.map((theme) => (
            <ThemeCard {...theme} key={`theme-${theme._id}`} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-elevated)]/50 p-6 text-center">
          <p className="text-sm text-[var(--app-muted)]">No custom themes yet</p>
          <Link
            href="/themes/create"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
          >
            <BiPlus size={16} />
            Create your first theme
          </Link>
        </div>
      )}
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
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 space-y-8">
        <StarterTemplatesList />
        <div className="border-t border-[var(--app-border)] pt-8">
          <ThemesList />
        </div>
      </section>
    </AppShell>
  );
};

export default ThemesPage;
