'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DynamicFormRenderer } from './DynamicFormRenderer';
import {
  Utensils,
  ShoppingBag,
  Package,
  Shirt,
  Store,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface FormItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  submitButtonText: string;
  fields: any[];
}

interface SectionViewerProps {
  section: {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    forms: FormItem[];
  };
  whatsappNumber: string;
  initialFormSlug?: string;
}

export const SectionViewer: React.FC<SectionViewerProps> = ({
  section,
  whatsappNumber,
  initialFormSlug,
}) => {
  // If the section only has 1 form (like LAUNDRY), default to it immediately
  const defaultSelectedSlug =
    initialFormSlug || (section.forms.length === 1 ? section.forms[0].slug : null);

  const [selectedFormSlug, setSelectedFormSlug] = useState<string | null>(defaultSelectedSlug);

  const selectedForm = section.forms.find((f) => f.slug === selectedFormSlug);

  const getCategoryIcon = (formSlug: string, formName: string) => {
    const s = `${formSlug} ${formName}`.toLowerCase();
    if (s.includes('food')) {
      return <Utensils className="w-7 h-7 text-amber-500" />;
    }
    if (s.includes('bigbasket') || s.includes('grocery')) {
      return <ShoppingBag className="w-7 h-7 text-emerald-500" />;
    }
    if (s.includes('online') || s.includes('parcel') || s.includes('package')) {
      return <Package className="w-7 h-7 text-blue-500" />;
    }
    if (s.includes('laundry')) {
      return <Shirt className="w-7 h-7 text-indigo-500" />;
    }
    if (s.includes('fresh') || s.includes('shop') || s.includes('store')) {
      return <Store className="w-7 h-7 text-teal-500" />;
    }
    return <Package className="w-7 h-7 text-slate-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 mb-8">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className={selectedFormSlug ? 'cursor-pointer hover:text-brand-600' : 'text-slate-900'} onClick={() => setSelectedFormSlug(section.forms.length === 1 ? section.forms[0].slug : null)}>
          {section.name}
        </span>
        {selectedForm && section.forms.length > 1 && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 font-bold">{selectedForm.name}</span>
          </>
        )}
      </nav>

      {/* Header section info */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/80 mb-3">
          <span>SRM AP • HOSTEL SERVICES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {section.name}
        </h1>
        <p className="mt-2 text-base text-slate-600">
          {section.description}
        </p>
      </div>

      {/* Conditional View: Category Selection Grid OR Form */}
      {!selectedForm ? (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Select Category
            </h2>
            <p className="text-xs text-slate-500">
              Choose the category of request you wish to submit:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.forms.map((form, index) => (
              <button
                key={form.id}
                onClick={() => setSelectedFormSlug(form.slug)}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getCategoryIcon(form.slug, form.name)}
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                      #{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                    {form.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {form.description || `Submit your ${form.name.toLowerCase()} request for quick processing.`}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-brand-600">
                  <span>Open Form</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all services</span>
            </Link>
          </div>
        </div>
      ) : (
        <DynamicFormRenderer
          sectionSlug={section.slug}
          sectionName={section.name}
          formSlug={selectedForm.slug}
          formName={selectedForm.name}
          submitButtonText={selectedForm.submitButtonText}
          fields={selectedForm.fields}
          whatsappNumber={whatsappNumber}
          onBack={section.forms.length > 1 ? () => setSelectedFormSlug(null) : undefined}
        />
      )}
    </div>
  );
};
