'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Sparkles, Layers, Menu, X, ArrowRight, Stamp } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  lang: 'en' | 'ml';
  onToggleLang: () => void;
}

export default function Navbar({ cart, onOpenCart, onSearch, lang, onToggleLang }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFDF7] border-b-2 border-[#1E1B18] shadow-[0_4px_0px_rgba(30,27,24,0.06)] select-none">
      {/* Top Desi Announcement Ticker */}
      <div className="bg-[#F15A24] text-white py-1.5 px-4 text-[11px] sm:text-xs font-bold tracking-wider border-b border-[#1E1B18] flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 mx-auto truncate font-mono">
          <span className="bg-[#1E1B18] text-[#E99D1A] px-2 py-0.5 rounded text-[10px] uppercase font-black">
            DHAMAKA
          </span>
          <span>
            {lang === 'ml'
              ? '🇮🇳 ധമാക്ക ക്ലിയറൻസ് സെയിൽ • 100% ഒറിജിനൽ ദേശിമാർട്ട് • ₹999 ന് മുകളിൽ സൗജന്യ ഡെലിവറി'
              : '🇮🇳 DHAMAKA CLEARANCE SALE • 100% HANDCRAFTED DESIMART • FREE SHIPPING OVER ₹999'}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo with 8-petal Marigold Chakra */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-2xl bg-[#F15A24] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] p-1 flex items-center justify-center group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[2px_2px_0px_#1E1B18] transition-all">
            {/* 8-Petal Marigold Chakra Emblem from Reference */}
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

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E1B18] font-desi-display lowercase">
                hatke<span className="text-[#F15A24]">.</span>haat
              </span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] shadow-[1.5px_1.5px_0px_#1E1B18] text-[#1E1B18]">
                Desi Mart
              </span>
            </div>
            <span className="text-[10px] text-[#C8331E] font-bold tracking-widest font-mono">
              {lang === 'ml' ? 'ഹട്കെ ഹാത്ത് • 100% ദേശി സ്റ്റോർ' : 'AUTHENTIC INDIAN DESI BAZAAR'}
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-2">
          <a
            href="#categories"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E1B18] hover:bg-[#FAF4E6] border border-transparent hover:border-[#1E1B18] transition-all flex items-center gap-1.5"
          >
            <Stamp className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>{lang === 'ml' ? 'കാറ്റഗറി സ്റ്റാമ്പുകൾ' : '9 Craft Stamps'}</span>
          </a>
          <a
            href="#showcase"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E1B18] hover:bg-[#FAF4E6] border border-transparent hover:border-[#1E1B18] transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#19857B]" />
            <span>{lang === 'ml' ? '3D കാർഖാന' : '3D Karkhana'}</span>
          </a>
          <a
            href="#products"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E1B18] hover:bg-[#FAF4E6] border border-transparent hover:border-[#1E1B18] transition-all"
          >
            {lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Curated Bazaar'}
          </a>
          <a
            href="#story"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#1E1B18] hover:bg-[#FAF4E6] border border-transparent hover:border-[#1E1B18] transition-all"
          >
            {lang === 'ml' ? 'പാരമ്പര്യം' : 'Our Story'}
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Input styled like parcel tag */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-full px-3 py-1.5 w-44 sm:w-60 shadow-[2px_2px_0px_#1E1B18]">
                <Search className="w-4 h-4 text-[#F15A24] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder={lang === 'ml' ? 'തിരയുക...' : 'Search spices, craft...'}
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none text-xs text-[#1E1B18] font-bold focus:outline-none w-full"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="text-[#1E1B18]/60 hover:text-[#1E1B18]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] flex items-center justify-center hover:bg-[#F2E7D0] transition-all"
                title="Search"
              >
                <Search className="w-4 h-4 text-[#1E1B18]" />
              </button>
            )}
          </div>

          {/* Language Switch Button */}
          <button
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-[#1E1B18] text-xs font-black hover:bg-[#D68D12] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1E1B18] transition-all flex items-center gap-1"
            title="Toggle Malayalam / English"
          >
            <span>{lang === 'en' ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* Chunky Desi Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative px-3 sm:px-4 py-2 rounded-full bg-[#F15A24] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] text-white font-extrabold text-xs sm:text-sm hover:bg-[#E04D18] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1B18] transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="hidden sm:inline font-mono">
              {lang === 'ml' ? 'സഞ്ചി' : 'Potli'}
            </span>
            <span className="w-5 h-5 rounded-full bg-[#1E1B18] text-[#E99D1A] text-[10px] font-black flex items-center justify-center">
              {totalCartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] flex items-center justify-center text-[#1E1B18]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF7] border-t-2 border-[#1E1B18] p-4 space-y-3">
          <a
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-[#1E1B18] bg-[#FAF4E6] font-bold text-xs"
          >
            <Stamp className="w-4 h-4 text-[#F15A24]" />
            <span>{lang === 'ml' ? '9 കാറ്റഗറി സ്റ്റാമ്പുകൾ' : '9 Craft Stamps'}</span>
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-[#1E1B18] bg-[#FAF4E6] font-bold text-xs"
          >
            <Sparkles className="w-4 h-4 text-[#19857B]" />
            <span>{lang === 'ml' ? '3D കാർഖാന' : '3D Karkhana'}</span>
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-[#1E1B18] bg-[#FAF4E6] font-bold text-xs"
          >
            <Layers className="w-4 h-4 text-[#C8331E]" />
            <span>{lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Curated Bazaar'}</span>
          </a>
          <a
            href="#story"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-[#1E1B18] bg-[#FAF4E6] font-bold text-xs"
          >
            <ArrowRight className="w-4 h-4 text-[#E99D1A]" />
            <span>{lang === 'ml' ? 'പാരമ്പര്യം' : 'Our Story'}</span>
          </a>
        </div>
      )}
    </header>
  );
}