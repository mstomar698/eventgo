import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVenueOption extends Document {
  name: string;
  type: string; // e.g., restaurant, park, hall
  location: string;
  capacity: number;
  priceRange: string; // e.g., $, $$, $$$
  rating?: number;
  description: string;
  nearbyServices: string[]; // e.g., parking, food, transport
  fitScore: number; // calculated fit for event
  createdAt: Date;
}

const VenueOptionSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  priceRange: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  description: {
    type: String,
    required: true,
  },
  nearbyServices: {
    type: [String],
    default: [],
  },
  fitScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const VenueOption = (mongoose.models.VenueOption ||
  mongoose.model<IVenueOption>('VenueOption', VenueOptionSchema)) as Model<IVenueOption>;
