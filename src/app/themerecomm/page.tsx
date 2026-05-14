'use client';

import QueryWorkspace from '@/components/ai/query-workspace';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useSession } from 'next-auth/react';

const ThemeRecommendationsPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Theme recommendation requires sign in" />;
  }

  return (
    <AppShell title="Theme Recommendations">
      <QueryWorkspace
        endpoint="/api/chatgpt3"
        placeholder="e.g. Birthday for 12 people, cozy indoor setting"
        actionLabel="Generate theme ideas"
        responseKey="recommendation"
        responseHeading="Theme output"
        description="Discover unique event themes tailored to your occasion. Specify the event type, guest count, venue, and mood to get creative theme suggestions and design ideas."
        examples={[
          'Cozy indoor birthday for 12 people',
          'Retro game-night theme for a teen party',
          'Nature-themed community workshop setup',
          'Tropical island themed wedding reception',
          'Vintage 1920s speakeasy for corporate event',
          'Minimalist modern art gallery opening',
          "Enchanted forest fairytale children's party",
          'Industrial chic loft networking event',
          'Mediterranean garden summer gathering',
          'Elegant black-tie gala dinner',
          'Outdoor carnival festival for family day',
          'Boho-chic intimate wedding ceremony',
          'Futuristic tech conference theme',
          'Rustic barn country-style celebration',
          'Around-the-world cultural fusion event',
        ]}
      />
    </AppShell>
  );
};

export default ThemeRecommendationsPage;
