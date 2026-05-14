import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — EventGo' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/home"
          className="text-xs text-[var(--app-muted)] hover:text-[var(--app-accent)]"
        >
          ← Back to EventGo
        </Link>
        <h1 className="mt-6 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-[var(--app-muted)]">Last updated: May 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-[var(--app-muted)]">
          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              1. Information we collect
            </h2>
            <p>
              When you sign in with Google, we receive your name, email address, and
              profile picture from Google OAuth. We do not receive or store your Google
              password.
            </p>
            <p className="mt-2">
              We also store content you create inside the app: themes, planning templates,
              notes, calendar events, and bookings.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              2. How we use your information
            </h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>To authenticate you and maintain your session</li>
              <li>To store and display the planning content you create</li>
              <li>To associate your custom themes and templates with your account</li>
            </ul>
            <p className="mt-2">
              We do not sell, share, or otherwise disclose your personal information to
              third parties except as required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              3. Data storage
            </h2>
            <p>
              Your data is stored in a cloud MongoDB database. Connections are encrypted
              in transit via TLS. We take reasonable precautions to protect your data but
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              4. AI features
            </h2>
            <p>
              When you use the AI Studio, your query text is sent to Google Gemini API to
              generate a response. Queries are not stored beyond your current session.
              Please do not include sensitive personal information in AI queries.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              5. Your rights
            </h2>
            <p>
              You can delete your data or your entire account at any time from your{' '}
              <Link href="/profile" className="text-[var(--app-accent)] hover:underline">
                Profile Settings
              </Link>{' '}
              page. Deletion is permanent and cannot be reversed.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              6. Cookies
            </h2>
            <p>
              We use a single session cookie set by NextAuth to keep you signed in. See
              our{' '}
              <Link href="/cookies" className="text-[var(--app-accent)] hover:underline">
                Cookie Policy
              </Link>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-[var(--app-text)]">
              7. Contact
            </h2>
            <p>
              If you have questions about this policy, please open an issue on our GitHub
              repository or contact the project maintainer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
