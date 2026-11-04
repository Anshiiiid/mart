'use client';

import React, { useState } from 'react';
import { CategoryFolder, Product } from '@/lib/types';
import AthangudiTileBanner from '@/components/AthangudiTileBanner';
import CategorySticker from '@/components/CategorySticker';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Check,
  ChevronRight,
  Layers,
  Star,
} from 'lucide-react';

interface FolderCategoryNavProps {
  categories: CategoryFolder[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onFilterCatalog?: (slug: string) => void;
  lang: 'en' | 'ml';
}

// Visual Meta for Category Squircles (Pastel tints matching Image 1 & Brand Guidelines)
const categoryStyleMap: Record<
  string,
  {
    bgTint: string;
    borderHover: string;
    englishTitle: string;
    malayalamTitle: string;
    subtitle: string;
    subtitleMl: string;
    badge: string;
  }
> = {
  kitchen: {
    bgTint: '#FEF3C7', // Soft Butter Yellow (Image 1)
    borderHover: '#1F5C3A',
    englishTitle: 'Kitchen',
    malayalamTitle: 'അടുക്കള',
    subtitle: 'Spice plates, cast iron & cookware',
    subtitleMl: 'മസാലത്താലം & പാചക ഉപകരണങ്ങൾ',
    badge: 'Artisan',
  },
  tech: {
    bgTint: '#E0F2FE', // Soft Powder Blue (Image 1)
    borderHover: '#1F5C3A',
    englishTitle: 'Tech',
    malayalamTitle: 'ടെക്',
    subtitle: 'Cyber audio, plugs & smart desk gear',
    subtitleMl: 'സ്മാർട്ട് ഗാഡ്‌ജറ്റുകൾ & ഓഡിയോ',
    badge: 'Trending',
  },
  kids: {
    bgTint: '#FCE7F3', // Soft Pastel Pink (Image 1)
    borderHover: '#1F5C3A',
    englishTitle: 'Kids',
    malayalamTitle: 'കിഡ്സ്',
    subtitle: 'Auto-rickshaw toys & wooden finds',
    subtitleMl: 'ഓട്ടോറിക്ഷ & മരക്കളിപ്പാട്ടങ്ങൾ',
    badge: 'Eco-Safe',
  },
  home: {
    bgTint: '#DCFCE7', // Soft Sage / Mint Green (Image 1)
    borderHover: '#1F5C3A',
    englishTitle: 'Home',
    malayalamTitle: 'ഹോം',
    subtitle: 'Whistling pressure cookers & living decor',
    subtitleMl: 'കുക്കറുകൾ & വീട്ടുപകരണങ്ങൾ',
    badge: 'Popular',
  },
  stationery: {
    bgTint: '#F3E8FF', // Soft Lavender
    borderHover: '#1F5C3A',
    englishTitle: 'Stationery',
    malayalamTitle: 'സ്റ്റേഷനറി',
    subtitle: 'Handmade deckle journals & brass dip pens',
    subtitleMl: 'ഡയറികൾ & പിച്ചള പേനകൾ',
    badge: 'Handmade',
  },
  dress: {
    bgTint: '#FFEDD5', // Soft Warm Peach
    borderHover: '#1F5C3A',
    englishTitle: 'Dress',
    malayalamTitle: 'ഡ്രസ്സ്',
    subtitle: 'Balaramapuram handloom & cotton kurtas',
    subtitleMl: 'കൈത്തറി കുർത്ത & വസ്ത്രങ്ങൾ',
    badge: 'Handloom',
  },
  footwear: {
    bgTint: '#F5EBE1', // Soft Warm Sand / Leather Cream
    borderHover: '#1F5C3A',
    englishTitle: 'Footwear',
    malayalamTitle: 'ഫുട്വെയർ',
    subtitle: 'Hand-braided leather Kolhapuri & juttis',
    subtitleMl: 'കൊൽഹാപുരി & മോജരി ചെരിപ്പുകൾ',
    badge: 'Artisan',
  },
  jewellery: {
    bgTint: '#CCFBF1', // Soft Mint / Aqua
    borderHover: '#1F5C3A',
    englishTitle: 'Jewellery',
    malayalamTitle: 'ആഭരണങ്ങൾ',
    subtitle: 'Temple bell jhumkas & pearl drop filigree',
    subtitleMl: 'ക്ഷേത്ര ജിമിക്കി & മുത്തുമാലകൾ',
    badge: 'Heirloom',
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
  // Ordered sequence: Row 1 = [Kitchen, Tech, Kids, Home], Row 2 = [Stationery, Dress, Footwear, Jewellery]
  const orderedSlugs = ['kitchen', 'tech', 'kids', 'home', 'stationery', 'dress', 'footwear', 'jewellery'];

  // Normalize categories according to the 8 desired slugs
  const displayCategories = orderedSlugs.map((slug, idx) => {
    const existing = categories.find(
      (c) =>
        c.slug === slug ||
        (slug === 'kitchen' && c.slug === 'kitchen-cookware') ||
        (slug === 'tech' && (c.slug === 'cyber-audio' || c.slug === 'computing-workspace')) ||
        (slug === 'kids' && c.slug === 'kids-nursery') ||
        (slug === 'home' && (c.slug === 'home-appliances' || c.slug === 'ambient-living'))
    );

    const style = categoryStyleMap[slug] || {
      bgTint: '#FEF3C7',
      borderHover: '#1F5C3A',
      englishTitle: slug.toUpperCase(),
      malayalamTitle: slug,
      subtitle: 'Curated finds',
      subtitleMl: 'ഹട്കെ കണ്ടെത്തലുകൾ',
      badge: 'Popular',
    };

    return {
      id: existing?.id || `cat-${slug}`,
      slug,
      name: style.englishTitle,
      nameMl: style.malayalamTitle,
      badge: style.badge,
      color: style.bgTint,
      subtitle: style.subtitle,
      subtitleMl: style.subtitleMl,
      order: idx + 1,
    };
  });

  const [activeSlug, setActiveSlug] = useState<string>('kitchen');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Filter products for the active category
  const activeProducts = products.filter(
    (p) =>
      p.categorySlug === activeSlug ||
      (activeSlug === 'kitchen' && p.categorySlug === 'kitchen-cookware') ||
      (activeSlug === 'tech' && (p.categorySlug === 'cyber-audio' || p.categorySlug === 'computing-workspace')) ||
      (activeSlug === 'kids' && p.categorySlug === 'kids-nursery') ||
      (activeSlug === 'home' && (p.categorySlug === 'home-appliances' || p.categorySlug === 'ambient-living' || p.categorySlug === 'modern-sanitation'))
  );

  const activeCategoryMeta = displayCategories.find((c) => c.slug === activeSlug) || displayCategories[0];
  const activeStyle = categoryStyleMap[activeSlug] || categoryStyleMap['kitchen'];

  const handleCategoryClick = (slug: string) => {
    setActiveSlug(slug);
    if (onFilterCatalog) {
      onFilterCatalog(slug);
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="categories" className="relative py-12 sm:py-16 bg-[#FAF9F6] text-[#111827] border-b-2 border-[#111827] scroll-mt-24 select-none">
      {/* Athangudi Indian Heritage Ribbon across top */}
      <div className="absolute top-0 left-0 right-0">
        <AthangudiTileBanner height={24} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 font-hatke-body">
        {/* Section Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] text-[#111827] text-[11px] sm:text-xs font-black uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#1F5C3A]" />
            <span>{lang === 'ml' ? 'വിഭാഗങ്ങൾ വഴി തിരയുക' : 'EXPLORE BY AISLE • 8 CATEGORIES'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#111827] font-hatke-title tracking-tight">
            <span>{lang === 'ml' ? 'ഒരു കാറ്റഗറി, ഒരു ക്രാഫ്റ്റ്' : 'Everyday things, one sticker each.'}</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#111827]/75 mt-1.5 max-w-lg mx-auto">
            {lang === 'ml'
              ? 'അടുക്കള, ടെക്, കുട്ടികൾ, വസ്ത്രങ്ങൾ മുതൽ ആഭരണങ്ങൾ വരെ - ലളിതമായ ഡിസൈനിൽ മനോഹരമായ തിരഞ്ഞെടുപ്പുകൾ.'
              : 'Kitchen, tech, kids, living, dress & craft. Flat tactile stickers with everyday clever utility.'}
          </p>
        </div>

        {/* 
          CATEGORY SQUIRCLE STICKER GRID
          - Exactly 4 in a row on Laptop (grid-cols-4)
          - Exactly 4 in a row on Phone (grid-cols-4)
          - Perfectly proportioned & responsive
        */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {displayCategories.map((cat) => {
              const isActive = cat.slug === activeSlug;
              const style = categoryStyleMap[cat.slug] || categoryStyleMap['kitchen'];

              return (
                <div
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="group flex flex-col items-center cursor-pointer transition-transform duration-200"
                >
                  {/* SQUIRCLE CARD CONTAINER (Matching Image 1) */}
                  <div
                    className={`relative w-18 h-18 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 flex items-center justify-center transition-all duration-300 border-2 ${
                      isActive
                        ? 'border-[#111827] shadow-[4px_4px_0px_#111827] scale-105 ring-3 ring-[#1F5C3A]/30'
                        : 'border-[#111827] shadow-[2.5px_2.5px_0px_#111827] hover:shadow-[4px_4px_0px_#111827] hover:-translate-y-1'
                    }`}
                    style={{ backgroundColor: style.bgTint }}
                  >
                    {/* Sticker Graphic */}
                    <div className="w-full h-full flex items-center justify-center transform group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
                      <CategorySticker slug={cat.slug} />
                    </div>

                    {/* Active Check Dot */}
                    {isActive && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1F5C3A] text-white border-1.5 border-[#111827] shadow-xs flex items-center justify-center animate-bounce">
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* LABEL UNDERNEATH (Matching Image 1) */}
                  <div className="mt-2 text-center w-full">
                    <span
                      className={`block font-hatke-title text-xs sm:text-base font-black tracking-tight leading-tight transition-colors ${
                        isActive ? 'text-[#1F5C3A]' : 'text-[#111827] group-hover:text-[#1F5C3A]'
                      }`}
                    >
                      {lang === 'ml' ? cat.nameMl : cat.name}
                    </span>

                    {/* Subtitle / Item Count Pill */}
                    <span className="hidden sm:inline-block text-[10px] font-bold text-[#111827]/60 mt-0.5">
                      {lang === 'ml' ? cat.name : cat.nameMl}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 
          ACTIVE AISLE PREVIEW VAULT
          Reveals the curated products for the active category in a neat, responsive strip
        */}
        <div className="mt-10 sm:mt-14 max-w-4xl mx-auto rounded-3xl border-2 border-[#111827] bg-[#FFFFFF] shadow-[5px_5px_0px_#111827] p-5 sm:p-7 relative overflow-hidden">
          {/* Active Banner Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b-2 border-dashed border-[#111827]/20">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center p-1.5"
                style={{ backgroundColor: activeStyle.bgTint }}
              >
                <CategorySticker slug={activeSlug} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#111827] font-hatke-title">
                    {lang === 'ml' ? activeCategoryMeta.nameMl : activeCategoryMeta.name} {lang === 'ml' ? 'വിഭാഗം' : 'Aisle'}
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FACC15] text-[#111827] border border-[#111827]">
                    {activeCategoryMeta.badge}
                  </span>
                </div>
                <p className="text-xs text-[#111827]/70 font-medium">
                  {lang === 'ml' ? activeStyle.subtitleMl : activeStyle.subtitle} • {activeProducts.length} {lang === 'ml' ? 'ഉൽപ്പന്നങ്ങൾ' : 'Finds in stock'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onFilterCatalog) onFilterCatalog(activeSlug);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-hatke-title font-bold text-xs border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center gap-1.5 cursor-pointer active:translate-y-0.5 self-start sm:self-auto"
            >
              <span>{lang === 'ml' ? 'മുഴുവൻ കാറ്റലോഗ് കാണുക' : 'View in Full Catalog'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Category Products (Compact Cards Grid) */}
          {activeProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {activeProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onSelectProduct(prod)}
                  className="group relative rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] hover:shadow-[3.5px_3.5px_0px_#111827] hover:-translate-y-0.5 transition-all p-3 flex flex-col justify-between cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full rounded-xl bg-[#FFFFFF] border-1.5 border-[#111827] overflow-hidden p-2 flex items-center justify-center mb-2">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    {prod.discountPercent && (
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-black bg-[#FACC15] text-[#111827] px-1.5 py-0.5 rounded border border-[#111827]">
                        {prod.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h4 className="text-xs font-black text-[#111827] font-hatke-title line-clamp-1 group-hover:text-[#1F5C3A] transition-colors">
                      {lang === 'ml' && prod.nameMl ? prod.nameMl : prod.name}
                    </h4>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-black text-[#1F5C3A] font-hatke-title">
                          ₹{prod.price}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-[#111827]/40 line-through">
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Quick Add Button */}
                      <button
                        onClick={(e) => handleQuickAdd(prod, e)}
                        className={`w-7 h-7 rounded-lg border-1.5 border-[#111827] flex items-center justify-center transition-all cursor-pointer ${
                          addedId === prod.id
                            ? 'bg-[#1F5C3A] text-white shadow-none'
                            : 'bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] shadow-[1px_1px_0px_#111827] active:translate-y-0.5'
                        }`}
                        title="Add to Potli"
                      >
                        {addedId === prod.id ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs font-bold text-[#111827]/60">
                {lang === 'ml' ? 'ഈ കാറ്റഗറിയിൽ കൂടുതൽ ഉൽപ്പന്നങ്ങൾ ഉടൻ എത്തും!' : 'More curated finds arriving soon in this aisle!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
