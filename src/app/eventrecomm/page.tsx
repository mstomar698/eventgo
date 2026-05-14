'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const EventRecommendationsPage = () => {
  const { data: session } = useSession();
  if (!session) return <SignInRequired title="Event ideas requires sign in" />;

  return (
    <AppShell title="Event Ideas">
      <QueryWorkspace
        endpoint="/api/chatgpt2"
        placeholder="e.g. Team bonding for 15 engineers, 1-day budget ₹30k"
        actionLabel="Generate event ideas"
        responseKey="recommendation"
        responseHeading="Event ideas"
        mode="text"
        description="Describe your group, size, budget, and occasion to get 3 concrete event ideas with formats, activities, and budget ranges."
        examples={[
          'Team bonding for 15 engineers, 1-day, medium budget',
          'Birthday celebration for 20 people, low budget, indoor',
          'Community meetup for 18 locals in a cafe, 2 hours',
          'Client appreciation dinner for 8 executives',
          'Weekend getaway for 12 friends, adventure focus',
          'Charity fundraiser for 40 attendees, evening',
          'Product launch for 50 stakeholders, corporate',
          'Family reunion for 30+ people, outdoor, all ages',
          'Housewarming for neighbours and close friends',
          'End-of-year party for 25-person startup team',
        ]}
      />

      <div className="mt-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--app-muted)]">
          Also in AI Studio
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/themerecomm"
            className="inline-flex flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3 text-sm transition hover:border-[var(--app-accent)] hover:bg-[var(--app-surface)]"
          >
            <span className="font-semibold text-[var(--app-text)]">Theme Ideation</span>
            <span className="mt-0.5 text-xs text-[var(--app-muted)]">
              Generate a full theme with AI
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

export default EventRecommendationsPage;
