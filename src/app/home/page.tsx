// Public product landing page: copy, highlights and CTA
'use client';

import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

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

const HomeRoute = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <Navbar title="Product Overview" />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                onClick={() =>
                  signIn('google', {
                    callbackUrl: '/',
                  })
                }
                className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Try for free with Google
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
      </main>

      <Footer />
    </div>
  );
};

export default HomeRoute;
