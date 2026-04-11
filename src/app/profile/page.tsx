'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import { useUiSettings } from '@/features/settings/ui-settings-provider';
import { useSession } from 'next-auth/react';

const ProfilePage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const { themeMode, fontScale, fontFamily, setThemeMode, setFontScale, setFontFamily } =
    useUiSettings();

  if (!isLoggedIn) {
    return <SignInRequired title="Profile settings require sign in" />;
  }

  return (
    <AppShell title="Profile Settings">
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
          <h2 className="text-xl font-semibold">Typography</h2>
          <p className="mb-4 mt-1 text-sm text-[var(--app-muted)]">
            Scale text and switch font family for readability.
          </p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--app-muted)]">
                Font size
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
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--app-muted)]">
                Font family
              </p>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    { value: 'sans', label: 'Sans' },
                    { value: 'serif', label: 'Serif' },
                    { value: 'mono', label: 'Mono' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFontFamily(option.value)}
                    className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                      fontFamily === option.value
                        ? 'border-[var(--app-accent)] bg-[var(--app-elevated)] text-[var(--app-text)]'
                        : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-elevated)]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default ProfilePage;
