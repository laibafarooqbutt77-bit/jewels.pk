import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, MetalColor, CheckoutFormData, PlacedOrder } from '../types/jewellery';

interface ShopContextType {
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  recentlyViewed: string[]; // Product IDs
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  activeQuickViewProduct: Product | null;
  activeDetailProduct: Product | null;
  activeCategory: string;
  promoCode: string;
  discountAmount: number;
  promoApplied: boolean;
  promoError: string;
  lastPlacedOrder: PlacedOrder | null;
  
  // Actions
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setActiveQuickViewProduct: (product: Product | null) => void;
  setActiveDetailProduct: (product: Product | null) => void;
  setActiveCategory: (cat: string) => void;
  addToCart: (product: Product, color?: MetalColor, quantity?: number, customImage?: string) => void;
  updateCartQuantity: (productId: string, color: MetalColor, quantity: number) => void;
  removeFromCart: (productId: string, color: MetalColor) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (product: Product) => void;
  recordRecentlyViewed: (productId: string) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  placeOrder: (formData: CheckoutFormData) => PlacedOrder;
  
  // Computed values
  subtotal: number;
  shippingFee: number;
  total: number;
  cartItemCount: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 250;

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aurelia_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => {
        const color = item.selectedColor || 'Gold';
        const prod = item.product;
        const img = item.selectedImage || prod?.imagesByColor?.[color]?.[0] || prod?.images?.[0] || '';
        return {
          ...item,
          selectedColor: color,
          selectedImage: img,
        };
      });
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aurelia_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aurelia_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = useState<Product | null>(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string>('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<PlacedOrder | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_cart', JSON.stringify(cart));
    } catch {
      // LocalStorage fallback
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_wishlist', JSON.stringify(wishlist));
    } catch {
      // LocalStorage fallback
    }
  }, [wishlist]);

  // Sync recently viewed to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_recent', JSON.stringify(recentlyViewed));
    } catch {
      // LocalStorage fallback
    }
  }, [recentlyViewed]);

  const addToCart = (product: Product, color: MetalColor = 'Gold', quantity = 1, customImage?: string) => {
    const variantImg = customImage 
      || product.imagesByColor?.[color]?.[0] 
      || product.images[0] 
      || '';

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          selectedImage: variantImg,
        };
        return next;
      }
      return [...prev, { product, selectedColor: color, selectedImage: variantImg, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, color: MetalColor, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, color: MetalColor) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (product: Product) => {
    addToCart(product, 'Gold', 1);
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  const recordRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Promo code calculation
  let discountAmount = 0;
  if (promoApplied) {
    if (promoCode.toUpperCase() === 'LUXE20') {
      discountAmount = Math.round(subtotal * 0.2);
    } else if (promoCode.toUpperCase() === 'WELCOME10') {
      discountAmount = Math.round(subtotal * 0.1);
    }
  }

  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LUXE20' || clean === 'WELCOME10') {
      setPromoCode(clean);
      setPromoApplied(true);
      setPromoError('');
      return true;
    } else {
      setPromoError('Invalid promo code. Try "LUXE20" for 20% off!');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
  };

  const placeOrder = (formData: CheckoutFormData): PlacedOrder => {
    const order: PlacedOrder = {
      orderId: `AA-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-PK', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customer: formData,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total,
      promoCode: promoApplied ? promoCode : undefined,
    };

    setLastPlacedOrder(order);
    clearCart();
    return order;
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        recentlyViewed,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isCheckoutOpen,
        activeQuickViewProduct,
        activeDetailProduct,
        activeCategory,
        promoCode,
        discountAmount,
        promoApplied,
        promoError,
        lastPlacedOrder,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setIsCheckoutOpen,
        setActiveQuickViewProduct,
        setActiveDetailProduct,
        setActiveCategory,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        recordRecentlyViewed,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        subtotal,
        shippingFee,
        total,
        cartItemCount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
