'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Menu, X, Shield, PhoneCall, Home, MessageSquare } from 'lucide-react';

interface NavbarProps {
  whatsappNumber?: string;
  location?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  whatsappNumber = '6300141729',
  location = 'SRM AP',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Contact Us', href: '#contact-us', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Campus badge */}
          <Link href="/" className="group flex items-center gap-3">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-brand-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Admin Login Button */}
            <Link
              href="/admin/login"
              className="flex items-center gap-2 ml-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 hover:text-slate-900 transition-all duration-200 border border-slate-200/70"
            >
              <Shield className="w-4 h-4 text-slate-600" />
              <span>Admin Login</span>
            </Link>

            {/* Quick WhatsApp Support Pill */}
            <a
              href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello Hostel Helper, I need assistance with a request.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 ml-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-sm hover:shadow transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden lg:inline">WhatsApp Help</span>
            </a>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello Hostel Helper, I need assistance.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              aria-label="Contact WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
            Navigation • {location}
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Icon className="w-5 h-5 text-slate-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold text-slate-800 bg-slate-100/80 hover:bg-slate-200 transition-colors"
            >
              <Shield className="w-5 h-5 text-slate-600" />
              <span>Admin Login</span>
            </Link>
            <a
              href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent('Hello Hostel Helper, I need assistance.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat on WhatsApp ({whatsappNumber})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
