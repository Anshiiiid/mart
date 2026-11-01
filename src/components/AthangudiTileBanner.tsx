'use client';

import React from 'react';

interface AthangudiTileBannerProps {
  className?: string;
  height?: number;
}

export default function AthangudiTileBanner({ className = '', height = 40 }: AthangudiTileBannerProps) {
  // Motifs in the Green, Yellow, White & Black Color Theme
  const motifs = [
    {
      name: 'chai',
      bg: '#1F5C3A', // Green
      fg: '#FACC15', // Yellow
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M7 6h10l-1.5 13h-7L7 6z" fill="#FACC15" />
          <path d="M6 6h12v2H6V6z" fill="#FFFFFF" />
          <path d="M9 10h6v1H9v-1zm.5 3h5v1h-5v-1z" fill="#1F5C3A" />
          <path d="M10 2c0 .8.8 1.2.8 2s-.8 1.2-.8 2" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M13 2c0 .8.8 1.2.8 2s-.8 1.2-.8 2" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'umbrella',
      bg: '#FFFFFF', // White
      fg: '#1F5C3A',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M12 3v13m0 0a2 2 0 102 2" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 13C3 7 7 3 12 3s9 4 9 10c-3-1.5-6-1.5-9 0-3-1.5-6-1.5-9 0z" fill="#1F5C3A" />
          <path d="M7.5 11.5C9 10 11 10 12 11c1-1 3-1 4.5.5C18 7 15 4 12 4s-6 3-4.5 7.5z" fill="#FACC15" />
        </svg>
      ),
    },
    {
      name: 'auto',
      bg: '#FACC15', // Yellow
      fg: '#111827',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="4" y="6" width="16" height="9" rx="2" fill="#1F5C3A" />
          <rect x="6" y="8" width="5" height="4" rx="0.5" fill="#FFFFFF" />
          <rect x="13" y="8" width="5" height="4" rx="0.5" fill="#FFFFFF" />
          <circle cx="8" cy="18" r="2.5" fill="#111827" />
          <circle cx="16" cy="18" r="2.5" fill="#111827" />
          <circle cx="8" cy="18" r="1" fill="#FFFFFF" />
          <circle cx="16" cy="18" r="1" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: 'masala-dabba',
      bg: '#1F5C3A', // Green
      fg: '#FACC15',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="12" cy="12" r="9" fill="#1F5C3A" stroke="#111827" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="7.5" fill="#FFFFFF" />
          <circle cx="12" cy="8" r="2" fill="#FACC15" />
          <circle cx="8.5" cy="13.5" r="2" fill="#FACC15" />
          <circle cx="15.5" cy="13.5" r="2" fill="#FACC15" />
          <circle cx="12" cy="12" r="1.2" fill="#1F5C3A" />
        </svg>
      ),
    },
    {
      name: 'cooker',
      bg: '#FAF9F6', // Off-White
      fg: '#1F5C3A',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="5" y="9" width="14" height="10" rx="3" fill="#1F5C3A" />
          <rect x="3" y="11" width="3" height="2" rx="0.5" fill="#111827" />
          <path d="M8 9V6h8v3" stroke="#111827" strokeWidth="1.5" />
          <rect x="11" y="4" width="2" height="3" fill="#FACC15" />
        </svg>
      ),
    },
    {
      name: 'parcel',
      bg: '#FACC15', // Yellow
      fg: '#111827',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="5" y="6" width="14" height="12" rx="1.5" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
          <rect x="10.5" y="6" width="3" height="12" fill="#1F5C3A" />
          <rect x="5" y="10.5" width="14" height="3" fill="#1F5C3A" />
        </svg>
      ),
    },
    {
      name: 'tiffin',
      bg: '#1F5C3A', // Green
      fg: '#FFFFFF',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="7" y="7" width="10" height="3.5" rx="1" fill="#FACC15" />
          <rect x="7" y="11.5" width="10" height="3.5" rx="1" fill="#FFFFFF" />
          <rect x="7" y="16" width="10" height="3.5" rx="1" fill="#FACC15" />
          <path d="M5 8v9a2 2 0 002 2h10a2 2 0 002-2V8" stroke="#111827" strokeWidth="1.5" />
          <path d="M10 5a2 2 0 014 0" stroke="#111827" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      name: 'vazhayila',
      bg: '#FFFFFF', // White
      fg: '#1F5C3A',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path
            d="M5 19C5 12 12 5 19 5c0 7-7 14-14 14z"
            fill="#1F5C3A"
            stroke="#111827"
            strokeWidth="1.2"
          />
          <path d="M5 19L19 5" stroke="#FACC15" strokeWidth="1.5" />
          <path d="M9 15l2-2m2-2l2-2" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'plug',
      bg: '#FACC15', // Yellow
      fg: '#111827',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="7" y="9" width="10" height="8" rx="2" fill="#1F5C3A" />
          <line x1="9" y1="5" x2="9" y2="9" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="15" y1="5" x2="15" y2="9" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 17v4" stroke="#111827" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'cleaning',
      bg: '#1F5C3A', // Green
      fg: '#FFFFFF',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="7" y="11" width="10" height="10" rx="2" fill="#FFFFFF" />
          <path d="M9 11V7a2 2 0 012-2h2a2 2 0 012 2v4" stroke="#FACC15" strokeWidth="1.5" />
          <path d="M15 7h4l-1 3" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'beauty',
      bg: '#FFFFFF', // White
      fg: '#1F5C3A',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="6" y="12" width="5" height="9" rx="1" fill="#111827" />
          <path d="M6 12l2.5-5 2.5 5" fill="#FACC15" />
          <circle cx="16" cy="11" r="4.5" fill="#1F5C3A" />
          <path d="M16 15.5v5.5" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'car-bike',
      bg: '#FACC15', // Yellow
      fg: '#111827',
      render: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="4" y="9" width="16" height="6" rx="2" fill="#1F5C3A" />
          <path d="M7 9l2-4h6l2 4" fill="#FFFFFF" />
          <circle cx="8" cy="16.5" r="2.2" fill="#111827" />
          <circle cx="16" cy="16.5" r="2.2" fill="#111827" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`w-full overflow-hidden flex border-y-2 border-[#111827] select-none ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <div className="flex w-full justify-between">
        {motifs.map((tile, i) => (
          <div
            key={i}
            className="flex-1 min-w-[34px] sm:min-w-[42px] h-full flex items-center justify-center border-r border-[#111827]/30 transition-transform hover:scale-105"
            style={{ backgroundColor: tile.bg }}
            title={tile.name}
          >
            {tile.render()}
          </div>
        ))}
      </div>
    </div>
  );
}
