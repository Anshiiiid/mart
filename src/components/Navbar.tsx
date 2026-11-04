'use client';

import React, { useState, useRef, useEffect, forwardRef } from 'react';
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
  Star,
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
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsSearchFocused(false);
    const prodSection = document.getElementById('products');
    if (prodSection) {
      prodSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSearchedProduct = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    setIsSearchFocused(false);
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

  // Matched products for real-time search suggestions
  const matchedProducts = searchValue.trim()
    ? products
        .filter((p) => {
          const q = searchValue.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            (p.nameMl && p.nameMl.toLowerCase().includes(q)) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  return (
    <header
      ref={ref}
      id="main-top-navbar"
      className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent border-none shadow-none backdrop-blur-none select-none transition-[opacity,transform] duration-200 pointer-events-none"
      style={{
        opacity: initialVisible ? 1 : 0,
        pointerEvents: initialVisible ? 'auto' : 'none',
        transform: initialVisible ? 'translateY(0px)' : 'translateY(-12px)',
      }}
    >
      {/* Main Bar: 100% transparent background, NO liquid glass, NO white box */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 lg:gap-3 pointer-events-auto bg-transparent">
        {/* Left: Brand Logo */}
        <a
          href="#top"
          onClick={scrollToTop}
          className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0"
        >
          {/* Logo Badge: Yellow square with Green tilted 'k' */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FACC15] border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] p-1 flex items-center justify-center group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1.5px_1.5px_0px_#111827] transition-all">
            <span className="font-hatke-title text-2xl font-black text-[#1F5C3A] inline-block hatke-k-tilt">
              k
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827] font-hatke-title lowercase">
                Hat<span className="hatke-k-tilt text-[#1F5C3A]">k</span>e
              </span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#FACC15] border-2 border-[#111827] shadow-[1.5px_1.5px_0px_#111827] text-[#111827]">
                Desi Mart
              </span>
            </div>
            {/* Tagline: Indian Desi Mart */}
            <span className="text-[10px] text-[#1F5C3A] font-black tracking-wider font-mono">
              {lang === 'ml' ? 'ഇന്ത്യൻ ദേശി മാർട്ട്' : 'AUTHENTIC INDIAN DESI MART'}
            </span>
          </div>
        </a>

        {/* Center: BIG SEARCH BAR */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-xl lg:max-w-2xl mx-2 sm:mx-6 hidden md:block"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-[#FFFFFF] border-2 border-[#111827] rounded-full shadow-[2.5px_2.5px_0px_#111827] px-3.5 py-1.5 focus-within:shadow-[3.5px_3.5px_0px_#111827] transition-all"
          >
            <Search className="w-4 h-4 text-[#1F5C3A] mr-2 shrink-0" />
            <input
              type="text"
              placeholder={
                lang === 'ml'
                  ? 'ഉൽപ്പന്നങ്ങൾ, സുഗന്ധവ്യഞ്ജനങ്ങൾ, കരകൗശലം തിരയുക...'
                  : 'Search spices, craft stamps, terracotta, brass...'
              }
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              className="bg-transparent border-none text-xs sm:text-sm text-[#111827] font-bold focus:outline-none w-full placeholder:text-[#111827]/45 placeholder:font-medium"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue('');
                  onSearch('');
                }}
                className="text-[#111827]/50 hover:text-[#111827] p-1 cursor-pointer mr-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] border border-[#111827] text-xs font-black shadow-[1px_1px_0px_#111827] shrink-0 active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer"
            >
              {lang === 'ml' ? 'തിരയുക' : 'Search'}
            </button>
          </form>

          {/* Real-time Search Results Dropdown */}
          {isSearchFocused && searchValue.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] border-2 border-[#111827] rounded-2xl shadow-[6px_6px_0px_#111827] p-3 z-50 max-h-96 overflow-y-auto animate-fadeIn font-hatke-body">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#111827]/15 text-[11px] font-black text-[#111827]/60 font-mono">
                <span>
                  {lang === 'ml' ? 'തിരഞ്ഞ ഫലങ്ങൾ' : 'SEARCH RESULTS'} (
                  {matchedProducts.length})
                </span>
                <span className="text-[#1F5C3A]">
                  &quot;{searchValue}&quot;
                </span>
              </div>

              {matchedProducts.length === 0 ? (
                <div className="py-6 text-center text-[#111827]/70">
                  <p className="text-xs font-bold">
                    {lang === 'ml'
                      ? 'ക്ഷമിക്കണം, ഉൽപ്പന്നങ്ങൾ കണ്ടെത്താനായില്ല'
                      : 'No handcrafted treasures found for this search.'}
                  </p>
                  <p className="text-[10px] text-[#111827]/50 mt-1">
                    {lang === 'ml'
                      ? 'മറ്റ് വാക്കുകൾ ഉപയോഗിച്ച് ശ്രമിക്കുക (ഉദാ: Spices, Cookware, Brass)'
                      : 'Try keywords like Spices, Terracotta, Brass, or Channapatna'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {matchedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectSearchedProduct(prod)}
                      className="p-2 rounded-xl hover:bg-[#FACC15]/20 border border-transparent hover:border-[#111827] flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <div className="w-11 h-11 rounded-lg bg-[#FAF9F6] border border-[#111827] overflow-hidden p-1 shrink-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-[#111827] truncate">
                          {lang === 'ml' && prod.nameMl
                            ? prod.nameMl
                            : prod.name}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#111827]/60 font-medium">
                          <span className="uppercase font-mono font-bold text-[#1F5C3A]">
                            {prod.category}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-[#EAB308] font-bold">
                            <Star className="w-2.5 h-2.5 fill-[#EAB308]" />
                            {prod.rating}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#111827] font-mono shrink-0">
                        ₹{prod.price}
                      </span>
                    </div>
                  ))}

                  <button
                    onClick={handleSearchSubmit}
                    className="w-full mt-2 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#FACC15]/30 border-2 border-[#111827] text-center text-xs font-black text-[#111827] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {lang === 'ml'
                        ? 'അങ്ങാടിയിൽ എല്ലാ ഫലങ്ങളും കാണുക'
                        : 'View all results in Curated Bazaar'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1F5C3A]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Buttons: Language, Account, Wishlist, Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0 font-hatke-body bg-transparent">
          {/* Language Switch Button */}
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
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#FACC15]/20 border border-transparent hover:border-[#111827] transition-all cursor-pointer group"
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
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-[#FACC15]/20 border border-transparent hover:border-[#111827] transition-all cursor-pointer group relative"
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
            className="md:hidden w-10 h-10 rounded-xl bg-[#FFFFFF] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center text-[#111827] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Only shown on small screens) */}
      <div className="md:hidden px-3 pb-2 bg-transparent pointer-events-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center bg-[#FFFFFF] border-2 border-[#111827] rounded-full shadow-[2px_2px_0px_#111827] px-3.5 py-1.5"
        >
          <Search className="w-4 h-4 text-[#1F5C3A] mr-2 shrink-0" />
          <input
            type="text"
            placeholder={
              lang === 'ml'
                ? 'തിരയുക...'
                : 'Search spices, craft stamps...'
            }
            value={searchValue}
            onChange={handleSearchChange}
            className="bg-transparent border-none text-xs text-[#111827] font-bold focus:outline-none w-full"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                onSearch('');
              }}
              className="text-[#111827]/50 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Mobile Drawer Menu (Floating card when opened) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFFFF] border-2 border-[#111827] rounded-2xl mx-3 mt-1 p-4 space-y-3 font-hatke-body shadow-[4px_4px_0px_#111827] animate-fadeIn pointer-events-auto">
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
