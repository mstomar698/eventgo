import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  color: {
    type: String,
  },
});

export const EventModel = (mongoose.models.Event ||
  model<IEvent>('Event', EventSchema)) as Model<IEvent>;
