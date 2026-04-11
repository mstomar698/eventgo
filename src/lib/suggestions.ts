import { z } from 'zod';

// Rule-based suggestions for quick wins

export const EventSuggestionSchema = z.object({
  query: z.string(),
  headcount: z.number().optional(),
  budget: z.number().optional(),
  location: z.string().optional(),
});

export type EventSuggestionInput = z.infer<typeof EventSuggestionSchema>;

export function parseQueryForSuggestions(query: string): EventSuggestionInput {
  // Extract headcount
  const headcountMatch = query.match(/(\d+)\s*(people|attendees|guests)/i);
  const headcount = headcountMatch ? parseInt(headcountMatch[1]) : undefined;

  // Extract budget
  const budgetMatch = query.match(/\$?(\d+)(?:\s*-\s*\$?(\d+))?\s*(dollars?|budget)/i);
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : undefined;

  // Extract location
  const locationMatch = query.match(/(in|at)\s+([a-zA-Z\s,]+)/i);
  const location = locationMatch ? locationMatch[2].trim() : undefined;

  return { query, headcount, budget, location };
}

export function getRuleBasedEventSuggestions(input: EventSuggestionInput): string | null {
  const { query, headcount, budget, location } = input;

  // Rule 1: Small events (<20 people)
  if (headcount && headcount < 20) {
    if (budget && budget < 100) {
      return 'For small gatherings under 20 people with low budget, consider a backyard picnic or home potluck. Keep it simple with finger foods and games.';
    }
    return 'For intimate events under 20 people, try a cozy cafe gathering or home dinner party. Focus on quality time and personal connections.';
  }

  // Rule 2: Medium events (20-50 people)
  if (headcount && headcount >= 20 && headcount <= 50) {
    if (location?.toLowerCase().includes('urban')) {
      return 'For medium-sized urban events, consider community centers or rooftop venues. Include networking activities and themed decorations.';
    }
    return 'For 20-50 person events, community halls or local restaurants work well. Plan for seated dining and group activities.';
  }

  // Rule 3: Large events (>50 people)
  if (headcount && headcount > 50) {
    return 'For larger events, consider event halls or parks. Focus on logistics, catering, and entertainment to keep everyone engaged.';
  }

  // Rule 4: Birthday specific
  if (query.toLowerCase().includes('birthday')) {
    if (headcount && headcount < 10) {
      return 'For small birthday celebrations, a surprise home party with close friends and family works perfectly.';
    }
    return 'Birthday parties shine with themed decorations, cake, and fun activities. Consider age-appropriate games and music.';
  }

  // Rule 5: Budget constraints
  if (budget && budget < 50) {
    return 'For budget-friendly events, focus on DIY decorations, potluck-style food, and free venue options like parks or homes.';
  }

  // No rule matched
  return null;
}

export function getRuleBasedThemeSuggestions(input: { query: string }): string | null {
  const { query } = input;

  if (query.toLowerCase().includes('birthday')) {
    return 'Birthday themes: Tropical Luau (bright colors, leis), Retro 80s (neon, music), Masquerade (masks, elegance), Superhero (capes, capes), Garden Party (flowers, tea).';
  }

  if (query.toLowerCase().includes('wedding')) {
    return 'Wedding themes: Rustic Barn (wood, lanterns), Beach Boho (shells, linen), Vintage Glam (gold, crystal), Garden Romance (roses, arches), Modern Minimalist (clean lines, white).';
  }

  if (query.toLowerCase().includes('corporate')) {
    return 'Corporate themes: Tech Innovation (circuits, screens), Wellness Retreat (plants, yoga), Team Building (games, challenges), Product Launch (branded, modern), Holiday Party (festive, lights).';
  }

  return null;
}

export function getRuleBasedVenueSuggestions(
  location: string,
  headcount?: number,
  budget?: string
): string | null {
  const lowerLocation = location.toLowerCase();

  if (headcount && headcount < 20) {
    if (lowerLocation.includes('urban') || lowerLocation.includes('city')) {
      return 'For small urban events: Cozy cafes, rooftop bars, or community gardens. Look for venues with good public transport access and nearby parking.';
    }
    return 'For small events: Local restaurants, parks, or home venues. Consider accessibility and nearby amenities like food trucks or shops.';
  }

  if (headcount && headcount >= 20 && headcount <= 100) {
    if (budget && budget.includes('low')) {
      return 'Budget-friendly mid-size venues: Community centers, parks with pavilions, or church halls. Check for permits and basic amenities.';
    }
    return 'Mid-size venues: Event halls, banquet rooms in hotels, or outdoor spaces. Prioritize venues with catering options and parking.';
  }

  if (headcount && headcount > 100) {
    return 'Large venues: Convention centers, ballrooms, or outdoor arenas. Focus on capacity, AV equipment, and transportation logistics.';
  }

  // Default suggestions
  if (lowerLocation.includes('beach')) {
    return 'Beach venues: Oceanfront restaurants, beach clubs, or private beach access. Consider weather, tides, and permits for gatherings.';
  }

  return 'General venue suggestions: Check local event halls, restaurants, or parks. Evaluate capacity, amenities, and transportation access for your group size.';
}

// AI prompt libraries
export const AI_PROMPTS = {
  eventIdeas: (query: string) =>
    `Suggest event ideas for "${query}". Provide a short list with format: title, why it works, and one practical execution tip for each idea.`,

  themes: (query: string) =>
    `Recommend event themes for "${query}". Return a concise shortlist where each theme includes vibe, decor direction, and one activity idea.`,

  venues: (query: string) =>
    `Recommend venue options for "${query}". Include venue types, location considerations, capacity fits, and nearby services. Provide 3-5 options with brief explanations.`,

  general: (query: string) =>
    `Explain ${query} for an event planner in practical, concise detail. Include examples where useful.`,
} as const;
