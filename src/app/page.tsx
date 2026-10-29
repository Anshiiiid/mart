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
import { Product, CategoryFolder, CartItem, Order } from '@/lib/types';
import { initialCategories, initialProducts } from '@/lib/seed-data';
import { SlidersHorizontal, Sparkles, Eye, ShieldCheck, ArrowRight, Grid } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryFolder[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  const [only3D, setOnly3D] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [lang, setLang] = useState<'en' | 'ml'>('en');
  const [showInspirationModal, setShowInspirationModal] = useState(false);

  // References for 120fps hardware-accelerated crossfade without React re-render churn
  const navbarRef = useRef<HTMLElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);

  // Load live data from API if available
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.products) setProducts(prodData.products);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.categories) setCategories(catData.categories);
        }
      } catch (err) {
        console.warn('Operating with bundled seed data:', err);
      }
    }
    loadData();

    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('hatke_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      // ignore
    }

    // Check if page was loaded / refreshed already past the hero
    if (typeof window !== 'undefined' && window.scrollY > window.innerHeight * 1.2) {
      if (navbarRef.current) {
        navbarRef.current.style.opacity = '1';
        navbarRef.current.style.pointerEvents = 'auto';
        navbarRef.current.style.transform = 'translateY(0px)';
      }
      if (storeRef.current) {
        storeRef.current.style.opacity = '1';
        storeRef.current.style.pointerEvents = 'auto';
        storeRef.current.style.transform = 'none';
        storeRef.current.style.filter = 'none';
      }
    }
  }, []);

  // Sync cart to localStorage
  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('hatke_cart', JSON.stringify(newCart));
    } catch (e) {
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

  const handleApplyPromo = (code: string) => {
    if (code.trim().toUpperCase() === 'HATKE15') {
      setAppliedDiscount(15);
      return true;
    }
    return false;
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    updateCartState([]);
  };

  // High-performance synchronized crossfade callback from HeroSection
  const handleHeroProgressUpdate = useCallback(
    ({ progress, scrollableDist, scrollY, isExited }: HeroProgressInfo) => {
      const exitStart = 0.80;
      const fade = progress > exitStart ? Math.min(1, (progress - exitStart) / (1 - exitStart)) : 0;
      // Smooth sinusoidal easing
      const easeFade = fade < 0.5 ? 2 * fade * fade : 1 - Math.pow(-2 * fade + 2, 2) / 2;

      // 1. Top Navbar: Always at top: 0, fades in and settles down gently (zero bottom sliding)
      if (navbarRef.current) {
        navbarRef.current.style.opacity = String(easeFade);
        navbarRef.current.style.pointerEvents = easeFade > 0.4 ? 'auto' : 'none';
        navbarRef.current.style.transform = `translateY(${(1 - easeFade) * -16}px)`;
      }

      // 2. Underlying Store Page: Pinned at top: 0 during dissolve so it NEVER slides up from the bottom
      if (storeRef.current) {
        if (progress < 0.02) {
          storeRef.current.style.opacity = '0';
          storeRef.current.style.pointerEvents = 'none';
          storeRef.current.style.transform = 'none';
          storeRef.current.style.filter = 'blur(6px)';
        } else if (progress < exitStart) {
          storeRef.current.style.opacity = '0';
          storeRef.current.style.pointerEvents = 'none';
          storeRef.current.style.transform = 'none';
          storeRef.current.style.filter = 'blur(6px)';
        } else if (!isExited && progress < 0.999) {
          // Inside Dissolve Zone: Pin content at viewport top: 0
          const remainingScroll = Math.max(0, scrollableDist - scrollY);
          storeRef.current.style.opacity = String(easeFade);
          storeRef.current.style.pointerEvents = easeFade > 0.4 ? 'auto' : 'none';
          // Counter-translate to pin at top: 0 while scaling cleanly into focus
          storeRef.current.style.transform = `translateY(-${remainingScroll}px) scale(${0.98 + 0.02 * easeFade})`;
          storeRef.current.style.filter = `blur(${(1 - easeFade) * 5}px)`;
        } else {
          // Fully transitioned into normal store browsing
          storeRef.current.style.opacity = '1';
          storeRef.current.style.pointerEvents = 'auto';
          storeRef.current.style.transform = 'none';
          storeRef.current.style.filter = 'none';
        }
      }
    },
    []
  );

  // Filter and sort products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.nameMl && prod.nameMl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedFilterCategory === 'all' || prod.categorySlug === selectedFilterCategory;

    const matches3D = !only3D || prod.is3dAvailable;

    return matchesSearch && matchesCategory && matches3D;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#FAF4E6] text-[#1E1B18] flex flex-col font-sans">
      {/* Top Navigation Bar - Fixed at top: 0, fades in at top during crossfade */}
      <Navbar
        ref={navbarRef}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'ml' : 'en')}
      />

      <main className="flex-1 relative">
        {/* 1. Fullscreen Hero Section with Scroll-Driven Video Scrubbing and Smooth Dissolve */}
        <HeroSection lang={lang} onProgressUpdate={handleHeroProgressUpdate} />

        {/* 2. Store Content: Begins flush with pt-[112px] so it nests directly under the top fixed Navbar */}
        <div
          ref={storeRef}
          id="store-content"
          className="relative z-20 will-change-transform will-change-opacity pt-[112px]"
          style={{
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Interactive Category Realms (3x3 Grid & Tactile Cyber Folders) */}
          <FolderCategoryNav
            categories={categories}
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            lang={lang}
          />

          {/* 3. Dynamic Showcase & 360-Degree Interactive Turntable */}
          <Interactive3DShowcase
            products={products}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            lang={lang}
          />

          {/* 4. Complete Catalog & Desi Filtering Grid */}
          <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header in Desimart Style */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] text-[#1E1B18] text-xs font-black uppercase tracking-wider mb-2">
                  <Grid className="w-3.5 h-3.5" />
                  <span>{lang === 'ml' ? 'സമ്പൂർണ്ണ കാറ്റലോഗ്' : 'CURATED DESI BAZAAR'}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#1E1B18] font-desi-display lowercase">
                  {lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'discover handcrafted treasures'}
                </h2>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 3D toggle pill */}
                <button
                  onClick={() => setOnly3D(!only3D)}
                  className={`px-3.5 py-2 rounded-full text-xs font-black border-2 border-[#1E1B18] transition-all flex items-center gap-1.5 cursor-pointer ${
                    only3D
                      ? 'bg-[#19857B] text-white shadow-[2px_2px_0px_#1E1B18]'
                      : 'bg-[#FFFDF7] text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#FAF4E6]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>3D Ready Only</span>
                </button>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FFFDF7] border-2 border-[#1E1B18] rounded-full px-4 py-2 text-xs font-black text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured / Artisan Pick</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills in Chunky Desi Style */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
              <button
                onClick={() => setSelectedFilterCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-black border-2 border-[#1E1B18] whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilterCategory === 'all'
                    ? 'bg-[#F15A24] text-white shadow-[3px_3px_0px_#1E1B18]'
                    : 'bg-[#FFFDF7] text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#FAF4E6]'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedFilterCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-black border-2 border-[#1E1B18] whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilterCategory === c.slug
                      ? 'bg-[#F15A24] text-white shadow-[3px_3px_0px_#1E1B18]'
                      : 'bg-[#FFFDF7] text-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] hover:bg-[#FAF4E6]'
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
              <div className="text-center py-24 bg-[#FFFDF7] rounded-3xl border-2 border-dashed border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18]">
                <p className="text-[#1E1B18] font-black text-base">No items match your selected filter or search.</p>
                <button
                  onClick={() => {
                    setSelectedFilterCategory('all');
                    setOnly3D(false);
                    setSearchQuery('');
                  }}
                  className="mt-4 desi-btn desi-btn-marigold text-xs px-5 py-2"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>

          {/* 5. Brand Heritage & Artisan Guild Story Section (Banjara Style from Image 3) */}
          <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-2 border-[#1E1B18]">
            <div className="relative rounded-3xl p-8 sm:p-14 bg-[#FFFDF7] border-3 border-[#1E1B18] shadow-[8px_8px_0px_#1E1B18] overflow-hidden">
              {/* Top Sunburst Rays in Corners */}
              <div className="absolute top-4 left-4 text-[#F15A24] font-black text-xs font-mono">
                ✹ ✹ ✹
              </div>
              <div className="absolute top-4 right-4 text-[#F15A24] font-black text-xs font-mono">
                ✹ ✹ ✹
              </div>

              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] text-[#1E1B18] text-xs font-black mb-4 shadow-[2px_2px_0px_#1E1B18]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8331E]" />
                  <span>{lang === 'ml' ? 'ബ്രാൻഡ് വിഷൻ & പാരമ്പര്യം' : 'HANDCRAFTED LIFESTYLE & PHILOSOPHY'}</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black font-desi-display text-[#1E1B18] lowercase mb-6 leading-tight">
                  {lang === 'ml'
                    ? 'പരമ്പരാഗത കലയെ ഭാവി സാങ്കേതികതയുമായി ബന്ധിപ്പിക്കുന്നു'
                    : 'handcrafted lifestyle with authentic indian soul'}
                </h2>
                <p className="text-sm sm:text-base text-[#1E1B18]/80 font-medium leading-relaxed mb-8">
                  {lang === 'ml'
                    ? 'നമ്മുടെ പരമ്പരാഗത കരകൗശല വിദഗ്ദ്ധരുടെ അറിവും ആധുനിക എഞ്ചിനീയറിംഗും ഒന്നിക്കുന്ന ഇടം. തനിമ ചോർന്നുപോകാതെ അടുത്ത തലമുറയിലേക്ക് എത്തിക്കുന്ന ഒരു ന്യൂ-ഏജ് ഷോപ്പിംഗ് അനുഭവം.'
                    : 'Every piece at Hatke Haat carries a lineage of centuries-old metal smithing, natural clay pottery, Athangudi floor tiles, and sacred geometry, curated into a modern Desimart.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/admin"
                    className="desi-btn desi-btn-marigold px-6 py-3 text-xs uppercase tracking-wider"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>{lang === 'ml' ? 'അഡ്മിൻ പാനലിലേക്ക് കടക്കുക' : 'Access Admin Dashboard'}</span>
                  </a>
                </div>
              </div>

              {/* Background 8-Petal Marigold Chakra Emblem (Reference Image 3) */}
              <div className="absolute -right-12 -bottom-12 w-80 h-80 opacity-10 pointer-events-none hidden md:block">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-[#F15A24] animate-spin-slow">
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
            </div>
          </section>

          {/* Footer */}
          <Footer lang={lang} />
        </div>
      </main>

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

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedDiscount={appliedDiscount}
        onOrderSuccess={handleOrderSuccess}
        lang={lang}
      />

      {/* Source Inspiration Reference Modal */}
      {showInspirationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-md w-full bg-[#141026] rounded-2xl border-2 border-amber-500/40 p-4 text-center">
            <button
              onClick={() => setShowInspirationModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold text-white mb-2">Source 9-Category Grid Reference</h3>
            <p className="text-xs text-slate-400 mb-4">
              All 9 items from your reference image are live in our Category Folders.
            </p>
            <div className="rounded-xl overflow-hidden border border-slate-700 bg-black">
              <img
                src="/categories-grid.jpeg"
                alt="Source grid reference"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
