'use client';

import React, { useState } from 'react';
import { CartItem } from '@/lib/types';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Tag, Check, Stamp } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF7] border-l-3 border-[#1E1B18] text-[#1E1B18] flex flex-col shadow-2xl">
          {/* Header in Desimart Style */}
          <div className="p-5 border-b-2 border-[#1E1B18] bg-[#FAF4E6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F15A24] border border-[#1E1B18] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black font-desi-display text-[#1E1B18] lowercase">
                {lang === 'ml' ? 'നിങ്ങളുടെ സഞ്ചി' : 'your shopping potli'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E99D1A] border border-[#1E1B18] text-[#1E1B18] font-black font-mono">
                {cart.reduce((c, i) => c + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border-2 border-[#1E1B18] bg-[#FFFDF7] hover:bg-[#F2E3C6] flex items-center justify-center text-[#1E1B18] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-[#FFF8E6] border-b-2 border-dashed border-[#1E1B18]/30">
            {subtotal >= freeShippingThreshold ? (
              <div className="flex items-center gap-2 text-[#19857B] text-xs font-black">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'ml' ? 'സൗജന്യ എക്സ്പ്രസ് ഡെലിവറി അൺലോക്ക് ആയി!' : 'You unlocked FREE All-India Postal Delivery!'}</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#1E1B18] font-bold mb-1.5 font-mono">
                  {lang === 'ml'
                    ? `സൗജന്യ ഡെലിവറിക്കായി ₹${freeShippingThreshold - subtotal} കൂടി ചേർക്കുക`
                    : `Add ₹${freeShippingThreshold - subtotal} more for FREE shipping`}
                </p>
                <div className="w-full h-2.5 bg-[#FAF4E6] border border-[#1E1B18] rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-[#F15A24] rounded-full transition-all duration-300"
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
                <div className="w-16 h-16 rounded-full bg-[#FAF4E6] border-2 border-[#1E1B18] flex items-center justify-center mb-4 shadow-[2px_2px_0px_#1E1B18]">
                  <ShoppingBag className="w-8 h-8 text-[#F15A24]" />
                </div>
                <h3 className="text-lg font-black text-[#1E1B18] font-desi-serif">
                  {lang === 'ml' ? 'സഞ്ചിയിൽ ഉൽപ്പന്നങ്ങൾ ഒന്നുമില്ല' : 'Your potli is empty'}
                </h3>
                <p className="text-xs text-[#1E1B18]/70 mt-1 max-w-xs font-medium">
                  {lang === 'ml'
                    ? '9 കാറ്റഗറി സ്റ്റാമ്പുകൾ തുറന്ന് ഇഷ്ടപ്പെട്ട ഇന്ത്യൻ കരവിരുതുകൾ ചേർക്കൂ'
                    : 'Select any of the 9 craft stamps to discover authentic regional creations.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 desi-btn desi-btn-marigold text-xs px-6 py-2.5"
                >
                  {lang === 'ml' ? 'ഷോപ്പിംഗ് ആരംഭിക്കൂ' : 'Start Exploring'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[3px_3px_0px_#1E1B18] transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0 border border-[#1E1B18] p-1 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-[#1E1B18] truncate font-desi-serif">
                      {lang === 'ml' && item.product.nameMl ? item.product.nameMl : item.product.name}
                    </h4>
                    <span className="text-xs text-[#F15A24] font-black block mt-0.5 font-mono">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border-2 border-[#1E1B18] rounded-lg bg-white shadow-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#1E1B18] hover:bg-[#FAF4E6] text-xs font-black"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-black text-[#1E1B18] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#1E1B18] hover:bg-[#FAF4E6] text-xs font-black"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#1E1B18]/50 hover:text-[#C8331E] p-1 transition-colors"
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
            <div className="p-5 border-t-2 border-[#1E1B18] bg-[#FAF4E6] space-y-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApply} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#F15A24] absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. HATKE15)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full bg-white border-2 border-[#1E1B18] rounded-xl pl-8 pr-3 py-2 text-xs text-[#1E1B18] font-bold placeholder-slate-400 uppercase font-mono focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="desi-btn desi-btn-turmeric text-xs px-4 py-2"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] font-bold ${
                    promoMessage.success ? 'text-[#19857B]' : 'text-[#C8331E]'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 text-xs font-bold text-[#1E1B18]">
                <div className="flex justify-between">
                  <span className="text-[#1E1B18]/70">Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-[#19857B]">
                    <span>Festive Discount ({appliedDiscount}%):</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#1E1B18]/70">Indian Postal Delivery:</span>
                  <span className={shippingFee === 0 ? 'text-[#19857B]' : ''}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#1E1B18] pt-2 border-t-2 border-[#1E1B18]">
                  <span>Total Payable:</span>
                  <span className="text-[#F15A24] text-lg">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button in Chunky Desi Style */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-full font-black text-xs uppercase tracking-wider bg-[#F15A24] border-2 border-[#1E1B18] text-white shadow-[3px_3px_0px_#1E1B18] hover:bg-[#E04D18] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{lang === 'ml' ? 'ഓർഡർ പൂർത്തിയാക്കുക' : 'Proceed To Secure Checkout'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}