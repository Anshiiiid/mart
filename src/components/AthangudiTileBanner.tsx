'use client';

import React from 'react';

interface AthangudiTileBannerProps {
  className?: string;
  height?: number;
}

export default function AthangudiTileBanner({ className = '', height = 36 }: AthangudiTileBannerProps) {
  // Tile motifs matching the Athangudi / Chettinad palette from the reference image
  const tiles = [
    { bg: '#F15A24', fg: '#FAF4E6', type: 'flower' },
    { bg: '#E99D1A', fg: '#1E1B18', type: 'star' },
    { bg: '#19857B', fg: '#FAF4E6', type: 'diamond' },
    { bg: '#C8331E', fg: '#E99D1A', type: 'sunburst' },
    { bg: '#562142', fg: '#FAF4E6', type: 'checker' },
    { bg: '#234982', fg: '#E99D1A', type: 'flower' },
    { bg: '#E99D1A', fg: '#C8331E', type: 'diamond' },
    { bg: '#F15A24', fg: '#FAF4E6', type: 'star' },
    { bg: '#19857B', fg: '#E99D1A', type: 'sunburst' },
    { bg: '#562142', fg: '#FAF4E6', type: 'flower' },
    { bg: '#C8331E', fg: '#FAF4E6', type: 'diamond' },
    { bg: '#E99D1A', fg: '#19857B', type: 'checker' },
  ];

  return (
    <div
      className={`w-full overflow-hidden flex border-y-2 border-[#1E1B18] select-none ${className}`}
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      <div className="flex w-full justify-between">
        {tiles.map((tile, i) => (
          <div
            key={i}
            className="flex-1 min-w-[28px] h-full flex items-center justify-center border-r border-[#1E1B18]/30 relative"
            style={{ backgroundColor: tile.bg }}
          >
            {tile.type === 'flower' && (
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill={tile.fg}>
                <circle cx="12" cy="12" r="3" />
                <circle cx="12" cy="4" r="2.5" />
                <circle cx="12" cy="20" r="2.5" />
                <circle cx="4" cy="12" r="2.5" />
                <circle cx="20" cy="12" r="2.5" />
                <circle cx="6.5" cy="6.5" r="2" />
                <circle cx="17.5" cy="17.5" r="2" />
                <circle cx="6.5" cy="17.5" r="2" />
                <circle cx="17.5" cy="6.5" r="2" />
              </svg>
            )}
            {tile.type === 'star' && (
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill={tile.fg}>
                <polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9" />
              </svg>
            )}
            {tile.type === 'sunburst' && (
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill={tile.fg}>
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="1" x2="12" y2="4" stroke={tile.fg} strokeWidth="2" />
                <line x1="12" y1="20" x2="12" y2="23" stroke={tile.fg} strokeWidth="2" />
                <line x1="1" y1="12" x2="4" y2="12" stroke={tile.fg} strokeWidth="2" />
                <line x1="20" y1="12" x2="23" y2="12" stroke={tile.fg} strokeWidth="2" />
              </svg>
            )}
            {tile.type === 'diamond' && (
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill={tile.fg}>
                <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
              </svg>
            )}
            {tile.type === 'checker' && (
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                <div style={{ backgroundColor: tile.fg }} className="w-1.5 h-1.5" />
                <div className="w-1.5 h-1.5" />
                <div className="w-1.5 h-1.5" />
                <div style={{ backgroundColor: tile.fg }} className="w-1.5 h-1.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}