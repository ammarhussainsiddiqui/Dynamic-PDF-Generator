import { connectToDatabase } from '@/lib/db';
import Template from '@/lib/models/Template';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await auth();


    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const template = await Template.findOne({
      _id: id,
      userId: (session.user as any).id
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template, { status: 200 });


  } catch (error) {
    console.error('GET Template Error:', error);
    return NextResponse.json({ error: 'Failed to fetch template details' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await auth();


    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const {
      name,
      htmlContent,
      cssContent,
      sampleJson,
      sizeKey,
      pageSize,
      googleFonts
    } = body;

    await connectToDatabase();

    const updateData: any = {
      name,
      htmlContent,
      cssContent,
      sampleJson,
      sizeKey,
      googleFonts
    };

    // Only store pageSize if provided
    if (pageSize && pageSize.width && pageSize.height) {
      updateData.pageSize = {
        width: pageSize.width,
        height: pageSize.height
      };
    }

    const template = await Template.findOneAndUpdate(
      {
        _id: id,
        userId: (session.user as any).id
      },
      { $set: updateData },
      { new: true }
    );

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template, { status: 200 });


  } catch (error) {
    console.error('PUT Template Error:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await auth();


    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    const template = await Template.findOneAndDelete({
      _id: id,
      userId: (session.user as any).id
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });


  } catch (error) {
    console.error('DELETE Template Error:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
