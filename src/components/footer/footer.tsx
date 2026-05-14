import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t border-[var(--app-border)] bg-[var(--app-bg)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--app-muted)]">
            EventGo — Plan smarter. Execute calmer.
          </p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href="/privacy"
              className="text-xs text-[var(--app-muted)] transition hover:text-[var(--app-accent)]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-[var(--app-muted)] transition hover:text-[var(--app-accent)]"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-[var(--app-muted)] transition hover:text-[var(--app-accent)]"
            >
              Cookies
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
