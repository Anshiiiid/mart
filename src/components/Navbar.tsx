'use client';

import React, { useState, forwardRef } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Sparkles,
  Layers,
  Menu,
  X,
  ArrowRight,
  Stamp,
  User,
  Heart,
} from 'lucide-react';
import { CartItem, Product } from '@/lib/types';

interface NavbarProps {
  cart: CartItem[];
  wishlist?: string[];
  products?: Product[];
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onSelectProduct?: (product: Product) => void;
  onSearch: (query: string) => void;
  lang: 'en' | 'ml';
  onToggleLang: () => void;
  initialVisible?: boolean;
}

const Navbar = forwardRef<HTMLElement, NavbarProps>(function Navbar(
  {
    cart,
    wishlist = [],
    products = [],
    onOpenCart,
    onOpenWishlist,
    onSelectProduct,
    onSearch,
    lang,
    onToggleLang,
    initialVisible = false,
  },
  ref
) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart calculations
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    const prodSection = document.getElementById('products');
    if (prodSection) {
      prodSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      ref={ref}
      id="main-top-navbar"
      className="fixed top-0 left-0 right-0 z-50 w-full bg-[#FFFFFF] border-b-2 border-[#111827] shadow-[0_4px_0px_rgba(17,24,39,0.06)] select-none transition-[opacity,transform] duration-200"
      style={{
        opacity: initialVisible ? 1 : 0,
        pointerEvents: initialVisible ? 'auto' : 'none',
        transform: initialVisible ? 'translateY(0px)' : 'translateY(-12px)',
      }}
    >
      {/* Top Announcement Ticker in Leaf Green & Haldi Yellow */}
      <div className="bg-[#1F5C3A] text-white py-1 px-4 text-[11px] sm:text-xs font-bold tracking-wider border-b-2 border-[#111827] flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 mx-auto truncate font-hatke-body">
          <span className="bg-[#FACC15] text-[#111827] px-2 py-0.5 rounded-full text-[10px] uppercase font-black border border-[#111827] shadow-[1px_1px_0px_#111827]">
            DHAMAKA
          </span>
          <span className="font-medium">
            {lang === 'ml'
              ? '🌴 100% ഒറിജിനൽ ദേശിമാർട്ട് • കേരളത്തിൽ ഉടനീളം സൗജന്യ ഡെലിവറി • ₹999 ന് മുകളിൽ'
              : '🌴 100% HANDCRAFTED DESIMART • FREE DELIVERY OVER ₹999 • KERALA & PAN-INDIA'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo with Tilted 'k' + Indian Desi Mart */}
        <a
          href="#top"
          onClick={scrollToTop}
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer shrink-0"
        >
          {/* Logo Badge: Yellow square with Green tilted 'k' */}
          <div className="relative w-11 h-11 rounded-2xl bg-[#FACC15] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] p-1 flex items-center justify-center group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[2px_2px_0px_#111827] transition-all">
            <span className="font-hatke-title text-2xl font-black text-[#1F5C3A] inline-block hatke-k-tilt">
              k
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] font-hatke-title lowercase">
                Hat<span className="hatke-k-tilt text-[#1F5C3A]">k</span>e
              </span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#FACC15] border-2 border-[#111827] shadow-[1.5px_1.5px_0px_#111827] text-[#111827]">
                Desi Mart
              </span>
            </div>
            {/* Tagline: Indian Desi Mart in Green */}
            <span className="text-[10px] text-[#1F5C3A] font-black tracking-wider font-mono">
              {lang === 'ml' ? 'ഇന്ത്യൻ ദേശി മാർട്ട്' : 'AUTHENTIC INDIAN DESI MART'}
            </span>
          </div>
        </a>

        {/* Center: Navigation Buttons */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 font-hatke-body">
          <a
            href="#categories"
            onClick={(e) => scrollToSection(e, 'categories')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#111827] hover:bg-[#FACC15]/20 hover:text-[#1F5C3A] border border-transparent hover:border-[#111827] active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Stamp className="w-3.5 h-3.5 text-[#1F5C3A]" />
            <span>{lang === 'ml' ? '9 കാറ്റഗറി സ്റ്റാമ്പുകൾ' : '9 Craft Stamps'}</span>
          </a>
          <a
            href="#showcase"
            onClick={(e) => scrollToSection(e, 'showcase')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#111827] hover:bg-[#FACC15]/20 hover:text-[#1F5C3A] border border-transparent hover:border-[#111827] active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1F5C3A]" />
            <span>{lang === 'ml' ? '3D കാർഖാന' : '3D Karkhana'}</span>
          </a>
          <a
            href="#products"
            onClick={(e) => scrollToSection(e, 'products')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#111827] hover:bg-[#FACC15]/20 hover:text-[#1F5C3A] border border-transparent hover:border-[#111827] active:translate-y-[1px] transition-all cursor-pointer"
          >
            {lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Curated Bazaar'}
          </a>
          <a
            href="#story"
            onClick={(e) => scrollToSection(e, 'story')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#111827] hover:bg-[#FACC15]/20 hover:text-[#1F5C3A] border border-transparent hover:border-[#111827] active:translate-y-[1px] transition-all cursor-pointer"
          >
            {lang === 'ml' ? 'പാരമ്പര്യം' : 'Our Story'}
          </a>
        </nav>

        {/* Right Side: Search, Language, Account, Wishlist, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 font-hatke-body">
          {/* Search Icon Button */}
          <div className="relative">
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-[#FFFFFF] border-2 border-[#111827] rounded-full px-3 py-1.5 w-40 sm:w-56 shadow-[2px_2px_0px_#111827] animate-fadeIn"
              >
                <button
                  type="submit"
                  className="text-[#1F5C3A] mr-2 shrink-0 cursor-pointer"
                  title="Search items"
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder={lang === 'ml' ? 'തിരയുക...' : 'Search finds...'}
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="bg-transparent border-none text-xs text-[#111827] font-bold focus:outline-none w-full placeholder:text-[#111827]/50"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchValue('');
                    onSearch('');
                  }}
                  className="text-[#111827]/60 hover:text-[#111827] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-full bg-[#FFFFFF] hover:bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                title="Search items"
              >
                <Search className="w-4 h-4 text-[#111827]" />
              </button>
            )}
          </div>

          {/* Language Switch Button in Haldi Yellow */}
          <button
            onClick={onToggleLang}
            className="px-3 py-1.5 rounded-full bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] text-[#111827] text-xs font-black hover:bg-[#EAB308] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#111827] transition-all flex items-center gap-1 cursor-pointer"
            title="Switch Language"
          >
            <span>{lang === 'en' ? 'മലയാളം' : 'English'}</span>
          </button>

          {/* Account Button */}
          <Link
            href="/login"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#111827] transition-all cursor-pointer group"
            title={lang === 'ml' ? 'അക്കൗണ്ട് / ലോഗിൻ' : 'Account / Sign In'}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#111827] shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-[#111827]/70 font-semibold font-mono">
                {lang === 'ml' ? 'ഹലോ, സൈൻ ഇൻ' : 'Hello, Sign in'}
              </span>
              <span className="text-xs font-black text-[#111827] tracking-tight">
                {lang === 'ml' ? 'അക്കൗണ്ട്' : 'Account'}
              </span>
            </div>
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#111827] transition-all cursor-pointer group relative"
            title={lang === 'ml' ? 'സേവ് ചെയ്ത വിഷ് ലിസ്റ്റ്' : 'Saved Wishlist'}
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#111827] shrink-0">
              <Heart
                className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8] ${
                  wishlist.length > 0 ? 'text-[#1F5C3A] fill-[#1F5C3A]' : ''
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1F5C3A] text-white text-[9px] font-black flex items-center justify-center border border-[#111827]">
                  {wishlist.length}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-[#111827]/70 font-semibold font-mono">
                {lang === 'ml' ? 'സേവ് ചെയ്തത്' : 'Saved'}
              </span>
              <span className="text-xs font-black text-[#111827] tracking-tight">
                {lang === 'ml' ? 'വിഷ് ലിസ്റ്റ്' : 'Wishlist'}
              </span>
            </div>
          </button>

          {/* Cart Button in Haldi Yellow with Green Count Badge */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] transition-all cursor-pointer relative group active:translate-x-[1px] active:translate-y-[1px]"
            title={lang === 'ml' ? 'ഷോപ്പിംഗ് കാർട്ട്' : 'Shopping Cart'}
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[#111827] shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              {/* Green Badge for count */}
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#1F5C3A] text-white text-[9px] font-black flex items-center justify-center border border-[#111827] shadow-xs">
                {totalCartCount}
              </span>
            </div>

            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-[#111827]/80 font-bold font-mono">
                ₹{cartSubtotal.toFixed(2)}
              </span>
              <span className="text-xs font-black text-[#111827] tracking-tight">
                {lang === 'ml' ? 'സഞ്ചി' : 'Cart'}
              </span>
            </div>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-[#FFFFFF] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center text-[#111827] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFFFF] border-t-2 border-[#111827] p-4 space-y-3 font-hatke-body animate-fadeIn">
          <a
            href="#categories"
            onClick={(e) => scrollToSection(e, 'categories')}
            className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#111827] bg-[#FAF9F6] font-bold text-xs hover:bg-[#FACC15]"
          >
            <Stamp className="w-4 h-4 text-[#1F5C3A]" />
            <span>{lang === 'ml' ? '9 കാറ്റഗറി സ്റ്റാമ്പുകൾ' : '9 Craft Stamps'}</span>
          </a>
          <a
            href="#showcase"
            onClick={(e) => scrollToSection(e, 'showcase')}
            className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#111827] bg-[#FAF9F6] font-bold text-xs hover:bg-[#FACC15]"
          >
            <Sparkles className="w-4 h-4 text-[#1F5C3A]" />
            <span>{lang === 'ml' ? '3D കാർഖാന' : '3D Karkhana'}</span>
          </a>
          <a
            href="#products"
            onClick={(e) => scrollToSection(e, 'products')}
            className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#111827] bg-[#FAF9F6] font-bold text-xs hover:bg-[#FACC15]"
          >
            <Layers className="w-4 h-4 text-[#111827]" />
            <span>{lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Curated Bazaar'}</span>
          </a>
          <a
            href="#story"
            onClick={(e) => scrollToSection(e, 'story')}
            className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#111827] bg-[#FAF9F6] font-bold text-xs hover:bg-[#FACC15]"
          >
            <ArrowRight className="w-4 h-4 text-[#FACC15]" />
            <span>{lang === 'ml' ? 'പാരമ്പര്യം' : 'Our Story'}</span>
          </a>
        </div>
      )}
    </header>
  );
});

export default Navbar;
