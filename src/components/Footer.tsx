'use client';

import React from 'react';
import Link from 'next/link';
import AthangudiTileBanner from '@/components/AthangudiTileBanner';
import { Sparkles, ShieldCheck, Heart, ArrowUpRight, Stamp } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ml';
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="relative bg-[#FFFDF7] border-t-2 border-[#1E1B18] text-[#1E1B18] text-xs overflow-hidden select-none">
      {/* Athangudi Tile Ribbon (Reference Image 1) */}
      <AthangudiTileBanner height={32} />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info in Banjara / Curried Away Style */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F15A24] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] p-1 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FFFDF7] fill-current animate-spin-slow">
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="12" cy="4" r="2" />
                  <circle cx="12" cy="20" r="2" />
                  <circle cx="4" cy="12" r="2" />
                  <circle cx="20" cy="12" r="2" />
                  <circle cx="6.5" cy="6.5" r="1.8" />
                  <circle cx="17.5" cy="17.5" r="1.8" />
                  <circle cx="6.5" cy="17.5" r="1.8" />
                  <circle cx="17.5" cy="6.5" r="1.8" />
                </svg>
              </div>

              <div>
                <span className="text-2xl font-black text-[#1E1B18] font-desi-display lowercase">
                  hatke<span className="text-[#F15A24]">.</span>haat
                </span>
                <span className="ml-2 text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#E99D1A] border border-[#1E1B18] text-[#1E1B18]">
                  Desi Mart
                </span>
              </div>
            </div>

            <p className="text-[#1E1B18]/80 leading-relaxed text-xs max-w-sm font-medium">
              {lang === 'ml'
                ? 'ഇന്ത്യൻ പാരമ്പര്യ കരകൗശല കലയും ആധുനിക ദേശിമാർട്ടും ഒന്നിക്കുന്ന ഇടം. തനിമയാർന്ന അത്താങ്കുടി ടൈലുകളും, വിന്റേജ് പോസ്റ്റൽ സ്റ്റാമ്പുകളും, 100% ഒറിജിനൽ ഉൽപ്പന്നങ്ങളും.'
                : 'An authentic Indian Desimart celebrating Athangudi tile craftsmanship, vintage postal art, and heirloom cookware fused with modern utility.'}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E99D1A]/20 border-2 border-[#1E1B18] text-[#1E1B18] font-mono text-[11px] font-black">
                <Stamp className="w-3.5 h-3.5 text-[#C8331E]" />
                <span>100% Authentic Indian Craft Guarantee</span>
              </span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div>
            <h4 className="text-[#1E1B18] font-black uppercase tracking-wider mb-4 text-xs font-desi-serif">
              {lang === 'ml' ? 'പ്രധാന സ്റ്റാമ്പുകൾ' : 'Craft Stamps'}
            </h4>
            <ul className="space-y-2.5 font-bold text-[#1E1B18]/70">
              <li>
                <a href="#categories" className="hover:text-[#F15A24] transition-colors">
                  {lang === 'ml' ? 'ഹെറിറ്റേജ് കുക്ക്വെയർ' : 'Heritage Cookware'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#F15A24] transition-colors">
                  {lang === 'ml' ? 'സ്മാർട്ട് അപ്ലയൻസസ്' : 'Smart Appliances'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#F15A24] transition-colors">
                  {lang === 'ml' ? 'ഓഡിയോ & ഗാഡ്‌ജറ്റുകൾ' : 'Cyber Audio & Gadgets'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#F15A24] transition-colors">
                  {lang === 'ml' ? 'ടെറാക്കോട്ട ഡെക്കോർ' : 'Ambient Living & Lamps'}
                </a>
              </li>
            </ul>
          </div>

          {/* Experience Links */}
          <div>
            <h4 className="text-[#1E1B18] font-black uppercase tracking-wider mb-4 text-xs font-desi-serif">
              {lang === 'ml' ? 'അനുഭവങ്ങൾ' : 'Experience'}
            </h4>
            <ul className="space-y-2.5 font-bold text-[#1E1B18]/70">
              <li>
                <a href="#showcase" className="hover:text-[#19857B] transition-colors flex items-center gap-1">
                  <span>360° Workshop Mode</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#19857B] transition-colors flex items-center gap-1">
                  <span>Postage Vault</span>
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#F15A24] transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#F15A24]" />
                  <span>Admin Control Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Desi Trust Seal */}
          <div>
            <h4 className="text-[#1E1B18] font-black uppercase tracking-wider mb-4 text-xs font-desi-serif">
              {lang === 'ml' ? 'വിശ്വാസ മുദ്ര' : 'Desi Trust'}
            </h4>
            <div className="p-4 rounded-2xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[2.5px_2.5px_0px_#1E1B18] space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C8331E] fill-current" />
                <span className="font-black text-xs">Pyaar Guaranteed</span>
              </div>
              <p className="text-[11px] text-[#1E1B18]/70 leading-relaxed font-medium">
                Directly from master artisans across Kerala, Tamil Nadu, and Gujarat.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t-2 border-[#1E1B18] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono font-bold text-[#1E1B18]/70">
          <p>© 2026 Hatke Haat Desimart. Handcrafted with Pyaar & Masala in India.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#1E1B18] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#1E1B18] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#1E1B18] cursor-pointer">Return Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}