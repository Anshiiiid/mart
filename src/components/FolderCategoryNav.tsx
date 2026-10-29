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

// 3x3 Grid category mapping that directly mirrors the Curried Away & Banjara reference style
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
    iconDesc: 'Cast Iron Pan + Stainless Kettle',
    iconDescMl: 'ഇരുമ്പ് ചീനച്ചട്ടി & പിച്ചള കെറ്റിൽ',
    sampleImg: '/categories/kitchen-cookware.jpg',
    tagline: 'Heirloom Vedic Cooking',
    taglineMl: 'പാരമ്പര്യ പാചക ഉപകരണങ്ങൾ',
    stampPrice: '₹25',
    postmark: 'ATHANGUDI • 1984',
    tintBg: '#FDF2EB',
    accentColor: '#D4421E',
  },
  'home-appliances': {
    iconDesc: 'Smart Air Fryer + Ovens',
    iconDescMl: 'സ്മാർട്ട് എയർ ഫ്രയർ & ഓവൻ',
    sampleImg: '/categories/home-appliances.jpg',
    tagline: 'Next-Gen Desi Kitchen',
    taglineMl: 'ആധുനിക കിച്ചൻ ഗാഡ്‌ജറ്റുകൾ',
    stampPrice: '₹50',
    postmark: 'CALICUT BAZAAR',
    tintBg: '#FFF8E6',
    accentColor: '#E99D1A',
  },
  'cyber-audio': {
    iconDesc: 'ANC Headphones + Resonant Speaker',
    iconDescMl: 'ഹെഡ്‌ഫോൺ & ബ്ലൂടൂത്ത് സ്പീക്കർ',
    sampleImg: '/categories/cyber-audio.jpg',
    tagline: 'Lossless Indian Acoustics',
    taglineMl: 'വ്യക്തമായ ശബ്ദാനുഭവം',
    stampPrice: '₹40',
    postmark: 'RADIO TARANG',
    tintBg: '#EBF4FA',
    accentColor: '#234982',
  },
  'computing-workspace': {
    iconDesc: 'Mechanical Keyboard + Wireless Mouse',
    iconDescMl: 'മെക്കാനിക്കൽ കീബോർഡ് & മൗസ്',
    sampleImg: '/categories/computing-workspace.jpg',
    tagline: 'Ergonomic Teak & CNC Desk',
    taglineMl: 'വർക്ക്‌സ്‌പേസ് ഉപകരണങ്ങൾ',
    stampPrice: '₹35',
    postmark: 'DECCAN TECH',
    tintBg: '#EFF6F2',
    accentColor: '#19857B',
  },
  'ambient-living': {
    iconDesc: 'Terracotta Lamp + Bamboo Basket',
    iconDescMl: 'മൺചിരാത് ലാമ്പ് & വട്ടി',
    sampleImg: '/categories/ambient-living.jpg',
    tagline: 'Warm Organic Illumination',
    taglineMl: 'മനോഹരമായ വീട്ടുപകരണങ്ങൾ',
    stampPrice: '₹20',
    postmark: 'KUTCH EMBROIDERY',
    tintBg: '#FFF9E8',
    accentColor: '#E89C12',
  },
  'personal-care': {
    iconDesc: 'Ionic Hair Dryer + Neem Comb + Elixir',
    iconDescMl: 'ഹെയർ ഡ്രയർ & വേപ്പ് ചീപ്പ്',
    sampleImg: '/categories/personal-care.jpg',
    tagline: 'Ayurvedic Grooming Rituals',
    taglineMl: 'സൗന്ദര്യ സംരക്ഷണ സാമഗ്രികൾ',
    stampPrice: '₹30',
    postmark: 'AYURVEDA VAIDYA',
    tintBg: '#FDF1F5',
    accentColor: '#C83366',
  },
  'kids-nursery': {
    iconDesc: 'Organic Plush Bear + Lacquer Bottle',
    iconDescMl: 'ഓർഗാനിക് ടെഡ്ഡി & കുപ്പികൾ',
    sampleImg: '/categories/kids-nursery.jpg',
    tagline: 'Safe GI Channapatna Toys',
    taglineMl: 'സുരക്ഷിത കളിപ്പാട്ടങ്ങൾ',
    stampPrice: '₹15',
    postmark: 'CHANNAPATNA',
    tintBg: '#EFF8F3',
    accentColor: '#19857B',
  },
  'smart-mobility': {
    iconDesc: 'Cordless Mini Vacuum + Smart Helmet',
    iconDescMl: 'കോർഡ്‌ലെസ് വാക്വം & ഹെൽമെറ്റ്',
    sampleImg: '/categories/smart-mobility.jpg',
    tagline: 'Clean Tech & Everyday Utility',
    taglineMl: 'സ്മാർട്ട് ക്ലീനിംഗ് & റൈഡിംഗ്',
    stampPrice: '₹45',
    postmark: 'SPEED ROYAL',
    tintBg: '#FDF0EE',
    accentColor: '#C8331E',
  },
  'modern-sanitation': {
    iconDesc: 'Spin Mop Bucket + Eco Spray',
    iconDescMl: 'സ്പിൻ മോപ്പ് & സാനിറ്റേഷൻ',
    sampleImg: '/categories/modern-sanitation.jpg',
    tagline: 'Dual-Chamber Microfiber Care',
    taglineMl: 'വീട് വൃത്തിയാക്കൽ സഹായികൾ',
    stampPrice: '₹20',
    postmark: 'SWACHH BHARAT',
    tintBg: '#FEFEE8',
    accentColor: '#E99D1A',
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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      className="relative py-16 sm:py-24 bg-[#FAF4E6] text-[#1E1B18] z-20 border-b-2 border-[#1E1B18]"
    >
      {/* Decorative Athangudi Tile Ribbon running across top (Image 1 Reference) */}
      <div className="absolute top-0 left-0 right-0">
        <AthangudiTileBanner height={32} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Section Header in Curried Away / Banjara Style */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Postmark Denomination Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] shadow-[2.5px_2.5px_0px_#1E1B18] text-[#1E1B18] text-xs font-black uppercase tracking-widest mb-4">
            <Stamp className="w-4 h-4 text-[#C8331E]" />
            <span>{lang === 'ml' ? '9 പാരമ്പര്യ കാറ്റഗറി സ്റ്റാമ്പുകൾ' : 'THE 9 SACRED POSTAL CRAFT STAMPS'}</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black text-[#1E1B18] font-desi-display lowercase mb-3 tracking-tight">
            <span>{lang === 'ml' ? 'കരകൗശല സ്റ്റാമ്പുകൾ' : 'authentic craft matrix'}</span>
          </h2>

          <div className="flex items-center justify-center gap-3 my-3">
            <div className="h-0.5 w-16 bg-[#C8331E]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F15A24]">
              {lang === 'ml' ? 'അത്താങ്കുടി ടൈലുകളും ശേഖരങ്ങളും' : 'ATHANGUDI TILES & POSTAGE STAMPS'}
            </span>
            <div className="h-0.5 w-16 bg-[#C8331E]" />
          </div>

          <p className="text-sm sm:text-base font-medium text-[#1E1B18]/80 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ml'
              ? 'റഫറൻസ് ചിത്രത്തിലെ 9 വിഭവങ്ങളും വിന്റേജ് ഇന്ത്യൻ പോസ്റ്റൽ സ്റ്റാമ്പുകളായി ഇവിടെ ക്രമീകരിച്ചിരിക്കുന്നു. സ്റ്റാമ്പിൽ ക്ലിക്ക് ചെയ്ത് ശേഖരം പരിശോധിക്കുക.'
              : 'Each craft realm crafted as a vintage collectible Indian postal stamp. Select any stamp to slide open its artisan inventory box.'}
          </p>

          {/* View Mode Switcher Pills */}
          <div className="inline-flex items-center gap-2 p-1.5 mt-6 rounded-full bg-[#FFFDF7] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] text-xs">
            <button
              onClick={() => setViewMode('both')}
              className={`px-4 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'both'
                  ? 'bg-[#F15A24] text-white shadow-[1px_1px_0px_#1E1B18]'
                  : 'text-[#1E1B18] hover:bg-[#FAF4E6]'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Stamps + Vault</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-[#F15A24] text-white shadow-[1px_1px_0px_#1E1B18]'
                  : 'text-[#1E1B18] hover:bg-[#FAF4E6]'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>3×3 Stamps Only</span>
            </button>
            <button
              onClick={() => setViewMode('tabs')}
              className={`px-4 py-1.5 rounded-full font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'tabs'
                  ? 'bg-[#F15A24] text-white shadow-[1px_1px_0px_#1E1B18]'
                  : 'text-[#1E1B18] hover:bg-[#FAF4E6]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Vault Tabs Only</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. VISUAL 3x3 CATEGORY POSTAGE STAMP MATRIX (IMAGE 1 & 2)     */}
        {/* ============================================================ */}
        {(viewMode === 'both' || viewMode === 'matrix') && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F15A24] animate-ping" />
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1E1B18] font-mono">
                  {lang === 'ml' ? '3×3 വിന്റേജ് സ്റ്റാമ്പ് ഗ്രിഡ്' : '3×3 Collectible Stamp Grid'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FFFDF7] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                9 {lang === 'ml' ? 'സ്റ്റാമ്പുകൾ ലഭ്യമാണ്' : 'Stamps In Stock'}
              </span>
            </div>

            {/* 3x3 Stamp Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {sortedCategories.map((cat, idx) => {
                const IconComp = iconMap[cat.iconName] || Folder;
                const isActive = cat.slug === activeSlug;
                const meta = categoryGridMeta[cat.slug] || {
                  iconDesc: cat.name,
                  iconDescMl: cat.nameMl,
                  sampleImg: `/categories/${cat.slug}.jpg`,
                  tagline: 'Artisanal Craft',
                  taglineMl: 'പാരമ്പര്യ ശേഖരം',
                  stampPrice: '₹25',
                  postmark: 'HATKE POST',
                  tintBg: '#FFFDF7',
                  accentColor: '#F15A24',
                };

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer overflow-hidden border-2 border-[#1E1B18] flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#FFFDF7] shadow-[6px_6px_0px_#1E1B18] scale-[1.02] ring-4 ring-[#F15A24]/30'
                        : 'bg-[#FFFDF7] hover:bg-[#FFFDF7] shadow-[4px_4px_0px_#1E1B18] hover:shadow-[7px_7px_0px_#1E1B18] hover:-translate-y-1'
                    }`}
                    style={{
                      backgroundColor: meta.tintBg,
                    }}
                  >
                    {/* Perforated Postal Border Frame inside */}
                    <div className="absolute inset-2 border-2 border-dashed border-[#1E1B18]/30 rounded-xl pointer-events-none" />

                    {/* Top Stamp Header: Denomination & Postal Cancellation */}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="w-7 h-7 rounded-lg bg-[#1E1B18] text-[#FAF4E6] font-mono font-black text-xs flex items-center justify-center shadow-sm">
                          {meta.stampPrice}
                        </span>
                        <span className="text-[10px] font-mono font-bold tracking-wider text-[#1E1B18]/70 uppercase">
                          {meta.postmark}
                        </span>
                      </div>

                      <span
                        className="text-[10px] uppercase px-2.5 py-0.5 rounded-full font-black border-2 border-[#1E1B18] shadow-[1.5px_1.5px_0px_#1E1B18]"
                        style={{
                          backgroundColor: isActive ? '#F15A24' : '#E99D1A',
                          color: isActive ? '#FFFFFF' : '#1E1B18',
                        }}
                      >
                        {cat.badge}
                      </span>
                    </div>

                    {/* Center Studio Product Visual matching Reference Image */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border-2 border-[#1E1B18] p-4 flex items-center justify-center shadow-inner group-hover:shadow-md transition-all duration-300 mb-4">
                      {/* Product Cutout from Reference Image */}
                      <img
                        src={meta.sampleImg}
                        alt={cat.name}
                        className="w-full h-full object-contain group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500 drop-shadow-md"
                        loading="lazy"
                      />

                      {/* Postmark stamp overlay on card corner */}
                      <div className="absolute top-2 right-2 border-2 border-[#C8331E]/40 text-[#C8331E] rounded-full w-10 h-10 flex items-center justify-center text-[7px] font-mono font-black uppercase text-center rotate-[-15deg] pointer-events-none">
                        HATKE<br />POST
                      </div>

                      {/* Active Indicator Icon */}
                      <div
                        className="absolute bottom-2 left-2 p-1.5 rounded-lg border border-[#1E1B18] text-white shadow-sm"
                        style={{ backgroundColor: meta.accentColor }}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Category Details in Desi Typography */}
                    <div className="relative z-10 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg sm:text-xl font-black text-[#1E1B18] font-desi-serif group-hover:text-[#F15A24] transition-colors">
                            {lang === 'ml' ? cat.nameMl : cat.name}
                          </h3>
                        </div>
                        <p className="text-xs font-bold text-[#C8331E] font-mono mt-0.5 truncate">
                          {lang === 'ml' ? meta.iconDescMl : meta.iconDesc}
                        </p>
                        <p className="text-[11px] text-[#1E1B18]/70 font-medium truncate mt-0.5">
                          {lang === 'ml' ? meta.taglineMl : meta.tagline}
                        </p>
                      </div>

                      {/* Bottom Action Strip */}
                      <div className="mt-4 pt-3 border-t border-[#1E1B18]/20 flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] font-bold text-[#1E1B18]/80">
                          {products.filter((p) => p.categorySlug === cat.slug).length} Units
                        </span>

                        <span
                          className={`font-black flex items-center gap-1 px-3 py-1 rounded-full border-2 border-[#1E1B18] shadow-[1.5px_1.5px_0px_#1E1B18] text-xs transition-all ${
                            isActive
                              ? 'bg-[#F15A24] text-white'
                              : 'bg-[#FFFDF7] text-[#1E1B18] group-hover:bg-[#E99D1A]'
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

        {/* ============================================================ */}
        {/* 2. TACTILE CYBER FOLDER TABS & VAULT CONTAINER               */}
        {/* ============================================================ */}
        {(viewMode === 'both' || viewMode === 'tabs') && (
          <div id="open-folder-container" className="relative pt-6">
            {/* Horizontal Scrollable Tabs Strip */}
            <div className="flex items-end gap-1.5 sm:gap-2 overflow-x-auto pb-0 px-2 scrollbar-none border-b-2 border-[#1E1B18]">
              {sortedCategories.map((cat, idx) => {
                const IconComponent = iconMap[cat.iconName] || Folder;
                const isActive = cat.slug === activeSlug;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSlug(cat.slug)}
                    className={`relative group flex items-center gap-2 px-3.5 sm:px-5 py-3 transition-all duration-200 whitespace-nowrap cursor-pointer select-none rounded-t-2xl font-bold border-t-2 border-x-2 border-[#1E1B18] ${
                      isActive
                        ? 'bg-[#FFFDF7] text-[#1E1B18] shadow-[0_-4px_0px_rgba(30,27,24,0.1)] z-10 translate-y-[2px]'
                        : 'bg-[#F2E3C6] text-[#1E1B18]/70 hover:bg-[#FFFDF7] hover:text-[#1E1B18]'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border border-[#1E1B18] ${
                        isActive ? 'scale-125' : 'opacity-60'
                      }`}
                      style={{ backgroundColor: cat.color }}
                    />

                    <IconComponent className="w-4 h-4 text-[#F15A24]" />

                    <div className="flex flex-col text-left">
                      <span className="text-xs sm:text-sm font-black font-desi-serif">
                        {lang === 'ml' ? cat.nameMl : cat.name}
                      </span>
                      <span className="text-[10px] text-[#1E1B18]/60 font-mono hidden sm:inline">
                        Stamp #{idx + 1}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-black border border-[#1E1B18] ${
                        isActive ? 'bg-[#E99D1A] text-[#1E1B18]' : 'bg-white/80 text-[#1E1B18]'
                      }`}
                    >
                      {cat.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* OPEN FOLDER BODY CONTAINER (Traditional Indian Parcel / Dabba style) */}
            <div className="w-full rounded-b-3xl rounded-tr-3xl p-6 sm:p-8 border-2 border-t-0 border-[#1E1B18] bg-[#FFFDF7] shadow-[6px_6px_0px_#1E1B18] relative overflow-hidden">
              {/* Folder Header Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-dashed border-[#1E1B18]/30 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-[#1E1B18]"
                      style={{ backgroundColor: activeCategory?.color || '#F15A24' }}
                    />
                    <span className="text-xs uppercase tracking-widest font-mono text-[#F15A24] font-black">
                      {lang === 'ml' ? 'തുറന്ന കാറ്റഗറി പെട്ടി' : 'OPEN ARTISAN PARCEL VAULT'}
                    </span>
                    <span className="text-xs text-[#1E1B18]/40">•</span>
                    <span className="text-xs font-mono font-bold text-[#1E1B18]">
                      {categoryProducts.length} {lang === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ ലഭ്യമാണ്' : 'Products Ready To Ship'}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black text-[#1E1B18] font-desi-display lowercase">
                    {lang === 'ml' ? activeCategory?.nameMl : activeCategory?.name}
                  </h3>
                  <p className="text-sm text-[#1E1B18]/80 max-w-2xl mt-1 leading-relaxed font-medium">
                    {activeCategory?.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="#products"
                    className="desi-btn desi-btn-turmeric text-xs px-4 py-2"
                  >
                    <span>{lang === 'ml' ? 'എല്ലാ ഉൽപ്പന്നങ്ങളും' : 'Explore All Items'}</span>
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
                      className="group relative rounded-2xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] hover:shadow-[5px_5px_0px_#1E1B18] hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer"
                    >
                      {/* Card Media Preview */}
                      <div className="relative aspect-square w-full overflow-hidden bg-white border-b-2 border-[#1E1B18] p-3 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                        />

                        {product.is3dAvailable && (
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#19857B] text-white border border-[#1E1B18] text-[10px] font-black tracking-wider flex items-center gap-1 shadow-sm">
                            <Eye className="w-3 h-3 text-white" />
                            <span>360° VIEW</span>
                          </div>
                        )}

                        {product.discountPercent ? (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#C8331E] text-white text-[10px] font-black border border-[#1E1B18] shadow-sm">
                            -{product.discountPercent}%
                          </div>
                        ) : null}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-[#E99D1A] mb-1.5">
                            <Star className="w-3.5 h-3.5 fill-[#E99D1A]" />
                            <span className="text-xs font-black text-[#1E1B18]">{product.rating}</span>
                            <span className="text-[11px] text-[#1E1B18]/60 font-mono">({product.reviewCount})</span>
                          </div>

                          <h4 className="text-sm font-black text-[#1E1B18] group-hover:text-[#F15A24] transition-colors line-clamp-1 font-desi-serif">
                            {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
                          </h4>
                          <p className="text-xs text-[#1E1B18]/70 line-clamp-2 mt-1 font-medium">
                            {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#1E1B18]/20 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-base font-black text-[#1E1B18]">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-[#1E1B18]/50 line-through font-mono">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#19857B] font-black font-mono">
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className={`p-2.5 rounded-xl font-black border-2 border-[#1E1B18] transition-all flex items-center justify-center cursor-pointer ${
                              addedId === product.id
                                ? 'bg-[#19857B] text-white shadow-[1px_1px_0px_#1E1B18]'
                                : 'bg-[#F15A24] hover:bg-[#E04D18] text-white shadow-[2px_2px_0px_#1E1B18]'
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
                <div className="text-center py-16 bg-[#FAF4E6] rounded-2xl border-2 border-dashed border-[#1E1B18]">
                  <Folder className="w-10 h-10 text-[#F15A24] mx-auto mb-2" />
                  <p className="text-[#1E1B18] font-bold">
                    {lang === 'ml' ? 'ഈ പെട്ടിയിൽ പുതിയ ഉൽപ്പന്നങ്ങൾ ചേർക്കുകയാണ്.' : 'Stocking new artisan units for this category.'}
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