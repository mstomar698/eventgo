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
        responseKey="info"
        responseHeading="Research output"
      />
    </AppShell>
  );
};

export default EventInfoPage;
