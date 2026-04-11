'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';

interface SignInRequiredProps {
  title?: string;
  description?: string;
}

const SignInRequired = ({
  title = 'Sign in required',
  description = 'This workspace is available to authenticated users only.',
}: SignInRequiredProps) => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)]">
            EventGo Access
          </p>
          <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-[var(--app-muted)]">{description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() =>
                signIn('google', {
                  callbackUrl: '/',
                })
              }
              className="rounded-lg bg-[var(--app-accent-strong)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Continue with Google
            </button>
            <Link
              href="/home"
              className="rounded-lg border border-[var(--app-border)] px-5 py-2.5 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
            >
              Back to product overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInRequired;
