'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, ShieldCheck, Sparkles, Layers, SlidersHorizontal, ArrowRight, Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#09070F]/85 border-b border-amber-500/20 transition-all">

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-900 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:shadow-[0_0_28px_rgba(245,158,11,0.6)] transition-all">
            <div className="w-full h-full bg-[#0E0B1A] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <span className="text-xl font-black text-amber-400 font-serif">ഹ</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-amber-300/20 pointer-events-none"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif uppercase">
                HATKE<span className="text-amber-400">.</span>HAAT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                Neo-Trad
              </span>
            </div>
            <span className="text-[10px] text-amber-300/70 tracking-widest font-mono">
              {lang === 'ml' ? 'ഹട്കെ ഹാത്ത് • ന്യൂ-ഏജ് പ്ലാറ്റ്‌ഫോം' : 'INDIAN HERITAGE × CYBER-TECH'}
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <a
            href="#categories"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ml' ? 'ഫോൾഡർ കാറ്റലോഗ്' : 'Category Folders'}</span>
          </a>
          <a
            href="#showcase"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ml' ? '3D ഷോക്കേസ്' : '3D Turntable'}</span>
          </a>
          <a
            href="#products"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          >
            {lang === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ' : 'All Products'}
          </a>
          <a
            href="#story"
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          >
            {lang === 'ml' ? 'പാരമ്പര്യം' : 'Heritage'}
          </a>
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Search Trigger / Input */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-[#151025] border border-amber-500/40 rounded-full px-3 py-1.5 w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder={lang === 'ml' ? 'തിരയുക...' : 'Search gear & craft...'}
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/30 transition-all"
                title="Search Products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Switch Button (Mobile & Desktop) */}
          <button
            onClick={onToggleLang}
            className="md:hidden px-2.5 py-1 text-xs rounded-lg border border-amber-500/30 bg-amber-950/40 text-amber-300 font-medium"
          >
            {lang === 'en' ? 'ML' : 'EN'}
          </button>

          {/* Admin portal direct link badge */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-950/50 to-orange-950/50 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin</span>
          </Link>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2 group"
          >
            <ShoppingBag className="w-5 h-5 text-black" />
            <span className="hidden sm:inline text-xs font-extrabold tracking-wide uppercase">
              {lang === 'ml' ? 'കാർട്ട്' : 'Cart'}
            </span>
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center border-2 border-[#09070F] animate-bounce">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-amber-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0B1E] border-b border-amber-500/20 px-6 py-4 flex flex-col gap-3 animate-fadeIn">
          <a
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm py-2 text-slate-300 hover:text-amber-300 flex items-center justify-between"
          >
            <span>{lang === 'ml' ? 'ഫോൾഡർ കാറ്റലോഗ്' : 'Category Folders'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm py-2 text-slate-300 hover:text-amber-300 flex items-center justify-between"
          >
            <span>{lang === 'ml' ? '3D ഇൻസ്പെക്ഷൻ' : '3D Turntable'}</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </a>
          <a
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm py-2 text-slate-300 hover:text-amber-300 flex items-center justify-between"
          >
            <span>{lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'All Products'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </a>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 py-2 px-3 text-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Dashboard / അഡ്മിൻ പാനൽ</span>
          </Link>
        </div>
      )}
    </header>
  );
}
