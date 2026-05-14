'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const EventInfoPage = () => {
  const { data: session } = useSession();
  if (!session) return <SignInRequired title="Research assistant requires sign in" />;

  return (
    <AppShell title="Research Assistant">
      <QueryWorkspace
        endpoint="/api/chatgpt"
        placeholder="e.g. How do I structure a day-of runbook for 50 people?"
        actionLabel="Get advice"
        responseKey="recommendation"
        responseHeading="Planning advice"
        mode="text"
        description="Ask any event planning question — timelines, budgets, vendor coordination, logistics, or best practices — and get structured, actionable advice."
        examples={[
          'How to structure a day-of runbook for 50 attendees?',
          'What are the biggest budget risks for small events?',
          'Venue coordination checklist one week before event',
          'How do I manage guest dietary restrictions?',
          'Best practices for outdoor event contingency planning',
          'How to coordinate multiple vendors on event day?',
          'What should a detailed event timeline include?',
          'Tips for keeping event costs within budget?',
          'How to handle last-minute guest cancellations?',
          'Best seating arrangement practices for 30 guests?',
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
            href="/eventrecomm"
            className="inline-flex flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3 text-sm transition hover:border-[var(--app-accent)] hover:bg-[var(--app-surface)]"
          >
            <span className="font-semibold text-[var(--app-text)]">Event Ideas</span>
            <span className="mt-0.5 text-xs text-[var(--app-muted)]">
              Get 3 concrete event suggestions
            </span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
};

export default EventInfoPage;
