'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import useFetch from 'http-react';
import { useSession } from 'next-auth/react';
import { BiPlus, BiPhone, BiEnvelope, BiDollar, BiCalendar } from 'react-icons/bi';

interface Booking {
  _id: string;
  vendorName: string;
  status: string;
  quote?: number;
  notes: string;
  dueDate?: string;
}

const statusColors = {
  to_contact: 'bg-gray-100 text-gray-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{booking.vendorName}</h3>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}
          >
            {booking.status.replace('_', ' ')}
          </span>
          {booking.quote && (
            <p className="mt-2 flex items-center gap-1 text-sm text-[var(--app-muted)]">
              <BiDollar size={14} />${booking.quote}
            </p>
          )}
          {booking.dueDate && (
            <p className="mt-1 flex items-center gap-1 text-sm text-[var(--app-muted)]">
              <BiCalendar size={14} />
              Due: {new Date(booking.dueDate).toLocaleDateString()}
            </p>
          )}
          {booking.notes && (
            <p className="mt-2 text-sm text-[var(--app-muted)]">{booking.notes}</p>
          )}
        </div>
        <div className="flex gap-1">
          <button className="rounded border border-[var(--app-border)] p-2 hover:bg-[var(--app-surface)]">
            <BiPhone size={14} />
          </button>
          <button className="rounded border border-[var(--app-border)] p-2 hover:bg-[var(--app-surface)]">
            <BiEnvelope size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingsList() {
  const { data, loadingFirst, error } = useFetch<Booking[]>('/bookings', {
    default: [],
  });

  if (loadingFirst) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-[var(--app-muted)]">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 text-sm text-red-300">
        Failed to load bookings.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--app-muted)]">
          {data.length} bookings in your pipeline
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
          <BiPlus size={18} />
          Add Booking
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
}

const BookingsPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Booking management requires sign in" />;
  }

  return (
    <AppShell
      title="Vendor Bookings"
      subtitle="Track your vendor pipeline and manage booking statuses."
    >
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <BookingsList />
      </section>
    </AppShell>
  );
};

export default BookingsPage;
