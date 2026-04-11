'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';

const EventRecommendationsPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Event recommendation requires sign in" />;
  }

  return (
    <AppShell title="Event Recommendations">
      <QueryWorkspace
        endpoint="/api/chatgpt2"
        placeholder="e.g. Team offsite for 15 people in Bangalore"
        actionLabel="Generate event ideas"
        responseKey="recommendation"
        responseHeading="Recommendation output"
        examples={[
          'Team offsite for 15 people with 1-day agenda',
          'Birthday event for 20 people with low budget',
          'Community meetup for 18 attendees in a cafe',
        ]}
      />
    </AppShell>
  );
};

export default EventRecommendationsPage;
