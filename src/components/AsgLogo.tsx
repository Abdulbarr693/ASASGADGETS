import React, { useId } from 'react';
import { useTheme } from '../context/ThemeContext';

interface AsgLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'mark' | 'full';
  onClick?: () => void;
}

export const AsgLogo: React.FC<AsgLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  variant = 'full',
  onClick
}) => {
  const { isDark } = useTheme();
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');

  const dimensions = {
    sm: { box: 32, font: 'text-base', sub: 'text-[9px]' },
    md: { box: 42, font: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 54, font: 'text-2xl', sub: 'text-xs' },
    xl: { box: 76, font: 'text-3xl', sub: 'text-sm' }
  }[size];

  const gradCyanId = `asgGradCyan_${uid}`;
  const gradAccentId = `asgGradAccent_${uid}`;
  const gradLetterId = `asgGradLetter_${uid}`;
  const filterGlowId = `asgGlow_${uid}`;

  return (
    <div 
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* The Monogram Mark: "AS" with "G" inscribed in it */}
      <div 
        className="relative flex-shrink-0 flex items-center justify-center rounded-2xl p-0.5 shadow-md shadow-cyan-500/15 group-hover:shadow-cyan-500/30 transition-all duration-300"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        {/* Subtle dynamic outer border glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Inner canvas containing the AS + G inscribed SVG */}
        <div className={`relative w-full h-full rounded-[14px] p-1 flex items-center justify-center transition-colors ${
          isDark ? 'bg-[#0F172A]' : 'bg-white'
        }`}>
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id={gradCyanId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id={gradAccentId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id={gradLetterId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? '#FFFFFF' : '#0F172A'} />
                <stop offset="100%" stopColor={isDark ? '#94A3B8' : '#334155'} />
              </linearGradient>
              <filter id={filterGlowId} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#06B6D4" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Background subtle geometric shield/emblem */}
            <rect x="6" y="6" width="88" height="88" rx="20" fill={isDark ? "#0B132B" : "#F8FAFC"} opacity="0.6" />
            <rect x="6" y="6" width="88" height="88" rx="20" stroke={`url(#${gradCyanId})`} strokeWidth="1.5" strokeOpacity="0.3" />

            {/* LETTER "A" - Left glyph of the AS monogram */}
            <path
              d="M14 80 L30 18 H44 L60 76 H48 L44 60 H28 L23 76 L20 80 H14 Z M30 48 H41 L36 28 Z"
              fill={`url(#${gradLetterId})`}
              fillRule="evenodd"
            />

            {/* LETTER "S" - Right glyph of the AS monogram */}
            <path
              d="M82 28 C78 20 68 16 56 18 C46 19 39 25 39 33 C39 41 46 45 56 48 C68 51 78 55 78 65 C78 75 67 82 52 82 C40 82 31 77 26 68 L36 61 C40 67 46 72 52 72 C60 72 66 68 66 63 C66 58 60 54 49 51 C37 47 27 42 27 32 C27 21 37 9 56 9 C69 9 79 14 87 23 L82 28 Z"
              fill={`url(#${gradLetterId})`}
              opacity="0.88"
            />

            {/* INSCRIBED "G" - Inscribed directly in the heart of "AS" */}
            <g filter={`url(#${filterGlowId})`}>
              {/* Outer circular contour of the inscribed G with knockout stroke */}
              <path
                d="M66 41 C63 34 57 30 50 30 C39 30 30 39 30 50 C30 61 39 70 50 70 C59 70 66 65 68 57 H50 V48 H76 V59 C74 71 63 80 50 80 C33 80 20 67 20 50 C20 33 33 20 50 20 C61 20 71 26 75 36 L66 41 Z"
                fill={`url(#${gradAccentId})`}
                stroke={isDark ? "#0F172A" : "#FFFFFF"}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Inscribed G horizontal crossbar with knockout stroke */}
              <path
                d="M50 48 H74 V56 H50 Z"
                fill={`url(#${gradAccentId})`}
                stroke={isDark ? "#0F172A" : "#FFFFFF"}
                strokeWidth="1.5"
              />
              <circle cx="62" cy="52" r="2.5" fill="#FFFFFF" />
            </g>
          </svg>
        </div>
      </div>

      {/* Brand Text Lockup */}
      {(showText || variant === 'full') && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight font-mono ${dimensions.font} ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              ASAS<span className="text-cyan-500">GADGETS</span>
            </span>
            <span className={`px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider text-[9px] ${
              isDark 
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' 
                : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
            }`}>
              NG
            </span>
          </div>
          <p className={`font-sans tracking-wide -mt-0.5 flex items-center gap-1 ${dimensions.sub} ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span>Verified Tech Marketplace</span>
          </p>
        </div>
      )}
    </div>
  );
};
