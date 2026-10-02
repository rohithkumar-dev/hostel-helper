import React from 'react';
import { MessageSquare, Phone, MapPin, User, Clock, ShieldCheck } from 'lucide-react';

interface ContactSectionProps {
  ownerName?: string;
  location?: string;
  whatsappNumber?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  ownerName = 'K ROHIT KUMAR',
  location = 'SRM AP',
  whatsappNumber = '6300141729',
}) => {
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello K Rohit Kumar, I need help with a Hostel Helper request.')}`;

  return (
    <section id="contact-us" className="py-16 md:py-24 bg-white relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-navy-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Left Column: Heading & Help Message */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Direct Support Available</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Need help with a request?
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                Whether you have questions about gate delivery timings, laundry pickup procedures, or special item availability at hostel shops, our student coordinator is ready to help on WhatsApp.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <Clock className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-400">Response Time</div>
                    <div className="text-sm font-bold text-white">Within 5 Minutes</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-slate-400">Student Verified</div>
                    <div className="text-sm font-bold text-white">{location} Campus</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Card with Button */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-white/15 space-y-6">
              <div className="border-b border-white/15 pb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  Campus Coordinator
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-black text-lg border border-brand-500/30">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{ownerName}</h3>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      <span>{location} • Hostel Services</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400">Direct WhatsApp:</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    +91 {whatsappNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 px-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-slate-400">Coverage:</span>
                  <span className="font-semibold text-slate-200">All SRM AP Hostels</span>
                </div>
              </div>

              {/* Requirement 12: Add button CONTACT ON WHATSAPP */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl text-base font-black text-white bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-[1.02]"
              >
                <MessageSquare className="w-5 h-5" />
                <span>CONTACT ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
