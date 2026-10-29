'use client';

import React, { useState } from 'react';
import { CartItem, Order } from '@/lib/types';
import { X, CheckCircle2, ShieldCheck, ArrowRight, CreditCard, Smartphone, Banknote, Truck, Sparkles, Stamp } from 'lucide-react';
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

        // Fire celebratory festive confetti
        try {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#F15A24', '#E99D1A', '#19857B', '#C8331E', '#1E1B18'],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFFDF7] rounded-3xl border-3 border-[#1E1B18] shadow-[10px_10px_0px_#1E1B18] overflow-hidden my-8 p-6 sm:p-8 text-[#1E1B18]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FAF4E6] hover:bg-[#F2E3C6] border-2 border-[#1E1B18] flex items-center justify-center text-[#1E1B18] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#19857B] border-2 border-[#1E1B18] text-white flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1E1B18] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E99D1A] border-2 border-[#1E1B18] text-[#1E1B18] text-xs font-black uppercase tracking-widest mb-2">
              <Stamp className="w-3.5 h-3.5 text-[#C8331E]" />
              <span>{lang === 'ml' ? 'ഓർഡർ സ്വീകരിച്ചു!' : 'DESI PARCEL REGISTERED'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-desi-display lowercase mt-1 mb-2">
              {lang === 'ml' ? 'നന്ദി! താങ്കളുടെ ഓർഡർ രേഖപ്പെടുത്തി' : 'thank you for your order!'}
            </h2>
            <p className="text-xs text-[#1E1B18]/80 max-w-md mx-auto mb-6 font-medium">
              {lang === 'ml'
                ? `ഓർഡർ നമ്പർ #${completedOrder.orderNumber} വിജയകരമായി പ്ലേസ് ചെയ്തു. ഉടൻ തന്നെ ഡെസ്പാച്ച് ചെയ്യുന്നതാണ്.`
                : `Order #${completedOrder.orderNumber} confirmed. Our master artisans are preparing your package.`}
            </p>

            {/* Order Details Card */}
            <div className="p-5 rounded-2xl bg-[#FAF4E6] border-2 border-[#1E1B18] shadow-[4px_4px_0px_#1E1B18] text-left max-w-lg mx-auto mb-6 space-y-2.5 text-xs font-bold">
              <div className="flex justify-between border-b border-[#1E1B18]/20 pb-2">
                <span className="text-[#1E1B18]/70">Order ID:</span>
                <span className="font-mono text-[#F15A24] font-black">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#1E1B18]/20 pb-2">
                <span className="text-[#1E1B18]/70">Indian Postal Tracking:</span>
                <span className="font-mono text-[#19857B] font-black">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#1E1B18]/20 pb-2">
                <span className="text-[#1E1B18]/70">Total Amount:</span>
                <span className="text-[#1E1B18] font-black text-sm">₹{completedOrder.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#1E1B18]/70">Shipping Address:</span>
                <span className="text-[#1E1B18] text-right font-medium">
                  {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city},{' '}
                  {completedOrder.shippingAddress.pincode}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="desi-btn desi-btn-marigold text-xs px-6 py-3"
              >
                {lang === 'ml' ? 'ഷോപ്പിംഗ് തുടരുക' : 'Continue Shopping'}
              </button>
              <a
                href="/admin"
                className="desi-btn desi-btn-cream text-xs px-6 py-3"
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
              <Sparkles className="w-4 h-4 text-[#F15A24]" />
              <span className="text-xs uppercase font-mono font-black tracking-widest text-[#F15A24]">
                {lang === 'ml' ? 'സുരക്ഷിത ചെക്ക്ഔട്ട്' : 'AUTHENTICATED INDIAN DESI CHECKOUT'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-desi-display lowercase mb-6">
              {lang === 'ml' ? 'ഡെലിവറി & പേയ്‌മെന്റ് വിവരങ്ങൾ' : 'delivery & parcel details'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-1">
                    {lang === 'ml' ? 'പൂർണ്ണ നാമം' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1B18] font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-1">
                    {lang === 'ml' ? 'ഫോൺ നമ്പർ' : 'Phone (WhatsApp)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1B18] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1B18] font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-1">
                    {lang === 'ml' ? 'മേൽവിലാസം' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1B18] font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-1">
                    City / ജില്ല
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1B18] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1B18] font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-[#FAF4E6] border-2 border-[#1E1B18] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1B18] font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-[11px] font-black text-[#1E1B18] uppercase tracking-wider mb-2">
                  {lang === 'ml' ? 'പേയ്‌മെന്റ് രീതി' : 'Select Payment Gateway'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                    className={`p-3 rounded-2xl border-2 border-[#1E1B18] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'UPI'
                        ? 'bg-[#F15A24] text-white shadow-[2.5px_2.5px_0px_#1E1B18]'
                        : 'bg-[#FAF4E6] text-[#1E1B18] hover:bg-[#F2E7D0]'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-[11px] font-black">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Card' })}
                    className={`p-3 rounded-2xl border-2 border-[#1E1B18] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'Card'
                        ? 'bg-[#F15A24] text-white shadow-[2.5px_2.5px_0px_#1E1B18]'
                        : 'bg-[#FAF4E6] text-[#1E1B18] hover:bg-[#F2E7D0]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px] font-black">Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'NetBanking' })}
                    className={`p-3 rounded-2xl border-2 border-[#1E1B18] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'NetBanking'
                        ? 'bg-[#F15A24] text-white shadow-[2.5px_2.5px_0px_#1E1B18]'
                        : 'bg-[#FAF4E6] text-[#1E1B18] hover:bg-[#F2E7D0]'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span className="text-[11px] font-black">NetBanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className={`p-3 rounded-2xl border-2 border-[#1E1B18] flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === 'COD'
                        ? 'bg-[#F15A24] text-white shadow-[2.5px_2.5px_0px_#1E1B18]'
                        : 'bg-[#FAF4E6] text-[#1E1B18] hover:bg-[#F2E7D0]'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="text-[11px] font-black">Cash on Del.</span>
                  </button>
                </div>
              </div>

              {/* Order Final Summary */}
              <div className="pt-3 border-t-2 border-[#1E1B18] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#1E1B18]/70 block font-bold">Total Payable:</span>
                  <span className="text-xl font-black text-[#F15A24]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="desi-btn desi-btn-marigold px-8 py-3.5 text-xs uppercase tracking-wider"
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