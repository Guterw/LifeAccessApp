import React from 'react';

// Bandeiras desenhadas em SVG puro: funcionam 100% offline e renderizam
// igual em qualquer navegador/sistema, sem depender de fonte de emoji
// (que em alguns sistemas, como o Windows, cai para as duas letras do
// código do país em vez de desenhar a bandeira).
export default function FlagIcon({ code, className = 'w-full h-full' }) {
  switch (code) {
    case 'gb':
      return (
        <svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" className={className}>
          <rect width="60" height="40" fill="#012169" />
          <line x1="0" y1="0" x2="60" y2="40" stroke="#FFFFFF" strokeWidth="10" />
          <line x1="60" y1="0" x2="0" y2="40" stroke="#FFFFFF" strokeWidth="10" />
          <line x1="0" y1="0" x2="60" y2="40" stroke="#C8102E" strokeWidth="4" />
          <line x1="60" y1="0" x2="0" y2="40" stroke="#C8102E" strokeWidth="4" />
          <rect x="0" y="13" width="60" height="14" fill="#FFFFFF" />
          <rect x="23" y="0" width="14" height="40" fill="#FFFFFF" />
          <rect x="0" y="16" width="60" height="8" fill="#C8102E" />
          <rect x="26" y="0" width="8" height="40" fill="#C8102E" />
        </svg>
      );
    case 'es':
      return (
        <svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" className={className}>
          <rect width="60" height="40" fill="#AA151B" />
          <rect y="10" width="60" height="20" fill="#F1BF00" />
          <rect x="14" y="14" width="4.5" height="6" fill="#F1BF00" stroke="#702520" strokeWidth="0.4" />
          <rect x="18.5" y="14" width="4.5" height="6" fill="#AD1519" stroke="#702520" strokeWidth="0.4" />
          <rect x="14" y="20" width="4.5" height="6" fill="#FFFFFF" stroke="#702520" strokeWidth="0.4" />
          <rect x="18.5" y="20" width="4.5" height="6" fill="#AD1519" stroke="#702520" strokeWidth="0.4" />
        </svg>
      );
    case 'fr':
      return (
        <svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" className={className}>
          <rect width="20" height="40" fill="#0055A4" />
          <rect x="20" width="20" height="40" fill="#FFFFFF" />
          <rect x="40" width="20" height="40" fill="#EF4135" />
        </svg>
      );
    case 'br':
      return (
        <svg viewBox="0 0 60 40" preserveAspectRatio="xMidYMid slice" className={className}>
          <rect width="60" height="40" fill="#009739" />
          <polygon points="30,4 56,20 30,36 4,20" fill="#FEDD00" />
          <defs>
            <clipPath id="globeClip">
              <circle cx="30" cy="20" r="9" />
            </clipPath>
          </defs>
          <g clipPath="url(#globeClip)">
            <circle cx="30" cy="20" r="9" fill="#002776" />
            <rect x="20" y="18.5" width="20" height="3" fill="#FFFFFF" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}