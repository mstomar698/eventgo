import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  type: string; // catering, venue, entertainment, etc.
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  location: string;
  priceRange: string;
  rating?: number;
  notes: string;
  createdBy?: string;
  isPublic: boolean;
  createdAt: Date;
}

const VendorSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String,
  },
  location: {
    type: String,
    required: true,
  },
  priceRange: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  notes: {
    type: String,
    default: '',
  },
  createdBy: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Vendor = (mongoose.models.Vendor ||
  mongoose.model<IVendor>('Vendor', VendorSchema)) as Model<IVendor>;
