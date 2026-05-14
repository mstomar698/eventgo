import mongoose, { Document, model, Model, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  date: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String },
    date: { type: String },
    content: { type: String },
    createdBy: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const Post = (mongoose.models.Post || model('Post', PostSchema)) as Model<IPost>;
