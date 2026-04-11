import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEventTemplate extends Document {
  name: string;
  category: string; // e.g., birthday, community
  description: string;
  headcount: number;
  checklist: string[]; // tasks to complete
  timeline: Array<{
    phase: string;
    daysBefore: number;
    tasks: string[];
  }>;
  budgetCategories: Array<{
    category: string;
    estimatedAmount: number;
    notes: string;
  }>;
  vendorNeeds: string[];
  nearbyConsiderations: string[];
  communicationPlan: string[];
  createdBy?: string; // userId if custom
  isPublic: boolean;
  createdAt: Date;
}

const EventTemplateSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  headcount: {
    type: Number,
    required: true,
  },
  checklist: {
    type: [String],
    default: [],
  },
  timeline: {
    type: [
      {
        phase: String,
        daysBefore: Number,
        tasks: [String],
      },
    ],
    default: [],
  },
  budgetCategories: {
    type: [
      {
        category: String,
        estimatedAmount: Number,
        notes: String,
      },
    ],
    default: [],
  },
  vendorNeeds: {
    type: [String],
    default: [],
  },
  nearbyConsiderations: {
    type: [String],
    default: [],
  },
  communicationPlan: {
    type: [String],
    default: [],
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

export const EventTemplate = (mongoose.models.EventTemplate ||
  mongoose.model<IEventTemplate>(
    'EventTemplate',
    EventTemplateSchema
  )) as Model<IEventTemplate>;
