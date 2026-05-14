import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  start: Date;
  end: Date;
  color?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    color: { type: String },
    createdBy: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const EventModel = (mongoose.models.Event ||
  model<IEvent>('Event', EventSchema)) as Model<IEvent>;
