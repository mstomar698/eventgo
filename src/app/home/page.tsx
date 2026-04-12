// Public product landing page: copy, highlights and CTA
'use client';

import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import useFetch from 'http-react';

const highlights = [
  {
    title: 'Full planning flow',
    description:
      'Move from event brief to themes, schedules, vendors, and execution checklists in one workspace.',
  },
  {
    title: 'AI-assisted ideation',
    description:
      'Generate event concepts, theme options, and planning insights quickly during discovery.',
  },
  {
    title: 'Template-first execution',
    description:
      'Start from proven packs for birthdays and small community events, then adapt to your needs.',
  },
];

const landingMilestones = [
  'Brief intake and requirement capture',
  'Theme and concept exploration',
  'Venue and nearby service planning',
  'Timeline, tasks, and run-of-show controls',
  'Notes, calendar, and booking coordination',
  'Post-event summary and reuse support',
];

interface Template {
  _id: string;
  name: string;
  description?: string;
  headcount?: number;
}

const launchTemplates: Template[] = [];

const HomeRoute = () => {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const isAuthLoading = status === 'loading';

  const { data: tplResp, loadingFirst } = useFetch<{ data?: Template[] }>('/templates', {
    default: { data: [] },
  });

  const templates = Array.isArray(tplResp?.data) ? tplResp!.data : [];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <Navbar title="Product Overview" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow-xl sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)]">
            EventGo
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Professional event planning, from concept to run-of-show
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            EventGo helps teams and independent planners convert rough ideas into
            executable plans. Build structure, collect insights, and keep every milestone
            organized in one system. We prioritize reproducible templates, simple
            collaboration primitives, and clear exportable run-of-show artifacts.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/"
                className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Enter workspace
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (isAuthLoading) {
                    return;
                  }

                  signIn('google', {
                    callbackUrl: '/',
                  });
                }}
                disabled={isAuthLoading}
                className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAuthLoading ? 'Checking session...' : 'Try for free with Google'}
              </button>
            )}
            <a
              href="#capabilities"
              className="rounded-lg border border-[var(--app-border)] px-5 py-2.5 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
            >
              View capabilities
            </a>
          </div>
        </section>

        <section id="capabilities" className="mt-6 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-[var(--app-muted)]">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 sm:p-8">
          <h2 className="text-xl font-semibold">
            What authenticated users get in the app workspace
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <p className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
              Structured planner flowchart and timeline controls
            </p>
            <p className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
              Notes + schedule management connected to event planning
            </p>
            <p className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
              Theme and activity mapping for reusable event concepts
            </p>
            <p className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
              AI assistant for ideation, research, and recommendations
            </p>
            <p className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
              Profile-level theme and font preferences for accessibility
            </p>
            <p className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
              Production-readiness baseline with lint, format, and PR quality checks
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
            <h2 className="text-xl font-semibold">How planning progresses in EventGo</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--app-muted)]">
              {landingMilestones.map((milestone) => (
                <li
                  key={milestone}
                  className="rounded-lg bg-[var(--app-elevated)] px-3 py-2"
                >
                  {milestone}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
            <h2 className="text-xl font-semibold">Ready starter templates</h2>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              Launch quickly with prebuilt plans designed for under-20 attendee events.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {loadingFirst ? (
                <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-sm text-[var(--app-muted)]">
                  Loading templates...
                </div>
              ) : (
                (templates.length ? templates.slice(0, 4) : launchTemplates).map(
                  (template) => (
                    <article
                      key={template._id ?? template.name}
                      className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3"
                    >
                      <h3 className="text-sm font-semibold">{template.name}</h3>
                      <p className="mt-1 text-xs text-[var(--app-muted)]">
                        {template.description}
                      </p>
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
                  )
                )
              )}
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomeRoute;
