'use client';

import React, { useState } from 'react';
import { CartItem } from '@/lib/types';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  appliedDiscount: number;
  onApplyPromo: (code: string) => boolean;
  lang: 'en' | 'ml';
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedDiscount,
  onApplyPromo,
  lang,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const success = onApplyPromo(promoCode.trim());
    if (success) {
      setPromoMessage({ text: '15% Thoda Sale discount applied!', success: true });
    } else {
      setPromoMessage({ text: 'Invalid code. Use HATKE15 for 15% off.', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none font-hatke-body">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFFFF] border-l-3 border-[#111827] shadow-[8px_0px_0px_#111827] flex flex-col">
          {/* Header in Vazhayila Green */}
          <div className="p-5 border-b-2 border-[#111827] bg-[#1F5C3A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FACC15] border-2 border-[#111827] flex items-center justify-center text-[#111827] shadow-[2px_2px_0px_#111827]">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-black font-hatke-title tracking-tight text-[#FFFFFF]">
                  {lang === 'ml' ? 'നിങ്ങളുടെ സഞ്ചി' : 'Your Desi Potli'}
                </h3>
                <span className="text-[10px] text-[#FACC15] font-bold block">
                  {cart.length} {lang === 'ml' ? 'ഇനങ്ങൾ തിരഞ്ഞെടുത്തു' : 'Unique finds'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg-[#FACC15] text-[#111827] border-2 border-[#111827] shadow-[1.5px_1.5px_0px_#111827] flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Alert Bar */}
          <div className="bg-[#FEF08A] px-4 py-2 text-[11px] font-black text-[#111827] border-b-2 border-[#111827] flex items-center justify-between">
            <span>
              {subtotal >= freeShippingThreshold
                ? '🎉 100% സൗജന്യ ഡെലിവറി ലഭ്യമാണ്!'
                : `₹${freeShippingThreshold - subtotal} കൂടുതൽ വാങ്ങിയാൽ സൗജന്യ ഡെലിവറി`}
            </span>
            <span className="font-mono text-[10px] bg-[#111827] text-[#FACC15] px-2 py-0.5 rounded-full">
              ₹999 Free
            </span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6]">
            {cart.length === 0 ? (
              <div className="text-center py-24 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#FFFFFF] border-2 border-[#111827] flex items-center justify-center mx-auto shadow-[3px_3px_0px_#111827]">
                  <ShoppingBag className="w-8 h-8 text-[#1F5C3A]" />
                </div>
                <h4 className="text-base font-black text-[#111827] font-hatke-title">
                  {lang === 'ml' ? 'സഞ്ചി ശൂന്യമാണ്' : 'Your potli is empty'}
                </h4>
                <p className="text-xs text-[#111827]/70 max-w-xs mx-auto font-medium">
                  {lang === 'ml'
                    ? 'ഞങ്ങളുടെ 9 ഐലുകളിൽ നിന്ന് നിത്യോപയോഗ സാധനങ്ങൾ കണ്ടെത്തൂ.'
                    : 'Discover clever everyday finds from our 9 curated aisles.'}
                </p>
                <button
                  onClick={onClose}
                  className="desi-btn hatke-btn-yellow text-xs px-5 py-2 mt-2 cursor-pointer"
                >
                  {lang === 'ml' ? 'ഷോപ്പിംഗ് തുടങ്ങാം' : 'Explore Finds'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3.5 rounded-2xl bg-white border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827]"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#FAF9F6] border border-[#111827] p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#111827] truncate font-hatke-title">
                        {lang === 'ml' && item.product.nameMl ? item.product.nameMl : item.product.name}
                      </h4>
                      <p className="text-xs font-black text-[#1F5C3A] mt-0.5">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border-2 border-[#111827] rounded-lg bg-white shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#111827] hover:bg-[#FACC15] text-xs font-black"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-black text-[#111827] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#111827] hover:bg-[#FACC15] text-xs font-black"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#111827]/50 hover:text-[#111827] p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t-2 border-[#111827] bg-[#FFFFFF] space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApply} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#1F5C3A] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. HATKE15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#FAF9F6] border-2 border-[#111827] rounded-xl pl-8 pr-3 py-2 text-xs text-[#111827] font-bold placeholder-gray-400 uppercase font-mono focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="desi-btn hatke-btn-green text-xs px-4 py-2 cursor-pointer active:translate-y-[1px]"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPromoCode('HATKE15');
                    onApplyPromo('HATKE15');
                    setPromoMessage({ text: '15% Thoda Sale discount applied!', success: true });
                  }}
                  className="text-[11px] font-bold text-[#111827] bg-[#FEF08A] border-2 border-[#111827] rounded-xl px-3 py-1.5 text-left flex items-center justify-between w-full hover:bg-[#FACC15] cursor-pointer shadow-[1px_1px_0px_#111827]"
                >
                  <span>🎉 Tap to apply <strong>HATKE15</strong></span>
                  <span className="font-black underline">Save 15%</span>
                </button>
              )}

              {promoMessage && (
                <p
                  className={`text-[11px] font-bold ${
                    promoMessage.success ? 'text-[#1F5C3A]' : 'text-red-600'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs font-bold text-[#111827]">
                <div className="flex justify-between">
                  <span className="text-[#111827]/70">Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#1F5C3A]">
                    <span>Discount ({appliedDiscount}%):</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#111827]/70">Postal Delivery:</span>
                  <span className={shippingFee === 0 ? 'text-[#1F5C3A]' : ''}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#111827] pt-2 border-t-2 border-[#111827]">
                  <span>Total Payable:</span>
                  <span className="text-[#1F5C3A] text-lg font-hatke-title">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button in Bright Yellow #FACC15 with Deep Black text */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider bg-[#FACC15] border-2 border-[#111827] text-[#111827] shadow-[3px_3px_0px_#111827] hover:bg-[#EAB308] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{lang === 'ml' ? 'ഓർഡർ പൂർത്തിയാക്കുക' : 'Proceed To Secure Checkout'}</span>
                <ArrowRight className="w-4 h-4 text-[#111827]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
