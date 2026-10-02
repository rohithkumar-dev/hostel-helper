import React from 'react';
import { Logo } from './Logo';
import { MessageSquare, Phone, MapPin, User, Shield, Heart } from 'lucide-react';

interface FooterProps {
  ownerName?: string;
  location?: string;
  whatsappNumber?: string;
}

export const Footer: React.FC<FooterProps> = ({
  ownerName = 'K ROHIT KUMAR',
  location = 'SRM AP',
  whatsappNumber = '6300141729',
}) => {
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello K Rohit Kumar, I need help with Hostel Helper service.')}`;

  return (
    <footer id="contact-us" className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Purpose */}
          <div className="space-y-4">
            <div className="inline-block bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
              <Logo size="md" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier student hostel services portal at SRM AP. Effortlessly submit gate delivery pickups, laundry services, and hostel shop orders directly through WhatsApp.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 text-xs font-medium text-slate-400 border border-slate-700/50">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              <span>Hostels & Campus • {location}</span>
            </div>
          </div>

          {/* Col 2: Services Quick Reference */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide uppercase">
              Hostel Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>Gate Delivery (Food, BigBasket, Online Orders)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>Hostel Laundry Request & Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span>Hostel Shops (Total Fresh Snacks & Essentials)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Instant WhatsApp Notification System</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Us Box (Requirement 12) */}
          <div className="space-y-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white tracking-wide uppercase">
                Contact Us
              </h4>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active Support
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Need help with a request? Reach out directly to the hostel service coordinator.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2.5 text-slate-300">
                <User className="w-4 h-4 text-brand-400" />
                <span className="font-semibold">{ownerName}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-medium">+91 {whatsappNumber}</span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-md transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>CONTACT ON WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HOSTEL HELPER • SRM AP. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="/admin/login"
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </a>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Designed with <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" /> for SRM AP Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
