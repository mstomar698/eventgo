'use client';

import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';

interface AppShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  hideFooter?: boolean;
}

const AppShell = ({ title, subtitle, children, hideFooter = false }: AppShellProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <Navbar title={title} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {subtitle ? (
          <div className="mb-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
            <p className="text-sm text-[var(--app-muted)]">{subtitle}</p>
          </div>
        ) : null}
        {children}
      </main>
      {hideFooter ? null : <Footer />}
    </div>
  );
};

export default AppShell;
