'use client';

import React, { useState } from 'react';
import { CartItem } from '@/lib/types';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, Check } from 'lucide-react';

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
    const ok = onApplyPromo(promoCode.trim());
    if (ok) {
      setPromoMessage({ text: '15% Festive discount applied successfully!', success: true });
    } else {
      setPromoMessage({ text: 'Invalid coupon. Try code HATKE15', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#16112A] via-[#100D1F] to-[#0A0714] border-l-2 border-amber-500/30 text-white flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          {/* Header */}
          <div className="p-5 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold font-serif text-white">
                {lang === 'ml' ? 'ഷോപ്പിംഗ് കാർട്ട്' : 'Your Shopping Bag'}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold">
                {cart.reduce((c, i) => c + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-amber-950/30 border-b border-amber-500/10">
            {subtotal >= freeShippingThreshold ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <Check className="w-4 h-4" />
                <span>{lang === 'ml' ? 'സൗജന്യ എക്സ്പ്രസ് ഡെലിവറി അൺലോക്ക് ആയി!' : 'You have unlocked FREE Express Delivery!'}</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-amber-200/90 mb-1.5">
                  {lang === 'ml'
                    ? `സൗജന്യ ഡെലിവറിക്കായി ₹${freeShippingThreshold - subtotal} കൂടി ചേർക്കുക`
                    : `Add ₹${freeShippingThreshold - subtotal} more for FREE shipping`}
                </p>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-amber-400/50" />
                </div>
                <h3 className="text-base font-bold text-slate-300">
                  {lang === 'ml' ? 'നിങ്ങളുടെ കാർട്ട് ശൂന്യമാണ്' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {lang === 'ml'
                    ? 'കാറ്റഗറി ഫോൾഡറുകൾ തുറന്ന് ഇഷ്ടപ്പെട്ട ഉൽപ്പന്നങ്ങൾ ചേർക്കൂ'
                    : 'Explore the category folders to discover authentic artisan creations.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                >
                  {lang === 'ml' ? 'ഷോപ്പിംഗ് ആരംഭിക്കൂ' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all"
                >
                  <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-slate-700">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {lang === 'ml' && item.product.nameMl ? item.product.nameMl : item.product.name}
                    </h4>
                    <span className="text-[11px] text-amber-400 font-extrabold block mt-0.5">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-[11px] font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-amber-500/20 bg-[#0F0C1E] space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApply} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon code (e.g. HATKE15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 uppercase font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] font-medium ${
                    promoMessage.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedDiscount}%):</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping:</span>
                  <span className={shippingFee === 0 ? 'text-emerald-400' : 'text-white'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-amber-400 text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-4 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-black shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>{lang === 'ml' ? 'ഓർഡർ ചെയ്യുക (ചെക്ക്ഔട്ട്)' : 'Proceed To Secure Checkout'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
