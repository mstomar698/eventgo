import { describe, it, expect } from 'vitest';
import {
  EventSchema,
  AIQuerySchema,
  BookingStatusSchema,
  BookingSchema,
  ThemeSchema,
  EventTemplateSchema,
  VenueOptionSchema,
} from '../schemas';

describe('EventSchema', () => {
  it('accepts a valid event and coerces date strings', () => {
    const result = EventSchema.parse({
      title: '  Launch  ',
      start: '2026-01-01T10:00:00Z',
      end: '2026-01-01T12:00:00Z',
    });
    expect(result.title).toBe('Launch'); // trimmed
    expect(result.start).toBeInstanceOf(Date);
  });

  it('rejects an empty title', () => {
    expect(() =>
      EventSchema.parse({ title: '', start: new Date(), end: new Date() })
    ).toThrow();
  });
});

describe('AIQuerySchema', () => {
  it('accepts a normal query and trims it', () => {
    expect(AIQuerySchema.parse({ query: '  birthday ideas ' }).query).toBe(
      'birthday ideas'
    );
  });

  it('rejects an empty query', () => {
    expect(() => AIQuerySchema.parse({ query: '' })).toThrow();
  });

  it('rejects a query over the 1000-char limit', () => {
    expect(() => AIQuerySchema.parse({ query: 'a'.repeat(1001) })).toThrow();
  });
});

describe('BookingStatusSchema', () => {
  it('accepts the known statuses', () => {
    for (const s of ['to_contact', 'contacted', 'quoted', 'confirmed', 'cancelled']) {
      expect(BookingStatusSchema.parse(s)).toBe(s);
    }
  });

  it('rejects an unknown status', () => {
    expect(() => BookingStatusSchema.parse('pending')).toThrow();
  });
});

describe('BookingSchema', () => {
  it('defaults status to to_contact and notes to empty', () => {
    const b = BookingSchema.parse({ vendorId: 'v1', vendorName: 'Acme' });
    expect(b.status).toBe('to_contact');
    expect(b.notes).toBe('');
  });

  it('coerces a date-string dueDate (as sent by <input type="date">)', () => {
    const b = BookingSchema.parse({
      vendorId: 'v1',
      vendorName: 'Acme',
      dueDate: '2026-07-01',
    });
    expect(b.dueDate).toBeInstanceOf(Date);
  });

  it('accepts a booking without vendorId (the UI uses free-text vendorName)', () => {
    const b = BookingSchema.parse({ vendorName: 'Acme', eventId: 'evt1' });
    expect(b.vendorName).toBe('Acme');
    expect(b.eventId).toBe('evt1');
  });
});

describe('ThemeSchema', () => {
  it('requires the events array', () => {
    expect(() => ThemeSchema.parse({ title: 'Party', date: '2026-01-01' })).toThrow();
  });

  it('accepts a minimal valid theme', () => {
    const t = ThemeSchema.parse({ title: 'Party', date: '2026-01-01', events: [] });
    expect(t.date).toBeInstanceOf(Date);
  });

  it('rejects an invalid occasion enum', () => {
    expect(() =>
      ThemeSchema.parse({
        title: 'P',
        date: '2026-01-01',
        events: [],
        occasion: 'funeral',
      })
    ).toThrow();
  });
});

describe('EventTemplateSchema', () => {
  it('fills array defaults and isPublic', () => {
    const t = EventTemplateSchema.parse({
      name: 'Wedding',
      category: 'wedding',
      description: 'A wedding template',
      headcount: 100,
    });
    expect(t.colorPalette).toEqual([]);
    expect(t.timeline).toEqual([]);
    expect(t.isPublic).toBe(true);
  });

  it('rejects a non-positive headcount', () => {
    expect(() =>
      EventTemplateSchema.parse({
        name: 'X',
        category: 'c',
        description: 'd',
        headcount: 0,
      })
    ).toThrow();
  });
});

describe('VenueOptionSchema', () => {
  it('applies defaults for nearbyServices and fitScore', () => {
    const v = VenueOptionSchema.parse({
      name: 'Hall',
      type: 'banquet',
      location: 'City',
      capacity: 50,
      priceRange: '$$',
      description: 'Nice hall',
    });
    expect(v.nearbyServices).toEqual([]);
    expect(v.fitScore).toBe(0);
  });

  it('rejects a rating above 5', () => {
    expect(() =>
      VenueOptionSchema.parse({
        name: 'Hall',
        type: 'banquet',
        location: 'City',
        capacity: 50,
        priceRange: '$$',
        description: 'Nice',
        rating: 6,
      })
    ).toThrow();
  });
});
