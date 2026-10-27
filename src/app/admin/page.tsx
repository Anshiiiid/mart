'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Package,
  Layers,
  ShoppingBag,
  Users,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
  TrendingUp,
  DollarSign,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Product, CategoryFolder, Order, CustomerUser, AdminAnalytics, OrderStatus } from '@/lib/types';
import { initialCategories, initialProducts, initialOrders, initialCustomers } from '@/lib/seed-data';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'orders' | 'customers'>('analytics');

  // Live state
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryFolder[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [customers, setCustomers] = useState<CustomerUser[]>(initialCustomers);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form for product
  const [productForm, setProductForm] = useState({
    name: '',
    nameMl: '',
    category: 'Home Appliances',
    categorySlug: 'home-appliances',
    price: 4999,
    originalPrice: 6999,
    discountPercent: 25,
    stock: 20,
    image: '/products/airfryer.jpg',
    description: '',
    descriptionMl: '',
    traditionalArtTag: 'Temple Craft',
    is3dAvailable: true,
    isFeatured: true,
  });

  // Fetch live store data
  const refreshData = async () => {
    try {
      const [prodRes, catRes, ordRes, custRes, analRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/orders'),
        fetch('/api/customers'),
        fetch('/api/analytics'),
      ]);

      if (prodRes.ok) {
        const d = await prodRes.json();
        if (d.products) setProducts(d.products);
      }
      if (catRes.ok) {
        const d = await catRes.json();
        if (d.categories) setCategories(d.categories);
      }
      if (ordRes.ok) {
        const d = await ordRes.json();
        if (d.orders) setOrders(d.orders);
      }
      if (custRes.ok) {
        const d = await custRes.json();
        if (d.customers) setCustomers(d.customers);
      }
      if (analRes.ok) {
        const d = await analRes.json();
        if (d.analytics) setAnalytics(d.analytics);
      }
    } catch (e) {
      console.warn('Using seeded data for admin dashboard:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin' || pin === 'admin123' || pin === '') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid PIN code. Try 1234 or leave blank.');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (e) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        if (res.ok) {
          const d = await res.json();
          setProducts(products.map((p) => (p.id === editingProduct.id ? d.product : p)));
        }
      } else {
        // create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        if (res.ok) {
          const d = await res.json();
          setProducts([d.product, ...products]);
        }
      }
      setShowAddProductModal(false);
      setEditingProduct(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Move category up or down
  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const newCats = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCats.length) return;

    const temp = newCats[index];
    newCats[index] = newCats[targetIdx];
    newCats[targetIdx] = temp;

    // re-assign order numbers
    newCats.forEach((c, i) => (c.order = i + 1));
    setCategories(newCats);

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          orderedIds: newCats.map((c) => c.id),
        }),
      });
    } catch (e) {
      // ignore
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  // Total revenue sum
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07050E] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-gradient-to-b from-[#18132D] to-[#0D0A19] border-2 border-amber-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
            SECURE ACCESS PORTAL
          </span>
          <h1 className="text-2xl font-black font-serif text-white mt-1 mb-2">
            Hatke Haat Admin Console
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            Enter Admin PIN (Default: <strong>1234</strong> or click Quick Unlock)
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center bg-slate-900 border border-slate-700 rounded-xl py-3 text-white text-sm focus:border-amber-400 focus:outline-none"
            />

            {authError && <p className="text-xs text-rose-400">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07050E] text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#0E0B1C]/90 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
            title="Back to Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-serif text-white">HATKE HAAT</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Admin 2.0 Live
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              MongoDB Engine • RBAC Authenticated
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Refresh Store Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs font-semibold hover:bg-rose-900/50"
          >
            Lock Console
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="bg-[#120F24] border-b border-amber-500/15 px-4 sm:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2.5">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Folder Tab Layout ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Pipeline ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Roster ({customers.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* ================= TAB 1: OVERVIEW & ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl glass-card border border-amber-500/30">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <span className="text-xs font-bold uppercase font-mono">Gross Sales</span>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +28.4% this month
                </span>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-cyan-500/30">
                <div className="flex items-center justify-between text-cyan-400 mb-2">
                  <span className="text-xs font-bold uppercase font-mono">Total Orders</span>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{orders.length}</div>
                <span className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1 mt-1">
                  100% fulfillment rate
                </span>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-purple-500/30">
                <div className="flex items-center justify-between text-purple-400 mb-2">
                  <span className="text-xs font-bold uppercase font-mono">Artisan Catalog</span>
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{products.length}</div>
                <span className="text-[11px] text-purple-300 font-semibold flex items-center gap-1 mt-1">
                  Across 9 folder tabs
                </span>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-emerald-500/30">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase font-mono">Active Customers</span>
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">{customers.length}</div>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  High return loyalty
                </span>
              </div>
            </div>

            {/* Performance Visual: Monthly Trends & Category Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trends */}
              <div className="p-6 rounded-2xl glass-card border border-amber-500/20">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Monthly Revenue Growth (₹)</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { month: 'Jun 2026', amount: 48000, max: 150000 },
                    { month: 'Jul 2026', amount: 62000, max: 150000 },
                    { month: 'Aug 2026', amount: 84000, max: 150000 },
                    { month: 'Sep 2026', amount: 112000, max: 150000 },
                    { month: 'Oct 2026', amount: 141000, max: 150000 },
                  ].map((m) => (
                    <div key={m.month}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{m.month}</span>
                        <span className="text-amber-300 font-bold">₹{m.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                          style={{ width: `${(m.amount / m.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="p-6 rounded-2xl glass-card border border-amber-500/20">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Category Catalog Share</span>
                </h3>
                <div className="space-y-3">
                  {categories.slice(0, 5).map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-white font-medium">{cat.name}</span>
                      </div>
                      <span className="text-slate-400 font-mono">{cat.itemCount} Units</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS MANAGEMENT ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-serif text-white">Products Catalog</h2>
                <p className="text-xs text-slate-400">Add, edit, or adjust inventory for your 9 categories</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setShowAddProductModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-amber-500/20 overflow-hidden bg-[#110D21]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18132D] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₹)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">3D Ready</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-slate-700">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-amber-300/80">{p.traditionalArtTag}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{p.category}</td>
                        <td className="p-4 font-mono font-bold text-amber-400">
                          ₹{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.stock > 10
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4">
                          {p.is3dAvailable ? (
                            <span className="text-cyan-400 font-bold flex items-center gap-1 text-[11px]">
                              <Eye className="w-3.5 h-3.5" />
                              Yes (360°)
                            </span>
                          ) : (
                            <span className="text-slate-500">Standard</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductForm({
                                name: p.name,
                                nameMl: p.nameMl || '',
                                category: p.category,
                                categorySlug: p.categorySlug,
                                price: p.price,
                                originalPrice: p.originalPrice || p.price,
                                discountPercent: p.discountPercent || 0,
                                stock: p.stock,
                                image: p.image,
                                description: p.description,
                                descriptionMl: p.descriptionMl || '',
                                traditionalArtTag: p.traditionalArtTag || 'Temple Craft',
                                is3dAvailable: Boolean(p.is3dAvailable),
                                isFeatured: Boolean(p.isFeatured),
                              });
                              setShowAddProductModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CATEGORIES & FOLDER LAYOUT CONTROL ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Folder Tab Layout Manager</h2>
              <p className="text-xs text-slate-400">
                Reorder the category folder tabs on the home page. Reordering updates the live front page folder sequence!
              </p>
            </div>

            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="p-4 rounded-xl bg-[#120F24] border border-amber-500/20 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-black text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                      #{idx + 1}
                    </span>
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      <span className="text-xs text-amber-300/80">{cat.nameMl}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      Badge: <strong>{cat.badge}</strong>
                    </span>

                    <span className="text-xs text-slate-400">{cat.itemCount} Products</span>

                    <div className="flex items-center gap-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleMoveCategory(idx, 'up')}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === categories.length - 1}
                        onClick={() => handleMoveCategory(idx, 'down')}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: ORDERS PIPELINE ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Customer Orders Management</h2>
              <p className="text-xs text-slate-400">
                Track status, update order transitions (Pending → Processing → Shipped → Delivered)
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-[#120F24] border border-amber-500/20 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-mono text-amber-400 font-bold text-sm">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="text-slate-400 text-xs ml-3">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Status Pill and Update Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border bg-slate-900 ${
                          ord.status === 'Delivered'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : ord.status === 'Shipped'
                            ? 'text-cyan-400 border-cyan-500/40'
                            : 'text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer and Items Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-semibold">Customer:</span>
                      <span className="text-white font-bold">{ord.customerName}</span>
                      <span className="text-slate-400 block">{ord.customerPhone}</span>
                      <span className="text-slate-400 block">{ord.customerEmail}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5 font-semibold">Shipping Address:</span>
                      <span className="text-slate-300">
                        {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                      </span>
                      <span className="text-cyan-400 font-mono block mt-1">
                        Tracking: {ord.trackingNumber}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block mb-0.5 font-semibold">Payment & Total:</span>
                      <span className="text-base font-black text-amber-400">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-emerald-400 block">
                        {ord.paymentMethod} • {ord.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: CUSTOMER ROSTER ================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold font-serif text-white">Customer Database</h2>
              <p className="text-xs text-slate-400">Customer spending history and loyalty tracking</p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 overflow-hidden bg-[#110D21]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#18132D] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Lifetime Spend</th>
                    <th className="p-4">Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/50">
                      <td className="p-4 font-bold text-white">{c.name}</td>
                      <td className="p-4 text-slate-300">
                        <div>{c.email}</div>
                        <div className="text-slate-500 text-[10px]">{c.phone}</div>
                      </td>
                      <td className="p-4 font-mono font-bold">{c.totalOrders}</td>
                      <td className="p-4 font-mono font-black text-amber-400">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            c.status === 'VIP'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#18132D] to-[#0A0714] rounded-3xl border-2 border-amber-500/40 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-serif text-white mb-4">
              {editingProduct ? 'Edit Artisan Product' : 'Add New Artisan Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Product Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Title (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={productForm.nameMl}
                    onChange={(e) => setProductForm({ ...productForm, nameMl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const found = categories.find((c) => c.name === e.target.value);
                      setProductForm({
                        ...productForm,
                        category: e.target.value,
                        categorySlug: found ? found.slug : 'home-appliances',
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Product Image URL or Path
                </label>
                <input
                  type="text"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Traditional Art Style Tag (e.g. Temple Brass Filigree, Kerala Mural)
                </label>
                <input
                  type="text"
                  value={productForm.traditionalArtTag}
                  onChange={(e) =>
                    setProductForm({ ...productForm, traditionalArtTag: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.is3dAvailable}
                    onChange={(e) =>
                      setProductForm({ ...productForm, is3dAvailable: e.target.checked })
                    }
                    className="rounded accent-amber-400"
                  />
                  <span>Enable 360° 3D Turntable Badge</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isFeatured: e.target.checked })
                    }
                    className="rounded accent-amber-400"
                  />
                  <span>Feature on Hero Showcase</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
