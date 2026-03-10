import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  password?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  isVerified: boolean;
  verifyOtp?: string;
  verifyOtpExpiry?: Date;
  plan: 'Free' | 'Pro' | 'Enterprise';
  apiCalls: number;
  totalGenerated: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional initially for email verification
    resetToken: { type: String, required: false },
    resetTokenExpiry: { type: Date, required: false },
    isVerified: { type: Boolean, default: false },
    verifyOtp: { type: String, required: false },
    verifyOtpExpiry: { type: Date, required: false },
    plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
    apiCalls: { type: Number, default: 0 },
    totalGenerated: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Force schema recreation in Next.js development (HMR)
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>('User', UserSchema);
