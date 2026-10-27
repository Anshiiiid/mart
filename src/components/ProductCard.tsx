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
      className="group relative rounded-2xl bg-gradient-to-b from-[#18132B]/80 to-[#100D1F]/90 border border-amber-500/20 hover:border-amber-400/80 hover:shadow-[0_12px_32px_rgba(245,158,11,0.25)] transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Media Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-black/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100D1F] via-transparent to-transparent opacity-80" />

        {/* 3D badge */}
        {product.is3dAvailable && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>360° VIEW</span>
          </div>
        )}

        {/* Traditional Heritage Tag */}
        {product.traditionalArtTag && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-amber-950/95 border border-amber-500/50 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>{product.traditionalArtTag}</span>
          </div>
        )}

        {/* Discount Badge */}
        {product.discountPercent ? (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-rose-600 font-black text-white text-[10px] shadow-md">
            -{product.discountPercent}%
          </div>
        ) : null}
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
            {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
          </p>
        </div>

        {/* Pricing & Quick Add */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-amber-400">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center ${
              added
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
            title="Add to cart"
          >
            {added ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
          </button>
        </div>
      </div>
    </div>
  );
}
