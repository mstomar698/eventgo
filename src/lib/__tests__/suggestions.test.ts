import { describe, it, expect } from 'vitest';
import {
  parseQueryForSuggestions,
  getRuleBasedEventSuggestions,
  getRuleBasedThemeSuggestions,
  getRuleBasedVenueSuggestions,
  AI_PROMPTS,
} from '../suggestions';

describe('parseQueryForSuggestions', () => {
  it('extracts headcount, budget, and location from a natural query', () => {
    const r = parseQueryForSuggestions(
      'birthday for 30 people with $500 budget in New York'
    );
    expect(r.headcount).toBe(30);
    expect(r.budget).toBe(500);
    expect(r.location).toBe('New York');
  });

  it('leaves fields undefined when nothing matches', () => {
    const r = parseQueryForSuggestions('just some idea');
    expect(r.headcount).toBeUndefined();
    expect(r.budget).toBeUndefined();
    expect(r.location).toBeUndefined();
  });
});

describe('getRuleBasedEventSuggestions', () => {
  it('returns a low-budget tip for small + cheap events', () => {
    const out = getRuleBasedEventSuggestions({
      query: 'party',
      headcount: 10,
      budget: 80,
    });
    expect(out).toMatch(/backyard picnic|potluck/i);
  });

  it('returns the medium-urban branch', () => {
    const out = getRuleBasedEventSuggestions({
      query: 'meetup',
      headcount: 30,
      location: 'urban district',
    });
    expect(out).toMatch(/urban/i);
  });

  it('handles large events', () => {
    const out = getRuleBasedEventSuggestions({ query: 'fest', headcount: 200 });
    expect(out).toMatch(/event halls or parks/i);
  });

  it('matches birthday with no headcount', () => {
    const out = getRuleBasedEventSuggestions({ query: 'birthday bash' });
    expect(out).toMatch(/birthday/i);
  });

  it('returns null when no rule matches', () => {
    expect(getRuleBasedEventSuggestions({ query: 'something generic' })).toBeNull();
  });
});

describe('getRuleBasedThemeSuggestions', () => {
  it('returns themes for known occasions', () => {
    expect(getRuleBasedThemeSuggestions({ query: 'a WEDDING' })).toMatch(/Rustic Barn/);
    expect(getRuleBasedThemeSuggestions({ query: 'corporate offsite' })).toMatch(
      /Tech Innovation/
    );
  });

  it('returns null for unknown occasions', () => {
    expect(getRuleBasedThemeSuggestions({ query: 'picnic' })).toBeNull();
  });
});

describe('getRuleBasedVenueSuggestions', () => {
  it('gives an urban small-event answer', () => {
    expect(getRuleBasedVenueSuggestions('Downtown City', 10)).toMatch(/cafes|rooftop/i);
  });

  it('respects the low-budget mid-size branch', () => {
    const out = getRuleBasedVenueSuggestions('suburb', 50, 'low');
    expect(out).toMatch(/community centers|church halls/i);
  });

  it('always returns a non-null default suggestion', () => {
    const out = getRuleBasedVenueSuggestions('somewhere');
    expect(out).toBeTruthy();
  });
});

describe('AI_PROMPTS', () => {
  it('interpolates the query into each prompt', () => {
    expect(AI_PROMPTS.eventIdeas('gala')).toContain('gala');
    expect(AI_PROMPTS.venues('rooftop')).toContain('rooftop');
  });
});
