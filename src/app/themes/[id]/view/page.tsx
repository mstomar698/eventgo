'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch from 'http-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiArrowToLeft, BiMap, BiCopy, BiCheck } from 'react-icons/bi';

interface Theme {
  _id: string;
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
  isPublic?: boolean;
}

function Tag({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs ${
        accent
          ? 'border-[var(--app-accent)]/40 bg-[var(--app-accent)]/10 text-[var(--app-accent)]'
          : 'border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-muted)]'
      }`}
    >
      {label}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <h2 className="mb-3 text-sm font-semibold text-[var(--app-text)]">{title}</h2>
      {children}
    </section>
  );
}

function ThemeViewContent({ themeId }: { themeId: string }) {
  const router = useRouter();
  const {
    data: response,
    loadingFirst,
    error,
  } = useFetch<{ data?: Theme }>(`/themes?id=${themeId}`, {
    default: { data: undefined },
  });

  const theme = response?.data;
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveAsMine = async () => {
    if (!theme) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `My ${theme.title}`,
          description: theme.description,
          occasion: theme.occasion,
          mood: theme.mood ?? [],
          colorPalette: theme.colorPalette ?? [],
          events: theme.events ?? [],
          decor: theme.decor ?? [],
          music: theme.music ?? [],
          food: theme.food ?? [],
          budgetEstimate: theme.budgetEstimate,
          budgetNotes: theme.budgetNotes,
          checklist: theme.checklist ?? [],
          timeline: theme.timeline ?? [],
          isPublic: false,
          date: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSaved(true);
        setTimeout(() => router.push(`/themes/${data.data._id}/edit`), 900);
      } else {
        const data = await res.json().catch(() => null);
        setSaveError(data?.error?.message || 'Failed to save theme.');
      }
    } catch {
      setSaveError('Failed to save theme. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading theme…
      </div>
    );
  }

  if (error || !theme) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Theme not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold">{theme.title}</h1>
            {theme.occasion && (
              <span className="rounded-full bg-[var(--app-accent)]/20 px-2 py-0.5 text-xs capitalize text-[var(--app-accent)]">
                {theme.occasion}
              </span>
            )}
            {theme.isPublic && (
              <span className="rounded-full border border-[var(--app-border)] px-2 py-0.5 text-xs text-[var(--app-muted)]">
                Starter theme
              </span>
            )}
          </div>
          {theme.description && (
            <p className="mt-1 max-w-2xl text-sm text-[var(--app-muted)]">
              {theme.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/planner?theme=${theme._id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-2 text-sm font-semibold transition hover:bg-[var(--app-surface)]"
          >
            <BiMap size={16} /> Start Planning
          </Link>
          {theme.isPublic && (
            <button
              onClick={handleSaveAsMine}
              disabled={saving || saved}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {saved ? (
                <>
                  <BiCheck size={16} /> Saved! Opening editor…
                </>
              ) : saving ? (
                'Saving…'
              ) : (
                <>
                  <BiCopy size={16} /> Save as My Theme
                </>
              )}
            </button>
          )}
          {!theme.isPublic && (
            <Link
              href={`/themes/${theme._id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Edit Theme
            </Link>
          )}
        </div>
      </div>

      {saveError && (
        <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">
          {saveError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Color Palette */}
        {theme.colorPalette && theme.colorPalette.length > 0 && (
          <Section title="Color Palette">
            <div className="flex flex-wrap gap-2">
              {theme.colorPalette.map((color) => (
                <div key={color} className="flex items-center gap-1.5">
                  <span
                    style={{ backgroundColor: color }}
                    className="h-5 w-5 rounded border border-[var(--app-border)]"
                  />
                  <span className="text-xs text-[var(--app-muted)]">{color}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Mood */}
        {theme.mood && theme.mood.length > 0 && (
          <Section title="Mood">
            <div className="flex flex-wrap gap-1.5">
              {theme.mood.map((m) => (
                <Tag key={m} label={m} accent />
              ))}
            </div>
          </Section>
        )}

        {/* Activities */}
        {theme.events && theme.events.length > 0 && (
          <Section title="Activities">
            <div className="flex flex-wrap gap-1.5">
              {theme.events.map((a) => (
                <Tag key={a} label={a} />
              ))}
            </div>
          </Section>
        )}

        {/* Decor */}
        {theme.decor && theme.decor.length > 0 && (
          <Section title="Decor Ideas">
            <div className="flex flex-wrap gap-1.5">
              {theme.decor.map((d) => (
                <Tag key={d} label={d} />
              ))}
            </div>
          </Section>
        )}

        {/* Music */}
        {theme.music && theme.music.length > 0 && (
          <Section title="Music & Vibes">
            <div className="flex flex-wrap gap-1.5">
              {theme.music.map((m) => (
                <Tag key={m} label={m} />
              ))}
            </div>
          </Section>
        )}

        {/* Food */}
        {theme.food && theme.food.length > 0 && (
          <Section title="Food & Drinks">
            <div className="flex flex-wrap gap-1.5">
              {theme.food.map((f) => (
                <Tag key={f} label={f} />
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Budget */}
      {theme.budgetEstimate != null && (
        <Section title="Budget">
          <p className="text-sm font-semibold text-[var(--app-text)]">
            ${theme.budgetEstimate.toLocaleString()} estimated
          </p>
          {theme.budgetNotes && (
            <p className="mt-1 text-xs text-[var(--app-muted)]">{theme.budgetNotes}</p>
          )}
        </Section>
      )}

      {/* Checklist */}
      {theme.checklist && theme.checklist.length > 0 && (
        <Section title={`Checklist (${theme.checklist.length} items)`}>
          <div className="space-y-1.5">
            {theme.checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-0.5 rounded" readOnly />
                <span className="text-[var(--app-text)]">{item}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Timeline */}
      {theme.timeline && theme.timeline.length > 0 && (
        <Section title="Timeline">
          <div className="space-y-3">
            {theme.timeline.map((phase, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{phase.phase}</h3>
                  <span className="text-xs text-[var(--app-muted)]">
                    {phase.daysBefore === 0
                      ? 'Day of event'
                      : `${phase.daysBefore} days before`}
                  </span>
                </div>
                {phase.tasks.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {phase.tasks.map((task, ti) => (
                      <li key={ti} className="text-xs text-[var(--app-muted)]">
                        • {task}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Bottom CTA for starter themes */}
      {theme.isPublic && !saved && (
        <div className="rounded-xl border border-[var(--app-accent)]/30 bg-[var(--app-accent)]/5 p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--app-text)]">
              Want to customise this theme?
            </p>
            <p className="text-xs text-[var(--app-muted)]">
              Save a copy to your library and edit every detail.
            </p>
          </div>
          <button
            onClick={handleSaveAsMine}
            disabled={saving || saved}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
          >
            <BiCopy size={16} />
            {saving ? 'Saving…' : 'Save as My Theme'}
          </button>
        </div>
      )}
    </div>
  );
}

const ThemeViewPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id as string;

  if (!session) return <SignInRequired title="Sign in to view themes" />;

  return (
    <AppShell title="Theme Details">
      <div className="mb-4">
        <Link
          href="/themes"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm transition hover:bg-[var(--app-surface)]"
        >
          <BiArrowToLeft size={16} /> Back to Themes
        </Link>
      </div>
      <ThemeViewContent themeId={id} />
    </AppShell>
  );
};

export default ThemeViewPage;
