// Homepage content component used on authenticated workspace root
// Contains quick links to main workspace areas and AI studio
'use client';

import AppShell from '@/components/layout/app-shell';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useFetch from 'http-react';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const templateExamples = [
  'Birthday at home (<20 attendees)',
  'Birthday at a cafe (<20 attendees)',
  'Small community meetup (<20 attendees)',
  'Neighborhood workshop / book club (<20 attendees)',
  'Casual game night or movie viewing',
  'Potluck dinner gathering',
  'Outdoor picnic celebration',
  'Coffee or brunch social',
  'Virtual or hybrid online event',
  'Small wedding or engagement party',
  'Baby shower or bridal shower',
  'Holiday or seasonal celebration',
];

interface ReadyTemplate {
  _id?: string;
  name: string;
  useCases?: string;
}

const readyTemplatesFallback: ReadyTemplate[] = [
  {
    name: 'Birthday at Home',
    useCases: 'Family celebration with simple logistics',
  },
  {
    name: 'Birthday at Cafe/Restaurant',
    useCases: 'Hosted celebration with venue support',
  },
  {
    name: 'Small Community Meetup',
    useCases: 'Recurring local gathering format',
  },
  {
    name: 'Neighborhood Workshop',
    useCases: 'Educational or hobby-based session',
  },
  {
    name: 'Casual Game Night',
    useCases: 'Friends gathering for games and snacks',
  },
  {
    name: 'Potluck Dinner',
    useCases: 'Community gathering with shared dishes',
  },
  {
    name: 'Garden Picnic',
    useCases: 'Outdoor casual celebration',
  },
  {
    name: 'Virtual/Hybrid Meetup',
    useCases: 'Online gathering with tech setup',
  },
  {
    name: 'Baby Shower',
    useCases: 'Celebration for parents-to-be',
  },
  {
    name: 'Wedding Engagement Party',
    useCases: 'Intimate celebration for engaged couples',
  },
];

const HomePage = () => {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Planner';

  const { data: tplResp, loadingFirst } = useFetch<{ data?: ReadyTemplate[] }>(
    '/templates',
    {
      default: { data: [] },
    }
  );

  const templates =
    Array.isArray(tplResp?.data) && tplResp?.data.length
      ? tplResp.data
      : readyTemplatesFallback;

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
            AI experimental mode — for ideation and research
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
            <h2 className="text-xl font-semibold">Starter templates now available</h2>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              Launch plans faster with template packs already prepared for small events.
            </p>
          </div>
          <Link
            href="/templates"
            className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
          >
            Open full library
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(loadingFirst ? readyTemplatesFallback : templates).map((template) => (
            <article
              key={template._id ?? template.name}
              className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3"
            >
              <h3 className="text-sm font-semibold">{template.name}</h3>
              <p className="mt-1 text-xs text-[var(--app-muted)]">{template.useCases}</p>
              <div className="mt-3">
                {template._id ? (
                  <Link
                    href={`/templates/${template._id}/use`}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                  >
                    Use template
                  </Link>
                ) : (
                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
                  >
                    View templates
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
};

export default HomePage;
