'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { X, Star, Eye, ShoppingBag, Check, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  lang: 'en' | 'ml';
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  lang,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuy = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#FFFFFF] rounded-3xl border-3 border-[#111827] shadow-[8px_8px_0px_#111827] overflow-hidden my-8 text-[#111827] cursor-default font-hatke-body"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#FAF9F6] hover:bg-[#FACC15] text-[#111827] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          {/* Left: Product Media Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF9F6] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] p-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-sm"
              />

              {product.is3dAvailable && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1F5C3A] text-white border-2 border-[#111827] text-xs font-black tracking-wider flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#111827]">
                  <Eye className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>360° WORKSHOP READY</span>
                </div>
              )}

              {product.traditionalArtTag && (
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#FACC15] text-[#111827] border-2 border-[#111827] text-xs font-black shadow-[1.5px_1.5px_0px_#111827] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1F5C3A]" />
                  <span>{product.traditionalArtTag}</span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 text-center font-hatke-body">
              <div className="p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
                <ShieldCheck className="w-4 h-4 text-[#1F5C3A] mx-auto mb-1" />
                <span className="text-[10px] text-[#111827] block font-black">100% Genuine</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
                <Truck className="w-4 h-4 text-[#1F5C3A] mx-auto mb-1" />
                <span className="text-[10px] text-[#111827] block font-black">Desi Postal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2px_2px_0px_#111827]">
                <RotateCcw className="w-4 h-4 text-[#1F5C3A] mx-auto mb-1" />
                <span className="text-[10px] text-[#111827] block font-black">7-Day Easy</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-black tracking-wider text-[#1F5C3A]">
                  {product.category}
                </span>
                <span className="text-xs text-[#111827]/40">•</span>
                <div className="flex items-center gap-1 text-[#FACC15] text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-[#FACC15] text-[#111827]" />
                  <span className="text-[#111827]">{product.rating}</span>
                  <span className="text-[#111827]/50 font-mono">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111827] font-hatke-title mb-2">
                {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#111827]/80 leading-relaxed font-medium mb-4">
                {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
              </p>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#111827] font-hatke-title">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#111827]/50 line-through font-mono">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercent ? (
                    <span className="px-2 py-0.5 rounded-full bg-[#FACC15] border border-[#111827] text-xs font-black text-[#111827]">
                      Save {product.discountPercent}%
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-[#1F5C3A] font-bold mt-1 block">
                  ✓ Free postal shipping on orders above ₹999
                </span>
              </div>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-2">
                    Key Highlights
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#111827]/85 font-medium">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#1F5C3A] mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity & Buy Buttons */}
            <div className="pt-4 border-t-2 border-[#111827]/20">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-black text-[#111827]">
                  {lang === 'ml' ? 'എണ്ണം:' : 'Quantity:'}
                </span>
                <div className="flex items-center border-2 border-[#111827] rounded-xl bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-[#111827] hover:bg-[#FACC15] text-sm font-black"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-black text-[#111827] min-w-[2.5rem] text-center font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-[#111827] hover:bg-[#FACC15] text-sm font-black"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-[#1F5C3A] font-bold">
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Add to Potli Button in Haldi Yellow */}
                <button
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider border-2 border-[#111827] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-[#1F5C3A] text-white shadow-[1px_1px_0px_#111827]'
                      : 'bg-[#FACC15] text-[#111827] shadow-[3px_3px_0px_#111827] hover:bg-[#EAB308]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{lang === 'ml' ? 'സഞ്ചിയിൽ ചേർത്തു' : 'Added to Potli!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{lang === 'ml' ? 'സഞ്ചിയിലേക്ക് ചേർക്കുക' : 'Add To Potli'}</span>
                    </>
                  )}
                </button>

                {/* Instant Checkout Button in Vazhayila Green */}
                <button
                  onClick={handleBuy}
                  className="py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider bg-[#1F5C3A] text-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827] hover:bg-[#14462B] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{lang === 'ml' ? 'ഇപ്പോൾ വാങ്ങുക' : 'Instant Checkout'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
