import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const dimensions = {
    sm: { icon: 32, text: 'text-lg', subtext: 'text-[10px]' },
    md: { icon: 42, text: 'text-xl', subtext: 'text-xs' },
    lg: { icon: 54, text: 'text-2xl', subtext: 'text-sm' },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon: Architectural hostel building + dynamic express delivery package & bell */}
      <div className="relative flex-shrink-0">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          <defs>
            <linearGradient id="hhGradientPrimary" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="hhGradientAccent" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="hhGradientBlue" x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Background Badge Shield */}
          <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#hhGradientPrimary)" />
          <rect x="4.75" y="4.75" width="54.5" height="54.5" rx="15.25" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

          {/* Hostel Building Silhouette Structure */}
          <path
            d="M16 46V22L28 15V46H16Z"
            fill="#334155"
            opacity="0.8"
          />
          {/* Hostel Windows */}
          <rect x="19" y="24" width="3" height="4" rx="0.5" fill="#94A3B8" />
          <rect x="24" y="24" width="3" height="4" rx="0.5" fill="#94A3B8" />
          <rect x="19" y="32" width="3" height="4" rx="0.5" fill="#94A3B8" />
          <rect x="24" y="32" width="3" height="4" rx="0.5" fill="#94A3B8" />

          {/* Delivery Parcel Box with Accent Ribbon */}
          <path
            d="M26 31L38 24L50 31L38 38L26 31Z"
            fill="url(#hhGradientAccent)"
          />
          <path
            d="M26 31V45L38 51V38L26 31Z"
            fill="#EA580C"
          />
          <path
            d="M50 31V45L38 51V38L50 31Z"
            fill="#C2410C"
          />
          {/* Parcel Ribbon detail */}
          <path
            d="M32 27.5L44 34.5M38 24V51"
            stroke="#FED7AA"
            strokeWidth="1.25"
            strokeLinecap="round"
          />

          {/* Express Service Bell / Flash indicator */}
          <circle cx="48" cy="18" r="6" fill="#F97316" stroke="#0F172A" strokeWidth="2" />
          <path
            d="M48 15V17M48 20V21"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name & Subtitle */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight leading-none text-slate-900 ${dimensions.text}`}>
            HOSTEL <span className="text-brand-600">HELPER</span>
          </span>
          <span className={`font-semibold tracking-wider uppercase text-slate-500 mt-0.5 ${dimensions.subtext}`}>
            SRM AP • HOSTEL SERVICES
          </span>
        </div>
      )}
    </div>
  );
};
