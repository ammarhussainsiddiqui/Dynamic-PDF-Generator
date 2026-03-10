import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, otp, password, name } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ message: 'Email, verification code, and password are required.' }, { status: 400 });
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
      return NextResponse.json({ message: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // verification successful, hash the password and promote to a fully valid user
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    if (name) user.name = name;
    
    // Clear OTP tracking
    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;
    
    await user.save();

    return NextResponse.json({ message: 'Account successfully registered and verified!' }, { status: 200 });
  } catch (error) {
    console.error('Verify & Set Password Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
