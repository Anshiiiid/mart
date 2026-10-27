'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FolderCategoryNav from '@/components/FolderCategoryNav';
import Interactive3DShowcase from '@/components/Interactive3DShowcase';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';
import { Product, CategoryFolder, CartItem, Order } from '@/lib/types';
import { initialCategories, initialProducts } from '@/lib/seed-data';
import { SlidersHorizontal, Sparkles, Eye, ShieldCheck, ArrowRight, Grid, Image as ImageIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-[#09070F] text-slate-100 flex flex-col">
      <main className="flex-1">
        {/* 1. Fullscreen Hero Section with Scroll-Driven Video Scrubbing and Smooth Exit (True 100vw x 100vh) */}
        <HeroSection lang={lang} />

        {/* Top Navigation Bar - Sticky from Category Section onwards for full e-commerce shopping */}
        <Navbar
          cart={cart}
          onOpenCart={() => setIsCartOpen(true)}
          onSearch={setSearchQuery}
          lang={lang}
          onToggleLang={() => setLang(lang === 'en' ? 'ml' : 'en')}
        />

        {/* 2. Interactive Category Realms (3x3 Grid & Tactile Cyber Folders) */}
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

        {/* 4. Complete Catalog & Cyber-Traditional Filtering Grid */}
        <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <Grid className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'സമ്പൂർണ്ണ കാറ്റലോഗ്' : 'CURATED COLLECTION'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
                {lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Discover Neo-Heritage Products'}
              </h2>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 3D toggle pill */}
              <button
                onClick={() => setOnly3D(!only3D)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  only3D
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D Ready Only</span>
              </button>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                <option value="featured">Featured / Artisan Pick</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            <button
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilterCategory === 'all'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedFilterCategory(c.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedFilterCategory === c.slug
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
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
            <div className="text-center py-24 glass-panel rounded-2xl border border-dashed border-amber-500/20">
              <p className="text-slate-300 font-medium">No items match your selected filter or search.</p>
              <button
                onClick={() => {
                  setSelectedFilterCategory('all');
                  setOnly3D(false);
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* 5. Brand Heritage & Artisan Guild Story Section */}
        <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-amber-500/15">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-[#17112C] via-[#0E0B1B] to-[#120F26] border border-amber-500/30">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'ബ്രാൻഡ് വിഷൻ & പാരമ്പര്യം' : 'THE PHILOSOPHY OF HATKE HAAT'}</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-serif text-white mb-6 leading-tight">
                {lang === 'ml'
                  ? 'പരമ്പരാഗത കലയെ ഭാവി സാങ്കേതികതയുമായി ബന്ധിപ്പിക്കുന്നു'
                  : 'Bridging Ancient Vedic Mastery With Cyber Precision'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                {lang === 'ml'
                  ? 'നമ്മുടെ പരമ്പരാഗത കരകൗശല വിദഗ്ദ്ധരുടെ അറിവും ആധുനിക എഞ്ചിനീയറിംഗും ഒന്നിക്കുന്ന ഇടം. തനിമ ചോർന്നുപോകാതെ അടുത്ത തലമുറയിലേക്ക് എത്തിക്കുന്ന ഒരു ന്യൂ-ഏജ് ഷോപ്പിംഗ് അനുഭവം.'
                  : 'Every item at Hatke Haat carries a lineage of centuries-old metal smithing, natural clay pottery, and sacred geometry, augmented by smart electronics, high-speed microcontrollers, and modern ergonomics.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/admin"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'ml' ? 'അഡ്മിൻ പാനലിലേക്ക് കടക്കുക' : 'Access Admin Dashboard'}</span>
                </a>
              </div>
            </div>

            {/* Background Decorative Mandala Accent */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-15 pointer-events-none hidden md:block">
              <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#F59E0B" strokeWidth="1" />
                <circle cx="100" cy="100" r="70" fill="none" stroke="#F59E0B" strokeWidth="0.8" />
                {Array.from({ length: 16 }).map((_, i) => (
                  <polygon
                    key={i}
                    points="100,20 105,40 100,45 95,40"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="0.6"
                    transform={`rotate(${i * 22.5} 100 100)`}
                  />
                ))}
              </svg>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer lang={lang} />

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
