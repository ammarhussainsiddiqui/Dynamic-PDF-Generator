import mongoose, { Schema, Document } from 'mongoose';
import '@/lib/models/User'; // Ensure User is registered to prevent MissingSchemaError on ref

export interface ITemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  htmlContent: string;
  cssContent: string;
  sampleJson: string;
  sizeKey?: string;
  pageSize?: {
    width: number;
    height: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  htmlContent: { type: String, default: '<h1>Hello {{name}}</h1>' },
  cssContent: { type: String, default: 'h1 { color: blue; }' },
  sampleJson: { type: String, default: '{\n  "name": "World"\n}' },
  sizeKey: { type: String, default: 'a4' },
  pageSize: {
    width: Number,
    height: Number,
  },
}, { timestamps: true, minimize: false });

// Force schema recreation in development
if (mongoose.models.Template) {
  delete mongoose.models.Template;
}

export default mongoose.model<ITemplate>('Template', TemplateSchema);
