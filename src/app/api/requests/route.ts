import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRequestId } from '@/lib/request-id';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionSlug, formSlug, fields } = body;

    if (!sectionSlug || !formSlug || !fields || typeof fields !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request data. Section, form, and fields are required.' },
        { status: 400 }
      );
    }

    // 1. Fetch section and form definition from database
    const section = await prisma.section.findUnique({
      where: { slug: sectionSlug },
      include: {
        forms: {
          where: { slug: formSlug },
          include: {
            fields: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!section || !section.isActive) {
      return NextResponse.json({ error: 'Section not found or inactive.' }, { status: 404 });
    }

    const form = section.forms[0];
    if (!form || !form.isActive) {
      return NextResponse.json({ error: 'Form not found or inactive.' }, { status: 404 });
    }

    // 2. Validate required fields
    const validationErrors: string[] = [];
    const submittedFieldValues: {
      fieldLabel: string;
      fieldName: string;
      value: string;
    }[] = [];

    let detectedStudentName: string | null = null;
    let detectedContactNumber: string | null = null;

    for (const fieldDef of form.fields) {
      const rawValue = fields[fieldDef.fieldName];
      const strVal = rawValue !== undefined && rawValue !== null ? String(rawValue).trim() : '';

      if (fieldDef.isRequired && strVal.length === 0) {
        validationErrors.push(`${fieldDef.label} is required.`);
      }

      if (strVal.length > 0) {
        submittedFieldValues.push({
          fieldLabel: fieldDef.label,
          fieldName: fieldDef.fieldName,
          value: strVal,
        });

        // Detect student name / contact number
        const lowerLabel = fieldDef.label.toLowerCase();
        const lowerName = fieldDef.fieldName.toLowerCase();

        if (
          !detectedStudentName &&
          (lowerLabel.includes('student name') || lowerLabel === 'name' || lowerName.includes('name'))
        ) {
          detectedStudentName = strVal;
        }

        if (
          !detectedContactNumber &&
          (fieldDef.fieldType === 'phone' ||
            lowerLabel.includes('contact') ||
            lowerLabel.includes('phone') ||
            lowerName.includes('contact'))
        ) {
          detectedContactNumber = strVal;
        }
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: validationErrors[0], errors: validationErrors },
        { status: 400 }
      );
    }

    // 3. Generate standardized Request ID
    const todayCount = await prisma.request.count();
    const requestId = generateRequestId(todayCount + 1);

    // 4. Save Request to database
    const savedRequest = await prisma.request.create({
      data: {
        requestId,
        sectionId: section.id,
        formId: form.id,
        studentName: detectedStudentName,
        contactNumber: detectedContactNumber,
        status: 'PENDING',
        values: {
          create: submittedFieldValues.map((fv) => ({
            fieldLabel: fv.fieldLabel,
            fieldName: fv.fieldName,
            value: fv.value,
          })),
        },
      },
    });

    // 5. Fetch WhatsApp number from Settings
    const whatsappSetting = await prisma.setting.findUnique({
      where: { key: 'whatsappNumber' },
    });
    const targetPhoneNumber = whatsappSetting?.value || '6300141729';

    // 6. Generate formatted WhatsApp URL
    const whatsappUrl = getWhatsAppUrl({
      phoneNumber: targetPhoneNumber,
      requestId,
      sectionName: section.name,
      formName: form.name,
      fields: submittedFieldValues.map((f) => ({
        label: f.fieldLabel,
        value: f.value,
      })),
      submittedAt: savedRequest.createdAt,
    });

    return NextResponse.json({
      success: true,
      requestId,
      whatsappUrl,
      message: 'Request saved successfully! Opening WhatsApp...',
    });
  } catch (error: any) {
    console.error('Error submitting request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving your request.' },
      { status: 500 }
    );
  }
}
