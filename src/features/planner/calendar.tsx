import React, { useEffect, useState } from 'react';
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

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setEvents([]);
          return;
        }

        setEvents(
          data.map((event: Event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          }))
        );
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
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
      .then((data) =>
        setEvents((current) => [
          ...current,
          {
            ...data,
            start: new Date(data.start),
            end: new Date(data.end),
          },
        ])
      )
      .catch((error) => console.log(error));
  };
  // const handleDelete = (event: Event) => {
  //   fetch(`/api/events/${event._id}`, {
  //     method: 'DELETE',
  //   })
  //     .then(() => setEvents(events.filter((e) => e._id !== event._id)))
  //     .catch((error) => console.log(error));
  // };
  const eventPropGetter = (event: Event) => {
    return {
      style: {
        backgroundColor: event.color ?? 'var(--app-accent-strong)',
        border: 'none',
        borderRadius: '6px',
      },
    };
  };

  return (
    <div className="h-[420px] w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-elevated)] p-3 text-sm">
      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        className="h-full"
      />
    </div>
  );
};

export default CalendarPage;
