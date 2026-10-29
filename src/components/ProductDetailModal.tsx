'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { X, Star, Eye, ShoppingBag, Check, Sparkles, ShieldCheck, Truck, RotateCcw, Stamp } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FFFDF7] rounded-3xl border-3 border-[#1E1B18] shadow-[10px_10px_0px_#1E1B18] overflow-hidden my-8 text-[#1E1B18]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#FAF4E6] hover:bg-[#F2E3C6] text-[#1E1B18] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18] flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          {/* Left: Product Media Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18] p-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-md"
              />

              {product.is3dAvailable && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#19857B] text-white border-2 border-[#1E1B18] text-xs font-black tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1B18]">
                  <Eye className="w-3.5 h-3.5 text-white" />
                  <span>360° WORKSHOP READY</span>
                </div>
              )}

              {product.traditionalArtTag && (
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-[#E99D1A] text-[#1E1B18] border-2 border-[#1E1B18] text-xs font-black shadow-[2px_2px_0px_#1E1B18] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8331E]" />
                  <span>{product.traditionalArtTag}</span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                <ShieldCheck className="w-4 h-4 text-[#19857B] mx-auto mb-1" />
                <span className="text-[10px] text-[#1E1B18] block font-black">100% Genuine</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                <Truck className="w-4 h-4 text-[#F15A24] mx-auto mb-1" />
                <span className="text-[10px] text-[#1E1B18] block font-black">Desi Postal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[2px_2px_0px_#1E1B18]">
                <RotateCcw className="w-4 h-4 text-[#C8331E] mx-auto mb-1" />
                <span className="text-[10px] text-[#1E1B18] block font-black">7-Day Easy</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-mono font-black tracking-wider text-[#F15A24]">
                  {product.category}
                </span>
                <span className="text-[#1E1B18]/40">•</span>
                <div className="flex items-center gap-1 text-[#E99D1A] text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-[#E99D1A]" />
                  <span>{product.rating}</span>
                  <span className="text-[#1E1B18]/60 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B18] font-desi-serif mb-2">
                {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-[#1E1B18]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#1E1B18]/50 line-through font-mono">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8331E] text-white text-xs font-black border border-[#1E1B18]">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#1E1B18]/80 leading-relaxed mb-6 font-medium">
                {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
              </p>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#F15A24] mb-2 font-mono">
                    {lang === 'ml' ? 'പ്രധാന കരവിരുത് സവിശേഷതകൾ' : 'Key Artisan & Engineering Highlights'}
                  </h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, i) => (
                      <li key={i} className="text-xs text-[#1E1B18] flex items-start gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#F15A24] mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity & Buy Buttons */}
            <div className="pt-4 border-t-2 border-[#1E1B18]/20">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-black text-[#1E1B18]">
                  {lang === 'ml' ? 'എണ്ണം:' : 'Quantity:'}
                </span>
                <div className="flex items-center border-2 border-[#1E1B18] rounded-xl bg-white shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-[#1E1B18] hover:bg-[#FAF4E6] text-sm font-black"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-black text-[#1E1B18] min-w-[2.5rem] text-center font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-[#1E1B18] hover:bg-[#FAF4E6] text-sm font-black"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-[#19857B] font-mono font-black">
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider border-2 border-[#1E1B18] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-[#19857B] text-white shadow-[1px_1px_0px_#1E1B18]'
                      : 'bg-[#FAF4E6] text-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] hover:bg-[#F2E7D0]'
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

                <button
                  onClick={handleBuy}
                  className="py-3.5 px-4 rounded-full font-black text-xs uppercase tracking-wider bg-[#F15A24] text-white border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] hover:bg-[#E04D18] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
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