import React from 'react';
import { MousePointerClick, FileEdit, Send, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Service',
      desc: 'Select Gate Delivery, Laundry, or Shops right from the homepage.',
      icon: MousePointerClick,
      color: 'from-orange-500 to-amber-500',
    },
    {
      step: '02',
      title: 'Fill Quick Form',
      desc: 'Enter your room details, items, or laundry specifics. No account needed!',
      icon: FileEdit,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      step: '03',
      title: 'WhatsApp Pre-fills',
      desc: 'Form data is instantly formatted into a clean message with your Request ID.',
      icon: Send,
      color: 'from-emerald-500 to-green-500',
    },
    {
      step: '04',
      title: 'Press Send & Relax',
      desc: 'Your request is assigned to our coordinator for swift hostel delivery.',
      icon: CheckCircle2,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30 mb-4">
            Zero Hassle Experience
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            How Hostel Helper Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Designed specifically for SRM AP students. No passwords, no login delays, and no complicated dashboards.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:border-slate-600 shadow-xl group"
              >
                {/* Step pill */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-slate-600 group-hover:text-brand-400 transition-colors">
                    {item.step}
                  </span>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>

                {/* Connector line for desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-[2px] bg-slate-700"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
