// Navbar used across landing and workspace routes
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { BiMenu, BiX } from 'react-icons/bi';
import Image from 'next/image';

interface NavbarProps {
  title?: string;
}

const appLinks = [
  { href: '/', label: 'Workspace' },
  { href: '/planner', label: 'Planner' },
  { href: '/templates', label: 'Templates' },
  { href: '/posts', label: 'Notes' },
  { href: '/themes', label: 'Themes' },
  { href: '/bookings', label: 'Bookings' },
  { href: '/themerecomm', label: 'AI Studio' },
];

const linkClasses = (active: boolean) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    active
      ? 'bg-[var(--app-elevated)] text-[var(--app-text)]'
      : 'text-[var(--app-muted)] hover:bg-[var(--app-elevated)] hover:text-[var(--app-text)]'
  }`;

// The AI Studio nav item covers all four AI surfaces, so it stays highlighted on any of them.
const AI_STUDIO_PATHS = ['/themerecomm', '/eventrecomm', '/venuerecomm', '/info'];

const Navbar = ({ title }: NavbarProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLinkActive = (href: string) =>
    href === '/themerecomm'
      ? AI_STUDIO_PATHS.includes(pathname ?? '')
      : pathname === href;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = status === 'authenticated';
  const isAuthLoading = status === 'loading';
  const rootHref = isAuthLoading ? '/home' : isLoggedIn ? '/' : '/home';
  const userName = session?.user?.name ?? 'Event planner';
  const userImage = session?.user?.image;

  const ctaLabel = isAuthLoading
    ? 'Loading...'
    : isLoggedIn
      ? 'Sign out'
      : 'Try for free';
  const ctaAction = () => {
    if (isAuthLoading) {
      return;
    }

    if (isLoggedIn) {
      signOut({ callbackUrl: '/home' });
      return;
    }

    signIn('google', {
      callbackUrl: '/',
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[color:var(--app-bg)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={rootHref}
            className="text-lg font-semibold tracking-tight text-[var(--app-text)]"
          >
            EventGo
          </Link>
          {title ? (
            <p className="hidden truncate text-sm text-[var(--app-muted)] sm:block">
              / {title}
            </p>
          ) : null}
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {isLoggedIn
            ? appLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClasses(isLinkActive(link.href))}
                >
                  {link.label}
                </Link>
              ))
            : null}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <Link href="/profile" className={linkClasses(pathname === '/profile')}>
              Profile
            </Link>
          ) : null}
          <button
            type="button"
            onClick={ctaAction}
            disabled={isAuthLoading}
            className="rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {ctaLabel}
          </button>
          {status === 'authenticated' && userImage ? (
            <Image
              src={userImage}
              alt={userName}
              className="h-9 w-9 rounded-full border border-[var(--app-border)] object-cover"
              width={36}
              height={36}
            />
          ) : null}
        </div>

        <button
          title="toggle-menu"
          type="button"
          className="rounded-lg border border-[var(--app-border)] p-2 text-[var(--app-text)] md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <BiX size={24} /> : <BiMenu size={24} />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[var(--app-border)] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {isLoggedIn
              ? appLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={linkClasses(isLinkActive(link.href))}
                  >
                    {link.label}
                  </Link>
                ))
              : null}
            {isLoggedIn ? (
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className={linkClasses(pathname === '/profile')}
              >
                Profile
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                ctaAction();
              }}
              disabled={isAuthLoading}
              className="rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-left text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
