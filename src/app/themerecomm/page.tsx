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
    <AppShell
      title="Theme Recommendations"
      subtitle="Generate event themes with vibe, decor direction, and activity ideas."
    >
      <QueryWorkspace
        endpoint="/api/chatgpt3"
        placeholder="e.g. Birthday for 12 people, cozy indoor setting"
        actionLabel="Generate theme ideas"
        responseKey="recommendation"
        responseHeading="Theme output"
      />
    </AppShell>
  );
};

export default ThemeRecommendationsPage;
