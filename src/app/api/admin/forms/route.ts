import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET all forms or forms for a section
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get('sectionId');

    const forms = await prisma.form.findMany({
      where: sectionId ? { sectionId } : undefined,
      orderBy: { displayOrder: 'asc' },
      include: {
        section: true,
        fields: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { requests: true },
        },
      },
    });

    return NextResponse.json({ forms });
  } catch (error: any) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

// POST create form with fields (Section 9 requirement)
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      sectionId,
      name,
      description,
      icon,
      submitButtonText,
      displayOrder,
      isActive,
      fields,
    } = body;

    if (!sectionId || !name) {
      return NextResponse.json(
        { error: 'Section and form name are required' },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    const existing = await prisma.form.findFirst({
      where: { sectionId, slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const buttonText =
      submitButtonText?.trim() || `SUBMIT ${name.trim().toUpperCase()} REQUEST`;

    const newForm = await prisma.form.create({
      data: {
        sectionId,
        slug,
        name: name.trim().toUpperCase(),
        description: description?.trim() || null,
        icon: icon?.trim() || null,
        submitButtonText: buttonText,
        displayOrder: Number(displayOrder) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        fields: {
          create: Array.isArray(fields)
            ? fields.map((f: any, idx: number) => ({
                label: f.label.trim(),
                fieldName: f.fieldName?.trim() || slugify(f.label).replace(/-/g, '_'),
                fieldType: f.fieldType || 'text',
                placeholder: f.placeholder?.trim() || null,
                defaultValue: f.defaultValue?.trim() || null,
                isRequired: f.isRequired !== undefined ? Boolean(f.isRequired) : true,
                options: f.options?.trim() || null,
                displayOrder: f.displayOrder !== undefined ? Number(f.displayOrder) : idx + 1,
              }))
            : [],
        },
      },
      include: {
        fields: true,
      },
    });

    return NextResponse.json({
      success: true,
      form: newForm,
      message: 'Form created successfully! It is now live in the section.',
    });
  } catch (error: any) {
    console.error('Error creating form:', error);
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}

// DELETE form
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    await prisma.form.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Form deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}
