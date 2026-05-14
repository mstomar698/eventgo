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
        description="Get AI-powered event planning recommendations. Describe your event type, attendees, budget, and preferences to receive tailored ideas and suggestions."
        examples={[
          'Team offsite for 15 people with 1-day agenda',
          'Birthday event for 20 people with low budget',
          'Community meetup for 18 attendees in a cafe',
          'Wedding anniversary celebration for 25 guests at home',
          'Professional networking event for startup founders',
          'Family reunion for 30+ family members outdoors',
          'Bachelor party weekend getaway for 12 friends',
          'Charity fundraiser dinner for 40 attendees',
          'Product launch event for 50 stakeholders',
          'Housewarming party for neighbors and friends',
          'Annual team awards ceremony for 100 employees',
          'Art exhibition opening for local artists',
        ]}
      />
    </AppShell>
  );
};

export default EventRecommendationsPage;
