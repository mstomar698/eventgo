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
  void subtitle;
  return (
    <div className="flex min-h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <Navbar title={title} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      {hideFooter ? null : <Footer />}
    </div>
  );
};

export default AppShell;
