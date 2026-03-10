import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and verification code are required.' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: 'Email is already verified. You can log in.' }, { status: 400 });
    }

    if (!user.verifyOtp || user.verifyOtp.trim() !== otp.trim()) {
      return NextResponse.json({ message: 'Invalid verification code.' }, { status: 400 });
    }

    if (user.verifyOtpExpiry && new Date() > user.verifyOtpExpiry) {
      return NextResponse.json({ message: 'Verification code has expired. Please register again or request a new one.' }, { status: 400 });
    }

    // verification successful
    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;
    
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
