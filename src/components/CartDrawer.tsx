import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    subtotal, 
    shippingFee, 
    total, 
    freeShippingThreshold,
    amountNeededForFreeShipping,
    promoCode,
    promoApplied,
    promoError,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutOpen
  } = useShop();

  const [inputPromo, setInputPromo] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPromo.trim()) {
      applyPromoCode(inputPromo);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between z-10 border-l border-[#EBE4D8] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#EBE4D8] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#241E1A]" />
            <h2 className="font-serif text-lg font-medium text-[#241E1A]">
              Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#6E5D51] hover:text-[#241E1A] hover:bg-[#F2ECE3] rounded-full transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F4EFEB] px-5 py-3 border-b border-[#EBE4D8]">
          <div className="flex items-center justify-between text-xs text-[#5C4F46] mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#B88E3E]" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-[#2E6F40] font-semibold">🎉 You have unlocked Free Express Delivery!</span>
              ) : (
                <span>Add <strong className="font-mono text-[#241E1A]">Rs. {amountNeededForFreeShipping.toLocaleString()}</strong> more for FREE delivery</span>
              )}
            </span>
            <span className="font-mono text-[11px] font-semibold text-[#8C7A6E]">
              {freeShippingProgress}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#E2D8CC] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#D8B96E] to-[#B88E3E] transition-all duration-300 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Scrollable Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F0EAE1] flex items-center justify-center text-[#B88E3E]">
                <ShoppingBag className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#241E1A]">
                Your shopping bag is empty
              </h3>
              <p className="text-xs text-[#8A796F] max-w-xs leading-relaxed">
                Explore our waterproof 18k gold-plated necklaces, chunky dome rings and hand cuffs.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2.5 bg-[#241E1A] hover:bg-[#3D332D] text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={`${item.product.id}-${item.selectedColor}`}
                className="flex gap-4 p-3 bg-white rounded-xl border border-[#EDE5DA] shadow-xs"
              >
                {/* Product Image with exact variant color */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F6F2EC] shrink-0 border border-[#EBE4D8]">
                  <ProductImage
                    src={item.selectedImage || item.product.imagesByColor?.[item.selectedColor]?.[0] || item.product.images[0]}
                    alt={`${item.product.name} in ${item.selectedColor}`}
                    color={item.selectedColor}
                    category={item.product.category}
                    aspectRatio="portrait"
                    zoomOnHover={false}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif text-sm font-medium text-[#241E1A] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7A6B61] mt-0.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.selectedColor === 'Gold' ? '#D4AF37' : '#CBD5E1' }} />
                        <span>{item.selectedColor} Stainless Steel</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="text-[#A39286] hover:text-[#A83724] p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#E0D5C7] rounded-lg bg-[#FAF8F5] overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-[#5C4F46] hover:bg-[#EDE5DA] transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-xs text-[#5C4F46] hover:bg-[#EDE5DA] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm font-bold text-[#1F1916] tabular-nums">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-[#EBE4D8] space-y-3.5">
            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A6E]" />
                  <input
                    type="text"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder="Promo code (try LUXE20)"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E2D8CC] rounded-xl focus:outline-none focus:border-[#241E1A] uppercase tracking-wider font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F2EDE5] hover:bg-[#241E1A] hover:text-white text-[#241E1A] text-xs font-semibold rounded-xl transition-colors border border-[#E2D8CC]"
                >
                  Apply
                </button>
              </div>

              {promoApplied && (
                <div className="flex items-center justify-between text-xs text-[#2E6F40] bg-[#EBF6EE] px-3 py-1.5 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{promoCode}</strong> applied (-20%)</span>
                  </span>
                  <button 
                    type="button" 
                    onClick={removePromoCode}
                    className="text-xs text-[#A83724] underline hover:no-underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-[#A83724]">{promoError}</p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5C4F46] pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#241E1A]">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#2E6F40]">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono tabular-nums text-[#241E1A]">
                  {shippingFee === 0 ? (
                    <span className="text-[#2E6F40] font-medium">FREE</span>
                  ) : (
                    `Rs. ${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#1F1916] pt-2 border-t border-[#EBE4D8]">
                <span>Total (PKR)</span>
                <span className="font-mono tabular-nums">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 bg-[#241E1A] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[10px] text-center text-[#8C7A6E]">
              Cash on Delivery & Bank Transfer accepted across Pakistan
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
