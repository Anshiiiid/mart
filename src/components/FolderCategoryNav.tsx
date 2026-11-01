'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CategoryFolder, Product } from '@/lib/types';
import AthangudiTileBanner from '@/components/AthangudiTileBanner';
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
  Stamp,
} from 'lucide-react';

interface FolderCategoryNavProps {
  categories: CategoryFolder[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onFilterCatalog?: (slug: string) => void;
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

// 3x3 Grid Category Mapping in Green, Yellow, White & Black Theme
const categoryGridMeta: Record<
  string,
  {
    iconDesc: string;
    iconDescMl: string;
    sampleImg: string;
    tagline: string;
    taglineMl: string;
    stampPrice: string;
    postmark: string;
    tintBg: string;
    accentColor: string;
  }
> = {
  'kitchen-cookware': {
    iconDesc: 'Cast Iron Pan + Spice Box',
    iconDescMl: 'ഇരുമ്പ് ചീനച്ചട്ടി & മസാലപ്പെട്ടി',
    sampleImg: '/categories/kitchen-cookware.jpg',
    tagline: '7 Clever Kitchen Finds',
    taglineMl: 'പാരമ്പര്യ പാചക ഉപകരണങ്ങൾ',
    stampPrice: '01',
    postmark: 'KITCHEN • AISLE',
    tintBg: '#FFFFFF',
    accentColor: '#1F5C3A',
  },
  'home-appliances': {
    iconDesc: 'Smart Air Fryer + Ovens',
    iconDescMl: 'സ്മാർട്ട് എയർ ഫ്രയർ & ഓവൻ',
    sampleImg: '/categories/home-appliances.jpg',
    tagline: 'Desi at Heart Utility',
    taglineMl: 'ആധുനിക കിച്ചൻ ഗാഡ്‌ജറ്റുകൾ',
    stampPrice: '02',
    postmark: 'APPLIANCE • AISLE',
    tintBg: '#FEF08A', // Yellow tint
    accentColor: '#FACC15',
  },
  'cyber-audio': {
    iconDesc: 'ANC Headphones + Resonant Speaker',
    iconDescMl: 'ഹെഡ്‌ഫോൺ & ബ്ലൂടൂത്ത് സ്പീക്കർ',
    sampleImg: '/categories/cyber-audio.jpg',
    tagline: 'Clean Everyday Sound',
    taglineMl: 'വ്യക്തമായ ശബ്ദാനുഭവം',
    stampPrice: '03',
    postmark: 'AUDIO • AISLE',
    tintBg: '#FFFFFF',
    accentColor: '#1F5C3A',
  },
  'computing-workspace': {
    iconDesc: 'Mechanical Keyboard + Wireless Mouse',
    iconDescMl: 'മെക്കാനിക്കൽ കീബോർഡ് & മൗസ്',
    sampleImg: '/categories/computing-workspace.jpg',
    tagline: 'Ergonomic Teak & Clean Tech',
    taglineMl: 'വർക്ക്‌സ്‌പേസ് ഉപകരണങ്ങൾ',
    stampPrice: '04',
    postmark: 'DESK • AISLE',
    tintBg: '#FAF9F6',
    accentColor: '#1F5C3A',
  },
  'ambient-living': {
    iconDesc: 'Terracotta Lamp + Bamboo Basket',
    iconDescMl: 'മൺചിരാത് ലാമ്പ് & വട്ടി',
    sampleImg: '/categories/ambient-living.jpg',
    tagline: 'Warm Organic Illumination',
    taglineMl: 'മനോഹരമായ വീട്ടുപകരണങ്ങൾ',
    stampPrice: '05',
    postmark: 'HOME • AISLE',
    tintBg: '#FEF08A',
    accentColor: '#FACC15',
  },
  'personal-care': {
    iconDesc: 'Ionic Hair Dryer + Neem Comb',
    iconDescMl: 'ഹെയർ ഡ്രയർ & വേപ്പ് ചീപ്പ്',
    sampleImg: '/categories/personal-care.jpg',
    tagline: 'Everyday Grooming Rituals',
    taglineMl: 'സൗന്ദര്യ സംരക്ഷണ സാമഗ്രികൾ',
    stampPrice: '06',
    postmark: 'BEAUTY • AISLE',
    tintBg: '#FFFFFF',
    accentColor: '#1F5C3A',
  },
  'kids-nursery': {
    iconDesc: 'Organic Plush Bear + Lacquer Bottle',
    iconDescMl: 'ഓർഗാനിക് ടെഡ്ഡി & കുപ്പികൾ',
    sampleImg: '/categories/kids-nursery.jpg',
    tagline: 'Safe Channapatna Toys',
    taglineMl: 'സുരക്ഷിത കളിപ്പാട്ടങ്ങൾ',
    stampPrice: '07',
    postmark: 'KIDS • AISLE',
    tintBg: '#FAF9F6',
    accentColor: '#1F5C3A',
  },
  'smart-mobility': {
    iconDesc: 'Cordless Mini Vacuum + Auto Find',
    iconDescMl: 'കോർഡ്‌ലെസ് വാക്വം & കാർ കെയർ',
    sampleImg: '/categories/smart-mobility.jpg',
    tagline: 'Car, Bike & Travel Finds',
    taglineMl: 'സ്മാർട്ട് ക്ലീനിംഗ് & റൈഡിംഗ്',
    stampPrice: '08',
    postmark: 'AUTO • AISLE',
    tintBg: '#FEF08A',
    accentColor: '#FACC15',
  },
  'modern-sanitation': {
    iconDesc: 'Spin Mop Bucket + Eco Spray',
    iconDescMl: 'സ്പിൻ മോപ്പ് & സാനിറ്റേഷൻ',
    sampleImg: '/categories/modern-sanitation.jpg',
    tagline: 'Clever Cleaning Tools',
    taglineMl: 'വീട് വൃത്തിയാക്കൽ സഹായികൾ',
    stampPrice: '09',
    postmark: 'CLEAN • AISLE',
    tintBg: '#FFFFFF',
    accentColor: '#1F5C3A',
  },
};

export default function FolderCategoryNav({
  categories,
  products,
  onSelectProduct,
  onAddToCart,
  onFilterCatalog,
  lang,
}: FolderCategoryNavProps) {
  const [activeSlug, setActiveSlug] = useState<string>(categories[0]?.slug || 'kitchen-cookware');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'matrix' | 'tabs'>('both');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <section
      ref={sectionRef}
      id="categories"
      className="relative py-16 sm:py-24 bg-[#FAF9F6] text-[#111827] z-20 border-b-2 border-[#111827] scroll-mt-24"
    >
      {/* Hatke Everyday Motifs Ribbon across top */}
      <div className="absolute top-0 left-0 right-0">
        <AthangudiTileBanner height={32} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-hatke-body">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Aisle Badge in Yellow & Green */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15] border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] text-[#111827] text-xs font-black uppercase tracking-wider mb-4">
            <Grid3X3 className="w-4 h-4 text-[#1F5C3A]" />
            <span>{lang === 'ml' ? 'ഐലുകൾ വഴി തിരയുക' : 'SHOP BY AISLE • EVERYDAY FINDS'}</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-[#111827] font-hatke-title mb-3 tracking-tight">
            <span>{lang === 'ml' ? 'ഒരു ടൈൽ, ഒരു വിഭവം' : 'Everyday things, one tile each.'}</span>
          </h2>

          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-0.5 w-16 bg-[#1F5C3A]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F5C3A]">
              {lang === 'ml' ? 'ഹാപ്പി ഫൈൻഡ്സ് • ഹട്കെ സ്റ്റോർ' : 'USEFUL FIRST • DESI AT HEART'}
            </span>
            <div className="h-0.5 w-16 bg-[#1F5C3A]" />
          </div>

          <p className="text-sm sm:text-base font-medium text-[#111827]/80 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ml'
              ? 'ദൈനംദിന പ്രശ്നങ്ങൾ പരിഹരിക്കുന്ന ചെറിയ ചെറിയ കണ്ടെത്തലുകൾ: അടുക്കള, ഡെസ്ക്, വാഹനം, കുട്ടികൾ. ഓരോ ഐലിലും അല്പം വ്യത്യസ്തമായ കണ്ടെത്തലുകൾ.'
              : 'Every find solves a small daily problem: kitchen, desk, car, kids. Flat simple shapes with one small twist.'}
          </p>

          {/* View Mode Switcher Pills */}
          <div className="inline-flex items-center gap-2 p-1.5 mt-6 rounded-full bg-[#FFFFFF] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] text-xs">
            <button
              onClick={() => setViewMode('both')}
              className={`px-4 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-[#FACC15] text-[#111827] shadow-[1px_1px_0px_#111827]'
                  : 'text-[#111827] hover:bg-[#FAF9F6]'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5 text-[#1F5C3A]" />
              <span>Aisle Grid + Vault</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#FACC15] text-[#111827] shadow-[1px_1px_0px_#111827]'
                  : 'text-[#111827] hover:bg-[#FAF9F6]'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5 text-[#1F5C3A]" />
              <span>Aisles Only</span>
            </button>
            <button
              onClick={() => setViewMode('tabs')}
              className={`px-4 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'tabs'
                  ? 'bg-[#FACC15] text-[#111827] shadow-[1px_1px_0px_#111827]'
                  : 'text-[#111827] hover:bg-[#FAF9F6]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#1F5C3A]" />
              <span>Aisle Tabs Only</span>
            </button>
          </div>
        </div>

        {/* 1. VISUAL 3x3 CATEGORY POSTAGE STAMP MATRIX */}
        {(viewMode === 'both' || viewMode === 'matrix') && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FACC15] animate-ping" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#111827]">
                  {lang === 'ml' ? '3×3 കാറ്റഗറി ഐലുകൾ' : 'Shop By Aisle (9 Curated Zones)'}
                </span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFFFFF] border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
                9 {lang === 'ml' ? 'വിഭാഗങ്ങൾ' : 'Aisles In Stock'}
              </span>
            </div>

            {/* 3x3 Stamp Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {sortedCategories.map((cat) => {
                const IconComp = iconMap[cat.iconName] || Folder;
                const isActive = cat.slug === activeSlug;
                const meta = categoryGridMeta[cat.slug] || {
                  iconDesc: cat.name,
                  iconDescMl: cat.nameMl,
                  sampleImg: `/categories/${cat.slug}.jpg`,
                  tagline: 'Curated find',
                  taglineMl: 'ഹട്കെ കണ്ടെത്തൽ',
                  stampPrice: '01',
                  postmark: 'HATKE • AISLE',
                  tintBg: '#FFFFFF',
                  accentColor: '#1F5C3A',
                };

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-[#111827] flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#FFFFFF] shadow-[6px_6px_0px_#111827] scale-[1.02] ring-4 ring-[#1F5C3A]/25'
                        : 'bg-[#FFFFFF] hover:bg-[#FFFFFF] shadow-[3px_3px_0px_#111827] hover:shadow-[5px_5px_0px_#111827] hover:-translate-y-1'
                    }`}
                    style={{
                      backgroundColor: meta.tintBg,
                    }}
                  >
                    {/* Perforated Inner Frame */}
                    <div className="absolute inset-2 border-2 border-dashed border-[#111827]/25 rounded-xl pointer-events-none" />

                    {/* Top Stamp Header */}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="w-7 h-7 rounded-lg bg-[#111827] text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                          {meta.stampPrice}
                        </span>
                        <span className="text-[10px] font-mono font-bold tracking-wider text-[#111827]/75 uppercase">
                          {meta.postmark}
                        </span>
                      </div>

                      <span
                        className="text-[10px] uppercase px-2.5 py-0.5 rounded-full font-black border-2 border-[#111827] shadow-[1.5px_1.5px_0px_#111827]"
                        style={{
                          backgroundColor: isActive ? '#FACC15' : '#1F5C3A',
                          color: isActive ? '#111827' : '#FFFFFF',
                        }}
                      >
                        {cat.badge}
                      </span>
                    </div>

                    {/* Center Studio Product Visual */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border-2 border-[#111827] p-4 flex items-center justify-center shadow-inner group-hover:shadow-md transition-all duration-300 mb-4">
                      <img
                        src={meta.sampleImg}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-sm"
                        loading="lazy"
                      />

                      {/* Hatke 9° tilted seal */}
                      <div className="absolute top-2 right-2 border-2 border-[#1F5C3A]/50 text-[#1F5C3A] rounded-full w-10 h-10 flex items-center justify-center text-[7px] font-mono font-black uppercase text-center hatke-tilt-neg9 pointer-events-none">
                        HATKE<br />FIND
                      </div>

                      {/* Active Indicator Icon */}
                      <div
                        className="absolute bottom-2 left-2 p-1.5 rounded-lg border border-[#111827] text-white shadow-xs"
                        style={{ backgroundColor: meta.accentColor }}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Category Details */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg sm:text-xl font-black text-[#111827] font-hatke-title group-hover:text-[#1F5C3A] transition-colors">
                            {lang === 'ml' ? cat.nameMl : cat.name}
                          </h3>
                        </div>
                        <p className="text-xs font-bold text-[#1F5C3A] mt-0.5 truncate">
                          {lang === 'ml' ? meta.iconDescMl : meta.iconDesc}
                        </p>
                        <p className="text-[11px] text-[#111827]/75 font-medium truncate mt-0.5">
                          {lang === 'ml' ? meta.taglineMl : meta.tagline}
                        </p>
                      </div>

                      {/* Bottom Action Strip */}
                      <div className="mt-4 pt-3 border-t border-[#111827]/20 flex items-center justify-between text-xs">
                        <span className="font-bold text-[11px] text-[#111827]/80">
                          {products.filter((p) => p.categorySlug === cat.slug).length} Finds
                        </span>

                        <span
                          className={`font-black flex items-center gap-1 px-3 py-1 rounded-full border-2 border-[#111827] shadow-[1.5px_1.5px_0px_#111827] text-xs transition-all ${
                            isActive
                              ? 'bg-[#FACC15] text-[#111827]'
                              : 'bg-[#FFFFFF] text-[#111827] group-hover:bg-[#FACC15]'
                          }`}
                        >
                          <span>{isActive ? (lang === 'ml' ? 'തുറന്നിരിക്കുന്നു' : 'Open') : (lang === 'ml' ? 'കാണുക' : 'Inspect')}</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TACTILE FOLDER TABS & VAULT CONTAINER */}
        {(viewMode === 'both' || viewMode === 'tabs') && (
          <div id="open-folder-container" className="relative pt-6">
            {/* Horizontal Scrollable Tabs Strip */}
            <div className="flex items-end gap-1.5 sm:gap-2 overflow-x-auto pb-0 px-2 scrollbar-none border-b-2 border-[#111827]">
              {sortedCategories.map((cat, idx) => {
                const IconComponent = iconMap[cat.iconName] || Folder;
                const isActive = cat.slug === activeSlug;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSlug(cat.slug)}
                    className={`relative group flex items-center gap-2 px-3.5 sm:px-5 py-3 transition-all duration-200 whitespace-nowrap cursor-pointer select-none rounded-t-2xl font-bold border-t-2 border-x-2 border-[#111827] ${
                      isActive
                        ? 'bg-[#FFFFFF] text-[#111827] shadow-[0_-3px_0px_rgba(17,24,39,0.1)] z-10 translate-y-[2px]'
                        : 'bg-[#FAF9F6] text-[#111827]/70 hover:bg-[#FFFFFF] hover:text-[#111827]'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border border-[#111827] ${
                        isActive ? 'scale-125' : 'opacity-60'
                      }`}
                      style={{ backgroundColor: cat.color }}
                    />

                    <IconComponent className="w-4 h-4 text-[#1F5C3A]" />

                    <div className="flex flex-col text-left">
                      <span className="text-xs sm:text-sm font-black font-hatke-title">
                        {lang === 'ml' ? cat.nameMl : cat.name}
                      </span>
                      <span className="text-[10px] text-[#111827]/60 hidden sm:inline">
                        Aisle #{idx + 1}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black border border-[#111827] ${
                        isActive ? 'bg-[#FACC15] text-[#111827]' : 'bg-white text-[#111827]'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* OPEN FOLDER BODY CONTAINER */}
            <div className="w-full rounded-b-3xl rounded-tr-3xl p-6 sm:p-8 border-2 border-t-0 border-[#111827] bg-[#FFFFFF] shadow-[5px_5px_0px_#111827] relative overflow-hidden">
              {/* Folder Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-dashed border-[#111827]/20 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#111827]"
                      style={{ backgroundColor: activeCategory?.color || '#1F5C3A' }}
                    />
                    <span className="text-xs uppercase tracking-wider font-hatke-body text-[#1F5C3A] font-black">
                      {lang === 'ml' ? 'തുറന്ന ഐൽ' : 'ACTIVE AISLE VAULT'}
                    </span>
                    <span className="text-xs text-[#111827]/40">•</span>
                    <span className="text-xs font-bold text-[#111827]">
                      {categoryProducts.length} {lang === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ' : 'Clever Finds In Stock'}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-[#111827] font-hatke-title">
                    {lang === 'ml' ? activeCategory?.nameMl : activeCategory?.name}
                  </h3>
                  <p className="text-sm text-[#111827]/80 max-w-2xl mt-1 leading-relaxed font-medium">
                    {activeCategory?.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onFilterCatalog) onFilterCatalog(activeSlug);
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="desi-btn hatke-btn-yellow text-xs px-4 py-2 cursor-pointer"
                  >
                    <span>{lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Explore All Items'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Category Products Grid */}
              {categoryProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                  {categoryProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="group relative rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] hover:shadow-[4px_4px_0px_#111827] hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
                    >
                      {/* Card Media Preview */}
                      <div className="relative aspect-square w-full overflow-hidden bg-white border-b-2 border-[#111827] p-3 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                          loading="lazy"
                        />

                        {product.is3dAvailable && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#1F5C3A] text-white border border-[#111827] text-[10px] font-black tracking-wider flex items-center gap-1 shadow-xs">
                            <Eye className="w-3 h-3 text-[#FACC15]" />
                            <span>360° VIEW</span>
                          </div>
                        )}

                        {product.discountPercent ? (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#FACC15] text-[#111827] text-[10px] font-black border border-[#111827] shadow-xs hatke-badge-tilt">
                            -{product.discountPercent}%
                          </div>
                        ) : null}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-[#FACC15] mb-1.5">
                            <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#111827]" />
                            <span className="text-xs font-black text-[#111827]">{product.rating}</span>
                            <span className="text-[11px] text-[#111827]/60 font-mono">({product.reviewCount})</span>
                          </div>

                          <h4 className="text-sm font-black text-[#111827] group-hover:text-[#1F5C3A] transition-colors line-clamp-1 font-hatke-title">
                            {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
                          </h4>
                          <p className="text-xs text-[#111827]/70 line-clamp-2 mt-1 font-medium">
                            {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#111827]/15 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-black text-[#111827] font-hatke-title">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-[#111827]/50 line-through font-mono">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#1F5C3A] font-bold">
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className={`p-2.5 rounded-xl font-black border-2 border-[#111827] transition-all flex items-center justify-center cursor-pointer ${
                              addedId === product.id
                                ? 'bg-[#1F5C3A] text-white shadow-[1px_1px_0px_#111827]'
                                : 'bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] shadow-[2px_2px_0px_#111827]'
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
                <div className="text-center py-16 bg-[#FAF9F6] rounded-2xl border-2 border-dashed border-[#111827]">
                  <Folder className="w-10 h-10 text-[#1F5C3A] mx-auto mb-2" />
                  <p className="text-[#111827] font-bold">
                    {lang === 'ml' ? 'ഈ പെട്ടിയിൽ പുതിയ ഉൽപ്പന്നങ്ങൾ ചേർക്കുകയാണ്.' : 'Stocking new finds for this aisle.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
