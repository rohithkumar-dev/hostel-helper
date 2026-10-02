'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Sparkles, LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  slug: string;
  name: string;
  description: string;
  iconName: string;
  formsCount?: number;
  formTags?: string[];
  badgeText?: string;
  accentColor: 'orange' | 'blue' | 'emerald';
  icon: React.ReactNode;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  slug,
  name,
  description,
  formsCount = 0,
  formTags = [],
  badgeText,
  accentColor,
  icon,
}) => {
  const colorStyles = {
    orange: {
      borderHover: 'group-hover:border-brand-400',
      iconBg: 'bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white',
      badge: 'bg-brand-100 text-brand-800 border-brand-200',
      tag: 'bg-orange-50/80 text-orange-700 border-orange-200/60',
      btn: 'bg-slate-900 group-hover:bg-brand-600 text-white',
      glow: 'group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)]',
    },
    blue: {
      borderHover: 'group-hover:border-blue-400',
      iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      tag: 'bg-blue-50/80 text-blue-700 border-blue-200/60',
      btn: 'bg-slate-900 group-hover:bg-blue-600 text-white',
      glow: 'group-hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)]',
    },
    emerald: {
      borderHover: 'group-hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      tag: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
      btn: 'bg-slate-900 group-hover:bg-emerald-600 text-white',
      glow: 'group-hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]',
    },
  }[accentColor];

  return (
    <div
      className={`group relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between shadow-card hover:shadow-card-hover ${colorStyles.borderHover} ${colorStyles.glow}`}
    >
      {/* Top Bar with Icon & Status Badge */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 shadow-sm ${colorStyles.iconBg}`}
          >
            {icon}
          </div>

          {badgeText && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${colorStyles.badge}`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 className="text-2xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 group-hover:text-brand-600 transition-colors">
          <span>{name}</span>
        </h3>

        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        {/* Service Subcategories / Options Preview */}
        {formTags.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Available Options:
            </span>
            <div className="flex flex-wrap gap-2">
              {formTags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${colorStyles.tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Button at bottom */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <Link
          href={`/service/${slug}`}
          className={`flex items-center justify-between w-full px-5 py-3.5 sm:py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md ${colorStyles.btn}`}
        >
          <span>OPEN {name}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </Link>
      </div>
    </div>
  );
};
