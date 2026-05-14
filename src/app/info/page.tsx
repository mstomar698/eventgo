'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';

const EventInfoPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Event info requires sign in" />;
  }

  return (
    <AppShell title="Planning Research">
      <QueryWorkspace
        endpoint="/api/chatgpt"
        placeholder="e.g. What should we include in a wedding day-of runbook?"
        actionLabel="Get insights"
        responseKey="recommendation"
        responseHeading="Research output"
        description="Research and learn best practices for event planning. Ask questions about timelines, budgets, vendor coordination, logistics, and more to get expert guidance."
        examples={[
          'How to structure a day-of runbook for 50 attendees?',
          'What are common budget overrun risks for small events?',
          'Checklist for venue coordination one week before event',
          'How to manage guest dietary restrictions effectively?',
          'Best practices for outdoor event contingency planning',
          'Tips for coordinating multiple vendors on event day',
          'How to create an emergency contact list and protocol?',
          'What should be included in a detailed timeline?',
          'Best ways to gather and display event RSVPs?',
          'How to negotiate better rates with event vendors?',
          'Tips for keeping event costs under budget?',
          'What insurance do I need for my event?',
          'How to handle last-minute guest cancellations?',
          'Best practices for seating arrangements and flow?',
          'What technology tools help with event management?',
          'How to create memorable experiences on a tight budget?',
          'Tips for managing events in challenging weather?',
          'How to capture quality event photos and videos?',
        ]}
      />
    </AppShell>
  );
};

export default EventInfoPage;
