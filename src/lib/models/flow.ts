import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFlow extends Document {
  userId: string;
  nodes: any[];
  edges: any[];
  updatedAt: Date;
}

const FlowSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  nodes: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  edges: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const FlowModel = (mongoose.models.Flow ||
  mongoose.model<IFlow>('Flow', FlowSchema)) as Model<IFlow>;
