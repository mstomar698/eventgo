'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const ThemeRecommendationsPage = () => {
  const { data: session } = useSession();
  if (!session) return <SignInRequired title="Theme ideation requires sign in" />;

  return (
    <AppShell title="Theme Ideation">
      <QueryWorkspace
        endpoint="/api/chatgpt3"
        placeholder="e.g. Tropical birthday party for 20 people, outdoor, summer"
        actionLabel="Generate theme"
        responseKey="recommendation"
        responseHeading="Theme output"
        mode="theme"
        description="Describe your event and get a complete theme with colors, activities, decor, music, food, checklist, and timeline — ready to save directly to your theme library."
        examples={[
          'Tropical outdoor birthday for 20 people, summer',
          'Elegant garden wedding reception for 50 guests',
          'Corporate innovation summit for 30 professionals',
          'Cozy winter indoor birthday for 12 close friends',
          'Retro 80s themed party for adults, evening event',
          'Minimalist modern art gallery opening for 25 guests',
          'Mediterranean summer gathering for 18 people',
          "Children's enchanted forest party for 15 kids",
          'Rooftop cocktail evening for 40 young professionals',
          'Boho-chic intimate wedding ceremony for 30 guests',
        ]}
      />

      <div className="mt-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--app-muted)]">
          Also in AI Studio
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/eventrecomm"
            className="inline-flex flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3 text-sm transition hover:border-[var(--app-accent)] hover:bg-[var(--app-surface)]"
          >
            <span className="font-semibold text-[var(--app-text)]">Event Ideas</span>
            <span className="mt-0.5 text-xs text-[var(--app-muted)]">
              Get 3 concrete event suggestions
            </span>
          </Link>
          <Link
            href="/info"
            className="inline-flex flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3 text-sm transition hover:border-[var(--app-accent)] hover:bg-[var(--app-surface)]"
          >
            <span className="font-semibold text-[var(--app-text)]">
              Research Assistant
            </span>
            <span className="mt-0.5 text-xs text-[var(--app-muted)]">
              Ask any planning question
            </span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
};

export default ThemeRecommendationsPage;
