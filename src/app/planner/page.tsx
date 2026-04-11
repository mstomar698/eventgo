'use client';
import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import Flowchart from '@/features/planner/flowchart';
import { useSession } from 'next-auth/react';

const Planner = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  return (
    <>
      {isLoggedIn ? (
        <AppShell title="Planner">
          <div className="overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-2 shadow-lg">
            <Flowchart />
          </div>
        </AppShell>
      ) : (
        <SignInRequired title="Planner access requires sign in" />
      )}
    </>
  );
};

export default Planner;
