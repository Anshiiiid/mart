'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection, { HeroProgressInfo } from '@/components/HeroSection';
import FolderCategoryNav from '@/components/FolderCategoryNav';
import Interactive3DShowcase from '@/components/Interactive3DShowcase';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';
import WishlistDrawer from '@/components/WishlistDrawer';
import { Product, CategoryFolder, CartItem, Order } from '@/lib/types';
import { initialCategories, initialProducts } from '@/lib/seed-data';
import { Sparkles, Eye, ShieldCheck, Grid, ShoppingBag, ArrowUp } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryFolder[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [only3D, setOnly3D] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [lang, setLang] = useState<'en' | 'ml'>('en');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navbarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/categories').catch(() => null),
        ]);
        if (prodRes?.ok) {
          const prodData = await prodRes.json();
          if (prodData.products) setProducts(prodData.products);
        }
        if (catRes?.ok) {
          const catData = await catRes.json();
          if (catData.categories) setCategories(catData.categories);
        }
      } catch (err) {
        console.warn('Operating with bundled seed data:', err);
      }
    }
    loadData();

    try {
      const savedCart = localStorage.getItem('hatke_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('hatke_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // ignore
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (typeof window !== 'undefined' && window.scrollY > window.innerHeight * 1.2) {
      if (navbarRef.current) {
        navbarRef.current.style.opacity = '1';
        navbarRef.current.style.pointerEvents = 'auto';
        navbarRef.current.style.transform = 'translateY(0px)';
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('hatke_cart', JSON.stringify(newCart));
    } catch {
      // ignore
    }
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...cart, { product, quantity }];
    }
    updateCartState(updated);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    updateCartState(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    updateCartState(updated);
  };

  const handleToggleWishlist = (productId: string) => {
    let next: string[];
    if (wishlist.includes(productId)) {
      next = wishlist.filter((id) => id !== productId);
    } else {
      next = [...wishlist, productId];
    }
    setWishlist(next);
    try {
      localStorage.setItem('hatke_wishlist', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleApplyPromo = (code: string) => {
    if (code.trim().toUpperCase() === 'HATKE15') {
      setAppliedDiscount(15);
      return true;
    }
    return false;
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (_order: Order) => {
    updateCartState([]);
  };

  const handleHeroProgressUpdate = useCallback(
    ({ progress, isExited }: HeroProgressInfo) => {
      const exitStart = 0.75;
      const fade = progress > exitStart ? Math.min(1, (progress - exitStart) / (0.96 - exitStart)) : 0;
      const easeFade = fade < 0.5 ? 2 * fade * fade : 1 - Math.pow(-2 * fade + 2, 2) / 2;

      if (navbarRef.current) {
        if (isExited || progress >= 0.95) {
          navbarRef.current.style.opacity = '1';
          navbarRef.current.style.pointerEvents = 'auto';
          navbarRef.current.style.transform = 'translateY(0px)';
        } else {
          navbarRef.current.style.opacity = String(easeFade);
          navbarRef.current.style.pointerEvents = easeFade > 0.4 ? 'auto' : 'none';
          navbarRef.current.style.transform = `translateY(${(1 - easeFade) * -12}px)`;
        }
      }
    },
    []
  );

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.nameMl && prod.nameMl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedFilterCategory === 'all' ||
      prod.categorySlug === selectedFilterCategory ||
      (selectedFilterCategory === 'kitchen' && (prod.categorySlug === 'kitchen-cookware' || prod.category.toLowerCase().includes('cookware') || prod.category.toLowerCase().includes('kitchen'))) ||
      (selectedFilterCategory === 'tech' && (prod.categorySlug === 'cyber-audio' || prod.categorySlug === 'computing-workspace' || prod.categorySlug === 'smart-mobility' || prod.category.toLowerCase().includes('gadget') || prod.category.toLowerCase().includes('audio'))) ||
      (selectedFilterCategory === 'kids' && (prod.categorySlug === 'kids-nursery' || prod.category.toLowerCase().includes('kids') || prod.category.toLowerCase().includes('toy'))) ||
      (selectedFilterCategory === 'home' && (prod.categorySlug === 'home-appliances' || prod.categorySlug === 'ambient-living' || prod.categorySlug === 'modern-sanitation' || prod.category.toLowerCase().includes('home') || prod.category.toLowerCase().includes('appliances')));

    const matches3D = !only3D || prod.is3dAvailable;

    return matchesSearch && matchesCategory && matches3D;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111827] flex flex-col font-hatke-body">
      {/* Top Navigation Bar */}
      <Navbar
        ref={navbarRef}
        cart={cart}
        wishlist={wishlist}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onSearch={setSearchQuery}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'ml' : 'en')}
      />

      <main className="flex-1 relative">
        {/* 1. Fullscreen Hero Section */}
        <HeroSection lang={lang} onProgressUpdate={handleHeroProgressUpdate} />

        {/* 2. Store Content in Clean Theme */}
        <div id="store-content" className="relative z-10 bg-[#FAF9F6]">
          {/* Interactive Category Realms */}
          <FolderCategoryNav
            categories={categories}
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onFilterCatalog={(slug) => setSelectedFilterCategory(slug)}
            lang={lang}
          />

          {/* 3. 3D Interactive Turntable */}
          <Interactive3DShowcase
            products={products}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onInstantBuy={(p) => handleBuyNow(p, 1)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            lang={lang}
          />

          {/* 4. Complete Catalog & Filtering Grid */}
          <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
            {/* Promo Banner Card in Haldi Yellow */}
            <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#FACC15] border-3 border-[#111827] shadow-[5px_5px_0px_#111827] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="max-w-xl z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5C3A] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
                  <span>✨ {lang === 'ml' ? 'ഈ ആഴ്ചയിലെ പുതിയ കണ്ടെത്തലുകൾ' : 'NEW THIS WEEK'}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#111827] font-hatke-title mb-2">
                  {lang === 'ml' ? '7 കിടിലൻ അടുക്കള കണ്ടെത്തലുകൾ' : '7 clever kitchen finds this week.'}
                </h3>
                <p className="text-sm text-[#111827]/85 font-medium leading-relaxed mb-4">
                  {lang === 'ml'
                    ? 'ഓരോ ദിവസത്തെയും ചെറിയ ചെറിയ പ്രശ്നങ്ങൾ പരിഹരിക്കുന്ന വിഭവങ്ങൾ. ഓർഡർ ചെയ്യും മുൻപേ ഡെലിവറി തീയതി അറിയാം.'
                    : 'Every find solves a small daily problem: kitchen, desk, car, kids. Your delivery date, shown before you pay.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedFilterCategory('kitchen');
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="desi-btn hatke-btn-black text-xs px-6 py-3 cursor-pointer uppercase tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FACC15]" />
                  <span>{lang === 'ml' ? 'ഇപ്പോൾ കാണുക' : 'Shop Kitchen Finds'}</span>
                </button>
              </div>

              {/* Product Preview Tile */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-2xl bg-white border-2 border-[#111827] p-4 flex items-center justify-center shadow-[3px_3px_0px_#111827] shrink-0 rotate-3 hover:rotate-0 transition-transform">
                <img
                  src="/categories/kitchen-cookware.jpg"
                  alt="Clever Kitchen Find"
                  className="w-full h-full object-contain drop-shadow-md"
                />
                <div className="absolute -bottom-2 -left-2 px-2.5 py-0.5 rounded-full bg-[#1F5C3A] text-white text-[10px] font-black border border-[#111827] shadow-xs">
                  ₹299 onwards
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1F5C3A] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] text-white text-xs font-black uppercase tracking-wider mb-2">
                  <Grid className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>{lang === 'ml' ? 'സമ്പൂർണ്ണ കാറ്റലോഗ്' : 'CURATED DESI BAZAAR'}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#111827] font-hatke-title">
                  {lang === 'ml' ? 'അല്പം ഹട്കെ, തികച്ചും ഉപകാരം' : 'Thoda hatke, poora useful.'}
                </h2>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setOnly3D(!only3D)}
                  className={`px-3.5 py-2 rounded-full text-xs font-black border-2 border-[#111827] transition-all flex items-center gap-1.5 cursor-pointer ${
                    only3D
                      ? 'bg-[#1F5C3A] text-white shadow-[2px_2px_0px_#111827]'
                      : 'bg-[#FFFFFF] text-[#111827] shadow-[2px_2px_0px_#111827] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>3D Ready Only</span>
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FFFFFF] border-2 border-[#111827] rounded-full px-4 py-2 text-xs font-black text-[#111827] shadow-[2px_2px_0px_#111827] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured / Hatke Pick</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills in Haldi Yellow & White */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-black border-2 border-[#111827] whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilterCategory === 'all'
                    ? 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827]'
                    : 'bg-[#FFFFFF] text-[#111827] shadow-[2px_2px_0px_#111827] hover:bg-[#FAF9F6]'
                }`}
              >
                All Finds ({products.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedFilterCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-black border-2 border-[#111827] whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilterCategory === c.slug
                      ? 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827]'
                      : 'bg-[#FFFFFF] text-[#111827] shadow-[2px_2px_0px_#111827] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {lang === 'ml' ? c.nameMl : c.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#FFFFFF] rounded-3xl border-2 border-dashed border-[#111827] shadow-[3px_3px_0px_#111827]">
                <p className="text-[#111827] font-black text-base font-hatke-title">
                  {lang === 'ml' ? 'ഫിൽട്ടറുകൾക്ക് അനുയോജ്യമായ ഉൽപ്പന്നങ്ങൾ കണ്ടെത്തിയില്ല.' : 'No items match your selected filter or search.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedFilterCategory('all');
                    setOnly3D(false);
                    setSearchQuery('');
                  }}
                  className="mt-4 desi-btn hatke-btn-yellow text-xs px-5 py-2 cursor-pointer"
                >
                  {lang === 'ml' ? 'ഫിൽട്ടറുകൾ റീസെറ്റ് ചെയ്യുക' : 'Reset Filters'}
                </button>
              </div>
            )}
          </section>

          {/* 5. Brand Vision Section */}
          <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-2 border-[#111827] scroll-mt-24">
            <div className="relative rounded-3xl p-8 sm:p-14 bg-[#FFFFFF] border-3 border-[#111827] shadow-[6px_6px_0px_#111827] overflow-hidden">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FACC15] border-2 border-[#111827] text-[#111827] text-xs font-black mb-4 shadow-[2px_2px_0px_#111827]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1F5C3A]" />
                  <span>{lang === 'ml' ? 'ബ്രാൻഡ് ദർശനം' : 'DESI AT HEART • EDITION 02 • 2026'}</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black font-hatke-title text-[#111827] mb-4 leading-tight">
                  {lang === 'ml'
                    ? 'വ്യത്യസ്തത നമ്മുടെ ദേശിയിലാണ്.'
                    : 'Different is in our desi.'}
                </h2>
                <p className="text-sm sm:text-base text-[#111827]/85 font-medium leading-relaxed mb-6 font-hatke-body">
                  {lang === 'ml'
                    ? 'നമ്മുടെ ലക്ഷ്യം ഓൺലൈനിലെ ഏറ്റവും വിശ്വസ്തവും സൗഹൃദപരവുമായ ദേശി സ്റ്റോർ ആവുക എന്നതാണ്: കൃത്യമായ വിലകൾ, വാങ്ങുന്നതിന് മുൻപേ കാണിക്കുന്ന ഡെലിവറി തീയതികൾ, ആളുകളെ "അരേ, കൊള്ളാമല്ലോ!" എന്ന് പറയിപ്പിക്കുന്ന കണ്ടെത്തലുകൾ.'
                    : 'Our vision is to be the friendliest desi store online: honest prices, real delivery dates, and finds that make people say "arre, nice!". Made for every Indian home. Launching first in Kerala.'}
                </p>

                {/* 3 Core Values Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
                    <h4 className="font-black text-xs text-[#1F5C3A] uppercase tracking-wider mb-1">Useful first</h4>
                    <p className="text-[11px] text-[#111827]/80">Kitchen, desk, car, kids daily problem solvers.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FEF08A] border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
                    <h4 className="font-black text-xs text-[#111827] uppercase tracking-wider mb-1">Desi at heart</h4>
                    <p className="text-[11px] text-[#111827]/80">Made for every Indian home. First in Kerala.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#1F5C3A] text-white border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
                    <h4 className="font-black text-xs text-[#FACC15] uppercase tracking-wider mb-1">One small twist</h4>
                    <p className="text-[11px] text-white/80">Never loud, always a little unexpected.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="/admin"
                    className="desi-btn hatke-btn-yellow px-6 py-3 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#111827]" />
                    <span>{lang === 'ml' ? 'അഡ്മിൻ പാനലിലേക്ക് കടക്കുക' : 'Access Admin Dashboard'}</span>
                  </a>
                </div>
              </div>

              {/* Decorative Giant Hatke Watermark Wordmark */}
              <div className="absolute -right-6 -bottom-10 opacity-5 pointer-events-none hidden md:block select-none">
                <span className="text-[180px] font-black text-[#1F5C3A] font-hatke-title leading-none">
                  Hat<span className="hatke-k-tilt text-[#FACC15]">k</span>e
                </span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer
            lang={lang}
            onSelectCategory={(slug) => {
              setSelectedFilterCategory(slug);
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#FACC15] text-[#111827] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] hover:bg-[#EAB308] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black animate-fadeIn"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline font-hatke-body">{lang === 'ml' ? 'മുകളിലേക്ക്' : 'Top'}</span>
        </button>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, q) => handleAddToCart(p, q)}
        onBuyNow={(p, q) => handleBuyNow(p, q)}
        lang={lang}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedDiscount={appliedDiscount}
        onApplyPromo={handleApplyPromo}
        lang={lang}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        products={products}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onRemoveWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
        lang={lang}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedDiscount={appliedDiscount}
        onOrderSuccess={handleOrderSuccess}
        lang={lang}
      />
    </div>
  );
}
