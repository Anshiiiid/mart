'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { Star, Eye, Plus, Check, Sparkles, ShoppingBag } from 'lucide-react';

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
      className="group relative rounded-2xl bg-[#FFFDF7] border-2 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18] hover:shadow-[7px_7px_0px_#1E1B18] hover:-translate-x-0.5 hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Media Area styled like Indian postal label */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF4E6] border-b-2 border-[#1E1B18] p-4 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
          loading="lazy"
        />

        {/* 3D badge */}
        {product.is3dAvailable && (
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#19857B] text-white border-2 border-[#1E1B18] text-[10px] font-black tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_#1E1B18]">
            <Eye className="w-3 h-3 text-white" />
            <span>360° VIEW</span>
          </div>
        )}

        {/* Traditional Heritage Tag */}
        {product.traditionalArtTag && (
          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-[#E99D1A] text-[#1E1B18] border-2 border-[#1E1B18] text-[10px] font-black shadow-[1.5px_1.5px_0px_#1E1B18] flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#C8331E]" />
            <span>{product.traditionalArtTag}</span>
          </div>
        )}

        {/* Discount Badge */}
        {product.discountPercent ? (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#C8331E] border-2 border-[#1E1B18] font-black text-white text-[10px] shadow-[2px_2px_0px_#1E1B18]">
            -{product.discountPercent}%
          </div>
        ) : null}
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono font-black tracking-wider text-[#F15A24]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#E99D1A] text-xs font-black">
              <Star className="w-3 h-3 fill-[#E99D1A]" />
              <span className="text-[#1E1B18]">{product.rating}</span>
              <span className="text-[#1E1B18]/50 font-mono font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title in Indian Serif */}
          <h3 className="text-base font-black text-[#1E1B18] group-hover:text-[#F15A24] transition-colors line-clamp-1 mb-1 font-desi-serif">
            {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
          </h3>

          <p className="text-xs text-[#1E1B18]/70 line-clamp-2 leading-relaxed font-medium">
            {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
          </p>
        </div>

        {/* Pricing & Chunky Quick Add */}
        <div className="mt-4 pt-3 border-t border-[#1E1B18]/20 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#1E1B18]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#1E1B18]/50 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#19857B] font-mono font-black">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`px-3 py-2 rounded-xl font-black text-xs border-2 border-[#1E1B18] transition-all flex items-center gap-1.5 cursor-pointer ${
              added
                ? 'bg-[#19857B] text-white shadow-[1px_1px_0px_#1E1B18]'
                : 'bg-[#F15A24] text-white shadow-[2.5px_2.5px_0px_#1E1B18] hover:bg-[#E04D18] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#1E1B18]'
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
                <span>{lang === 'ml' ? 'സഞ്ചിയിൽ' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}