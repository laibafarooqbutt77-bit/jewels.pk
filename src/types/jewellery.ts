export type ProductCategory = 
  | 'all'
  | 'necklaces'
  | 'rings'
  | 'earrings'
  | 'bracelets'
  | 'hand-cuffs'
  | 'chunky'
  | 'new-arrivals'
  | 'best-sellers'
  | 'sale';

export type MetalColor = 'Gold' | 'Silver';

export interface ProductVariant {
  color: MetalColor;
  images: string[];
  stock: number;
  inStock: boolean;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'necklaces' | 'rings' | 'earrings' | 'bracelets' | 'hand-cuffs' | 'chunky';
  subCategory: string;
  price: number; // PKR
  originalPrice: number; // PKR
  discountPercent: number;
  colors: MetalColor[];
  defaultColor: MetalColor;
  imagesByColor: {
    Gold: string[];
    Silver: string[];
  };
  images: string[]; // default/fallback gallery (Gold)
  description: string;
  shortDescription: string;
  material: string;
  stock: number;
  inStock: boolean;
  variantStock?: {
    Gold: number;
    Silver: number;
  };
  rating: number;
  reviewsCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isChunky?: boolean;
  isSale?: boolean;
  tags: string[];
  modelType?: 'ring' | 'necklace' | 'earring' | 'cuff';
  details: string[];
  dimensions?: string;
  weight?: string;
}

export interface CartItem {
  product: Product;
  selectedColor: MetalColor;
  selectedImage: string;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  productName: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'easypaisa_jazzcash';
  orderNotes?: string;
}

export interface PlacedOrder {
  orderId: string;
  date: string;
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
}
