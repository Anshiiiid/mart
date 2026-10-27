'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ml';
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="relative bg-[#07050E] border-t border-amber-500/20 text-slate-400 text-xs overflow-hidden">
      {/* Decorative Traditional Border Motif */}
      <div className="w-full h-1.5 bg-gradient-to-r from-amber-700 via-yellow-400 to-amber-700 opacity-70" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-[#0E0B1A] rounded-[10px] flex items-center justify-center">
                  <span className="text-lg font-black text-amber-400 font-serif">ഹ</span>
                </div>
              </div>
              <span className="text-xl font-black text-white font-serif tracking-tight">
                HATKE<span className="text-amber-400">.</span>HAAT
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {lang === 'ml'
                ? 'ഇന്ത്യൻ പാരമ്പര്യ കലയും ആധുനിക ഫ്യൂച്ചറിസ്റ്റിക് ഡിസൈനും കൂട്ടിയിണക്കിയുള്ള ന്യൂ-ഏജ് ഇ-കൊമേഴ്സ് പ്ലാറ്റ്ഫോം. 3D പ്രിവ്യൂ, ഫോൾഡർ കാറ്റലോഗ്, മികച്ച നിർമ്മാണ മികവ്.'
                : 'A neo-traditional e-commerce sanctuary fusing ancient Indian sacred motifs, temple brass craftsmanship, and Kerala murals with next-gen high-performance engineering.'}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Next.js • Node.js • MongoDB Ready</span>
              </span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs font-serif">
              {lang === 'ml' ? 'പ്രധാന ഫോൾഡറുകൾ' : 'Featured Folders'}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#categories" className="hover:text-amber-300 transition-colors">
                  {lang === 'ml' ? 'ഹോം അപ്ലയൻസസ്' : 'Smart Home Appliances'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-300 transition-colors">
                  {lang === 'ml' ? 'സൈബർ ഓഡിയോ' : 'Cyber Audio & Gadgets'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-300 transition-colors">
                  {lang === 'ml' ? 'ഹെറിറ്റേജ് കുക്ക്വെയർ' : 'Artisanal Cookware'}
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-300 transition-colors">
                  {lang === 'ml' ? 'ടെറാക്കോട്ട ഡെക്കോർ' : 'Ambient Living & Lamps'}
                </a>
              </li>
            </ul>
          </div>

          {/* Experience Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs font-serif">
              {lang === 'ml' ? 'ടെക്നോളജി' : 'Innovation'}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#showcase" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>360° Turntable Mode</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Folder Navigation</span>
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Admin Control Hub</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Verification */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-xs font-serif">
              {lang === 'ml' ? 'വിശ്വാസ്യത' : 'Craft Guarantee'}
            </h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>GI Tagged & Verified</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Directly sourced from indigenous craft guilds across Kerala, Karnataka, and Rajasthan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Malayalam tribute */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p className="text-[11px]">
            © 2026 Hatke Haat (ഹട്കെ ഹാത്ത്). All rights reserved.
          </p>

          <p className="text-[11px] flex items-center gap-1.5 text-slate-400">
            <span>Crafted with Indian Pride</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>& Next-Gen Cyber Aesthetics</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
