import { initialCategories, initialProducts, initialOrders, initialCustomers } from './seed-data';
import { Product, CategoryFolder, Order, CustomerUser, AdminAnalytics, OrderStatus } from './types';

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

// ---------------- ANALYTICS ----------------
export async function getAnalyticsData(): Promise<AdminAnalytics> {
  const orders = global.__hatke_orders || initialOrders;
  const products = global.__hatke_products || initialProducts;
  const customers = global.__hatke_customers || initialCustomers;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;

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
  }));

  const monthlyRevenue = [
    { month: 'Jun', amount: 48000 },
    { month: 'Jul', amount: 62000 },
    { month: 'Aug', amount: 84000 },
    { month: 'Sep', amount: 112000 },
    { month: 'Oct', amount: totalRevenue + 125000 },
  ];

  const recentActivities = [
    { id: 'act-1', action: 'New order placed by Aiswarya Menon', time: '10 mins ago', type: 'order' },
    { id: 'act-2', action: 'Product stock updated for Neo-Vortex Air Fryer', time: '45 mins ago', type: 'stock' },
    { id: 'act-3', action: 'New customer registration from Kochi', time: '2 hours ago', type: 'user' },
    { id: 'act-4', action: 'Delivered Order #HH-89216 to Thiruvananthapuram', time: '1 day ago', type: 'delivery' },
  ];

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    monthlyRevenue,
    categoryDistribution,
    recentActivities,
  };
}
