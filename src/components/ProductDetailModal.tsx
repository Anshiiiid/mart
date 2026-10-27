'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { X, Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, Eye, Sparkles } from 'lucide-react';

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
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuy = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#18132D] via-[#100D20] to-[#0A0713] rounded-3xl border-2 border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left: Product Media Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black/60 border border-amber-500/30">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.is3dAvailable && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>360° INTERACTIVE TURNTABLE READY</span>
                </div>
              )}

              {product.traditionalArtTag && (
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-amber-950/95 border border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{product.traditionalArtTag}</span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-300 block font-medium">100% Genuine</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-300 block font-medium">Fast Insured</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <RotateCcw className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] text-slate-300 block font-medium">7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
                  {product.category}
                </span>
                <span className="text-slate-500">•</span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif mb-2">
                {lang === 'ml' && product.nameMl ? product.nameMl : product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-black text-amber-400">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-500 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600/90 text-white text-xs font-black">
                    Save {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {lang === 'ml' && product.descriptionMl ? product.descriptionMl : product.description}
              </p>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {lang === 'ml' ? 'പ്രധാന സവിശേഷതകൾ' : 'Key Engineering & Craft Features'}
                  </h4>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs Grid */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mb-6 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                    {lang === 'ml' ? 'സ്പെസിഫിക്കേഷനുകൾ' : 'Specifications'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="flex flex-col">
                        <span className="text-slate-500 text-[10px]">{k}</span>
                        <span className="text-slate-200 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity & Buy Buttons */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold text-slate-300">
                  {lang === 'ml' ? 'എണ്ണം:' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-slate-700 rounded-xl bg-slate-900/80">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-emerald-400 font-medium">
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className={`py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                      : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{lang === 'ml' ? 'കാർട്ടിൽ ചേർത്തു' : 'Added!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{lang === 'ml' ? 'കാർട്ടിലേക്ക് ചേർക്കുക' : 'Add To Cart'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuy}
                  className="py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center gap-2"
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
