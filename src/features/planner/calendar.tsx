import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Event {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch events');
        return response.json();
      })
      .then((payload: ApiResponse<Event[]>) => {
        const items = Array.isArray(payload?.data) ? payload.data : [];
        setEvents(
          items.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
        setError(null);
      })
      .catch((err) => {
        console.error('Calendar error:', err);
        setError('Could not load calendar events');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = window.prompt('Enter event title');
    if (!title?.trim()) {
      return;
    }

    const color = window.prompt('Enter event color (optional)') ?? undefined;
    const eventData = { title, start, end, color };

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save event');
        }
        return response.json();
      })
      .then((payload: ApiResponse<Event>) => {
        const saved = payload.data;
        setEvents((current) => [
          ...current,
          {
            ...saved,
            start: new Date(saved.start),
            end: new Date(saved.end),
          },
        ]);
      })
      .catch((err) => {
        console.error('Save event error:', err);
        alert('Failed to save event. Please try again.');
      });
  };

  const handleSelectEvent = (event: Event) => {
    const shouldDelete = window.confirm(`Remove \"${event.title}\" from calendar?`);
    if (!shouldDelete) {
      return;
    }

    if (!event._id) {
      setEvents((current) => current.filter((item) => item !== event));
      return;
    }

    fetch(`/api/events?id=${event._id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete event');
        }
        setEvents((current) => current.filter((item) => item._id !== event._id));
      })
      .catch((err) => {
        console.error('Delete event error:', err);
        alert('Failed to delete event. Please try again.');
      });
  };

  const eventPropGetter = (event: Event) => ({
    style: {
      backgroundColor: event.color ?? 'var(--app-accent-strong)',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      color: '#5eead4',
    },
  });

  const helperText = useMemo(() => {
    if (error) {
      return `Error: ${error}`;
    }
    if (isLoading) {
      return 'Loading calendar...';
    }
    if (events.length === 0) {
      return 'Select a time slot to create your first event.';
    }
    return 'Select a slot to add or click an event to remove it.';
  }, [events.length, isLoading, error]);

  return (
    <div className="space-y-2">
      <p className={`text-xs ${error ? 'text-red-400' : 'text-[var(--app-muted)]'}`}>
        {helperText}
      </p>
      {!error ? (
        <div className="h-[460px] w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
          <Calendar
            localizer={localizer}
            events={events}
            eventPropGetter={eventPropGetter}
            startAccessor="start"
            endAccessor="end"
            selectable
            popup
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            className="h-full"
          />
        </div>
      ) : (
        <div className="h-[460px] w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 flex items-center justify-center text-sm text-red-400">
          Failed to load calendar. Please try refreshing the page.
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
