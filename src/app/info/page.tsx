'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';
import AiStudioNav from '@/components/ai/ai-studio-nav';

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

      <AiStudioNav current="/info" />
    </AppShell>
  );
};

export default EventInfoPage;
