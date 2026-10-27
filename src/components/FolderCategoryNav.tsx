'use client';

import React, { useState } from 'react';
import { CategoryFolder, Product } from '@/lib/types';
import {
  Zap,
  Headphones,
  UtensilsCrossed,
  Keyboard,
  Lamp,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  Droplets,
  FolderOpen,
  Folder,
  ArrowRight,
  Eye,
  Plus,
  Star,
  Check,
  Grid3X3,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface FolderCategoryNavProps {
  categories: CategoryFolder[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  lang: 'en' | 'ml';
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Headphones,
  UtensilsCrossed,
  Keyboard,
  Lamp,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  Droplets,
};

// 3x3 Grid category mapping that directly matches the reference image
const categoryGridMeta: Record<
  string,
  {
    iconDesc: string;
    iconDescMl: string;
    sampleImg: string;
    tagline: string;
  }
> = {
  'kitchen-cookware': {
    iconDesc: 'Cast Iron Pan + Brass Kettle',
    iconDescMl: 'ഇരുമ്പ് ചീനച്ചട്ടി & പിച്ചള കെറ്റിൽ',
    sampleImg: '/products/cookware.jpg',
    tagline: 'Heirloom Vedic Cooking',
  },
  'home-appliances': {
    iconDesc: 'Smart Air Fryer + Ovens',
    iconDescMl: 'സ്മാർട്ട് എയർ ഫ്രയർ & ഓവൻ',
    sampleImg: '/products/airfryer.jpg',
    tagline: 'Next-Gen Cyber Kitchen',
  },
  'cyber-audio': {
    iconDesc: 'ANC Headphones + Resonant Speaker',
    iconDescMl: 'ഹെഡ്‌ഫോൺ & ബ്ലൂടൂത്ത് സ്പീക്കർ',
    sampleImg: '/products/headphones.jpg',
    tagline: 'Lossless Cyber Acoustics',
  },
  'computing-workspace': {
    iconDesc: 'Mechanical Keyboard + Wireless Mouse',
    iconDescMl: 'മെക്കാനിക്കൽ കീബോർഡ് & മൗസ്',
    sampleImg: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    tagline: 'Ergonomic Teak & CNC Desk',
  },
  'ambient-living': {
    iconDesc: 'Terracotta Lamp + Bamboo Basket',
    iconDescMl: 'മൺചിരാത് ലാമ്പ് & വട്ടി',
    sampleImg: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    tagline: 'Warm Organic Illumination',
  },
  'personal-care': {
    iconDesc: 'Ionic Hair Dryer + Neem Comb + Elixir',
    iconDescMl: 'ഹെയർ ഡ്രയർ & വേപ്പ് ചീപ്പ്',
    sampleImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    tagline: 'Ayurvedic Grooming Rituals',
  },
  'kids-nursery': {
    iconDesc: 'Organic Plush Bear + Lacquer Bottle',
    iconDescMl: 'ഓർഗാനിക് ടെഡ്ഡി & കുപ്പികൾ',
    sampleImg: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    tagline: 'Safe GI Channapatna Toys',
  },
  'smart-mobility': {
    iconDesc: 'Cordless Mini Vacuum + Smart Helmet',
    iconDescMl: 'കോർഡ്‌ലെസ് വാക്വം & ഹെൽമെറ്റ്',
    sampleImg: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80',
    tagline: 'Clean Tech & Everyday Utility',
  },
  'modern-sanitation': {
    iconDesc: 'Spin Mop Bucket + Eco Spray',
    iconDescMl: 'സ്പിൻ മോപ്പ് & സാനിറ്റേഷൻ',
    sampleImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    tagline: 'Dual-Chamber Microfiber Care',
  },
};

export default function FolderCategoryNav({
  categories,
  products,
  onSelectProduct,
  onAddToCart,
  lang,
}: FolderCategoryNavProps) {
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug || 'kitchen-cookware');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'matrix' | 'tabs'>('both');

  // Order categories to strictly reflect the 3x3 reference image:
  // Row 1: Cookware, Appliances, Audio
  // Row 2: Workspace, Living/Lamp, Personal Care
  // Row 3: Kids/Toy, Utility/Vacuum, Sanitation/Mop
  const gridOrder = [
    'kitchen-cookware',
    'home-appliances',
    'cyber-audio',
    'computing-workspace',
    'ambient-living',
    'personal-care',
    'kids-nursery',
    'smart-mobility',
    'modern-sanitation',
  ];

  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = gridOrder.indexOf(a.slug);
    const idxB = gridOrder.indexOf(b.slug);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  const activeCategory = sortedCategories.find((c) => c.slug === activeSlug) || sortedCategories[0];
  const categoryProducts = products.filter((p) => p.categorySlug === activeSlug);

  const handleSelectCategory = (slug: string) => {
    setActiveSlug(slug);
    // Smooth scroll into open folder
    const folderEl = document.getElementById('open-folder-container');
    if (folderEl) {
      folderEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="categories" className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
      {/* Smooth Entrance Arch from Hero Video Fade */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4">
          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ml' ? '9 കാറ്റഗറി മാട്രിക്സ്' : 'THE 9 SACRED CRAFT REALMS'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-serif mb-4 leading-tight">
          <span className="block">{lang === 'ml' ? 'കാറ്റഗറി സെക്ഷൻ' : 'Explore Category Realms'}</span>
          <span className="gold-gradient-text text-2xl sm:text-4xl block mt-1">
            {lang === 'ml' ? '9 വിഭാഗങ്ങൾ • ക്ലിക്ക് ചെയ്ത് തുറക്കുക' : 'Visual 3×3 Matrix & Tactile Folder Vault'}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {lang === 'ml'
            ? 'റഫറൻസ് ചിത്രത്തിലെ എല്ലാ 9 വിഭാഗങ്ങളും ഇവിടെ ക്രമീകരിച്ചിരിക്കുന്നു. താഴെയുള്ള കാർഡുകളിൽ ക്ലിക്ക് ചെയ്താൽ ബന്ധപ്പെട്ട ഫോൾഡർ വിരിഞ്ഞ് ഉൽപ്പന്നങ്ങൾ കാണാം.'
            : 'Mapped directly to the 9-category craft matrix. Click any category card to slide open its live tactile folder and inspect artisan inventory.'}
        </p>

        {/* View Mode Switcher Pills */}
        <div className="inline-flex items-center gap-1 p-1 mt-6 rounded-xl bg-slate-900/90 border border-amber-500/20 text-xs">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'both' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Matrix + Folders</span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'matrix' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>3×3 Grid Only</span>
          </button>
          <button
            onClick={() => setViewMode('tabs')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'tabs' ? 'bg-amber-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Folder Tabs Only</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. VISUAL 3x3 CATEGORY MATRIX (DIRECTLY MIRRORING REFERENCE) */}
      {/* ============================================================ */}
      {(viewMode === 'both' || viewMode === 'matrix') && (
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                {lang === 'ml' ? '3×3 വിഷ്വൽ ഗ്രിഡ്' : 'Interactive 3×3 Category Grid'}
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              9 {lang === 'ml' ? 'വിഭാഗങ്ങൾ' : 'Realms Active'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedCategories.map((cat, idx) => {
              const IconComp = iconMap[cat.iconName] || Folder;
              const isActive = cat.slug === activeSlug;
              const meta = categoryGridMeta[cat.slug] || {
                iconDesc: cat.name,
                iconDescMl: cat.nameMl,
                sampleImg: cat.bannerImage || '/products/cookware.jpg',
                tagline: 'Artisanal Craft',
              };

              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={`group relative rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer overflow-hidden border ${
                    isActive
                      ? 'bg-gradient-to-br from-[#241A3E] via-[#161228] to-[#0E0B19] border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.35)] scale-[1.02]'
                      : 'bg-[#120E22]/80 hover:bg-[#1A1430] border-amber-500/20 hover:border-amber-400/60 shadow-lg'
                  }`}
                >
                  {/* Top Realm Badge & Number */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                      REALM 0{idx + 1}
                    </span>
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold tracking-wider ${
                        isActive
                          ? 'bg-amber-400 text-black font-black'
                          : 'bg-black/60 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  {/* Thumbnail & Title Container */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/50 border border-amber-500/30 shrink-0">
                      <img
                        src={meta.sampleImg}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1 right-1 p-1 rounded-md bg-black/70 text-amber-400">
                        <IconComp className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-base sm:text-lg font-bold truncate transition-colors ${
                          isActive ? 'text-amber-300' : 'text-white group-hover:text-amber-200'
                        }`}
                      >
                        {lang === 'ml' ? cat.nameMl : cat.name}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-medium truncate mt-0.5">
                        {lang === 'ml' ? meta.iconDescMl : meta.iconDesc}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {meta.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer Strip */}
                  <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {products.filter((p) => p.categorySlug === cat.slug).length} Units Ready
                    </span>
                    <span
                      className={`font-bold flex items-center gap-1 transition-all ${
                        isActive ? 'text-amber-300 translate-x-1' : 'text-slate-400 group-hover:text-amber-300'
                      }`}
                    >
                      <span>{isActive ? 'Folder Active' : 'Open Vault'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Glowing Bottom Accent */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: cat.color }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. TACTILE CYBER FOLDER TABS & VAULT CONTAINER               */}
      {/* ============================================================ */}
      {(viewMode === 'both' || viewMode === 'tabs') && (
        <div id="open-folder-container" className="relative pt-6">
          {/* Horizontal Scrollable Tabs Strip */}
          <div className="flex items-end gap-1.5 sm:gap-2 overflow-x-auto pb-0 px-2 scrollbar-none border-b-2 border-amber-500/40">
            {sortedCategories.map((cat, idx) => {
              const IconComponent = iconMap[cat.iconName] || Folder;
              const isActive = cat.slug === activeSlug;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveSlug(cat.slug)}
                  className={`relative group flex items-center gap-2 px-3 sm:px-5 py-3 sm:py-3.5 transition-all duration-300 whitespace-nowrap cursor-pointer select-none rounded-t-xl font-medium ${
                    isActive
                      ? 'bg-gradient-to-b from-[#1E1736] to-[#120F22] text-white border-t-2 border-x-2 border-amber-400 shadow-[0_-8px_20px_rgba(245,158,11,0.2)] z-10 translate-y-[2px]'
                      : 'bg-[#0E0B19]/90 text-slate-400 hover:text-slate-200 hover:bg-[#161228] border-t border-x border-slate-800'
                  }`}
                  style={{
                    borderTopColor: isActive ? cat.color : undefined,
                  }}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'scale-125 animate-pulse' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: cat.color }}
                  />

                  <IconComponent
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  />

                  <div className="flex flex-col text-left">
                    <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {lang === 'ml' ? cat.nameMl : cat.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                      Tab #{idx + 1}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* OPEN FOLDER BODY CONTAINER */}
          <div
            className="w-full rounded-b-2xl rounded-tr-2xl p-6 sm:p-8 border-2 border-t-0 border-amber-400/50 bg-gradient-to-b from-[#120F22] via-[#0E0B1B] to-[#080612] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500"
          >
            {/* Subtle Cyber Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

            {/* Folder Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-amber-500/20 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeCategory?.color || '#F59E0B' }}
                  />
                  <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-bold">
                    {lang === 'ml' ? 'തുറന്ന കാറ്റഗറി ഫോൾഡർ' : 'ACTIVE FOLDER INVENTORY'}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">
                    {categoryProducts.length} {lang === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ' : 'Craft Units Available'}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-white font-serif">
                  {lang === 'ml' ? activeCategory?.nameMl : activeCategory?.name}
                </h3>
                <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  {activeCategory?.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#products"
                  className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <span>{lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Full Catalog'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Category Products Grid */}
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group relative rounded-xl bg-[#17122B]/80 border border-amber-500/20 hover:border-amber-400/80 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                  >
                    {/* Card Media Preview */}
                    <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#17122B] via-transparent to-transparent opacity-70" />

                      {product.is3dAvailable && (
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-[10px] font-black tracking-wider flex items-center gap-1 shadow-md">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>360° VIEW</span>
                        </div>
                      )}

                      {product.traditionalArtTag && (
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-950/90 border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                          {product.traditionalArtTag}
                        </div>
                      )}

                      {product.discountPercent ? (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-black">
                          -{product.discountPercent}%
                        </div>
                      ) : null}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-amber-400 mb-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-xs font-bold text-white">{product.rating}</span>
                          <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-amber-400">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-slate-500 line-through">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold">
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
                            addedId === product.id
                              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                              : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          }`}
                          title="Add to Cart"
                        >
                          {addedId === product.id ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Plus className="w-4 h-4 stroke-[3]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#161226]/50 rounded-xl border border-dashed border-amber-500/20">
                <Folder className="w-10 h-10 text-amber-400/50 mx-auto mb-2" />
                <p className="text-slate-300 font-medium">
                  {lang === 'ml' ? 'ഈ ഫോൾഡറിൽ നിലവിൽ ഉൽപ്പന്നങ്ങൾ ചേർക്കുകയാണ്.' : 'Stocking new artisan units for this folder.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
