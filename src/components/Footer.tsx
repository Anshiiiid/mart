'use client';

import React from 'react';

interface FooterProps {
  lang?: 'en' | 'ml';
  onSelectCategory?: (slug: string) => void;
}

export default function Footer({ lang, onSelectCategory }: FooterProps) {
  const handleScrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#1F5C3A] border-t-4 border-[#111827] select-none overflow-hidden">
      <div
        onClick={handleScrollTop}
        className="w-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-95"
        title={lang === 'ml' ? 'മുകളിലേക്ക് സ്ക്രോൾ ചെയ്യുക' : 'Back to top'}
      >
        <img
          src="/hatke-footer-banner.png"
          alt="Hatke Store"
          className="w-full h-auto block select-none pointer-events-none"
        />
      </div>
    </footer>
  );
}
