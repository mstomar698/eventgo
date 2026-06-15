'use client';

import Link from 'next/link';

/** All AI Studio surfaces, so each page can cross-link to the others. */
export const AI_STUDIO_PAGES = [
  {
    href: '/themerecomm',
    label: 'Theme Ideation',
    desc: 'Generate a full theme with AI',
  },
  {
    href: '/eventrecomm',
    label: 'Event Ideas',
    desc: 'Get 3 concrete event suggestions',
  },
  {
    href: '/venuerecomm',
    label: 'Venue Recommendations',
    desc: 'Find real venues near your location',
  },
  {
    href: '/info',
    label: 'Research Assistant',
    desc: 'Ask any planning question',
  },
];

/** Renders links to every AI Studio page except the current one. */
const AiStudioNav = ({ current }: { current: string }) => {
  const others = AI_STUDIO_PAGES.filter((p) => p.href !== current);
  return (
    <div className="mt-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--app-muted)]">
        Also in AI Studio
      </p>
      <div className="flex flex-wrap gap-3">
        {others.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="inline-flex flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-3 text-sm transition hover:border-[var(--app-accent)] hover:bg-[var(--app-surface)]"
          >
            <span className="font-semibold text-[var(--app-text)]">{p.label}</span>
            <span className="mt-0.5 text-xs text-[var(--app-muted)]">{p.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AiStudioNav;
