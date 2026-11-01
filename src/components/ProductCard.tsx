'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { Star, Eye, Plus, Check, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  lang: 'en' | 'ml';
}

export default function ProductCard({ product, onSelect, onAddToCart, lang }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative rounded-2xl bg-[#FFFFFF] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] hover:shadow-[5px_5px_0px_#111827] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Media Area: Clean White tile with subtle soft shadow */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF9F6] border-b-2 border-[#111827] p-4 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          loading="lazy"
        />

        {/* 3D badge (Leaf Green #1F5C3A with White text) */}
        {product.is3dAvailable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#1F5C3A] text-white border-2 border-[#111827] text-[10px] font-black tracking-wider flex items-center gap-1 shadow-[1.5px_1.5px_0px_#111827] cursor-pointer hover:bg-[#14462B] active:translate-y-[1px]"
            title="Inspect in 360° View"
          >
            <Eye className="w-3 h-3 text-[#FACC15]" />
            <span>360° VIEW</span>
          </button>
        )}

        {/* Traditional / Desi Find Tag (Yellow #FACC15 with Black text) */}
        {product.traditionalArtTag && (
          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-[#FACC15] text-[#111827] border-2 border-[#111827] text-[10px] font-black shadow-[1.5px_1.5px_0px_#111827] flex items-center gap-1 font-hatke-body">
            <Sparkles className="w-2.5 h-2.5 text-[#1F5C3A]" />
            <span>{product.traditionalArtTag}</span>
          </div>
        )}

        {/* Discount Badge in Yellow (#FACC15) with Black border */}
        {product.discountPercent ? (
          <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#FACC15] border-2 border-[#111827] font-black text-[#111827] text-[10px] shadow-[2px_2px_0px_#111827] hatke-badge-tilt font-hatke-body">
            -{product.discountPercent}% OFF
          </div>
        ) : null}
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between font-hatke-body bg-[#FFFFFF]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-black tracking-wider text-[#1F5C3A]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#FACC15] text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#111827]" />
              <span className="text-[#111827] font-bold">{product.rating}</span>
              <span className="text-[#111827]/50 font-mono font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-black text-[#111827] group-hover:text-[#1F5C3A] transition-colors line-clamp-1 mb-1 font-hatke-title">
            {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
          </h3>

          <p className="text-xs text-[#111827]/75 line-clamp-2 leading-relaxed font-medium">
            {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart (Bright Yellow Button #FACC15 with Deep Black text) */}
        <div className="mt-4 pt-3 border-t border-[#111827]/15 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#111827] font-hatke-title">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#111827]/50 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#1F5C3A] font-bold block">
              delivery date at checkout
            </span>
          </div>

          {/* Add to Cart button in Yellow / Green */}
          <button
            onClick={handleAdd}
            className={`px-3.5 py-1.5 rounded-full font-black text-xs border-2 border-[#111827] transition-all flex items-center gap-1.5 cursor-pointer ${
              added
                ? 'bg-[#1F5C3A] text-white shadow-[1px_1px_0px_#111827]'
                : 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827] hover:bg-[#EAB308] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0.5px_0.5px_0px_#111827]'
            }`}
            title="Add to Cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{lang === 'ml' ? 'ചേർത്തു' : 'Added'}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{lang === 'ml' ? 'സഞ്ചിയിൽ' : 'Add to cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
