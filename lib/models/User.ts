import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for passwordless or OAuth
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
