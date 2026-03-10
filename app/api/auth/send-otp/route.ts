import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Generate a 6-digit OTP
    const verifyOtp = crypto.randomInt(100000, 999999).toString();
    const verifyOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (user) {
      // If user exists but is not verified, just update the OTP payload
      user.verifyOtp = verifyOtp;
      user.verifyOtpExpiry = verifyOtpExpiry;
      await user.save();
    } else {
      // Create a new unverified placeholder user
      user = await User.create({
        email,
        isVerified: false,
        verifyOtp,
        verifyOtpExpiry,
      });
    }

    await sendVerificationEmail(email, verifyOtp);

    return NextResponse.json({ message: 'Verification OTP sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
