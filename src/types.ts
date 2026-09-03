export type ConditionGrade = 
  | 'brand_new' 
  | 'refurbished_a' 
  | 'refurbished_b' 
  | 'used_good';

export type Category = 
  | 'smartphones' 
  | 'laptops' 
  | 'audio' 
  | 'accessories' 
  | 'tablets' 
  | 'gaming';

export interface ProductSpecs {
  processor: string;
  ram: string;
  storage: string;
  display: string;
  battery: string;
  os: string;
  connectivity: string;
  camera?: string;
  color: string;
  weight?: string;
  ports?: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  model: string;
  upc: string;
  category: Category;
  condition: ConditionGrade;
  conditionDescription: string;
  price: number;
  originalPrice: number;
  vendorId: string;
  vendorName: string;
  vendorRating: number;
  vendorSalesCount: number;
  images: string[];
  serialNumber: string;
  batteryHealth?: number;
  specs: ProductSpecs;
  status: 'active' | 'offloaded';
  description: string;
  warrantyMonths: number;
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  isVerified: boolean;
  totalEarnings: number;
  escrowBalance: number;
  activeListingsCount: number;
  phone?: string;
  address?: string;
}

export type OrderStatus = 
  | 'escrow_held' 
  | 'in_transit' 
  | 'delivered_inspecting' 
  | 'completed' 
  | 'disputed' 
  | 'refunded';

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  vendorId: string;
  vendorName: string;
  price: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  serialNumber: string;
  shippingAddress: string;
  createdAt: string;
  inspectionEndsAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  sellerName: string;
  sellerId: string;
  productTitle: string;
  reason: string;
  description: string;
  escrowAmount: number;
  status: 'open' | 'resolved_seller' | 'resolved_buyer';
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'seller' | 'buyer';
  avatar: string;
  vendorId?: string;
}

export interface PlatformStats {
  gmv: number;
  activeListings: number;
  offloadedListings: number;
  totalVendors: number;
  totalOrders: number;
  escrowBalance: number;
  activeDisputes: number;
}

export interface SpecPreset {
  upc: string;
  model: string;
  title: string;
  brand: string;
  category: Category;
  suggestedRetail: number;
  images: string[];
  specs: ProductSpecs;
}

export interface FilterState {
  category: string;
  search: string;
  minPrice: number;
  maxPrice: number;
  conditions: string[];
  rams: string[];
  storages: string[];
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
