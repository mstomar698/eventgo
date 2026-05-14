import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface ITheme extends Document {
  title: string;
  date: Date;
  description?: string;
  occasion?: string;
  mood?: string[];
  colorPalette?: string[];
  decor?: string[];
  music?: string[];
  food?: string[];
  budgetEstimate?: number;
  budgetNotes?: string;
  checklist?: string[];
  timeline?: Array<{ phase: string; daysBefore: number; tasks: string[] }>;
  events: string[];
  isPublic?: boolean;
}

const ThemeSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  description: { type: String },
  occasion: { type: String },
  mood: { type: [String], default: [] },
  colorPalette: { type: [String], default: [] },
  decor: { type: [String], default: [] },
  music: { type: [String], default: [] },
  food: { type: [String], default: [] },
  budgetEstimate: { type: Number },
  budgetNotes: { type: String },
  checklist: { type: [String], default: [] },
  timeline: {
    type: [{ phase: String, daysBefore: Number, tasks: [String] }],
    default: [],
  },
  events: { type: [String], required: true },
  isPublic: { type: Boolean, default: false },
});

export const Theme = (mongoose.models.Theme ||
  model<ITheme>('Theme', ThemeSchema)) as Model<ITheme>;
