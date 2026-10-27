export interface Product {
  id: string;
  name: string;
  nameMl?: string; // Malayalam name support
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
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
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  monthlyRevenue: { month: string; amount: number }[];
  categoryDistribution: { category: string; count: number; revenue: number }[];
  recentActivities: { id: string; action: string; time: string; type: string }[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'VIP' | 'Inactive';
}
