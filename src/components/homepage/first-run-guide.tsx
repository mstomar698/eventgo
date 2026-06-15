'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BiX, BiSitemap, BiCategory, BiBulb, BiCalendarCheck } from 'react-icons/bi';

const STORAGE_KEY = 'eventgo:onboarded';

const steps = [
  {
    icon: BiSitemap,
    title: 'Map your event',
    body: 'Sketch the flow, milestones, and tasks on the visual planner.',
    href: '/planner',
    cta: 'Open planner',
  },
  {
    icon: BiCategory,
    title: 'Start from a theme',
    body: 'Pick a ready-made theme with colors, checklist, and timeline.',
    href: '/themes',
    cta: 'Browse themes',
  },
  {
    icon: BiBulb,
    title: 'Get AI ideas',
    body: 'Generate themes, event ideas, and venue suggestions in the AI Studio.',
    href: '/themerecomm',
    cta: 'Open AI Studio',
  },
  {
    icon: BiCalendarCheck,
    title: 'Track your vendors',
    body: 'Move vendors from “to contact” to “confirmed” in bookings.',
    href: '/bookings',
    cta: 'Open bookings',
  },
];

/**
 * A dismissible first-run guide shown once per browser. Hidden until mounted (to avoid an
 * SSR/localStorage hydration mismatch) and after the user dismisses it.
 */
const FirstRunGuide = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private mode etc.) — just don't show the guide.
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="relative mb-6 rounded-2xl border border-[var(--app-accent)]/30 bg-[var(--app-elevated)] p-6 sm:p-8">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss the getting-started guide"
        className="absolute right-3 top-3 rounded-lg border border-[var(--app-border)] p-1.5 text-[var(--app-muted)] transition hover:bg-[var(--app-surface)]"
      >
        <BiX size={16} />
      </button>

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-accent)]">
        Getting started
      </p>
      <h2 className="mt-1 text-lg font-semibold">Four ways to plan your first event</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <article
            key={step.href}
            className="flex flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
          >
            <div className="flex items-center gap-2 text-[var(--app-accent)]">
              <step.icon size={18} />
              <h3 className="text-sm font-semibold text-[var(--app-text)]">
                {step.title}
              </h3>
            </div>
            <p className="mt-1 flex-1 text-xs text-[var(--app-muted)]">{step.body}</p>
            <Link
              href={step.href}
              className="mt-3 inline-flex w-fit items-center rounded-lg bg-[var(--app-accent-strong)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              {step.cta}
            </Link>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="mt-4 text-xs font-semibold text-[var(--app-muted)] underline-offset-2 hover:underline"
      >
        Got it, don’t show this again
      </button>
    </section>
  );
};

export default FirstRunGuide;
