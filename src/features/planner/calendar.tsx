'use client';

import React, { useEffect, useState } from 'react';
import { BiChevronLeft, BiChevronRight, BiPlus, BiX } from 'react-icons/bi';
import Modal from '@/components/ui/modal';
import ConfirmModal from '@/components/ui/confirm-modal';

interface Event {
  _id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  color?: string;
}

interface Post {
  _id: string;
  title: string;
  date: string;
  content: string;
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedItem, setSelectedItem] = useState<Event | Post | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', color: '#06b6d4' });

  const isEvent = (item: Event | Post): item is Event => '_id' in item && 'start' in item;
  const isPost = (item: Event | Post): item is Post => '_id' in item && 'date' in item;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, postsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/posts'),
        ]);

        if (!eventsRes.ok || !postsRes.ok) {
          throw new Error('Failed to load calendar data');
        }

        const eventsData = await eventsRes.json();
        const postsData = await postsRes.json();

        const eventsList = Array.isArray(eventsData.data) ? eventsData.data : [];
        const postsList = Array.isArray(postsData.data) ? postsData.data : [];

        setEvents(
          eventsList.map((e: any) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
        setPosts(postsList);
        setError(null);
      } catch (err) {
        console.error('Calendar error:', err);
        setError('Could not load calendar data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const toLocalDateStr = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const getItemsForDate = (date: Date) => {
    const dateStr = toLocalDateStr(date);
    const dayEvents = events.filter((e) => toLocalDateStr(new Date(e.start)) === dateStr);
    const dayPosts = posts.filter((p) => toLocalDateStr(new Date(p.date)) === dateStr);
    return [...dayEvents, ...dayPosts];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const items = getItemsForDate(date);
    if (items.length === 0) {
      setShowAddEventModal(true);
    } else if (items.length === 1) {
      setSelectedItem(items[0]);
      setShowDetailModal(true);
    } else {
      setShowDetailModal(true);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setIsSubmitting(true);
    try {
      const end = new Date(selectedDate);
      end.setHours(end.getHours() + 1);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eventForm.title,
          start: selectedDate,
          end,
          color: eventForm.color,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newEvent = data.data;
        setEvents((prev) => [
          ...prev,
          {
            ...newEvent,
            start: new Date(newEvent.start),
            end: new Date(newEvent.end),
          },
        ]);
        setShowAddEventModal(false);
        setEventForm({ title: '', color: '#06b6d4' });
      } else {
        throw new Error('Failed to create event');
      }
    } catch (err) {
      console.error('Add event error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem || !isEvent(selectedItem)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/events?id=${selectedItem._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== selectedItem._id));
        setShowDeleteConfirm(false);
        setShowDetailModal(false);
        setSelectedItem(null);
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  if (error) {
    return (
      <div className="h-[460px] w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 flex items-center justify-center text-sm text-red-400">
        {error}. Please refresh the page.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[460px] w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 flex items-center justify-center text-sm text-[var(--app-muted)]">
        Loading calendar...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--app-muted)]">
        Click any date to view or add events
      </p>
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-4 text-sm">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="rounded-lg p-1 hover:bg-[var(--app-surface)]"
            aria-label="Previous month"
          >
            <BiChevronLeft size={20} />
          </button>
          <h3 className="text-base font-semibold">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="rounded-lg p-1 hover:bg-[var(--app-surface)]"
            aria-label="Next month"
          >
            <BiChevronRight size={20} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-[var(--app-muted)]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="aspect-square rounded-lg bg-[var(--app-surface)]/50"
            />
          ))}
          {days.map((day) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const items = getItemsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <button
                key={day}
                onClick={() => handleDateClick(date)}
                className={`aspect-square rounded-lg border p-1 text-xs transition ${
                  isToday
                    ? 'border-[var(--app-accent)] bg-[var(--app-accent)]/10'
                    : 'border-[var(--app-border)] hover:bg-[var(--app-surface)]'
                }`}
              >
                <div className="font-semibold text-[var(--app-text)]">{day}</div>
                <div className="mt-1 space-y-0.5">
                  {items.slice(0, 2).map((item) => (
                    <div
                      key={item._id}
                      className={`truncate rounded px-1 py-0.5 text-xs ${
                        isEvent(item)
                          ? 'bg-[var(--app-accent)]/30 text-[var(--app-accent)]'
                          : 'bg-blue-500/30 text-blue-400'
                      }`}
                    >
                      {item.title}
                    </div>
                  ))}
                  {items.length > 2 && (
                    <div className="text-xs text-[var(--app-muted)]">
                      +{items.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
        title="Add event"
        size="sm"
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              Event title
            </label>
            <input
              type="text"
              required
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[var(--app-accent)]/20"
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--app-text)]">
              Color
            </label>
            <div className="mt-2 flex gap-2">
              {['#06b6d4', '#f43f5e', '#f97316', '#22c55e', '#8b5cf6'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setEventForm({ ...eventForm, color })}
                  style={{ backgroundColor: color }}
                  className={`h-6 w-6 rounded-lg border-2 ${
                    eventForm.color === color ? 'border-white' : 'border-transparent'
                  }`}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddEventModal(false)}
              disabled={isSubmitting}
              className="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--app-accent-strong)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
            >
              <BiPlus size={16} />
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      {selectedDate && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedItem(null);
          }}
          title={selectedDate.toLocaleDateString()}
          size="md"
        >
          <div className="space-y-4">
            {getItemsForDate(selectedDate).length === 0 ? (
              <p className="text-sm text-[var(--app-muted)]">
                No events or notes on this date
              </p>
            ) : (
              <>
                {getItemsForDate(selectedDate).map((item) => (
                  <div
                    key={item._id}
                    className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        {isEvent(item) && (
                          <p className="mt-1 text-xs text-[var(--app-muted)]">
                            {new Date(item.start).toLocaleTimeString()} -{' '}
                            {new Date(item.end).toLocaleTimeString()}
                          </p>
                        )}
                        {isPost(item) && item.content && (
                          <p className="mt-2 text-sm text-[var(--app-muted)] line-clamp-3">
                            {item.content}
                          </p>
                        )}
                      </div>
                      {isEvent(item) && (
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowDeleteConfirm(true);
                          }}
                          className="rounded-lg p-1 text-[var(--app-muted)] hover:text-red-400 hover:bg-[var(--app-surface)]"
                          aria-label="Delete event"
                        >
                          <BiX size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowAddEventModal(true);
                }}
                className="flex-1 rounded-lg border border-[var(--app-border)] px-3 py-2 text-sm font-semibold text-[var(--app-text)] transition hover:bg-[var(--app-surface)]"
              >
                Add event
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 rounded-lg bg-[var(--app-accent-strong)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteItem}
        title="Delete event"
        message="This action cannot be undone. Are you sure you want to delete this event?"
        confirmLabel="Delete"
        danger
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default CalendarPage;
