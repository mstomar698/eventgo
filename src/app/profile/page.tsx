'use client';

import AppShell from '@/components/layout/app-shell';
import ConfirmModal from '@/components/ui/confirm-modal';
import SignInRequired from '@/features/auth/sign-in-required';
import { useUiSettings } from '@/features/settings/ui-settings-provider';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const ProfilePage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const { themeMode, fontScale, fontFamily, setThemeMode, setFontScale, setFontFamily } =
    useUiSettings();

  const [showDeleteData, setShowDeleteData] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!isLoggedIn) {
    return <SignInRequired title="Profile settings require sign in" />;
  }

  const btnClass = (active: boolean) =>
    `rounded-lg border px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'border-[var(--app-accent)] bg-[var(--app-elevated)] text-[var(--app-text)]'
        : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-elevated)]'
    }`;

  const handleDeleteData = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (res.ok) {
        setShowDeleteData(false);
        // Clear local storage settings
        localStorage.removeItem('eventgo-ui-settings');
      } else {
        setDeleteError('Failed to delete data. Please try again.');
      }
    } catch {
      setDeleteError('An error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (res.ok) {
        localStorage.removeItem('eventgo-ui-settings');
        await signOut({ callbackUrl: '/home' });
      } else {
        setDeleteError('Failed to delete account. Please try again.');
        setIsDeleting(false);
      }
    } catch {
      setDeleteError('An error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <AppShell title="Profile Settings">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Theme */}
        <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <h2 className="text-xl font-semibold">Theme</h2>
          <p className="mb-4 mt-1 text-sm text-[var(--app-muted)]">
            Choose light or dark mode based on your environment.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={btnClass(themeMode === 'dark')}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={btnClass(themeMode === 'light')}
            >
              Light
            </button>
          </div>
        </section>

        {/* Typography */}
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
                    className={btnClass(fontScale === scale)}
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
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFontFamily(opt.value)}
                    className={btnClass(fontFamily === opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="rounded-2xl border border-red-500/20 bg-[var(--app-surface)] p-6">
          <h2 className="text-xl font-semibold text-[var(--app-text)]">Data & Privacy</h2>
          <p className="mb-5 mt-1 text-sm text-[var(--app-muted)]">
            Manage your personal data and account. These actions are permanent and cannot
            be undone.
          </p>

          {deleteError && (
            <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-400">
              {deleteError}
            </div>
          )}

          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
              <h3 className="text-sm font-semibold">Delete my data</h3>
              <p className="mt-1 text-xs text-[var(--app-muted)]">
                Removes all your themes, custom planning templates, and preferences. Your
                account remains active.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteData(true)}
                className="mt-3 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                Delete my data
              </button>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
              <h3 className="text-sm font-semibold text-red-400">Delete account</h3>
              <p className="mt-1 text-xs text-[var(--app-muted)]">
                Permanently deletes all your data and signs you out. You can re-sign in
                with Google but all data will be gone.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteAccount(true)}
                className="mt-3 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/30"
              >
                Delete account
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Delete Data Modal */}
      <ConfirmModal
        isOpen={showDeleteData}
        onClose={() => {
          setShowDeleteData(false);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteData}
        title="Delete your data"
        message="This will permanently delete all your themes, custom templates, and preferences. Your account will remain active. This cannot be undone."
        confirmLabel="Yes, delete my data"
        danger
        isLoading={isDeleting}
      />

      {/* Delete Account Modal */}
      <ConfirmModal
        isOpen={showDeleteAccount}
        onClose={() => {
          setShowDeleteAccount(false);
          setDeleteError(null);
        }}
        onConfirm={handleDeleteAccount}
        title="Delete your account"
        message="This will permanently delete all your data and sign you out immediately. You can sign back in with Google but all themes, templates, notes, and settings will be gone forever."
        confirmLabel="Yes, delete my account"
        danger
        isLoading={isDeleting}
      />
    </AppShell>
  );
};

export default ProfilePage;
