'use client';

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  ownerName?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappNumber = '6300141729',
  ownerName = 'K Rohit Kumar',
}) => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello! I have a question regarding Hostel Helper services.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Tooltip bubble */}
      {!tooltipDismissed && (
        <div className="mb-3 hidden sm:flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200 text-xs font-semibold text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span>Chat with {ownerName}</span>
          <button
            onClick={() => setTooltipDismissed(true)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/40"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-7 h-7" />
        <span className="sr-only">Contact on WhatsApp</span>
      </a>
    </div>
  );
};
