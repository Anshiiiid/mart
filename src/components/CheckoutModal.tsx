'use client';

import React, { useState } from 'react';
import { CartItem, Order } from '@/lib/types';
import { X, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Smartphone, Banknote, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedDiscount: number;
  onOrderSuccess: (order: Order) => void;
  lang: 'en' | 'ml';
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  appliedDiscount,
  onOrderSuccess,
  lang,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'NetBanking' | 'COD',
  });

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        subtotal,
        discount: discountAmount,
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCompletedOrder(data.order);
        onOrderSuccess(data.order);

        // Fire festive confetti in Hatke Colors (Green, Yellow, White, Black)
        try {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#1F5C3A', '#FACC15', '#FFFFFF', '#111827', '#EAB308'],
          });
        } catch (err) {
          // confetti fallback
        }
      }
    } catch (error) {
      console.error('Order checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fadeIn font-hatke-body">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] rounded-3xl border-3 border-[#111827] shadow-[8px_8px_0px_#111827] overflow-hidden my-8 text-[#111827]">
        {/* Header */}
        <div className="p-6 border-b-2 border-[#111827] bg-[#1F5C3A] text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black font-hatke-title">
              {completedOrder
                ? (lang === 'ml' ? 'ഓർഡർ സ്ഥിരീകരിച്ചു! 🎉' : 'Order Confirmed! 🎉')
                : (lang === 'ml' ? 'സുരക്ഷിത പേയ്‌മെന്റ്' : 'Secure Desi Checkout')}
            </h3>
            <p className="text-xs text-[#FACC15] font-bold">
              {completedOrder
                ? (lang === 'ml' ? 'പാഴ്സൽ ഉടൻ യാത്ര തിരിക്കും' : 'Your parcel is being packed')
                : (lang === 'ml' ? 'തപാൽ വഴി സുരക്ഷിത ഡെലിവറി' : 'Fast Postal Delivery across Kerala')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#FACC15] text-[#111827] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {completedOrder ? (
          <div className="p-8 text-center space-y-4 bg-[#FAF9F6]">
            <div className="w-16 h-16 rounded-full bg-[#FACC15] border-3 border-[#111827] shadow-[3px_3px_0px_#111827] flex items-center justify-center mx-auto text-[#1F5C3A]">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h4 className="text-2xl font-black font-hatke-title text-[#111827]">
              {lang === 'ml' ? 'നന്ദി! ഓർഡർ വിജയകരം' : 'Nanni for choosing different!'}
            </h4>

            <p className="text-xs text-[#111827]/80 max-w-sm mx-auto leading-relaxed font-medium">
              Order ID: <span className="font-mono font-bold text-[#1F5C3A]">{completedOrder.id}</span>
              <br />
              {lang === 'ml'
                ? 'നിങ്ങളുടെ ഇമെയിലിലേക്ക് സ്ഥിരീകരണം അയച്ചിട്ടുണ്ട്. ഡെലിവറി തീയതി SMS വഴി അറിയിക്കും.'
                : 'Confirmation has been sent to your email with honest live tracking updates.'}
            </p>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#111827] shadow-[2px_2px_0px_#111827] max-w-sm mx-auto text-left text-xs space-y-1.5 font-bold">
              <div className="flex justify-between">
                <span className="text-[#111827]/60">Recipient:</span>
                <span>{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#111827]/60">Destination:</span>
                <span>{completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#1F5C3A] pt-2 border-t border-[#111827]/20">
                <span>Amount:</span>
                <span>₹{completedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="desi-btn hatke-btn-yellow px-8 py-3 text-xs uppercase tracking-wider cursor-pointer"
            >
              {lang === 'ml' ? 'ഷോപ്പിംഗ് തുടരുക' : 'Continue Exploring'}
            </button>
          </div>
        ) : (
          /* Form View */
          <div className="p-6 sm:p-8 bg-[#FAF9F6]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase text-[#111827] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-2 border-[#111827] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase text-[#111827] block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border-2 border-[#111827] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#111827] block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border-2 border-[#111827] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-[#111827] block mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House, Building, Street / Locality"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-white border-2 border-[#111827] rounded-xl px-3.5 py-2 text-xs font-bold text-[#111827] focus:outline-none mb-2"
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City / Town"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="bg-white border-2 border-[#111827] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods (Yellow Active State) */}
              <div>
                <label className="text-[11px] font-black uppercase text-[#111827] block mb-1.5">
                  Payment Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                    className={`p-3 rounded-2xl border-2 border-[#111827] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'UPI'
                        ? 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827]'
                        : 'bg-[#FFFFFF] text-[#111827] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-[#1F5C3A]" />
                    <span className="text-[11px] font-black">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                    className={`p-3 rounded-2xl border-2 border-[#111827] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'Card'
                        ? 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827]'
                        : 'bg-[#FFFFFF] text-[#111827] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#1F5C3A]" />
                    <span className="text-[11px] font-black">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'NetBanking' })}
                    className={`p-3 rounded-2xl border-2 border-[#111827] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'NetBanking'
                        ? 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827]'
                        : 'bg-[#FFFFFF] text-[#111827] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#1F5C3A]" />
                    <span className="text-[11px] font-black">NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`p-3 rounded-2xl border-2 border-[#111827] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'COD'
                        ? 'bg-[#FACC15] text-[#111827] shadow-[2.5px_2.5px_0px_#111827]'
                        : 'bg-[#FFFFFF] text-[#111827] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#1F5C3A]" />
                    <span className="text-[11px] font-black">Cash on Del.</span>
                  </button>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="pt-3 border-t-2 border-[#111827] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#111827]/70 block font-bold">Total Payable:</span>
                  <span className="text-xl font-black text-[#1F5C3A] font-hatke-title">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="desi-btn hatke-btn-yellow px-8 py-3.5 text-xs uppercase tracking-wider"
                >
                  <ShieldCheck className="w-4 h-4 text-[#111827]" />
                  <span>
                    {loading
                      ? (lang === 'ml' ? 'പ്രോസസ്സ് ചെയ്യുന്നു...' : 'Authorizing...')
                      : (lang === 'ml' ? 'ഓർഡർ സ്ഥിരീകരിക്കുക' : 'Confirm Order')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
