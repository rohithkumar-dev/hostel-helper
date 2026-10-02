import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ServiceCard } from '@/components/ServiceCard';
import { HowItWorks } from '@/components/HowItWorks';
import { ContactSection } from '@/components/ContactSection';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { prisma } from '@/lib/prisma';
import {
  DoorClosed,
  Shirt,
  Store,
  Package,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch dynamic settings from database
  let settingsMap: Record<string, string> = {};
  try {
    const settingsRecords = await prisma.setting.findMany();
    settingsMap = Object.fromEntries(settingsRecords.map((s) => [s.key, s.value]));
  } catch (error) {
    console.error('Failed to load settings from DB:', error);
  }

  const websiteName = settingsMap.websiteName || 'HOSTEL HELPER';
  const ownerName = settingsMap.ownerName || 'K ROHIT KUMAR';
  const location = settingsMap.location || 'SRM AP';
  const whatsappNumber = settingsMap.whatsappNumber || '6300141729';
  const heroDescription =
    settingsMap.description || 'Quickly request deliveries, laundry services and hostel shop items.';

  // Fetch active sections from database with their forms
  let sections: any[] = [];
  try {
    sections = await prisma.section.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        forms: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  } catch (error) {
    console.error('Failed to load sections from DB:', error);
  }

  // Helper to map icon names or section slugs to icons and accents
  const getSectionMetadata = (slug: string, iconName: string, index: number) => {
    const lowerSlug = slug.toLowerCase();
    const lowerIcon = iconName?.toLowerCase() || '';

    if (lowerSlug.includes('gate') || lowerIcon.includes('door') || lowerIcon.includes('gate')) {
      return {
        icon: <DoorClosed className="w-8 h-8 sm:w-9 sm:h-9" />,
        accentColor: 'orange' as const,
        badgeText: 'Popular Service',
      };
    }
    if (lowerSlug.includes('laundry') || lowerIcon.includes('shirt') || lowerIcon.includes('laundry')) {
      return {
        icon: <Shirt className="w-8 h-8 sm:w-9 sm:h-9" />,
        accentColor: 'blue' as const,
        badgeText: 'Campus Essential',
      };
    }
    if (lowerSlug.includes('shop') || lowerIcon.includes('store') || lowerIcon.includes('shop')) {
      return {
        icon: <Store className="w-8 h-8 sm:w-9 sm:h-9" />,
        accentColor: 'emerald' as const,
        badgeText: 'Instant Snacks',
      };
    }

    // Dynamic additional sections created by Admin (e.g. MEDICINE DELIVERY)
    const accents: ('orange' | 'blue' | 'emerald')[] = ['orange', 'blue', 'emerald'];
    return {
      icon: <Package className="w-8 h-8 sm:w-9 sm:h-9" />,
      accentColor: accents[index % accents.length],
      badgeText: 'Hostel Service',
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar whatsappNumber={whatsappNumber} location={location} />

      <main className="flex-1">
        {/* Campus Notice Announcement */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-950 to-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 text-center border-b border-navy-800">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              <strong>SRM AP Campus Notice:</strong> Direct requests are live! No student login or registration required.
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/70 bg-gradient-to-b from-white via-slate-50/60 to-slate-100/60">
          <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Campus Location Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span>{location} • HOSTEL SERVICES</span>
            </div>

            {/* Main Brand Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none">
              HOSTEL <span className="text-brand-600">HELPER</span>
            </h1>

            {/* Tagline */}
            <p className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-700 tracking-tight">
              "Your Hostel Services, Simplified"
            </p>

            {/* Subtitle Description */}
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {heroDescription}
            </p>

            {/* Value Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Free • No Student Login</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors">
                <Zap className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <span>1-Tap WhatsApp Dispatch</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors">
                <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Express SRM AP Gate Pickup</span>
              </div>
            </div>
          </div>
        </section>

        {/* The 3 Main Service Cards Section (Section 2 of Prompt) */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200 mb-3">
              Explore Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Hostel Services at Your Fingertips
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Click any service below to open its dedicated form and submit your request directly via WhatsApp.
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {sections.map((section, index) => {
              const meta = getSectionMetadata(section.slug, section.icon, index);
              const formTags = section.forms ? section.forms.map((f: any) => f.name) : [];

              return (
                <ServiceCard
                  key={section.id}
                  slug={section.slug}
                  name={section.name}
                  description={section.description}
                  iconName={section.icon}
                  formsCount={section.forms?.length || 0}
                  formTags={formTags}
                  badgeText={meta.badgeText}
                  accentColor={meta.accentColor}
                  icon={meta.icon}
                />
              );
            })}
          </div>

          {/* Quick Support strip */}
          <div className="mt-14 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Have a custom or urgent request?</h4>
                <p className="text-xs text-slate-500">Contact {ownerName} directly on WhatsApp: +91 {whatsappNumber}</p>
              </div>
            </div>
            <a
              href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello! I have a custom hostel request.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 transition-colors shadow-sm whitespace-nowrap"
            >
              Direct Chat
            </a>
          </div>
        </section>

        {/* How It Works Walkthrough */}
        <HowItWorks />

        {/* Contact Us Section (Section 12 of Prompt) */}
        <ContactSection
          ownerName={ownerName}
          location={location}
          whatsappNumber={whatsappNumber}
        />
      </main>

      {/* Main Footer */}
      <Footer ownerName={ownerName} location={location} whatsappNumber={whatsappNumber} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp whatsappNumber={whatsappNumber} ownerName={ownerName} />
    </div>
  );
}
