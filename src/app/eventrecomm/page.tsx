'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';
import AiStudioNav from '@/components/ai/ai-studio-nav';

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

      <AiStudioNav current="/eventrecomm" />
    </AppShell>
  );
};

export default EventRecommendationsPage;
