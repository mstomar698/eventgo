'use client';

import AppShell from '@/components/layout/app-shell';
import QueryWorkspace from '@/components/ai/query-workspace';
import AiStudioNav from '@/components/ai/ai-studio-nav';

const VenueRecommPage = () => {
  return (
    <AppShell title="Venue Recommendations">
      <QueryWorkspace
        endpoint="/api/venues"
        placeholder="Describe your event (e.g., 'birthday party for 20 people in downtown area')"
        actionLabel="Find Venues"
        responseKey="recommendation"
        responseHeading="Venue Suggestions"
        description="Find the perfect venue for your event. Tell us about your guest count, event type, location preferences, and budget to get personalized venue recommendations."
        examples={[
          'Birthday party for 20 people in downtown area',
          'Corporate team building event for 30 people',
          'Intimate wedding ceremony for 50 guests',
          'Product launch for 100+ people with tech setup',
          'Casual networking event for 25 professionals',
          'Family reunion for 40+ people outdoors',
          'Art exhibition opening for 60 attendees',
          'Small wedding reception for 30 close friends',
          'Workshop or training session for 15-20 people',
          'Annual company gala for 150+ employees',
          'Casual dinner party for 12 friends at home',
          'Conference or seminar for 200+ attendees',
          'Intimate proposal celebration for 20 people',
          'Community charity event for 100+ people',
          'Milestone birthday bash for 50 guests',
        ]}
      />

      <AiStudioNav current="/venuerecomm" />
    </AppShell>
  );
};

export default VenueRecommPage;
