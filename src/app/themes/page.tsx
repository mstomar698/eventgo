'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import ConfirmModal from '@/components/ui/confirm-modal';
import useFetch, { revalidate } from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiPlus, BiTrashAlt, BiRocket, BiPencil, BiMap } from 'react-icons/bi';

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
  budgetEstimate?: number;
  budgetNotes?: string;
  checklist?: string[];
  timeline?: Array<{ phase: string; daysBefore: number; tasks: string[] }>;
  events: string[];
  isPublic?: boolean;
}

interface Template {
  _id: string;
  name: string;
  category: string;
  description: string;
  headcount: number;
  isPublic?: boolean;
}

function ThemeCard({
  theme,
  onDelete,
  isPublic,
}: {
  theme: ThemeWithId;
  onDelete: (t: ThemeWithId) => void;
  isPublic?: boolean;
}) {
  return (
    <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold">{theme.title}</h3>
            {theme.occasion && (
              <span className="rounded-full bg-[var(--app-accent)]/20 px-2 py-0.5 text-xs capitalize text-[var(--app-accent)]">
                {theme.occasion}
              </span>
            )}
          </div>
          {theme.description && (
            <p className="mt-1 line-clamp-2 text-xs text-[var(--app-muted)]">
              {theme.description}
            </p>
          )}
        </div>
        {!isPublic && (
          <div className="flex shrink-0 gap-1">
            <Link
              href={`/themes/${theme._id}/edit`}
              title="edit-theme"
              className="rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-muted)] transition hover:text-[var(--app-accent)]"
            >
              <BiPencil size={14} />
            </Link>
            <button
              type="button"
              title="delete-theme"
              onClick={() => onDelete(theme)}
              className="rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-muted)] transition hover:text-red-400"
            >
              <BiTrashAlt size={14} />
            </button>
          </div>
        )}
      </div>

      {theme.colorPalette && theme.colorPalette.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {theme.colorPalette.map((color) => (
            <span
              key={color}
              style={{ backgroundColor: color }}
              className="h-4 w-4 rounded-full border border-[var(--app-border)]"
              title={color}
            />
          ))}
        </div>
      )}

      {theme.mood && theme.mood.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {theme.mood.map((m) => (
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
        {theme.events.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
              Activities
            </p>
            <div className="flex flex-wrap gap-1">
              {theme.events.map((event) => (
                <span
                  key={`${theme._id}-${event}`}
                  className="rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-0.5 text-xs text-[var(--app-muted)]"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        )}
        {theme.decor && theme.decor.length > 0 && (
          <p className="text-xs text-[var(--app-muted)]">
            <span className="font-medium">Decor:</span>{' '}
            {theme.decor.slice(0, 3).join(', ')}
            {theme.decor.length > 3 ? '…' : ''}
          </p>
        )}
        {theme.music && theme.music.length > 0 && (
          <p className="text-xs text-[var(--app-muted)]">
            <span className="font-medium">Music:</span>{' '}
            {theme.music.slice(0, 3).join(', ')}
            {theme.music.length > 3 ? '…' : ''}
          </p>
        )}
        {theme.food && theme.food.length > 0 && (
          <p className="text-xs text-[var(--app-muted)]">
            <span className="font-medium">Food:</span> {theme.food.slice(0, 3).join(', ')}
            {theme.food.length > 3 ? '…' : ''}
          </p>
        )}
        {theme.budgetEstimate != null && (
          <p className="text-xs text-[var(--app-muted)]">
            <span className="font-medium">Budget:</span> $
            {theme.budgetEstimate.toLocaleString()}
            {theme.budgetNotes ? ` — ${theme.budgetNotes}` : ''}
          </p>
        )}
        {theme.checklist && theme.checklist.length > 0 && (
          <p className="text-xs text-[var(--app-muted)]">
            <span className="font-medium">Checklist:</span> {theme.checklist.length} items
          </p>
        )}
        {theme.timeline && theme.timeline.length > 0 && (
          <p className="text-xs text-[var(--app-muted)]">
            <span className="font-medium">Timeline:</span> {theme.timeline.length} phases
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/themes/${theme._id}/view`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)]"
        >
          View Details
        </Link>
        <Link
          href={`/planner?theme=${theme._id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
        >
          <BiMap size={13} />
          Start Planning
        </Link>
      </div>
    </article>
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

  const allThemes = Array.isArray(response?.data) ? response.data : [];
  const starterThemes = allThemes.filter((t) => t.isPublic);
  const userThemes = allThemes.filter((t) => !t.isPublic);

  const [deleteTheme, setDeleteTheme] = useState<ThemeWithId | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTheme) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/themes?id=${deleteTheme._id}`, { method: 'DELETE' });
      if (res.ok) {
        revalidate('GET /themes');
        setDeleteTheme(null);
        setShowDeleteConfirm(false);
      }
    } catch {
      /* ignore */
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const onDelete = (t: ThemeWithId) => {
    setDeleteTheme(t);
    setShowDeleteConfirm(true);
  };

  return (
    <>
      <div className="space-y-8">
        {/* Starter Themes */}
        {starterThemes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--app-text)]">
                  Starter Themes
                </h2>
                <p className="mt-1 text-xs text-[var(--app-muted)]">
                  {starterThemes.length} example themes to get started
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {starterThemes.map((theme) => (
                <ThemeCard
                  key={`starter-${theme._id}`}
                  theme={theme}
                  onDelete={onDelete}
                  isPublic
                />
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {starterThemes.length > 0 && (
          <div className="border-t border-[var(--app-border)]" />
        )}

        {/* Your Themes */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--app-text)]">
                Your Themes
              </h2>
              <p className="mt-1 text-xs text-[var(--app-muted)]">
                {userThemes.length} custom themes in your library
              </p>
            </div>
            <Link
              href="/themes/create"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              <BiPlus size={18} /> Add theme
            </Link>
          </div>
          {userThemes.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {userThemes.map((theme) => (
                <ThemeCard key={`theme-${theme._id}`} theme={theme} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-elevated)]/50 p-6 text-center">
              <p className="text-sm text-[var(--app-muted)]">No custom themes yet</p>
              <Link
                href="/themes/create"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
              >
                <BiPlus size={16} /> Create your first theme
              </Link>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTheme(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete theme"
        message="This action cannot be undone. Are you sure you want to delete this theme?"
        confirmLabel="Delete"
        danger
        isLoading={isSubmitting}
      />
    </>
  );
}

const ThemesPage = () => {
  const { data: session } = useSession();

  if (!session) {
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
