'use client';

import AppShell from '@/components/layout/app-shell';
import QueryWorkspace from '@/components/ai/query-workspace';

const VenueRecommPage = () => {
  return (
    <AppShell title="Venue Recommendations">
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
