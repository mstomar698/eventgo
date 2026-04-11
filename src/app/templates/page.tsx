'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch from 'http-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { BiRocket, BiPlus } from 'react-icons/bi';

interface Template {
  _id: string;
  name: string;
  category: string;
  description: string;
  headcount: number;
}

function TemplateCard(props: Template) {
  return (
    <article className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="line-clamp-2 text-sm font-semibold">{props.name}</h3>
          <p className="mt-1 text-xs text-[var(--app-muted)] capitalize">
            {props.category} • Up to {props.headcount} people
          </p>
        </div>
        <BiRocket className="text-[var(--app-accent)]" size={20} />
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-[var(--app-muted)]">
        {props.description}
      </p>
      <Link
        href={`/templates/${props._id}/use`}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90"
      >
        Use Template
      </Link>
    </article>
  );
}

function TemplatesList() {
  const { data, loadingFirst, error } = useFetch<Template[]>('/templates', {
    default: [],
  });

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading templates...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Failed to load templates.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--app-muted)]">
          {data.length} starter templates available
        </p>
        <Link
          href="/templates/create"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <BiPlus size={18} />
          Create Custom
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((template) => (
          <TemplateCard {...template} key={`template-${template._id}`} />
        ))}
      </div>
    </div>
  );
}

const TemplatesPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Template access requires sign in" />;
  }

  return (
    <AppShell
      title="Event Templates"
      subtitle="Start planning with proven templates for birthdays and community events."
    >
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <TemplatesList />
      </section>
    </AppShell>
  );
};

export default TemplatesPage;
