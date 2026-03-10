import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session: any = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById((session.user as any).id).select('plan apiCalls totalGenerated');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      plan: user.plan || 'Free',
      apiCalls: user.apiCalls || 0,
      totalGenerated: user.totalGenerated || 0,
    }, { status: 200 });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
