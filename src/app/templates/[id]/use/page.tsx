'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
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
  const id = params?.id as string;

  const {
    data: template,
    loadingFirst,
    error,
  } = useFetch<Template>(`/templates/${id}`, {
    default: undefined,
  });

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
                name="eventName"
                title="event Name"
                type="text"
                defaultValue={`${template.name} Event`}
                className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--app-muted)]">
                Headcount
              </label>
              <input
                name="headcount"
                title="headcount"
                type="number"
                defaultValue={template.headcount}
                className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--app-muted)]">
                Date
              </label>
              <input
                name="date"
                title="date"
                type="date"
                className="mt-1 w-full rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm"
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
                <input
                  name="checklist"
                  title="check"
                  type="checkbox"
                  className="rounded"
                />
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
      <div className="flex justify-end gap-3">
        <Link
          href="/planner"
          className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-4 py-2 text-sm transition hover:bg-[var(--app-surface)]"
        >
          Start Planning
        </Link>
        <button className="rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
          Save as My Event
        </button>
      </div>
    </div>
  );
}

const UseTemplatePage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Template setup requires sign in" />;
  }

  return (
    <AppShell
      title="Plan from Template"
      subtitle="Customize this template to create your perfect event."
    >
      <TemplateWizard />
    </AppShell>
  );
};

export default UseTemplatePage;
