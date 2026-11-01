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
} from './seed-data';
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
} from './types';

// Global in-memory cache to persist state during dev server runtime
declare global {
  // eslint-disable-next-line no-var
  var __hatke_products: Product[] | undefined;
  // eslint-disable-next-line no-var
  var __hatke_categories: CategoryFolder[] | undefined;
  // eslint-disable-next-line no-var
  var __hatke_orders: Order[] | undefined;
  // eslint-disable-next-line no-var
  var __hatke_customers: CustomerUser[] | undefined;
  // eslint-disable-next-line no-var
  var __hatke_coupons: Coupon[] | undefined;
  // eslint-disable-next-line no-var
  var __hatke_campaigns: MarketingCampaign[] | undefined;
  // eslint-disable-next-line no-var
  var __hatke_expenses: BusinessExpense[] | undefined;
  // eslint-disable-next-line no-var
  var __hatke_banner: AnnouncementBanner | undefined;
  // eslint-disable-next-line no-var
  var __hatke_payouts: PayoutSettlement[] | undefined;
}

if (!global.__hatke_products) {
  global.__hatke_products = [...initialProducts];
}
if (!global.__hatke_categories) {
  global.__hatke_categories = [...initialCategories];
}
if (!global.__hatke_orders) {
  global.__hatke_orders = [...initialOrders];
}
if (!global.__hatke_customers) {
  global.__hatke_customers = [...initialCustomers];
}
if (!global.__hatke_coupons) {
  global.__hatke_coupons = [...initialCoupons];
}
if (!global.__hatke_campaigns) {
  global.__hatke_campaigns = [...initialCampaigns];
}
if (!global.__hatke_expenses) {
  global.__hatke_expenses = [...initialExpenses];
}
if (!global.__hatke_banner) {
  global.__hatke_banner = { ...initialAnnouncementBanner };
}
if (!global.__hatke_payouts) {
  global.__hatke_payouts = [...initialPayoutSettlements];
}

// ---------------- PRODUCTS ----------------
export async function getAllProducts(categorySlug?: string): Promise<Product[]> {
  const products = global.__hatke_products || initialProducts;
  if (!categorySlug || categorySlug === 'all') {
    return products;
  }
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = global.__hatke_products || initialProducts;
  return products.find((p) => p.id === id) || null;
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const newProduct: Product = {
    ...data,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (!global.__hatke_products) {
    global.__hatke_products = [...initialProducts];
  }
  global.__hatke_products.unshift(newProduct);

  // Update item count in category
  const categories = global.__hatke_categories || initialCategories;
  const targetCat = categories.find((c) => c.slug === newProduct.categorySlug);
  if (targetCat) {
    targetCat.itemCount += 1;
  }

  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = global.__hatke_products || initialProducts;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  return products[index];
}

export async function updateProductStock(id: string, delta: number): Promise<Product | null> {
  const products = global.__hatke_products || initialProducts;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const newStock = Math.max(0, (products[index].stock || 0) + delta);
  products[index] = { ...products[index], stock: newStock };
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!global.__hatke_products) return false;
  const initialLength = global.__hatke_products.length;
  global.__hatke_products = global.__hatke_products.filter((p) => p.id !== id);
  return global.__hatke_products.length < initialLength;
}

// ---------------- CATEGORIES ----------------
export async function getAllCategories(): Promise<CategoryFolder[]> {
  return (global.__hatke_categories || initialCategories).sort((a, b) => a.order - b.order);
}

export async function updateCategory(id: string, updates: Partial<CategoryFolder>): Promise<CategoryFolder | null> {
  const categories = global.__hatke_categories || initialCategories;
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  categories[index] = { ...categories[index], ...updates };
  return categories[index];
}

export async function reorderCategories(orderedIds: string[]): Promise<CategoryFolder[]> {
  const categories = global.__hatke_categories || initialCategories;
  orderedIds.forEach((id, index) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      cat.order = index + 1;
    }
  });
  return getAllCategories();
}

// ---------------- ORDERS ----------------
export async function getAllOrders(): Promise<Order[]> {
  return global.__hatke_orders || initialOrders;
}

export async function createOrder(orderInput: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
}): Promise<Order> {
  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `HH-${Math.floor(10000 + Math.random() * 90000)}`,
    ...orderInput,
    shippingFee: orderInput.subtotal > 999 ? 0 : 99,
    total: orderInput.subtotal - orderInput.discount + (orderInput.subtotal > 999 ? 0 : 99),
    status: 'Pending',
    paymentStatus: orderInput.paymentMethod === 'COD' ? 'Pending' : 'Paid',
    createdAt: new Date().toISOString(),
    trackingNumber: `TRK-KL-${Math.floor(100000 + Math.random() * 900000)}`,
  };

  if (!global.__hatke_orders) {
    global.__hatke_orders = [...initialOrders];
  }
  global.__hatke_orders.unshift(newOrder);

  // Deduct inventory
  for (const item of newOrder.items) {
    const product = (global.__hatke_products || []).find((p) => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  }

  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const orders = global.__hatke_orders || initialOrders;
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status;
  return order;
}

// ---------------- CUSTOMERS ----------------
export async function getAllCustomers(): Promise<CustomerUser[]> {
  return global.__hatke_customers || initialCustomers;
}

// ---------------- MARKETING ----------------
export async function getAllCoupons(): Promise<Coupon[]> {
  return global.__hatke_coupons || initialCoupons;
}

export async function createCoupon(couponData: Omit<Coupon, 'id' | 'usageCount'>): Promise<Coupon> {
  const newCoupon: Coupon = {
    ...couponData,
    id: `coup-${Date.now()}`,
    usageCount: 0,
    code: couponData.code.toUpperCase().trim(),
  };
  if (!global.__hatke_coupons) {
    global.__hatke_coupons = [...initialCoupons];
  }
  global.__hatke_coupons.unshift(newCoupon);
  return newCoupon;
}

export async function toggleCoupon(id: string): Promise<Coupon | null> {
  const coupons = global.__hatke_coupons || initialCoupons;
  const coupon = coupons.find((c) => c.id === id);
  if (!coupon) return null;
  coupon.isActive = !coupon.isActive;
  return coupon;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  if (!global.__hatke_coupons) return false;
  const prevLen = global.__hatke_coupons.length;
  global.__hatke_coupons = global.__hatke_coupons.filter((c) => c.id !== id);
  return global.__hatke_coupons.length < prevLen;
}

export async function getAllCampaigns(): Promise<MarketingCampaign[]> {
  return global.__hatke_campaigns || initialCampaigns;
}

export async function createCampaign(campaignData: Omit<MarketingCampaign, 'id'>): Promise<MarketingCampaign> {
  const newCampaign: MarketingCampaign = {
    ...campaignData,
    id: `camp-${Date.now()}`,
  };
  if (!global.__hatke_campaigns) {
    global.__hatke_campaigns = [...initialCampaigns];
  }
  global.__hatke_campaigns.unshift(newCampaign);
  return newCampaign;
}

export async function getWhatsAppTemplates(): Promise<WhatsAppTemplate[]> {
  return initialWhatsAppTemplates;
}

export async function getAnnouncementBanner(): Promise<AnnouncementBanner> {
  return global.__hatke_banner || initialAnnouncementBanner;
}

export async function updateAnnouncementBanner(updates: Partial<AnnouncementBanner>): Promise<AnnouncementBanner> {
  if (!global.__hatke_banner) {
    global.__hatke_banner = { ...initialAnnouncementBanner };
  }
  global.__hatke_banner = { ...global.__hatke_banner, ...updates };
  return global.__hatke_banner;
}

// ---------------- ACCOUNTS & EXPENSES ----------------
export async function getAllExpenses(): Promise<BusinessExpense[]> {
  return global.__hatke_expenses || initialExpenses;
}

export async function createExpense(expenseData: Omit<BusinessExpense, 'id'>): Promise<BusinessExpense> {
  const newExp: BusinessExpense = {
    ...expenseData,
    id: `exp-${Date.now()}`,
  };
  if (!global.__hatke_expenses) {
    global.__hatke_expenses = [...initialExpenses];
  }
  global.__hatke_expenses.unshift(newExp);
  return newExp;
}

export async function deleteExpense(id: string): Promise<boolean> {
  if (!global.__hatke_expenses) return false;
  const prevLen = global.__hatke_expenses.length;
  global.__hatke_expenses = global.__hatke_expenses.filter((e) => e.id !== id);
  return global.__hatke_expenses.length < prevLen;
}

export async function getPayoutSettlements(): Promise<PayoutSettlement[]> {
  return global.__hatke_payouts || initialPayoutSettlements;
}

export async function getFinancialSummary(): Promise<FinancialSummary> {
  const orders = global.__hatke_orders || initialOrders;
  const expenses = global.__hatke_expenses || initialExpenses;
  const payouts = global.__hatke_payouts || initialPayoutSettlements;

  const grossRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const totalDiscount = orders.reduce((sum, o) => sum + o.discount, 0);
  const netSales = grossRevenue - totalDiscount;

  // Approximate COGS as 42% of revenue for authentic artisanal/curated finds
  const cogs = Math.round(netSales * 0.42);
  const shippingCosts = expenses.filter((e) => e.category === 'Shipping').reduce((sum, e) => sum + e.amount, 0) || 14850;
  const marketingSpend = expenses.filter((e) => e.category === 'Marketing').reduce((sum, e) => sum + e.amount, 0) || 15000;
  const operationalExpenses = expenses.filter((e) => !['Shipping', 'Marketing'].includes(e.category)).reduce((sum, e) => sum + e.amount, 0);

  // Payment gateway fees approx 2% of digital payments
  const gatewayFees = Math.round(grossRevenue * 0.02);

  const totalCost = cogs + shippingCosts + marketingSpend + gatewayFees + operationalExpenses;
  const netProfit = Math.max(0, netSales - totalCost);
  const profitMarginPercent = netSales > 0 ? Number(((netProfit / netSales) * 100).toFixed(1)) : 0;

  // Tax breakdown (GST 18% approximate component)
  const gstCollected = Math.round(netSales * 0.18);

  const settledPayouts = payouts.filter((p) => p.status === 'Settled').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = payouts.filter((p) => p.status === 'Processing').reduce((sum, p) => sum + p.amount, 0);

  return {
    grossRevenue,
    netSales,
    cogs,
    shippingCosts,
    marketingSpend,
    gatewayFees,
    operationalExpenses,
    netProfit,
    profitMarginPercent,
    pendingPayouts,
    settledPayouts,
    gstCollected,
  };
}

// ---------------- RICH ANALYTICS ----------------
export async function getAnalyticsData(): Promise<AdminAnalytics> {
  const orders = global.__hatke_orders || initialOrders;
  const products = global.__hatke_products || initialProducts;
  const customers = global.__hatke_customers || initialCustomers;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const netRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total - o.discount : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const conversionRate = 3.65; // High performance e-commerce conversion rate

  const categoryMap = new Map<string, { count: number; revenue: number }>();
  for (const prod of products) {
    const current = categoryMap.get(prod.category) || { count: 0, revenue: 0 };
    current.count += 1;
    categoryMap.set(prod.category, current);
  }

  for (const order of orders) {
    for (const item of order.items) {
      const prod = products.find((p) => p.id === item.productId);
      const catName = prod ? prod.category : 'General';
      const cur = categoryMap.get(catName) || { count: 0, revenue: 0 };
      cur.revenue += item.price * item.quantity;
      categoryMap.set(catName, cur);
    }
  }

  const categoryDistribution = Array.from(categoryMap.entries()).map(([category, val]) => ({
    category,
    count: val.count,
    revenue: val.revenue,
    percentage: totalRevenue > 0 ? Math.round((val.revenue / totalRevenue) * 100) : 0,
  }));

  const monthlyRevenue = [
    { month: 'Jun', amount: 48000, orders: 32 },
    { month: 'Jul', amount: 62000, orders: 44 },
    { month: 'Aug', amount: 84000, orders: 58 },
    { month: 'Sep', amount: 112000, orders: 76 },
    { month: 'Oct', amount: totalRevenue + 125000, orders: totalOrders + 82 },
  ];

  const dailySales = [
    { day: 'Mon', date: '26 Oct', amount: 14200, orders: 8 },
    { day: 'Tue', date: '27 Oct', amount: 19800, orders: 11 },
    { day: 'Wed', date: '28 Oct', amount: 24500, orders: 15 },
    { day: 'Thu', date: '29 Oct', amount: 31200, orders: 19 },
    { day: 'Fri', date: '30 Oct', amount: 28400, orders: 17 },
    { day: 'Sat', date: '31 Oct', amount: 42100, orders: 26 },
    { day: 'Sun', date: '01 Nov', amount: 38900, orders: 22 },
  ];

  const regionalDistribution = [
    { city: 'Kochi (Ernakulam)', state: 'Kerala', orders: 48, revenue: 142500, percentage: 38 },
    { city: 'Kozhikode', state: 'Kerala', orders: 28, revenue: 84200, percentage: 22 },
    { city: 'Thiruvananthapuram', state: 'Kerala', orders: 22, revenue: 68900, percentage: 18 },
    { city: 'Thrissur', state: 'Kerala', orders: 14, revenue: 39500, percentage: 10 },
    { city: 'Malappuram & Kannur', state: 'Kerala', orders: 11, revenue: 31400, percentage: 8 },
    { city: 'Bengaluru (Keralite Hub)', state: 'Karnataka', orders: 6, revenue: 16200, percentage: 4 },
  ];

  const conversionFunnel = [
    { step: 'Store Visitors', count: 18450, percentage: 100 },
    { step: 'Product Views', count: 9620, percentage: 52 },
    { step: 'Added to Bag', count: 2140, percentage: 11.6 },
    { step: 'Reached Checkout', count: 980, percentage: 5.3 },
    { step: 'Completed Orders', count: 674, percentage: 3.65 },
  ];

  const recentActivities: AdminAnalytics['recentActivities'] = [
    { id: 'act-1', action: 'New order #HH-89216 placed by Aiswarya Menon (Kochi)', time: '8 mins ago', type: 'order' },
    { id: 'act-2', action: 'Stock replenished: Neo-Vortex Air Fryer (+15 units)', time: '35 mins ago', type: 'stock' },
    { id: 'act-3', action: 'WhatsApp broadcast triggered: "പാഴ്സൽ വന്നു" sent to 32 buyers', time: '1 hour ago', type: 'marketing' },
    { id: 'act-4', action: 'New VIP shopper joined: Muhammed Nihal (Kozhikode)', time: '3 hours ago', type: 'user' },
    { id: 'act-5', action: 'Delivered Order #HH-77210 in Thiruvananthapuram', time: '5 hours ago', type: 'delivery' },
  ];

  return {
    totalRevenue,
    netRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    averageOrderValue,
    conversionRate,
    monthlyRevenue,
    dailySales,
    categoryDistribution,
    regionalDistribution,
    conversionFunnel,
    recentActivities,
  };
}
