// Homepage content component used on authenticated workspace root
// Contains quick links to main workspace areas and AI studio
'use client';

import AppShell from '@/components/layout/app-shell';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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

const templateExamples = [
  'Birthday at home (<20 attendees)',
  'Birthday at a cafe (<20 attendees)',
  'Small community meetup (<20 attendees)',
  'Neighborhood workshop / book club (<20 attendees)',
];

const HomePage = () => {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Planner';

  return (
    <AppShell
      title="Workspace"
      subtitle="Your authenticated planning dashboard for building real event workflows."
    >
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-lg sm:p-8">
        <p className="text-sm text-[var(--app-muted)]">Welcome back, {firstName}</p>
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
          Turn ideas into executable event plans
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--app-muted)]">
          EventGo helps you move from concept to execution with structured planning,
          AI-assisted suggestions, and reusable templates designed for small-to-medium
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
            AI experimental mode (Gemini) — for ideation and research (dev only)
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
        <h2 className="text-xl font-semibold">Starter template direction</h2>
        <p className="mt-2 text-sm text-[var(--app-muted)]">
          These are the first template packs targeted in the roadmap for ready-to-run
          planning.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {templateExamples.map((template) => (
            <div
              key={template}
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3 text-sm"
            >
              {template}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default HomePage;
