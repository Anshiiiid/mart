export interface Product {
  id: string;
  name: string;
  nameMl?: string; // Malayalam name support
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  costPrice?: number; // Sourcing cost for Accounts profit calculation
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  description: string;
  descriptionMl?: string;
  features: string[];
  specs: Record<string, string>;
  stock: number;
  isFeatured?: boolean;
  is3dAvailable?: boolean;
  badge?: 'New find' | 'Thoda sale' | 'Gift ready' | 'Desi find' | '3 whistles done!' | 'Best seller';
  tileColor?: 'leaf' | 'mango' | 'coconut'; // Brand guideline: one product, one colour
  traditionalArtTag?: string; // e.g. "Kerala Mural Filigree", "Channapatna Craft", "Temple Brass"
  tags: string[];
  createdAt: string;
}

export interface CategoryFolder {
  id: string;
  slug: string;
  name: string;
  nameMl: string;
  badge: string;
  color: string; // Neon accent color
  bgGradient: string;
  iconName: string;
  bannerImage?: string;
  description: string;
  order: number;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
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
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending';
  createdAt: string;
  trackingNumber?: string;
}

export interface AdminAnalytics {
  totalRevenue: number;
  netRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  monthlyRevenue: { month: string; amount: number; orders: number }[];
  dailySales: { day: string; date: string; amount: number; orders: number }[];
  categoryDistribution: { category: string; count: number; revenue: number; percentage: number }[];
  regionalDistribution: { city: string; state: string; orders: number; revenue: number; percentage: number }[];
  conversionFunnel: { step: string; count: number; percentage: number }[];
  recentActivities: { id: string; action: string; time: string; type: 'order' | 'stock' | 'user' | 'delivery' | 'marketing' }[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'VIP' | 'Inactive';
}

// ---------------- MARKETING TYPES ----------------
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  usageLimit: number;
  usageCount: number;
  expiresAt: string;
  isActive: boolean;
  description: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'Instagram' | 'WhatsApp' | 'Google Ads' | 'Influencer';
  status: 'Active' | 'Paused' | 'Ended';
  budget: number;
  spent: number;
  revenue: number;
  roas: number;
  clicks: number;
  conversions: number;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  triggerEvent: 'Abandoned Cart' | 'Order Confirmation' | 'Dispatched (പാഴ്സൽ വന്നു)' | 'Festival Sale';
  message: string;
  sentCount: number;
  openRate: number;
}

export interface AnnouncementBanner {
  text: string;
  badge: string;
  linkText: string;
  linkUrl: string;
  isEnabled: boolean;
}

// ---------------- ACCOUNTS & FINANCIAL TYPES ----------------
export interface BusinessExpense {
  id: string;
  title: string;
  category: 'Packaging' | 'Shipping' | 'Marketing' | 'Sourcing' | 'Tools & SaaS' | 'Operations';
  amount: number;
  date: string;
  paymentMode: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card';
  notes?: string;
}

export interface FinancialSummary {
  grossRevenue: number;
  netSales: number;
  cogs: number;
  shippingCosts: number;
  marketingSpend: number;
  gatewayFees: number;
  operationalExpenses: number;
  netProfit: number;
  profitMarginPercent: number;
  pendingPayouts: number;
  settledPayouts: number;
  gstCollected: number;
}

export interface PayoutSettlement {
  id: string;
  payoutId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: 'Settled' | 'Processing' | 'Failed';
  settledDate: string;
  utr: string;
}
