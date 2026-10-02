import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const status = searchParams.get('status')?.trim();

    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search && search.length > 0) {
      whereClause.OR = [
        { requestId: { contains: search } },
        { studentName: { contains: search } },
        { contactNumber: { contains: search } },
        { section: { name: { contains: search } } },
        { form: { name: { contains: search } } },
      ];
    }

    const requests = await prisma.request.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        section: { select: { id: true, name: true, slug: true } },
        form: { select: { id: true, name: true, slug: true } },
        values: true,
      },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error('Error fetching admin requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, additionalNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Request ID and status are required' }, { status: 400 });
    }

    const updated = await prisma.request.update({
      where: { id },
      data: {
        status,
        additionalNotes: additionalNotes !== undefined ? additionalNotes : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      request: updated,
      message: 'Status updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating request status:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 });
    }

    await prisma.request.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Request deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
