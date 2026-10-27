'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '@/lib/types';
import { X, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Banknote, Truck, Sparkles, ArrowRight } from 'lucide-react';

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
    name: 'Anshid',
    email: 'anshid@example.com',
    phone: '+91 98460 12345',
    street: 'Kaloor Kadavanthra Road',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682017',
    paymentMethod: 'UPI' as 'UPI' | 'Card' | 'NetBanking' | 'COD',
  });

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
  const shippingFee = subtotal >= 999 ? 0 : 99;
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

        // Fire celebratory festive confetti
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#06B6D4', '#E11D48', '#FFD700', '#10B981'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#18132D] via-[#100D20] to-[#0A0713] rounded-3xl border-2 border-amber-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden my-8 p-6 sm:p-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
              {lang === 'ml' ? 'ഓർഡർ സ്വീകരിച്ചു!' : 'TRANSACTION CONFIRMED'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif mt-1 mb-2">
              {lang === 'ml' ? 'നന്ദി! താങ്കളുടെ ഓർഡർ രേഖപ്പെടുത്തി' : 'Thank You For Your Order!'}
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto mb-6">
              {lang === 'ml'
                ? `ഓർഡർ നമ്പർ #${completedOrder.orderNumber} വിജയകരമായി പ്ലേസ് ചെയ്തു. ഉടൻ തന്നെ ഡെസ്പാച്ച് ചെയ്യുന്നതാണ്.`
                : `Order #${completedOrder.orderNumber} has been received. Our artisans are preparing your package for express dispatch.`}
            </p>

            {/* Order Details Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 text-left max-w-lg mx-auto mb-6 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono text-amber-300 font-bold">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Tracking Code:</span>
                <span className="font-mono text-cyan-300 font-bold">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Paid:</span>
                <span className="text-white font-black text-sm">₹{completedOrder.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="text-slate-200 text-right">
                  {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city},{' '}
                  {completedOrder.shippingAddress.pincode}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                {lang === 'ml' ? 'ഷോപ്പിംഗ് തുടരുക' : 'Continue Shopping'}
              </button>
              <a
                href="/admin"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>{lang === 'ml' ? 'അഡ്മിനിൽ ഓർഡർ കാണുക' : 'Inspect in Admin Portal'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
                {lang === 'ml' ? 'സുരക്ഷിത ചെക്ക്ഔട്ട്' : 'AUTHENTICATED CHECKOUT'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-serif mb-6">
              {lang === 'ml' ? 'ഡെലിവറി & പേയ്‌മെന്റ് വിവരങ്ങൾ' : 'Delivery & Payment Information'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    {lang === 'ml' ? 'പൂർണ്ണ നാമം' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    {lang === 'ml' ? 'ഫോൺ നമ്പർ' : 'Phone (WhatsApp)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    {lang === 'ml' ? 'മേൽവിലാസം' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    City / ജില്ല
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {lang === 'ml' ? 'പേയ്‌മെന്റ് രീതി' : 'Select Payment Gateway'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'UPI'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px] font-bold">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'Card'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'NetBanking' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'NetBanking'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-[11px] font-bold">NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      formData.paymentMethod === 'COD'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Cash on Del.</span>
                  </button>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Payable:</span>
                  <span className="text-xl font-black text-amber-400">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
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
