'use client';

import HomePage from '@/components/homepage';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/home');
    }
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
