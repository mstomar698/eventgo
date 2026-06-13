'use client';

import AppShell from '@/components/layout/app-shell';
import SignInRequired from '@/features/auth/sign-in-required';
import Modal from '@/components/ui/modal';
import useFetch, { revalidate } from 'http-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  BiPlus,
  BiPhone,
  BiEnvelope,
  BiDollar,
  BiCalendar,
  BiEdit,
  BiTrash,
} from 'react-icons/bi';

interface Booking {
  _id: string;
  vendorName: string;
  status: string;
  quote?: number;
  notes: string;
  dueDate?: string;
}

interface BookingFormData {
  vendorName: string;
  status: string;
  quote: string;
  dueDate: string;
  notes: string;
}

const EMPTY_FORM: BookingFormData = {
  vendorName: '',
  status: 'to_contact',
  quote: '',
  dueDate: '',
  notes: '',
};

const statusColors = {
  to_contact: 'bg-gray-100 text-gray-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

function BookingCard({
  booking,
  onEdit,
  onDelete,
}: {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}) {
  const iconBtn =
    'rounded border border-[var(--app-border)] p-2 hover:bg-[var(--app-surface)]';
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
          <button type="button" title="phone" className={iconBtn}>
            <BiPhone size={14} />
          </button>
          <button type="button" title="email" className={iconBtn}>
            <BiEnvelope size={14} />
          </button>
          <button
            type="button"
            title="Edit booking"
            onClick={() => onEdit(booking)}
            className={iconBtn}
          >
            <BiEdit size={14} />
          </button>
          <button
            type="button"
            title="Delete booking"
            onClick={() => onDelete(booking)}
            className="rounded border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10"
          >
            <BiTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingsList() {
  const {
    data: response,
    loadingFirst,
    error,
  } = useFetch<{ data?: Booking[] }>('/bookings', {
    default: { data: [] },
  });

  const bookings = Array.isArray(response?.data) ? response.data : [];
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BookingFormData>(EMPTY_FORM);

  const openAdd = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setSubmitError(null);
    setShowFormModal(true);
  };

  const openEdit = (booking: Booking) => {
    setEditingId(booking._id);
    setFormData({
      vendorName: booking.vendorName,
      status: booking.status,
      quote: booking.quote != null ? String(booking.quote) : '',
      dueDate: booking.dueDate ? booking.dueDate.slice(0, 10) : '',
      notes: booking.notes ?? '',
    });
    setSubmitError(null);
    setShowFormModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        vendorName: formData.vendorName.trim(),
        status: formData.status,
        quote: formData.quote ? parseFloat(formData.quote) : undefined,
        dueDate: formData.dueDate || undefined,
        notes: formData.notes.trim(),
      };

      const response = await fetch(
        editingId ? `/api/bookings/${editingId}` : '/api/bookings',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        revalidate('GET /bookings');
        setShowFormModal(false);
        setEditingId(null);
        setFormData(EMPTY_FORM);
      } else {
        setSubmitError(
          editingId
            ? 'Failed to update booking. Please try again.'
            : 'Failed to create booking. Please try again.'
        );
      }
    } catch (err) {
      console.error('Submit failed:', err);
      setSubmitError('Error saving booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBooking) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/bookings/${deletingBooking._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        revalidate('GET /bookings');
        setDeletingBooking(null);
      } else {
        setDeleteError('Failed to delete booking. Please try again.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleteError('Error deleting booking. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  const inputClass =
    'w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20';
  const labelClass = 'block text-sm font-medium text-[var(--app-text)]';

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--app-muted)]">
            {bookings.length} bookings in your pipeline
          </p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <BiPlus size={18} />
            Add Booking
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onEdit={openEdit}
              onDelete={setDeletingBooking}
            />
          ))}
        </div>
      </div>

      {/* Add / Edit Booking Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setSubmitError(null);
        }}
        title={editingId ? 'Edit Booking' : 'Add Booking'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">
              {submitError}
            </div>
          )}
          <div>
            <label className={labelClass}>Vendor Name*</label>
            <input
              type="text"
              required
              value={formData.vendorName}
              onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
              className={inputClass}
              placeholder="Vendor name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={inputClass}
              >
                <option value="to_contact">To Contact</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Quote ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={inputClass}
              placeholder="Add any notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowFormModal(false)}
              disabled={isSubmitting}
              className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.vendorName.trim()}
              className="rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {isSubmitting
                ? editingId
                  ? 'Saving...'
                  : 'Adding...'
                : editingId
                  ? 'Save Changes'
                  : 'Add Booking'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingBooking !== null}
        onClose={() => {
          setDeletingBooking(null);
          setDeleteError(null);
        }}
        title="Delete Booking"
        size="sm"
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">
              {deleteError}
            </div>
          )}
          <p className="text-sm text-[var(--app-muted)]">
            Delete the booking for{' '}
            <span className="font-semibold text-[var(--app-text)]">
              {deletingBooking?.vendorName}
            </span>
            ? This cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setDeletingBooking(null)}
              disabled={isDeleting}
              className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

const BookingsPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);

  if (!isLoggedIn) {
    return <SignInRequired title="Booking management requires sign in" />;
  }

  return (
    <AppShell title="Vendor Bookings">
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <BookingsList />
      </section>
    </AppShell>
  );
};

export default BookingsPage;
