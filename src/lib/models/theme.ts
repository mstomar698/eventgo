import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface ITheme extends Document {
  title: string;
  date: string;
  events: Array<string>;
}

const ThemeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  events: {
    type: [String],
    required: true,
  },
});

export const Theme = (mongoose.models.Theme ||
  model<ITheme>('Theme', ThemeSchema)) as Model<ITheme>;
