import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// Helper to slugify a name
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET all sections
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sections = await prisma.section.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        forms: {
          orderBy: { displayOrder: 'asc' },
          include: {
            fields: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        _count: {
          select: { requests: true, forms: true },
        },
      },
    });

    return NextResponse.json({ sections });
  } catch (error: any) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST create section (Section 8 requirement)
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, icon, image, displayOrder, isActive } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Section name and description are required' },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    // Ensure slug uniqueness
    const existing = await prisma.section.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newSection = await prisma.section.create({
      data: {
        slug,
        name: name.trim().toUpperCase(),
        description: description.trim(),
        icon: icon?.trim() || 'Package',
        image: image?.trim() || null,
        displayOrder: Number(displayOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({
      success: true,
      section: newSection,
      message: 'Section created successfully! It is now live on the homepage.',
    });
  } catch (error: any) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

// PUT update section
export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, description, icon, image, displayOrder, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    const updated = await prisma.section.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim().toUpperCase() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        icon: icon !== undefined ? icon.trim() : undefined,
        image: image !== undefined ? image.trim() : undefined,
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      section: updated,
      message: 'Section updated successfully!',
    });
  } catch (error: any) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

// DELETE section
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    await prisma.section.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Section deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting section:', error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
