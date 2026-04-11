'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useUiSettings } from '@/features/settings/ui-settings-provider';
import { useSession } from 'next-auth/react';

const ProfilePage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const { themeMode, fontScale, setThemeMode, setFontScale } = useUiSettings();

  if (!isLoggedIn) {
    return <SignInRequired title="Profile settings require sign in" />;
  }

  return (
    <AppShell
      title="Profile Settings"
      subtitle="Customize your visual preferences for a comfortable planning workflow."
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h2 className="text-xl font-semibold">Theme</h2>
          <p className="mb-4 mt-1 text-sm text-[var(--app-muted)]">
            Choose light or dark mode based on your environment.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                themeMode === 'dark'
                  ? 'border-[var(--app-accent)] bg-[var(--app-elevated)] text-[var(--app-text)]'
                  : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-elevated)]'
              }`}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                themeMode === 'light'
                  ? 'border-[var(--app-accent)] bg-[var(--app-elevated)] text-[var(--app-text)]'
                  : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-elevated)]'
              }`}
            >
              Light
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h2 className="text-xl font-semibold">Font size</h2>
          <p className="mb-4 mt-1 text-sm text-[var(--app-muted)]">
            Scale base typography for readability.
          </p>
          <div className="flex flex-wrap gap-3">
            {(['sm', 'md', 'lg'] as const).map((scale) => (
              <button
                key={scale}
                type="button"
                onClick={() => setFontScale(scale)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition ${
                  fontScale === scale
                    ? 'border-[var(--app-accent)] bg-[var(--app-elevated)] text-[var(--app-text)]'
                    : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-elevated)]'
                }`}
              >
                {scale === 'sm' ? 'Small' : scale === 'md' ? 'Medium' : 'Large'}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h2 className="text-xl font-semibold">Preview</h2>
          <p className="mt-2 text-sm text-[var(--app-muted)]">
            The current page reflects your selected theme and font scale settings.
          </p>
        </section>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
