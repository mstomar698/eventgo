'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BiArrowToLeft, BiCheck, BiCalendar, BiDollar, BiUser } from 'react-icons/bi';

interface Template {
  _id: string;
  name: string;
  category: string;
  description: string;
  headcount: number;
  checklist: string[];
  timeline: Array<{
    phase: string;
    daysBefore: number;
    tasks: string[];
  }>;
  budgetCategories: Array<{
    category: string;
    estimatedAmount: number;
    notes: string;
  }>;
  vendorNeeds: string[];
  nearbyConsiderations: string[];
  communicationPlan: string[];
}

function TemplateWizard() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: response,
    loadingFirst,
    error,
  } = useFetch<{ data?: Template }>(`/templates/${id}`, {
    default: { data: undefined },
  });

  const template = response?.data;

  const [eventName, setEventName] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [date, setDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAsEvent = async () => {
    if (!date) {
      setSaveError('Please select a date for the event.');
      return;
    }
    setSaveError(null);
    setIsSaving(true);
    try {
      const start = new Date(date);
      start.setHours(10, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 8);

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventName || template?.name || 'My Event',
          start: start.toISOString(),
          end: end.toISOString(),
          color: '#14b8a6',
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => router.push('/posts'), 1200);
      } else {
        const data = await res.json().catch(() => null);
        setSaveError(data?.error?.message || 'Failed to save event.');
      }
    } catch {
      setSaveError('Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading template...
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Template not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm transition hover:bg-[var(--app-surface)]"
        >
          <BiArrowToLeft size={16} />
          Back to Templates
        </Link>
        <div>
          <h1 className="text-lg font-semibold">{template.name}</h1>
          <p className="text-sm text-[var(--app-muted)]">{template.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Event Basics */}
        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <BiUser size={16} />
            Event Basics
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--app-muted)]">
                Event Name
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder={`${template.name} Event`}
                className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--app-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--app-muted)]">
                Headcount
              </label>
              <input
                type="number"
                value={headcount}
                onChange={(e) => setHeadcount(e.target.value)}
                placeholder={String(template.headcount)}
                className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--app-accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--app-muted)]">
                Event Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm outline-none focus:border-[var(--app-accent)]"
              />
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <BiCheck size={16} />
            Checklist ({template.checklist.length} items)
          </h2>
          <div className="space-y-2">
            {template.checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <BiCalendar size={16} />
            Timeline
          </h2>
          <div className="space-y-3">
            {template.timeline.map((phase, index) => (
              <div
                key={index}
                className="rounded border border-[var(--app-border)] bg-[var(--app-surface)] p-3"
              >
                <h3 className="font-medium text-sm">{phase.phase}</h3>
                <p className="text-xs text-[var(--app-muted)]">
                  {phase.daysBefore} days before
                </p>
                <ul className="mt-2 space-y-1">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="text-xs text-[var(--app-muted)]">
                      • {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Budget */}
        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <BiDollar size={16} />
            Budget Categories
          </h2>
          <div className="space-y-2">
            {template.budgetCategories.map((cat, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded border border-[var(--app-border)] bg-[var(--app-surface)] p-3"
              >
                <div>
                  <p className="font-medium text-sm">{cat.category}</p>
                  <p className="text-xs text-[var(--app-muted)]">{cat.notes}</p>
                </div>
                <span className="font-semibold text-sm">${cat.estimatedAmount}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--app-muted)]">
            Total estimated: $
            {template.budgetCategories.reduce((sum, cat) => sum + cat.estimatedAmount, 0)}
          </p>
        </section>
      </div>

      {/* Action Buttons */}
      {saveError && (
        <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">
          {saveError}
        </div>
      )}
      {saveSuccess && (
        <div className="rounded-lg bg-green-500/20 p-3 text-sm text-green-400">
          Event saved to calendar! Redirecting to Notes & Schedule...
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Link
          href="/planner"
          className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-2 text-sm transition hover:bg-[var(--app-surface)]"
        >
          Start Planning
        </Link>
        <button
          onClick={handleSaveAsEvent}
          disabled={isSaving || saveSuccess}
          className="rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
        >
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save as My Event'}
        </button>
      </div>
    </div>
  );
}

const UseTemplatePage = () => {
  const { data: session } = useSession();

  if (!session) {
    return <SignInRequired title="Template setup requires sign in" />;
  }

  return (
    <AppShell title="Plan from Template">
      <TemplateWizard />
    </AppShell>
  );
};

export default UseTemplatePage;
