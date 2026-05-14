import { z } from 'zod';

/**
 * Zod schemas for input validation and type safety across the EventGo application.
 * These schemas define the structure, constraints, and transformations for API inputs,
 * database models, and response objects. They provide runtime validation and TypeScript
 * type inference for robust data handling.
 */

// Event schemas
/**
 * Base schema for calendar events.
 * Defines required fields for creating and updating events in the planner.
 */
export const EventSchema = z.object({
  title: z.string().min(1).trim(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  color: z.string().optional(),
});

export const EventCreateSchema = EventSchema;
/**
 * Schema for event responses including the database-generated ID.
 * Used by API endpoints when returning event data from the database.
 */
export const EventResponseSchema = EventSchema.extend({
  _id: z.string(),
});

// Theme schemas
/**
 * Schema for event themes stored in the database.
 * Themes include a title, creation date, and associated event types.
 */
export const ThemeSchema = z.object({
  title: z.string().min(1).trim(),
  date: z.coerce.date(),
  description: z.string().optional(),
  occasion: z.enum(['birthday', 'wedding', 'corporate', 'community', 'other']).optional(),
  mood: z.array(z.string()).optional(),
  colorPalette: z.array(z.string()).optional(),
  decor: z.array(z.string()).optional(),
  music: z.array(z.string()).optional(),
  food: z.array(z.string()).optional(),
  budgetEstimate: z.coerce.number().min(0).optional(),
  budgetNotes: z.string().optional(),
  events: z.array(z.string()),
});

export const ThemeCreateSchema = ThemeSchema;
export const ThemeResponseSchema = ThemeSchema.extend({
  _id: z.string(),
});

// Post schemas
export const PostSchema = z.object({
  title: z.string().trim(),
  date: z.string(),
  content: z.string(),
});

export const PostCreateSchema = PostSchema;
export const PostResponseSchema = PostSchema.extend({
  _id: z.string(),
});

// AI query schemas
/**
 * Schema for AI-powered query endpoints.
 * Validates user input for event planning queries with length limits for security.
 */
export const AIQuerySchema = z.object({
  query: z.string().min(1).max(1000).trim(),
});

// Theme search schemas
/**
 * Schema for theme search operations.
 * Used by theme lookup endpoints to validate search terms.
 */
export const ThemeSearchSchema = z.object({
  searchTerm: z.string().min(1).trim(),
});

// Venue schemas
export const VenueOptionSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  location: z.string().min(1),
  capacity: z.number().min(1),
  priceRange: z.string().min(1),
  rating: z.number().min(0).max(5).optional(),
  description: z.string().min(1),
  nearbyServices: z.array(z.string()).default([]),
  fitScore: z.number().default(0),
});

export const VenueSearchSchema = z.object({
  location: z.string().min(1),
  headcount: z.number().min(1).optional(),
  budget: z.string().optional(),
  type: z.string().optional(),
});

// Template schemas
export const TimelineItemSchema = z.object({
  phase: z.string(),
  daysBefore: z.number(),
  tasks: z.array(z.string()),
});

export const BudgetCategorySchema = z.object({
  category: z.string(),
  estimatedAmount: z.number(),
  notes: z.string(),
});

export const EventTemplateSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  headcount: z.number().min(1),
  checklist: z.array(z.string()).default([]),
  timeline: z.array(TimelineItemSchema).default([]),
  budgetCategories: z.array(BudgetCategorySchema).default([]),
  vendorNeeds: z.array(z.string()).default([]),
  nearbyConsiderations: z.array(z.string()).default([]),
  communicationPlan: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
});

export const EventTemplateCreateSchema = EventTemplateSchema;

// Vendor schemas
export const VendorSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  contactInfo: z
    .object({
      phone: z.string().optional(),
      email: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  location: z.string().min(1),
  priceRange: z.string().min(1),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().default(''),
  isPublic: z.boolean().default(true),
});

export const VendorCreateSchema = VendorSchema;

// Booking schemas
export const BookingStatusSchema = z.enum([
  'to_contact',
  'contacted',
  'quoted',
  'confirmed',
  'cancelled',
]);

export const BookingSchema = z.object({
  eventId: z.string().optional(),
  vendorId: z.string(),
  vendorName: z.string(),
  status: BookingStatusSchema.default('to_contact'),
  quote: z.number().optional(),
  notes: z.string().default(''),
  dueDate: z.date().optional(),
});

export const BookingCreateSchema = BookingSchema;
export const BookingUpdateSchema = BookingSchema.partial();

// Generic API response schemas
export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
  data: z.any().optional(),
});

// Validation helpers
export type EventInput = z.infer<typeof EventCreateSchema>;
export type ThemeInput = z.infer<typeof ThemeCreateSchema>;
export type PostInput = z.infer<typeof PostCreateSchema>;
export type AIQueryInput = z.infer<typeof AIQuerySchema>;
export type ThemeSearchInput = z.infer<typeof ThemeSearchSchema>;
