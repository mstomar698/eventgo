'use client';

import AppShell from '@/components/layout/app-shell';
import QueryWorkspace from '@/components/ai/query-workspace';

const VenueRecommPage = () => {
  return (
    <AppShell
      title="Venue Recommendations"
      subtitle="Find the perfect location for your event with venue suggestions and nearby area insights."
    >
      <QueryWorkspace
        endpoint="/venues"
        placeholder="Describe your event (e.g., 'birthday party for 20 people in downtown area')"
        actionLabel="Find Venues"
        responseKey="recommendation"
        responseHeading="Venue Suggestions"
      />
    </AppShell>
  );
};

export default VenueRecommPage;
