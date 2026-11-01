'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: string[];
  products: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  lang: 'en' | 'ml';
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  products,
  onAddToCart,
  onRemoveWishlist,
  onSelectProduct,
  lang,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn font-hatke-body">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l-3 border-[#111827] shadow-[-8px_0px_0px_#111827] flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b-2 border-[#111827] bg-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FACC15] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center text-[#111827]">
                <Heart className="w-5 h-5 fill-[#111827]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#111827] font-hatke-title tracking-tight flex items-center gap-2">
                  <span>{lang === 'ml' ? 'വിഷ് ലിസ്റ്റ്' : 'Saved Wishlist'}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1F5C3A] text-[#FFFFFF] font-black font-hatke-body">
                    {savedProducts.length}
                  </span>
                </h2>
                <p className="text-[11px] font-bold text-[#111827]/60">
                  {lang === 'ml' ? 'നിങ്ങളുടെ പ്രിയപ്പെട്ട ഹട്കെ ഉൽപ്പന്നങ്ങൾ' : 'Your saved Hatke everyday finds'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#F4F3EF] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center text-[#111827] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] flex items-center justify-center text-[#1F5C3A]">
                  <Heart className="w-10 h-10 stroke-1 fill-[#FAF9F6]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#111827] font-hatke-title">
                    {lang === 'ml' ? 'വിഷ് ലിസ്റ്റ് ശൂന്യമാണ്' : 'Your Wishlist is Empty'}
                  </h3>
                  <p className="text-xs text-[#111827]/70 mt-1 max-w-xs font-medium">
                    {lang === 'ml'
                      ? 'നിങ്ങൾക്ക് ഇഷ്ടപ്പെട്ട ഉൽപ്പന്നങ്ങളിൽ ഹൃദയ ചിഹ്നം അമർത്തി ഇവിടെ സൂക്ഷിക്കുക!'
                      : 'Tap the heart icon on any clever find to save it here for later!'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-[#FACC15] hover:bg-[#EAB308] border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] text-[#111827] text-xs font-black active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  {lang === 'ml' ? 'അങ്ങാടി കാണുക' : 'Explore Hatke Bazaar'}
                </button>
              </div>
            ) : (
              savedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3.5 rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] flex items-center gap-3.5"
                >
                  <div
                    onClick={() => {
                      onSelectProduct(prod);
                      onClose();
                    }}
                    className="w-16 h-16 rounded-xl bg-[#FFFFFF] border-2 border-[#111827] overflow-hidden p-1 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      onClick={() => {
                        onSelectProduct(prod);
                        onClose();
                      }}
                      className="text-xs font-black text-[#111827] truncate cursor-pointer hover:text-[#1F5C3A] font-hatke-title"
                    >
                      {lang === 'ml' && prod.nameMl ? prod.nameMl : prod.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-[#111827] font-hatke-title">₹{prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-[#111827]/50 line-through font-mono">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => {
                          onAddToCart(prod);
                          onRemoveWishlist(prod.id);
                        }}
                        className="px-3 py-1 rounded-full bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] border-2 border-[#111827] shadow-[1.5px_1.5px_0px_#111827] text-[10px] font-black flex items-center gap-1 active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#111827]" />
                        <span>{lang === 'ml' ? 'സഞ്ചിയിലേക്ക്' : 'Move to Cart'}</span>
                      </button>

                      <button
                        onClick={() => onRemoveWishlist(prod.id)}
                        className="p-1 rounded-lg hover:bg-[#FFFFFF] text-[#111827]/60 hover:text-red-600 border border-transparent hover:border-[#111827] transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          {savedProducts.length > 0 && (
            <div className="p-4 border-t-2 border-[#111827] bg-[#FAF9F6] flex items-center justify-between text-xs font-bold text-[#111827]/80">
              <span className="flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#1F5C3A]" />
                {lang === 'ml' ? 'വില മാറുമ്പോൾ അപ്‌ഡേറ്റ് ലഭിക്കും' : 'Prices guaranteed before you pay'}
              </span>
              <button
                onClick={onClose}
                className="text-xs font-black text-[#1F5C3A] hover:underline cursor-pointer"
              >
                {lang === 'ml' ? 'തുടരുക' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
