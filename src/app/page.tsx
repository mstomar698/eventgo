// EventGo: authenticated workspace entry page (app route)
// This component guards the workspace and redirects unauthenticated users
'use client';

import HomePage from '@/components/homepage';
import { useRouter } from 'next/navigation';
import { useSession, getSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkAndRedirect() {
      // only act when session reports unauthenticated — but double-check
      // with an explicit getSession call to avoid race conditions.
      if (status === 'unauthenticated') {
        const s = await getSession();
        if (cancelled) return;
        if (!s) {
          router.replace('/home');
        }
      }
    }

    checkAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [router, status]);

  if (status === 'loading' || status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4">
          <p className="text-sm text-[var(--app-muted)]">Opening workspace...</p>
        </div>
      </div>
    );
  }

  return <HomePage />;
}
