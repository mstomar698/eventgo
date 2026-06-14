// Homepage content component used on authenticated workspace root
'use client';

import AppShell from '@/components/layout/app-shell';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useFetch from 'http-react';
import FirstRunGuide from '@/components/homepage/first-run-guide';

const workspaceSections = [
  {
    title: 'Planning workspace',
    description:
      'Structure event flow, milestones, dependencies, and execution steps in one board.',
    href: '/planner',
    cta: 'Open planner',
  },
  {
    title: 'Notes and schedule',
    description:
      'Capture decisions, assumptions, and timeline notes alongside a calendar view.',
    href: '/posts',
    cta: 'Manage notes',
  },
  {
    title: 'Theme library',
    description: 'Store reusable concepts and map activities for each event theme.',
    href: '/themes',
    cta: 'Explore themes',
  },
];

const aiSections = [
  {
    title: 'Event ideas',
    description: 'Generate practical event suggestions for your audience and context.',
    href: '/eventrecomm',
  },
  {
    title: 'Theme ideation',
    description: 'Get curated themes with style direction and activity suggestions.',
    href: '/themerecomm',
  },
  {
    title: 'Research assistant',
    description:
      'Ask event-specific questions and receive planning-focused explanations.',
    href: '/info',
  },
];

interface StarterTheme {
  _id: string;
  title: string;
  description?: string;
  occasion?: string;
  colorPalette?: string[];
  mood?: string[];
  isPublic?: boolean;
}

interface StarterTemplate {
  _id: string;
  name: string;
  category: string;
  description: string;
  headcount: number;
  isPublic?: boolean;
}

const HomePage = () => {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Planner';

  const { data: themeResp, loadingFirst } = useFetch<{ data?: StarterTheme[] }>(
    '/themes',
    {
      default: { data: [] },
    }
  );

  const starterThemes = (Array.isArray(themeResp?.data) ? themeResp!.data : []).filter(
    (t) => (t as any).isPublic
  );

  const { data: templateResp, loadingFirst: loadingTemplates } = useFetch<{
    data?: StarterTemplate[];
  }>('/templates', {
    default: { data: [] },
  });

  const starterTemplates = (
    Array.isArray(templateResp?.data) ? templateResp!.data : []
  ).filter((t) => (t as any).isPublic);

  return (
    <AppShell
      title="Workspace"
      subtitle="Your authenticated planning dashboard for building real event workflows."
    >
      <FirstRunGuide />

      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-lg sm:p-8">
        <p className="text-sm text-[var(--app-muted)]">Welcome back, {firstName}</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Turn ideas into executable event plans
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--app-muted)]">
          EventGo helps you move from concept to execution with structured planning,
          AI-assisted suggestions, and reusable themes designed for small-to-medium
          events.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {workspaceSections.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-[var(--app-muted)]">{item.description}</p>
            <Link
              href={item.href}
              className="mt-5 inline-flex rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {item.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">AI planning studio</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--app-accent)]">
            AI mode — for ideation and research
          </p>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {aiSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--app-muted)]">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Starter themes</h2>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              Jump-start your planning with ready-made themes for any occasion.
            </p>
          </div>
          <Link
            href="/themes"
            className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
          >
            Open theme library
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {loadingFirst ? (
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-4 text-sm text-[var(--app-muted)]">
              Loading themes...
            </div>
          ) : starterThemes.length > 0 ? (
            starterThemes.map((theme) => (
              <article
                key={theme._id}
                className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3"
              >
                {theme.colorPalette && theme.colorPalette.length > 0 && (
                  <div className="mb-2 flex gap-1.5">
                    {theme.colorPalette.slice(0, 4).map((c) => (
                      <span
                        key={c}
                        style={{ backgroundColor: c }}
                        className="h-3 w-3 rounded-full"
                      />
                    ))}
                  </div>
                )}
                <h3 className="text-sm font-semibold">{theme.title}</h3>
                {theme.occasion && (
                  <p className="mt-0.5 text-xs capitalize text-[var(--app-accent)]">
                    {theme.occasion}
                  </p>
                )}
                {theme.mood && theme.mood.length > 0 && (
                  <p className="mt-1 text-xs italic text-[var(--app-muted)]">
                    {theme.mood.slice(0, 3).join(' · ')}
                  </p>
                )}
                <p className="mt-1 line-clamp-2 text-xs text-[var(--app-muted)]">
                  {theme.description}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/themes/${theme._id}/view`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    View theme
                  </Link>
                  <Link
                    href={`/planner?theme=${theme._id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)]"
                  >
                    Plan
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 rounded-lg border border-dashed border-[var(--app-border)] bg-[var(--app-elevated)]/50 p-6 text-center text-sm text-[var(--app-muted)]">
              <Link href="/themes" className="text-[var(--app-accent)] hover:underline">
                Browse starter themes →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Planning templates</h2>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              Start from a structured plan — checklist, timeline, and budget already
              mapped.
            </p>
          </div>
          <Link
            href="/templates"
            className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
          >
            Browse templates
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {loadingTemplates ? (
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-4 text-sm text-[var(--app-muted)]">
              Loading templates...
            </div>
          ) : starterTemplates.length > 0 ? (
            starterTemplates.slice(0, 6).map((template) => (
              <article
                key={template._id}
                className="flex flex-col rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3"
              >
                <h3 className="text-sm font-semibold">{template.name}</h3>
                <p className="mt-0.5 text-xs capitalize text-[var(--app-accent)]">
                  {template.category} · up to {template.headcount} people
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--app-muted)]">
                  {template.description}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/templates/${template._id}/use`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    Use template
                  </Link>
                  <Link
                    href={`/planner?template=${template._id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)]"
                  >
                    Plan
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 rounded-lg border border-dashed border-[var(--app-border)] bg-[var(--app-elevated)]/50 p-6 text-center text-sm text-[var(--app-muted)]">
              <Link
                href="/templates"
                className="text-[var(--app-accent)] hover:underline"
              >
                Browse planning templates →
              </Link>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
};

export default HomePage;
