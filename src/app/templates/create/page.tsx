'use client';

import Link from 'next/link';

export default function CreateTemplatePlaceholder() {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <section className="rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 shadow">
          <h1 className="text-2xl font-semibold">Create Template (placeholder)</h1>
          <p className="mt-3 text-sm text-[var(--app-muted)]">
            This route is a lightweight placeholder to avoid 404s while the full template
            creation UX is being implemented. Use this page to scaffold the real flow.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/templates"
              className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold"
            >
              Back to templates
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
