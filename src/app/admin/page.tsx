'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  Megaphone,
  DollarSign,
  Truck,
  Users,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Percent,
  ShoppingBag,
  Tag,
  Phone,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Send,
  Eye,
  ArrowUpRight,
  Sparkles,
  Layers,
  Receipt,
  Wallet,
  CreditCard,
  X,
  Share2,
} from 'lucide-react';
import {
  Product,
  CategoryFolder,
  Order,
  CustomerUser,
  AdminAnalytics,
  OrderStatus,
  Coupon,
  MarketingCampaign,
  WhatsAppTemplate,
  AnnouncementBanner,
  BusinessExpense,
  FinancialSummary,
  PayoutSettlement,
} from '@/lib/types';
import {
  initialCategories,
  initialProducts,
  initialOrders,
  initialCustomers,
  initialCoupons,
  initialCampaigns,
  initialWhatsAppTemplates,
  initialAnnouncementBanner,
  initialExpenses,
  initialPayoutSettlements,
} from '@/lib/seed-data';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab
  type AdminTab = 'analytics' | 'products' | 'marketing' | 'accounts' | 'orders' | 'customers';
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Live data states
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryFolder[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<CustomerUser[]>(initialCustomers);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(initialCampaigns);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>(initialWhatsAppTemplates);
  const [banner, setBanner] = useState<AnnouncementBanner>(initialAnnouncementBanner);
  const [expenses, setExpenses] = useState<BusinessExpense[]>(initialExpenses);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [payouts, setPayouts] = useState<PayoutSettlement[]>(initialPayoutSettlements);

  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    nameMl: '',
    category: 'Kitchen Finds',
    categorySlug: 'kitchen-cookware',
    price: 999,
    originalPrice: 1499,
    costPrice: 450,
    stock: 25,
    image: '/products/cookware.jpg',
    badge: 'New find' as Product['badge'],
    tileColor: 'leaf' as Product['tileColor'],
    description: '',
    descriptionMl: '',
    isFeatured: true,
    tags: 'Handmade, Desi, Clever',
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 10,
    minOrderValue: 499,
    usageLimit: 200,
    expiresAt: '2026-12-31',
    description: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Packaging' as BusinessExpense['category'],
    amount: 1500,
    date: '2026-11-01',
    paymentMode: 'UPI' as BusinessExpense['paymentMode'],
    notes: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch all store data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, ordRes, custRes, analRes, mktRes, accRes] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/categories').catch(() => null),
        fetch('/api/orders').catch(() => null),
        fetch('/api/customers').catch(() => null),
        fetch('/api/analytics').catch(() => null),
        fetch('/api/marketing').catch(() => null),
        fetch('/api/accounts').catch(() => null),
      ]);

      if (prodRes?.ok) {
        const d = await prodRes.json();
        if (d.products) setProducts(d.products);
      }
      if (catRes?.ok) {
        const d = await catRes.json();
        if (d.categories) setCategories(d.categories);
      }
      if (ordRes?.ok) {
        const d = await ordRes.json();
        if (d.orders) setOrders(d.orders);
      }
      if (custRes?.ok) {
        const d = await custRes.json();
        if (d.customers) setCustomers(d.customers);
      }
      if (analRes?.ok) {
        const d = await analRes.json();
        if (d.analytics) setAnalytics(d.analytics);
      }
      if (mktRes?.ok) {
        const d = await mktRes.json();
        if (d.coupons) setCoupons(d.coupons);
        if (d.campaigns) setCampaigns(d.campaigns);
        if (d.whatsappTemplates) setWhatsappTemplates(d.whatsappTemplates);
        if (d.banner) setBanner(d.banner);
      }
      if (accRes?.ok) {
        const d = await accRes.json();
        if (d.summary) setFinancialSummary(d.summary);
        if (d.expenses) setExpenses(d.expenses);
        if (d.payouts) setPayouts(d.payouts);
      }
    } catch (e) {
      console.warn('Using seeded data for admin dashboard:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    const today = new Date().toISOString().split('T')[0];
    setExpenseForm((prev) => ({ ...prev, date: today }));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin' || pin === 'admin123' || pin === '') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('സ്വാഗതം! Hatke Admin Dashboard ready.');
    } else {
      setAuthError('തെറ്റായ PIN കോഡ്. 1234 ഉപയോഗിക്കുക അല്ലെങ്കിൽ വെറുതെ Unlock ചെയ്യുക.');
    }
  };

  // Stock quick adjustment for mobile (+1 / -1)
  const handleStockDelta = async (id: string, delta: number) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p))
    );
    try {
      await fetch('/api/products/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delta }),
      });
    } catch {
      // rollback handled on refresh
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const discount =
      productForm.originalPrice > productForm.price
        ? Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100)
        : 0;

    const payload = {
      ...productForm,
      discountPercent: discount,
      tags: productForm.tags.split(',').map((t) => t.trim()),
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const d = await res.json();
          setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? d.product : p)));
          showToast(`'${payload.name}' അപ്‌ഡേറ്റ് ചെയ്തു!`);
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const d = await res.json();
          setProducts((prev) => [d.product, ...prev]);
          showToast(`പുതിയ ഫൈൻഡ് '${payload.name}' ചേർത്തു!`);
        }
      }
    } catch (err) {
      console.error(err);
      // Fallback local update
      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload, id: p.id } : p))
        );
      } else {
        const newLocal: Product = {
          ...payload,
          id: `prod-${Date.now()}`,
          rating: 5,
          reviewCount: 1,
          features: [],
          specs: {},
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [newLocal, ...prev]);
      }
      showToast('ലോക്കലായി അപ്‌ഡേറ്റ് ചെയ്തു.');
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Open Edit Product Modal
  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      nameMl: p.nameMl || '',
      category: p.category,
      categorySlug: p.categorySlug,
      price: p.price,
      originalPrice: p.originalPrice || Math.round(p.price * 1.3),
      costPrice: p.costPrice || Math.round(p.price * 0.45),
      stock: p.stock,
      image: p.image,
      badge: p.badge || 'New find',
      tileColor: p.tileColor || 'leaf',
      description: p.description,
      descriptionMl: p.descriptionMl || '',
      isFeatured: Boolean(p.isFeatured),
      tags: p.tags?.join(', ') || 'Handmade, Desi',
    });
    setShowProductModal(true);
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`'${name}' നീക്കം ചെയ്യണോ?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`'${name}' നീക്കം ചെയ്തു`);
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order status updated to: ${newStatus}`);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle coupon
  const handleToggleCoupon = async (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    try {
      await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_coupon', id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Save new coupon
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    try {
      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_coupon',
          ...couponForm,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setCoupons((prev) => [d.coupon, ...prev]);
      } else {
        const newLocalCoupon: Coupon = {
          id: `coup-${Date.now()}`,
          code: couponForm.code.toUpperCase(),
          discountType: couponForm.discountType,
          discountValue: Number(couponForm.discountValue),
          minOrderValue: Number(couponForm.minOrderValue),
          usageLimit: Number(couponForm.usageLimit),
          usageCount: 0,
          expiresAt: couponForm.expiresAt,
          isActive: true,
          description: couponForm.description,
        };
        setCoupons((prev) => [newLocalCoupon, ...prev]);
      }
      showToast(`കൂപ്പൺ ${couponForm.code.toUpperCase()} വിജയകരമായി ചേർത്തു!`);
      setShowCouponModal(false);
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 499,
        usageLimit: 200,
        expiresAt: '2026-12-31',
        description: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Save new expense
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title.trim()) return;
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_expense',
          ...expenseForm,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setExpenses((prev) => [d.expense, ...prev]);
      } else {
        const localExp: BusinessExpense = {
          id: `exp-${Date.now()}`,
          title: expenseForm.title,
          category: expenseForm.category,
          amount: Number(expenseForm.amount),
          date: expenseForm.date,
          paymentMode: expenseForm.paymentMode,
          notes: expenseForm.notes,
        };
        setExpenses((prev) => [localExp, ...prev]);
      }
      showToast(`ചിലവ് ₹${expenseForm.amount} രേഖപ്പെടുത്തി!`);
      setShowExpenseModal(false);
      setExpenseForm({
        title: '',
        category: 'Packaging',
        amount: 1500,
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'UPI',
        notes: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Copy coupon or text
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    showToast(`Copied: ${text}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.nameMl && p.nameMl.includes(productSearch)) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCat = productCategoryFilter === 'all' || p.categorySlug === productCategoryFilter;

      let matchesStock = true;
      if (productStockFilter === 'in_stock') matchesStock = (p.stock || 0) > 5;
      else if (productStockFilter === 'low_stock') matchesStock = (p.stock || 0) > 0 && (p.stock || 0) <= 5;
      else if (productStockFilter === 'out_of_stock') matchesStock = (p.stock || 0) === 0;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  // Revenue & calculations
  const totalGrossRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0),
    [orders]
  );
  const totalPaidOrders = useMemo(
    () => orders.filter((o) => o.paymentStatus === 'Paid').length,
    [orders]
  );
  const averageOrderVal = totalPaidOrders > 0 ? Math.round(totalGrossRevenue / totalPaidOrders) : 2180;
  const totalExpensesSum = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const estimatedProfit = Math.max(0, Math.round(totalGrossRevenue * 0.48) - totalExpensesSum);
  const profitMargin = totalGrossRevenue > 0 ? ((estimatedProfit / totalGrossRevenue) * 100).toFixed(1) : '32.4';

  // ---------------- AUTHENTICATION GATE ----------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1F5C3A] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[6px_6px_0px_#111827] text-center relative overflow-hidden">
          {/* Top Decorative Tile Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#FACC15]" />

          {/* Hatke Tilted k Brand Logo */}
          <div className="w-16 h-16 rounded-2xl bg-[#FACC15] border-2 border-[#111827] flex items-center justify-center mx-auto mb-3 shadow-[3px_3px_0px_#111827]">
            <span className="font-hatke-title text-4xl font-extrabold text-[#1F5C3A] inline-block hatke-k-tilt">
              k
            </span>
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-[#1F5C3A]/10 border border-[#1F5C3A]/20 text-[#1F5C3A] text-xs font-bold font-hatke-body uppercase tracking-wider mb-2">
            Hatke Official Admin Portal
          </div>

          <h1 className="text-2xl sm:text-3xl font-hatke-title font-black text-[#111827] tracking-tight">
            ഹട്കെ അഡ്മിൻ കൺസോൾ
          </h1>
          <p className="text-xs text-[#111827]/70 mt-1 mb-6 font-hatke-body">
            Everyday finds, a little different. Manage analytics, products & financials on mobile or PC.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter Admin PIN (Default: 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center bg-white border-2 border-[#111827] rounded-2xl py-3.5 px-4 text-[#111827] text-base font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FACC15] shadow-[2px_2px_0px_#111827]"
              />
            </div>

            {authError && (
              <p className="text-xs font-bold text-[#E6337A] bg-[#E6337A]/10 p-2 rounded-xl border border-[#E6337A]/30">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-hatke-title font-black text-sm uppercase tracking-wider border-2 border-[#111827] shadow-[4px_4px_0px_#111827] active:translate-y-0.5 active:shadow-[1px_1px_0px_#111827] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Dashboard (ലോഗിൻ)</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#111827]/20 flex items-center justify-between text-xs font-hatke-body text-[#111827]/70">
            <span>Quick PIN: <strong>1234</strong></span>
            <Link
              href="/"
              className="hover:text-[#1F5C3A] font-bold flex items-center gap-1 transition-colors underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN ADMIN INTERFACE ----------------
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111827] flex flex-col font-hatke-body pb-24 sm:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#1F5C3A] text-white px-4 py-3 rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_#111827] flex items-center gap-2 text-xs sm:text-sm font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-[#FACC15]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER (Sticky, Clean, Brand Identity) */}
      <header className="sticky top-0 z-40 bg-[#1F5C3A] text-white border-b-2 border-[#111827] px-3 sm:px-6 py-2.5 sm:py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Brand Wordmark & Tilted 'k' */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="p-1.5 sm:p-2 rounded-xl bg-[#FAF9F6] text-[#111827] border-2 border-[#111827] hover:bg-[#FACC15] transition-all shadow-[2px_2px_0px_#111827] active:translate-y-0.5"
              title="Return to Hatke Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FACC15] border-2 border-[#111827] flex items-center justify-center shadow-[2px_2px_0px_#111827]">
                <span className="font-hatke-title text-xl font-black text-[#1F5C3A] inline-block hatke-k-tilt">
                  k
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-hatke-title text-base sm:text-xl font-extrabold tracking-tight text-[#FAF9F6]">
                    Hatke
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#FACC15] text-[#111827] text-[10px] font-black uppercase tracking-wider border border-[#111827]">
                    Admin
                  </span>
                </div>
                <p className="text-[10px] text-[#FAF9F6]/80 hidden sm:block">
                  Everyday finds, a little different • Kerala Edition
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[#FAF9F6] text-[#111827] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] active:translate-y-0.5 hover:bg-[#FACC15] transition-all"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  nameMl: '',
                  category: 'Kitchen Finds',
                  categorySlug: 'kitchen-cookware',
                  price: 999,
                  originalPrice: 1499,
                  costPrice: 450,
                  stock: 25,
                  image: '/products/cookware.jpg',
                  badge: 'New find',
                  tileColor: 'leaf',
                  description: '',
                  descriptionMl: '',
                  isFeatured: true,
                  tags: 'Handmade, Desi, Clever',
                });
                setShowProductModal(true);
              }}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-hatke-title font-bold text-xs border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center gap-1 sm:gap-1.5 cursor-pointer active:translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="hidden xs:inline">Add Find</span>
              <span className="xs:hidden">+ Find</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#111827] text-white font-bold text-xs border-2 border-[#111827] shadow-[2px_2px_0px_#111827] hover:bg-[#1F5C3A] transition-all active:translate-y-0.5"
              title="Lock Console"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* DESKTOP TOP NAV TABS (Visible on sm screens and up) */}
      <nav className="hidden sm:block bg-[#FAF9F6] border-b-2 border-[#111827] px-4 sm:px-8 py-2 sticky top-[57px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-hatke-title font-bold flex items-center gap-2 border-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[3px_3px_0px_#111827] -translate-y-0.5'
                : 'bg-white text-[#111827] border-[#111827]/40 hover:border-[#111827]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#FACC15]" />
            <span>Overview & Analytics (അനലിറ്റിക്സ്)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-hatke-title font-bold flex items-center gap-2 border-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[3px_3px_0px_#111827] -translate-y-0.5'
                : 'bg-white text-[#111827] border-[#111827]/40 hover:border-[#111827]'
            }`}
          >
            <Package className="w-4 h-4 text-[#FACC15]" />
            <span>Products & Edit ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-4 py-2 rounded-xl text-xs font-hatke-title font-bold flex items-center gap-2 border-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'marketing'
                ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[3px_3px_0px_#111827] -translate-y-0.5'
                : 'bg-white text-[#111827] border-[#111827]/40 hover:border-[#111827]'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#FACC15]" />
            <span>Marketing Hub (മാർക്കറ്റിംഗ്)</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 rounded-xl text-xs font-hatke-title font-bold flex items-center gap-2 border-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'accounts'
                ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[3px_3px_0px_#111827] -translate-y-0.5'
                : 'bg-white text-[#111827] border-[#111827]/40 hover:border-[#111827]'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#FACC15]" />
            <span>Accounts & Profit (അക്കൗണ്ട്സ്)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-hatke-title font-bold flex items-center gap-2 border-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[3px_3px_0px_#111827] -translate-y-0.5'
                : 'bg-white text-[#111827] border-[#111827]/40 hover:border-[#111827]'
            }`}
          >
            <Truck className="w-4 h-4 text-[#FACC15]" />
            <span>Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-hatke-title font-bold flex items-center gap-2 border-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[3px_3px_0px_#111827] -translate-y-0.5'
                : 'bg-white text-[#111827] border-[#111827]/40 hover:border-[#111827]'
            }`}
          >
            <Users className="w-4 h-4 text-[#FACC15]" />
            <span>Customers ({customers.length})</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-4 sm:pt-6 flex-1">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS DASHBOARD                    */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Top Stat Cards Grid (Mobile friendly 2-col, Desktop 4-col) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Stat 1: Total Revenue */}
              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-[#111827]/70 uppercase tracking-wider">
                    Gross Sales
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#1F5C3A]/10 text-[#1F5C3A] flex items-center justify-center font-bold">
                    ₹
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-hatke-title font-black text-[#1F5C3A]">
                  ₹{totalGrossRevenue.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#1F5C3A] mt-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% this week</span>
                </div>
              </div>

              {/* Stat 2: Orders & AOV */}
              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-[#111827]/70 uppercase tracking-wider">
                    Total Orders
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#FACC15]/20 text-[#111827] flex items-center justify-center font-bold">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-hatke-title font-black text-[#111827]">
                  {orders.length} <span className="text-xs font-normal text-gray-500">parcels</span>
                </div>
                <div className="text-[11px] font-medium text-gray-600 mt-1.5">
                  Avg Order: <strong>₹{averageOrderVal}</strong>
                </div>
              </div>

              {/* Stat 3: Est Net Profit */}
              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-[#111827]/70 uppercase tracking-wider">
                    Net Profit (ലാഭം)
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#1F5C3A] flex items-center justify-center font-bold">
                    <Percent className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-hatke-title font-black text-[#1F5C3A]">
                  ₹{estimatedProfit.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-1.5">
                  Margin: {profitMargin}% net
                </div>
              </div>

              {/* Stat 4: Active Catalog */}
              <div className="p-3.5 sm:p-5 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-[#111827]/70 uppercase tracking-wider">
                    Everyday Finds
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#1F5C3A]/15 text-[#1F5C3A] flex items-center justify-center font-bold">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-hatke-title font-black text-[#111827]">
                  {products.length} <span className="text-xs font-normal text-gray-500">items</span>
                </div>
                <div className="text-[11px] font-bold text-[#1F5C3A] mt-1.5">
                  {products.filter((p) => (p.stock || 0) <= 5).length} low stock alert
                </div>
              </div>
            </div>

            {/* Daily Sales Bar Chart & Regional Kerala Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Daily Sales Visual Bars */}
              <div className="lg:col-span-2 p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-hatke-title font-extrabold text-base sm:text-lg text-[#111827]">
                      Daily Sales Trend (കഴിഞ്ഞ 7 ദിവസങ്ങൾ)
                    </h3>
                    <p className="text-xs text-gray-500">Peak weekend traffic from Kerala shoppers</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#1F5C3A]/10 text-[#1F5C3A] text-xs font-bold border border-[#1F5C3A]/20">
                    Live Feed
                  </span>
                </div>

                {/* Visual Bars */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-3 items-end h-44 pt-6 pb-2 border-b-2 border-dashed border-gray-200">
                  {(analytics?.dailySales || [
                    { day: 'Mon', date: '26 Oct', amount: 14200, orders: 8 },
                    { day: 'Tue', date: '27 Oct', amount: 19800, orders: 11 },
                    { day: 'Wed', date: '28 Oct', amount: 24500, orders: 15 },
                    { day: 'Thu', date: '29 Oct', amount: 31200, orders: 19 },
                    { day: 'Fri', date: '30 Oct', amount: 28400, orders: 17 },
                    { day: 'Sat', date: '31 Oct', amount: 42100, orders: 26 },
                    { day: 'Sun', date: '01 Nov', amount: 38900, orders: 22 },
                  ]).map((item, idx) => {
                    const maxVal = 45000;
                    const heightPercent = Math.max(15, Math.round((item.amount / maxVal) * 100));
                    const isPeak = item.day === 'Sat' || item.day === 'Sun';

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                        <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{Math.round(item.amount / 1000)}k
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-xl border-2 border-[#111827] transition-all group-hover:scale-105 ${
                            isPeak
                              ? 'bg-[#FACC15] shadow-[2px_0px_0px_#111827]'
                              : 'bg-[#1F5C3A] shadow-[2px_0px_0px_#111827]'
                          }`}
                        />
                        <div className="text-center">
                          <span className="text-[11px] font-bold text-[#111827] block">{item.day}</span>
                          <span className="text-[9px] text-gray-400 hidden sm:block">{item.orders} ord</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-3 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#1F5C3A] border border-[#111827]" />
                    <span>Weekday Finds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#FACC15] border border-[#111827]" />
                    <span>Weekend Rush (Peak)</span>
                  </div>
                </div>
              </div>

              {/* Kerala & Regional Order Share */}
              <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-hatke-title font-extrabold text-base sm:text-lg text-[#111827]">
                      Regional Share (കേരളം)
                    </h3>
                    <span className="text-xs font-bold text-[#1F5C3A]">Orders</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Top delivering districts for Hatke parcels
                  </p>

                  <div className="space-y-3">
                    {(analytics?.regionalDistribution || [
                      { city: 'Kochi (Ernakulam)', orders: 48, percentage: 38 },
                      { city: 'Kozhikode', orders: 28, percentage: 22 },
                      { city: 'Thiruvananthapuram', orders: 22, percentage: 18 },
                      { city: 'Thrissur', orders: 14, percentage: 10 },
                      { city: 'Malappuram & Kannur', orders: 11, percentage: 8 },
                      { city: 'Bengaluru (Malayalis)', orders: 6, percentage: 4 },
                    ]).map((reg, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#111827]">{reg.city}</span>
                          <span className="text-gray-600">{reg.percentage}% ({reg.orders} ord)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-gray-100 border border-[#111827]/20 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              idx === 0 ? 'bg-[#1F5C3A]' : idx === 1 ? 'bg-[#FACC15]' : 'bg-[#111827]'
                            }`}
                            style={{ width: `${reg.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-xs font-bold text-center text-[#1F5C3A]">
                  🚚 Fast delivery partnership with Delhivery Surface
                </div>
              </div>
            </div>

            {/* Conversion Funnel & Live Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Funnel */}
              <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827]">
                <h3 className="font-hatke-title font-extrabold text-base sm:text-lg text-[#111827] mb-1">
                  E-Commerce Funnel (കൺവേർഷൻ)
                </h3>
                <p className="text-xs text-gray-500 mb-4">From visitor to parcel delivered</p>

                <div className="space-y-2.5">
                  {(analytics?.conversionFunnel || [
                    { step: 'Store Visitors', count: 18450, percentage: 100 },
                    { step: 'Product Views', count: 9620, percentage: 52 },
                    { step: 'Added to Bag', count: 2140, percentage: 11.6 },
                    { step: 'Reached Checkout', count: 980, percentage: 5.3 },
                    { step: 'Completed Orders', count: 674, percentage: 3.65 },
                  ]).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#111827]/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#1F5C3A] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#111827]">{step.step}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black font-hatke-title text-[#1F5C3A]">
                          {step.count.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-500 block">({step.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-Time Live Activity */}
              <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-hatke-title font-extrabold text-base sm:text-lg text-[#111827]">
                    Recent Store Activity (ലൈവ് അപ്‌ഡേറ്റ്സ്)
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">Latest dispatches, orders and marketing alerts</p>

                <div className="space-y-3">
                  {(analytics?.recentActivities || [
                    { id: '1', action: 'New order #HH-89216 placed by Aiswarya Menon (Kochi)', time: '8 mins ago', type: 'order' },
                    { id: '2', action: 'Stock replenished: Neo-Vortex Air Fryer (+15 units)', time: '35 mins ago', type: 'stock' },
                    { id: '3', action: 'WhatsApp broadcast triggered: "പാഴ്സൽ വന്നു" sent to 32 buyers', time: '1 hour ago', type: 'marketing' },
                    { id: '4', action: 'New VIP shopper joined: Muhammed Nihal (Kozhikode)', time: '3 hours ago', type: 'user' },
                    { id: '5', action: 'Delivered Order #HH-77210 in Thiruvananthapuram', time: '5 hours ago', type: 'delivery' },
                  ]).map((act, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-[#FACC15]/20 text-[#111827] border border-[#111827]/20">
                        {act.type === 'order' && <ShoppingBag className="w-3.5 h-3.5 text-[#1F5C3A]" />}
                        {act.type === 'stock' && <Package className="w-3.5 h-3.5 text-[#FACC15]" />}
                        {act.type === 'marketing' && <Megaphone className="w-3.5 h-3.5 text-[#111827]" />}
                        {act.type === 'user' && <Users className="w-3.5 h-3.5 text-blue-600" />}
                        {act.type === 'delivery' && <Truck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#111827] leading-snug">{act.action}</p>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {act.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCTS & INVENTORY DASHBOARD (MOBILE OPTIMIZED)  */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Action Bar & Mobile Search */}
            <div className="p-3.5 sm:p-5 rounded-3xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827] space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center sm:justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search finds by title, malayalam or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] text-xs sm:text-sm font-bold text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Stock Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                  {[
                    { id: 'all', label: `All (${products.length})` },
                    { id: 'in_stock', label: 'In Stock' },
                    { id: 'low_stock', label: 'Low Stock (≤5)' },
                    { id: 'out_of_stock', label: 'Out of Stock' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setProductStockFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all whitespace-nowrap cursor-pointer ${
                        productStockFilter === f.id
                          ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[2px_2px_0px_#111827]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#111827]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
                <button
                  onClick={() => setProductCategoryFilter('all')}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all whitespace-nowrap ${
                    productCategoryFilter === 'all'
                      ? 'bg-[#FACC15] text-[#111827] border-[#111827] font-black'
                      : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                  }`}
                >
                  All Aisles
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setProductCategoryFilter(c.slug)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all whitespace-nowrap ${
                      productCategoryFilter === c.slug
                        ? 'bg-[#FACC15] text-[#111827] border-[#111827] font-black'
                        : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Count & Help Notice */}
            <div className="flex items-center justify-between text-xs font-bold text-[#111827]/70 px-1">
              <span>Showing {filteredProducts.length} everyday finds</span>
              <span className="hidden sm:inline">
                💡 Tip: Use <strong className="text-[#1F5C3A]">+</strong> and <strong className="text-[#1F5C3A]">-</strong> to update inventory directly from phone
              </span>
            </div>

            {/* PRODUCT CARDS LIST (Optimized for Mobile Phones & Desktop Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredProducts.map((prod) => {
                const discount =
                  prod.originalPrice && prod.originalPrice > prod.price
                    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                    : 0;

                const isLowStock = (prod.stock || 0) <= 5 && (prod.stock || 0) > 0;
                const isOutOfStock = (prod.stock || 0) === 0;

                return (
                  <div
                    key={prod.id}
                    className="rounded-3xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827] p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-[5px_5px_0px_#111827] transition-all relative overflow-hidden"
                  >
                    {/* Top Tile Preview following Brand Guideline: "One product. One colour." */}
                    <div className="flex gap-3 items-start">
                      {/* Product Image Tile */}
                      <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-[#111827] flex-shrink-0 flex items-center justify-center relative overflow-hidden ${
                          prod.tileColor === 'leaf'
                            ? 'bg-[#1F5C3A]'
                            : prod.tileColor === 'mango'
                            ? 'bg-[#FACC15]'
                            : 'bg-[#FAF9F6]'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover mix-blend-multiply transition-transform hover:scale-110"
                          onError={(e) => {
                            // Fallback graphic if image path doesn't load
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="absolute bottom-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-[#111827]/80 text-white">
                          Find
                        </span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        {/* Badge */}
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FACC15] text-[#111827] border border-[#111827]">
                            {prod.badge || 'New find'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-bold truncate">
                            {prod.category}
                          </span>
                        </div>

                        {/* Title (English & Malayalam) */}
                        <h4 className="font-hatke-title font-black text-sm sm:text-base text-[#111827] leading-tight truncate">
                          {prod.name}
                        </h4>
                        {prod.nameMl && (
                          <p className="font-hatke-ml text-xs text-[#1F5C3A] font-bold truncate">
                            {prod.nameMl}
                          </p>
                        )}

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="font-hatke-title font-black text-base sm:text-lg text-[#1F5C3A]">
                            ₹{prod.price}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ₹{prod.originalPrice}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="text-[10px] font-black bg-[#FACC15] text-[#111827] px-1.5 py-0.2 rounded border border-[#111827]">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Controller & Quick Actions */}
                    <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-200 flex items-center justify-between gap-2">
                      {/* Stock Counter with Big Mobile Touch Targets */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStockDelta(prod.id, -1)}
                          disabled={isOutOfStock}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-[#111827] font-black text-sm text-[#111827] flex items-center justify-center active:scale-95 disabled:opacity-40"
                          title="Decrease Stock (-1)"
                        >
                          -
                        </button>

                        <div className="text-center px-1">
                          <span
                            className={`text-xs font-black block ${
                              isOutOfStock
                                ? 'text-rose-600'
                                : isLowStock
                                ? 'text-amber-600'
                                : 'text-[#1F5C3A]'
                            }`}
                          >
                            {prod.stock || 0}
                          </span>
                          <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                            In Stock
                          </span>
                        </div>

                        <button
                          onClick={() => handleStockDelta(prod.id, 1)}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 border-2 border-[#111827] font-black text-sm text-[#111827] flex items-center justify-center active:scale-95"
                          title="Increase Stock (+1)"
                        >
                          +
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditProduct(prod)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#FAF9F6] hover:bg-[#FACC15] text-[#111827] font-bold text-xs border-2 border-[#111827] shadow-[1px_1px_0px_#111827] flex items-center gap-1 active:translate-y-0.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 active:translate-y-0.5"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-8 text-center rounded-3xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <h4 className="font-hatke-title font-bold text-base text-[#111827]">
                  No everyday finds match your filter
                </h4>
                <p className="text-xs text-gray-500 mt-1">Try resetting search or category pills</p>
                <button
                  onClick={() => {
                    setProductSearch('');
                    setProductCategoryFilter('all');
                    setProductStockFilter('all');
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#1F5C3A] text-white font-bold text-xs border-2 border-[#111827]"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MARKETING HUB (COUPONS, ADS, WHATSAPP BLAST)      */}
        {/* ========================================================= */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            {/* Header / Announcement Bar Manager Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#1F5C3A] text-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#FACC15] text-[#111827] text-[10px] font-black uppercase tracking-wider border border-[#111827]">
                      Live Store Announcement
                    </span>
                    <span className="text-xs font-bold text-[#FAF9F6]/80">Top Bar Marquee</span>
                  </div>
                  <p className="font-hatke-title font-bold text-sm sm:text-base text-[#FAF9F6]">
                    &ldquo;{banner.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const newText = prompt('Enter new top announcement bar text:', banner.text);
                      if (newText && newText.trim()) {
                        setBanner((prev) => ({ ...prev, text: newText.trim() }));
                        await fetch('/api/marketing', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'update_banner', banner: { ...banner, text: newText.trim() } }),
                        });
                        showToast('Store banner updated live!');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#FACC15] text-[#111827] font-hatke-title font-bold text-xs border-2 border-[#111827] shadow-[2px_2px_0px_#111827] active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                  >
                    Edit Announcement
                  </button>
                </div>
              </div>
            </div>

            {/* Coupons Section */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-hatke-title font-black text-base sm:text-lg text-[#111827]">
                    Discount Coupons & Promo Codes (കൂപ്പണുകൾ)
                  </h3>
                  <p className="text-xs text-gray-500">
                    High conversion codes for Kerala shoppers & festival deals
                  </p>
                </div>

                <button
                  onClick={() => setShowCouponModal(true)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#FACC15] text-[#111827] font-hatke-title font-bold text-xs border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center gap-1.5 active:translate-y-0.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>New Coupon</span>
                </button>
              </div>

              {/* Coupons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {coupons.map((coup) => (
                  <div
                    key={coup.id}
                    className={`p-3.5 rounded-2xl border-2 border-[#111827] relative flex flex-col justify-between transition-all ${
                      coup.isActive
                        ? 'bg-[#FAF9F6] shadow-[3px_3px_0px_#111827]'
                        : 'bg-gray-100 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-hatke-title font-black text-sm tracking-widest text-[#1F5C3A] bg-white px-2 py-0.5 rounded-lg border border-[#111827]">
                          {coup.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(coup.code)}
                          className="p-1 rounded-md hover:bg-gray-200 text-gray-600"
                          title="Copy Promo Code"
                        >
                          {copiedCode === coup.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#111827] mt-1">
                        {coup.discountType === 'percentage'
                          ? `${coup.discountValue}% OFF`
                          : `₹${coup.discountValue} FLAT OFF`}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{coup.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-dashed border-[#111827]/20 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-gray-500">{coup.usageCount} used</span>
                      <button
                        onClick={() => handleToggleCoupon(coup.id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-black border ${
                          coup.isActive
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                            : 'bg-gray-200 text-gray-700 border-gray-400'
                        }`}
                      >
                        {coup.isActive ? 'Active' : 'Paused'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Performance & Ad Spend */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-hatke-title font-black text-base sm:text-lg text-[#111827]">
                    Active Ad Campaigns & ROAS (പരസ്യങ്ങൾ & ലാഭം)
                  </h3>
                  <p className="text-xs text-gray-500">Instagram Reels, WhatsApp and Influencer tracking</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          camp.channel === 'Instagram'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : camp.channel === 'WhatsApp'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {camp.channel}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{camp.roas}x ROAS</span>
                    </div>

                    <h4 className="font-hatke-title font-bold text-sm text-[#111827] leading-tight">
                      {camp.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-dashed border-gray-200">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Spent</span>
                        <span className="font-bold text-gray-700">₹{camp.spent.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase block">Revenue</span>
                        <span className="font-bold text-[#1F5C3A]">₹{camp.revenue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                      <span>{camp.clicks} clicks</span>
                      <span>{camp.conversions} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Marketing & Direct Customer Push */}
            <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-hatke-title font-black text-base sm:text-lg text-[#111827]">
                    WhatsApp Marketing Triggers (വാട്സാപ്പ് ബ്ലാസ്റ്റ്)
                  </h3>
                  <p className="text-xs text-gray-500">
                    High engagement messages formatted in authentic Hatke tone
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {whatsappTemplates.map((wt) => (
                  <div
                    key={wt.id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-hatke-title font-bold text-xs text-[#1F5C3A]">
                          {wt.triggerEvent}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">
                          {wt.openRate}% Read Rate
                        </span>
                      </div>
                      <h4 className="font-hatke-title font-black text-sm text-[#111827] mt-1">
                        {wt.title}
                      </h4>
                      <div className="p-3 mt-2 rounded-xl bg-white border border-[#111827]/20 text-xs text-gray-700 font-hatke-body leading-relaxed whitespace-pre-wrap">
                        {wt.message}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-gray-500 font-bold">
                        {wt.sentCount} sent this month
                      </span>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(wt.message)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-hatke-title font-bold text-xs border border-[#111827] shadow-[1px_1px_0px_#111827] flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Blast</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ACCOUNTS, PROFIT, TAX & EXPENSE MANAGER            */}
        {/* ========================================================= */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase">Gross Sales</span>
                <div className="text-xl sm:text-2xl font-hatke-title font-black text-[#111827] mt-1">
                  ₹{totalGrossRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Digital + COD receipts</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase">Total Expenses</span>
                <div className="text-xl sm:text-2xl font-hatke-title font-black text-rose-700 mt-1">
                  ₹{totalExpensesSum.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Logistics, ads & packaging</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#1F5C3A] text-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <span className="text-[11px] sm:text-xs font-bold text-[#FACC15] uppercase">
                  Net Profit (യഥാർത്ഥ ലാഭം)
                </span>
                <div className="text-xl sm:text-2xl font-hatke-title font-black text-[#FAF9F6] mt-1">
                  ₹{estimatedProfit.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-300 mt-1 block">Margin: {profitMargin}%</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827]">
                <span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase">GST Component</span>
                <div className="text-xl sm:text-2xl font-hatke-title font-black text-[#111827] mt-1">
                  ₹{Math.round(totalGrossRevenue * 0.18).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Approx 18% tax pool</span>
              </div>
            </div>

            {/* Expense Breakdown & Bank Settlements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Bank Payouts / Settlements */}
              <div className="lg:col-span-1 p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-hatke-title font-black text-base text-[#111827]">
                    Bank Payouts (ബാങ്ക് ട്രാൻസ്ഫർ)
                  </h3>
                  <Wallet className="w-4 h-4 text-[#1F5C3A]" />
                </div>
                <p className="text-xs text-gray-500">Auto settlements from UPI & Gateway to your HDFC account</p>

                <div className="space-y-3">
                  {payouts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#111827]/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-hatke-title font-bold text-sm text-[#111827]">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            p.status === 'Settled'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">
                        {p.bankName} {p.accountNumber}
                      </div>
                      <div className="text-[10px] text-gray-400 flex items-center justify-between">
                        <span>UTR: {p.utr.substring(0, 16)}...</span>
                        <span>{p.settledDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense Logger & History */}
              <div className="lg:col-span-2 p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-hatke-title font-black text-base sm:text-lg text-[#111827]">
                      Business Expenses (ചിലവുകൾ)
                    </h3>
                    <p className="text-xs text-gray-500">Record daily courier, packing and tool bills</p>
                  </div>

                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#FACC15] text-[#111827] font-hatke-title font-bold text-xs border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center gap-1 active:translate-y-0.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Log Expense</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-2xl bg-white border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              exp.category === 'Shipping'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : exp.category === 'Packaging'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : exp.category === 'Marketing'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            {exp.category}
                          </span>
                          <span className="text-[11px] text-gray-400">{exp.date}</span>
                        </div>
                        <h4 className="font-hatke-title font-bold text-xs sm:text-sm text-[#111827] truncate mt-1">
                          {exp.title}
                        </h4>
                        {exp.notes && (
                          <p className="text-[11px] text-gray-500 truncate">{exp.notes}</p>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-hatke-title font-black text-sm sm:text-base text-rose-700 block">
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase">{exp.paymentMode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ORDERS & DISPATCH (TOUCH & CALL OPTIMIZED)         */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Filter by Status Pills */}
            <div className="p-3.5 sm:p-5 rounded-3xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {(['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-[#1F5C3A] text-white border-[#111827] shadow-[2px_2px_0px_#111827]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#111827]'
                    }`}
                  >
                    {st === 'all' ? `All Orders (${orders.length})` : st}
                  </button>
                )
              )}
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-3xl bg-white border-2 border-[#111827] shadow-[3px_3px_0px_#111827] p-4 sm:p-5 space-y-3 flex flex-col justify-between"
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-2.5">
                    <div>
                      <span className="font-hatke-title font-black text-sm text-[#1F5C3A]">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-gray-400 block">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800 border-blue-400'
                            : ord.status === 'Processing'
                            ? 'bg-amber-100 text-amber-800 border-amber-400'
                            : 'bg-gray-100 text-gray-800 border-gray-400'
                        }`}
                      >
                        {ord.status}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ord.paymentMethod} • {ord.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info & Direct Mobile Action (Call & WhatsApp) */}
                  <div className="flex items-center justify-between gap-2 bg-[#FAF9F6] p-3 rounded-2xl border border-[#111827]/20">
                    <div className="min-w-0">
                      <h4 className="font-hatke-title font-bold text-xs sm:text-sm text-[#111827] truncate">
                        {ord.customerName}
                      </h4>
                      <p className="text-[11px] text-gray-600 truncate">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}
                      </p>
                      <p className="text-[11px] font-mono text-gray-500">{ord.customerPhone}</p>
                    </div>

                    {/* Touch Friendly Action Buttons on Mobile */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href={`tel:${ord.customerPhone}`}
                        className="w-8 h-8 rounded-xl bg-white border-2 border-[#111827] shadow-[1px_1px_0px_#111827] flex items-center justify-center text-[#1F5C3A] hover:bg-[#FACC15] transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `ഹലോ ${ord.customerName}! നിങ്ങളുടെ Hatke ഓർഡർ #${ord.orderNumber} പ്രോസസ്സിംഗിലാണ്.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-xl bg-emerald-600 border-2 border-[#111827] shadow-[1px_1px_0px_#111827] flex items-center justify-center text-white hover:bg-emerald-700 transition-colors"
                        title="Message on WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-1.5">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-medium">
                        <span className="text-gray-700 truncate">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="font-bold text-[#111827]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Total & Status Changer */}
                  <div className="pt-2 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total</span>
                      <span className="font-hatke-title font-black text-base text-[#1F5C3A]">
                        ₹{ord.total}
                      </span>
                    </div>

                    {/* Status Changer Dropdown */}
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] text-xs font-bold text-[#111827] focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: CUSTOMERS DIRECTORY                                */}
        {/* ========================================================= */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#111827] shadow-[4px_4px_0px_#111827]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-hatke-title font-black text-base sm:text-lg text-[#111827]">
                    Desi Shoppers & Loyal Patrons (കസ്റ്റമേഴ്സ്)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Lifetime value and order frequency for repeat buyers
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FACC15] text-[#111827] font-bold text-xs border border-[#111827]">
                  {customers.length} Shoppers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {customers.map((cust) => (
                  <div
                    key={cust.id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-hatke-title font-black text-sm text-[#111827]">
                        {cust.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          cust.status === 'VIP'
                            ? 'bg-[#FACC15] text-[#111827] border-[#111827]'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 font-medium">
                      <div>{cust.email}</div>
                      <div className="font-mono text-gray-500">{cust.phone}</div>
                    </div>

                    <div className="pt-2 border-t border-dashed border-[#111827]/20 flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500">{cust.totalOrders} Orders placed</span>
                      <span className="text-[#1F5C3A]">₹{cust.totalSpent.toLocaleString('en-IN')} LTV</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MOBILE FIXED BOTTOM NAVIGATION BAR                        */}
      {/* (Designed strictly for effortless 1-handed smartphone use) */}
      {/* ========================================================= */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF9F6] border-t-2 border-[#111827] shadow-[0_-4px_10px_rgba(0,0,0,0.06)] px-2 py-2">
        <div className="grid grid-cols-5 gap-1 items-center">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#1F5C3A] text-[#FACC15] font-black shadow-[1px_1px_0px_#111827]'
                : 'text-[#111827]/70 hover:text-[#111827]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] tracking-tighter mt-0.5">Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'products'
                ? 'bg-[#1F5C3A] text-[#FACC15] font-black shadow-[1px_1px_0px_#111827]'
                : 'text-[#111827]/70 hover:text-[#111827]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-[10px] tracking-tighter mt-0.5">Finds</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'marketing'
                ? 'bg-[#1F5C3A] text-[#FACC15] font-black shadow-[1px_1px_0px_#111827]'
                : 'text-[#111827]/70 hover:text-[#111827]'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span className="text-[10px] tracking-tighter mt-0.5">Market</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'accounts'
                ? 'bg-[#1F5C3A] text-[#FACC15] font-black shadow-[1px_1px_0px_#111827]'
                : 'text-[#111827]/70 hover:text-[#111827]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] tracking-tighter mt-0.5">Accounts</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-[#1F5C3A] text-[#FACC15] font-black shadow-[1px_1px_0px_#111827]'
                : 'text-[#111827]/70 hover:text-[#111827]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span className="text-[10px] tracking-tighter mt-0.5">Orders</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRODUCT ADD / EDIT MODAL & MOBILE BOTTOM DRAWER          */}
      {/* ========================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl border-2 border-[#111827] shadow-[6px_6px_0px_#111827] max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#1F5C3A] text-white border-b-2 border-[#111827] flex items-center justify-between">
              <div>
                <h3 className="font-hatke-title font-black text-base sm:text-lg text-[#FAF9F6]">
                  {editingProduct ? 'Edit Everyday Find (പ്രൊഡക്റ്റ് എഡിറ്റ്)' : 'Add New Everyday Find (പുതിയ ഫൈൻഡ്)'}
                </h3>
                <p className="text-xs text-[#FAF9F6]/70">
                  {editingProduct ? `Modifying '${editingProduct.name}'` : 'Create a curious find for Indian homes'}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 rounded-xl bg-white text-[#111827] border border-[#111827] hover:bg-[#FACC15] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Form */}
            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Product Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neo-Vortex Copper Air Fryer"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#1F5C3A] block mb-1">
                    Title in Malayalam (മലയാളം പേര്)
                  </label>
                  <input
                    type="text"
                    placeholder="ഉദാ: കോപ്പർ എയർ ഫ്രയർ"
                    value={productForm.nameMl}
                    onChange={(e) => setProductForm({ ...productForm, nameMl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FACC15]"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">Aisle / Category *</label>
                  <select
                    value={productForm.categorySlug}
                    onChange={(e) => {
                      const selectedSlug = e.target.value;
                      const catObj = categories.find((c) => c.slug === selectedSlug);
                      setProductForm({
                        ...productForm,
                        categorySlug: selectedSlug,
                        category: catObj ? catObj.name : 'Kitchen Finds',
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Hatke Badge / Tag</label>
                  <select
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none"
                  >
                    <option value="New find">New find</option>
                    <option value="Thoda sale">Thoda sale</option>
                    <option value="Gift ready">Gift ready</option>
                    <option value="Desi find">Desi find</option>
                    <option value="3 whistles done!">3 whistles done!</option>
                    <option value="Best seller">Best seller</option>
                  </select>
                </div>
              </div>

              {/* Pricing, Cost Price & Stock (3 Columns) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="font-bold text-[#1F5C3A] block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-500 block mb-1">MRP / Original (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-rose-700 block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.costPrice}
                    onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tile Color Picker & Image URL (Brand Guideline: One product. One colour.) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">
                    Image Tile Color (Brand Theme)
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'leaf', label: 'Leaf Green', bg: 'bg-[#1F5C3A]', text: 'text-white' },
                      { id: 'mango', label: 'Mango', bg: 'bg-[#FACC15]', text: 'text-black' },
                      { id: 'coconut', label: 'Coconut', bg: 'bg-[#FAF9F6]', text: 'text-black' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, tileColor: t.id as any })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                          productForm.tileColor === t.id
                            ? 'border-[#111827] shadow-[2px_2px_0px_#111827] scale-105'
                            : 'border-transparent opacity-70'
                        } ${t.bg} ${t.text}`}
                      >
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Image URL / Path</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-mono text-xs text-[#111827] focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-[#111827] block mb-1">
                  Product Description (English & Malayali Touch)
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Tell why this everyday find is a little different..."
                  className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-medium text-[#111827] focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t-2 border-dashed border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#111827] font-bold text-xs border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-hatke-title font-black text-xs uppercase tracking-wider border-2 border-[#111827] shadow-[3px_3px_0px_#111827] active:translate-y-0.5 cursor-pointer"
                >
                  {editingProduct ? 'Save Changes (സേവ് ചെയ്യുക)' : 'Publish Find (പ്രൊഡക്റ്റ് ചേർക്കുക)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NEW COUPON MODAL                                          */}
      {/* ========================================================= */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#111827] shadow-[6px_6px_0px_#111827] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-hatke-title font-black text-base text-[#111827]">
                Create Discount Coupon (കൂപ്പൺ ചേർക്കുക)
              </h3>
              <button onClick={() => setShowCouponModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#111827] block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KERALA15"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-mono font-black text-sm uppercase text-[#111827] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  >
                    <option value="percentage">% Percentage</option>
                    <option value="flat">₹ Flat Rupee</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 15% discount for festival weekend"
                  value={couponForm.description}
                  onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                  className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-3 py-2 rounded-xl bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FACC15] text-[#111827] font-hatke-title font-bold border-2 border-[#111827] shadow-[2px_2px_0px_#111827]"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NEW EXPENSE MODAL                                         */}
      {/* ========================================================= */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-[#111827]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#111827] shadow-[6px_6px_0px_#111827] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-hatke-title font-black text-base text-[#111827]">
                Record Business Expense (ചിലവ് രേഖപ്പെടുത്തുക)
              </h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#111827] block mb-1">Title / Expense Item *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Courier Shipping charges"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  >
                    <option value="Packaging">Packaging</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sourcing">Sourcing</option>
                    <option value="Tools & SaaS">Tools & SaaS</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-rose-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#111827] block mb-1">Payment Mode</label>
                  <select
                    value={expenseForm.paymentMode}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMode: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#111827] block mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#111827] block mb-1">Notes / Vendor Details</label>
                <input
                  type="text"
                  placeholder="Optional details or bill number"
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  className="w-full p-2 rounded-xl bg-[#FAF9F6] border-2 border-[#111827]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-3 py-2 rounded-xl bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-hatke-title font-bold border-2 border-[#111827] shadow-[2px_2px_0px_#111827]"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

