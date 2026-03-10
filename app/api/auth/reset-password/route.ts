import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Hash the raw token from the request to compare with the db
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired password reset token' }, { status: 400 });
    }

    // Hash the new password and save
    const newHashedPassword = await bcrypt.hash(password, 10);
    user.password = newHashedPassword;
    
    // Clear reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({ message: 'Password has been reset successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ message: 'Failed to reset password.' }, { status: 500 });
  }
}
