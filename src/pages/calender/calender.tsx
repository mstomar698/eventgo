import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Event {
  _id: string;
  title: string;
  start: Date;
  end?: Date;
  color?: string;
}

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.log(error));
  }, []);

  const handleSelect = ({ start, end }: any) => {
    const title = window.prompt('Enter event title');
    const color = window.prompt('Enter event color (optional)');
    const eventData = { title, start, end, color };
    console.log(eventData);
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => setEvents([...events, data]))
      .then(() => console.log(events))
      .then(() =>
        setTimeout(() => {
          window.location.reload();
        }, 1000)
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
        backgroundColor: event.color,
      },
      onClick: () => handleSelect(event),
    };
  };

  return (
    <div className="h-[440px] w-full rounded-sm text-green-500 bg-gray-500 text-center flex justify-center items-center">
      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
      />
    </div>
  );
};

export default CalendarPage;
