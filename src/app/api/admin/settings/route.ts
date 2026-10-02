import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.setting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    return NextResponse.json({
      settings: {
        websiteName: settingsMap.websiteName || 'HOSTEL HELPER',
        ownerName: settingsMap.ownerName || 'K ROHIT KUMAR',
        location: settingsMap.location || 'SRM AP',
        whatsappNumber: settingsMap.whatsappNumber || '6300141729',
        description:
          settingsMap.description ||
          'Quickly request deliveries, laundry services and hostel shop items.',
      },
    });
  } catch (error: any) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { websiteName, ownerName, location, whatsappNumber, description } = body;

    const updates = [
      { key: 'websiteName', value: websiteName?.trim() || 'HOSTEL HELPER' },
      { key: 'ownerName', value: ownerName?.trim() || 'K ROHIT KUMAR' },
      { key: 'location', value: location?.trim() || 'SRM AP' },
      { key: 'whatsappNumber', value: whatsappNumber?.trim() || '6300141729' },
      { key: 'description', value: description?.trim() || '' },
    ];

    for (const u of updates) {
      await prisma.setting.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully! New values are now active across the entire website.',
    });
  } catch (error: any) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
