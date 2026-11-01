'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AthangudiTileBanner from '@/components/AthangudiTileBanner';
import { ShieldCheck, X } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ml';
  onSelectCategory?: (slug: string) => void;
}

export default function Footer({ lang, onSelectCategory }: FooterProps) {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'return' | null>(null);

  const handleCategoryClick = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#FFFFFF] border-t-2 border-[#111827] text-[#111827] text-xs overflow-hidden select-none font-hatke-body">
      {/* Hatke Everyday Motifs Ribbon */}
      <AthangudiTileBanner height={36} />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {/* Hatke Tilted 'k' Logo Icon in Haldi Yellow */}
              <div className="w-11 h-11 rounded-2xl bg-[#FACC15] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] flex items-center justify-center">
                <span className="text-2xl font-black text-[#1F5C3A] font-hatke-title hatke-k-tilt leading-none">
                  k
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#111827] font-hatke-title">
                  Hat<span className="hatke-k-tilt text-[#1F5C3A]">k</span>e
                </span>
                <span className="ml-2 text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#1F5C3A] text-white border border-[#111827]">
                  Desi at Heart
                </span>
              </div>
            </div>

            <p className="text-[#111827]/80 leading-relaxed text-xs max-w-sm font-medium">
              {lang === 'ml'
                ? 'ദിവസേനയുള്ള കണ്ടെത്തലുകൾ, കുറച്ച് വ്യത്യസ്തമായി. ഓരോ ഇന്ത്യൻ വീടിനും ഇണങ്ങുന്ന തരത്തിൽ രൂപകൽപ്പന ചെയ്തത്. ആദ്യം കേരളത്തിൽ ആരംഭിക്കുന്നു.'
                : 'Everyday finds, a little different. A store not just to sell things, but to make the everyday a little more fun. Desi at heart. Launching first in Kerala.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-[#111827] text-[#111827] font-bold text-[11px] shadow-[1px_1px_0px_#111827]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1F5C3A]" />
                <span>Honest Prices • Real Delivery Dates • No Spam</span>
              </span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div>
            <h4 className="text-[#111827] font-black uppercase tracking-wider mb-4 text-xs font-hatke-title">
              {lang === 'ml' ? 'പ്രധാന ഐലുകൾ' : 'Shop by Aisle'}
            </h4>
            <ul className="space-y-2.5 font-bold text-[#111827]/70">
              <li>
                <button
                  onClick={(e) => handleCategoryClick('kitchen-cookware', e)}
                  className="hover:text-[#1F5C3A] transition-colors cursor-pointer text-left"
                >
                  {lang === 'ml' ? 'അടുക്കള വിഭവങ്ങൾ' : 'Kitchen Finds'}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleCategoryClick('home-appliances', e)}
                  className="hover:text-[#1F5C3A] transition-colors cursor-pointer text-left"
                >
                  {lang === 'ml' ? 'സ്മാർട്ട് അപ്ലയൻസസ്' : 'Smart Appliances'}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleCategoryClick('cyber-audio', e)}
                  className="hover:text-[#1F5C3A] transition-colors cursor-pointer text-left"
                >
                  {lang === 'ml' ? 'ഓഡിയോ & ഗാഡ്‌ജറ്റുകൾ' : 'Audio & Gadgets'}
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleCategoryClick('ambient-living', e)}
                  className="hover:text-[#1F5C3A] transition-colors cursor-pointer text-left"
                >
                  {lang === 'ml' ? 'വീട്ടുപകരണങ്ങൾ' : 'Ambient Living'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[#111827] font-black uppercase tracking-wider mb-4 text-xs font-hatke-title">
              {lang === 'ml' ? 'സഹായം & വിവരങ്ങൾ' : 'Support & Legal'}
            </h4>
            <ul className="space-y-2.5 font-bold text-[#111827]/70">
              <li>
                <button
                  onClick={() => setActivePolicy('privacy')}
                  className="hover:text-[#1F5C3A] transition-colors cursor-pointer text-left"
                >
                  {lang === 'ml' ? 'സ്വകാര്യതാ നയം' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('terms')}
                  className="hover:text-[#1F5C3A] transition-colors cursor-pointer text-left"
                >
                  {lang === 'ml' ? 'നിബന്ധനകൾ' : 'Terms & Conditions'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicy('return')}
                  className="hover:text-[#1F5C3A] transition-colors cursor-pointer text-left"
                >
                  {lang === 'ml' ? 'റിട്ടേൺ പോളിസി' : 'Easy 7-Day Returns'}
                </button>
              </li>
              <li>
                <span className="text-[#1F5C3A] font-black">hello@hatke.store</span>
              </li>
            </ul>
          </div>

          {/* Admin Direct Access */}
          <div>
            <h4 className="text-[#111827] font-black uppercase tracking-wider mb-4 text-xs font-hatke-title">
              {lang === 'ml' ? 'അഡ്മിൻ പ്രവേശനം' : 'Store Portal'}
            </h4>
            <p className="text-xs text-[#111827]/70 mb-3 font-medium">
              Manage inventory, live orders and store financials.
            </p>
            <Link
              href="/admin"
              className="desi-btn hatke-btn-yellow text-xs px-4 py-2 block text-center"
            >
              <span>{lang === 'ml' ? 'അഡ്മിൻ കൺസോൾ' : 'Admin Console'}</span>
            </Link>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t-2 border-[#111827]/15 flex flex-col sm:flex-row items-center justify-between gap-4 font-bold text-[#111827]/70 text-[11px]">
          <p>© 2026 Hatke Store. Everyday finds, a little different. Har cheez, thoda hatke.</p>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#1F5C3A]" />
            <span>Built with Next.js App Router • Kerala Edition</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div
          onClick={() => setActivePolicy(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl border-3 border-[#111827] shadow-[8px_8px_0px_#111827] p-6 text-[#111827] cursor-default"
          >
            <button
              onClick={() => setActivePolicy(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#FAF9F6] border-2 border-[#111827] hover:bg-[#FACC15]"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-xl font-black font-hatke-title mb-2">
              {activePolicy === 'privacy' && 'Privacy Commitment'}
              {activePolicy === 'terms' && 'Terms of Service'}
              {activePolicy === 'return' && '7-Day Easy Returns'}
            </h3>
            <p className="text-xs text-[#111827]/80 leading-relaxed font-medium">
              Honest prices, real delivery dates, and zero hidden fees. We never share customer data or bombard you with fake urgency notifications.
            </p>
          </div>
        </div>
      )}
    </footer>
  );
}
