import Link from 'next/link';

export const metadata = { title: 'Cookie Policy — EventGo' };

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="text-xs text-[var(--app-muted)] hover:text-[var(--app-accent)]"
        >
          ← Back to EventGo
        </Link>
        <h1 className="mt-6 text-3xl font-semibold">Cookie Policy</h1>
        <p className="mt-2 text-sm text-[var(--app-muted)]">Last updated: May 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[var(--app-muted)]">
          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              What cookies we use
            </h2>
            <p>
              EventGo uses a minimal number of cookies necessary to operate the service:
            </p>
            <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--app-border)]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--app-border)] bg-[var(--app-elevated)]">
                    <th className="px-4 py-2 text-left font-semibold text-[var(--app-text)]">
                      Cookie
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-[var(--app-text)]">
                      Purpose
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-[var(--app-text)]">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--app-border)]">
                    <td className="px-4 py-2 font-mono">next-auth.session-token</td>
                    <td className="px-4 py-2">Keeps you signed in across page loads</td>
                    <td className="px-4 py-2">Session / 30 days</td>
                  </tr>
                  <tr className="border-b border-[var(--app-border)]">
                    <td className="px-4 py-2 font-mono">next-auth.csrf-token</td>
                    <td className="px-4 py-2">
                      Protects against cross-site request forgery
                    </td>
                    <td className="px-4 py-2">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono">next-auth.callback-url</td>
                    <td className="px-4 py-2">
                      Remembers where to redirect after sign-in
                    </td>
                    <td className="px-4 py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              What we do not use
            </h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>No advertising or tracking cookies</li>
              <li>No third-party analytics cookies (e.g. Google Analytics)</li>
              <li>No cross-site tracking</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              Local storage
            </h2>
            <p>
              We use browser{' '}
              <code className="rounded bg-[var(--app-elevated)] px-1 font-mono">
                localStorage
              </code>{' '}
              (not cookies) to save your UI preferences such as dark/light mode and font
              size. This data never leaves your device.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              Managing cookies
            </h2>
            <p>
              You can delete cookies at any time via your browser settings. Deleting the
              session cookie will sign you out of EventGo. Blocking all cookies will
              prevent sign-in from working.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              Further reading
            </h2>
            <p>
              For more on how we handle personal data, see our{' '}
              <Link href="/privacy" className="text-[var(--app-accent)] hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
