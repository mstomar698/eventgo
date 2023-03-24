import mongoose, { Schema } from 'mongoose';

interface FlowNodeData {
  label: string;
}

interface FlowNode {
  id: string;
  type?: string;
  data: FlowNodeData;
  position: {
    x: number;
    y: number;
  };
  style?: {
    background?: string;
    color?: string;
    border?: string;
    width?: number;
  };
}

interface Flow {
  nodes: FlowNode[];
}

const FlowNodeDataSchema = new Schema<FlowNodeData>({
  label: { type: String, required: true },
});

const FlowNodeSchema = new Schema<FlowNode>({
  id: { type: String, required: true },
  type: { type: String },
  data: { type: FlowNodeDataSchema, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  style: {
    background: { type: String },
    color: { type: String },
    border: { type: String },
    width: { type: Number },
  },
});

const FlowSchema = new Schema<Flow>({
  nodes: { type: [FlowNodeSchema], required: true },
});

export const FlowModel =
  mongoose.models.Flow || mongoose.model<Flow>('Flow', FlowSchema);
