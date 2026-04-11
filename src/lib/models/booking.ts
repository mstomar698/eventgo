import mongoose, { Document, Model, Schema } from 'mongoose';

export type BookingStatus =
  | 'to_contact'
  | 'contacted'
  | 'quoted'
  | 'confirmed'
  | 'cancelled';

export interface IBooking extends Document {
  eventId?: string; // reference to event if exists
  vendorId: string;
  vendorName: string; // cached for display
  status: BookingStatus;
  quote?: number;
  notes: string;
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  eventId: {
    type: String,
  },
  vendorId: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['to_contact', 'contacted', 'quoted', 'confirmed', 'cancelled'],
    default: 'to_contact',
  },
  quote: {
    type: Number,
  },
  notes: {
    type: String,
    default: '',
  },
  dueDate: {
    type: Date,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = (mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema)) as Model<IBooking>;
