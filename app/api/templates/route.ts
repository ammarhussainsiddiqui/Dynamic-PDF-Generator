import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session: any = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      name, 
      htmlContent, 
      cssContent, 
      sampleJson, 
      pageSize, 
      sizeKey, 
      googleFonts 
    } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await connectToDatabase();
    const template = await Template.create({
      userId: (session.user as any).id,
      name,
      htmlContent: htmlContent || '',
      cssContent: cssContent || '',
      sampleJson: sampleJson || '{}',
      pageSize: pageSize || { width: 794, height: 1123 },
      sizeKey: sizeKey || 'a4',
      googleFonts: googleFonts || ['Inter']
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Template POST Error:', error);
    return NextResponse.json({ error: 'Failed to create new template' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session: any = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const templates = await Template.find({ userId: (session.user as any).id }).sort({ updatedAt: -1 });

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error('Template GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}
