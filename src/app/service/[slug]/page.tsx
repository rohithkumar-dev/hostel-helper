import React from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SectionViewer } from '@/components/SectionViewer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ form?: string }>;
}

export default async function ServicePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { form: initialFormSlug } = await searchParams;

  // Fetch section with its forms and fields
  const section = await prisma.section.findUnique({
    where: { slug },
    include: {
      forms: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          fields: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
    },
  });

  if (!section || !section.isActive) {
    notFound();
  }

  // Fetch settings for Navbar and Footer
  const settingsRecords = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(settingsRecords.map((s) => [s.key, s.value]));

  const whatsappNumber = settingsMap.whatsappNumber || '6300141729';
  const ownerName = settingsMap.ownerName || 'K ROHIT KUMAR';
  const location = settingsMap.location || 'SRM AP';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar whatsappNumber={whatsappNumber} location={location} />

      <main className="flex-1 bg-slate-50/50">
        <SectionViewer
          section={section}
          whatsappNumber={whatsappNumber}
          initialFormSlug={initialFormSlug}
        />
      </main>

      <Footer
        ownerName={ownerName}
        location={location}
        whatsappNumber={whatsappNumber}
      />

      <FloatingWhatsApp whatsappNumber={whatsappNumber} ownerName={ownerName} />
    </div>
  );
}
