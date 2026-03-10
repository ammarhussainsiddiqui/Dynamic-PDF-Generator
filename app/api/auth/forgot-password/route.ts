import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    
    // We intentionally return 200 even if user is not found to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a reset link was sent.' }, { status: 200 });
    }

    // Generate secure reset token
    const rawToken = crypto.randomUUID();
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Token expires in 1 hour
    const tokenExpiry = new Date(Date.now() + 3600000);

    user.resetToken = hashedToken;
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // Send the UNHASHED token via email
    // The user will click the link with rawToken, which we hash and compare in reset-password route
    await sendPasswordResetEmail(email, rawToken);

    return NextResponse.json({ message: 'If an account exists, a reset link was sent.' }, { status: 200 });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ message: 'Failed to send reset email.' }, { status: 500 });
  }
}
