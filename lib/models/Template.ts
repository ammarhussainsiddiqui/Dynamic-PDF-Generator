import mongoose, { Schema, Document } from 'mongoose';
import '@/models/User'; // Ensure User is registered to prevent MissingSchemaError on ref

export interface ITemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  htmlContent: string;
  cssContent: string;
  sampleJson: string;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  htmlContent: { type: String, default: '<h1>Hello {{name}}</h1>' },
  cssContent: { type: String, default: 'h1 { color: blue; }' },
  sampleJson: { type: String, default: '{\n  "name": "World"\n}' },
}, { timestamps: true });

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);
