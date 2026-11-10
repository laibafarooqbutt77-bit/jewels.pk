import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductImage } from './ProductImage';

export const WishlistModal: React.FC = () => {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    toggleWishlist, 
    moveToCartFromWishlist,
    setActiveDetailProduct 
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden border border-[#EBE4D8] z-10 max-h-[85vh] flex flex-col my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4D8] bg-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#B88E3E] fill-[#B88E3E]" />
            <h2 className="font-serif text-lg font-medium text-[#241E1A]">
              My Wishlist ({wishlistProducts.length})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-[#6E5D51] hover:text-[#241E1A] hover:bg-[#F2ECE3] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {wishlistProducts.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#F0EAE1] flex items-center justify-center text-[#B88E3E] mx-auto">
                <Heart className="w-7 h-7 opacity-70" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#241E1A]">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-[#8A796F] max-w-xs mx-auto">
                Save your favourite waterproof necklaces, rings, and cuffs to easily access or buy them later.
              </p>
              <button
                onClick={() => setIsWishlistOpen(false)}
                className="mt-2 px-5 py-2.5 bg-[#241E1A] hover:bg-[#3D332D] text-white text-xs font-semibold rounded-xl uppercase tracking-wider transition-colors shadow-sm"
              >
                Browse Jewellery
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wishlistProducts.map((p) => {
                const img = p.imagesByColor?.Gold?.[0] || p.images[0];
                return (
                  <div 
                    key={p.id}
                    className="flex gap-3 p-3 bg-white rounded-xl border border-[#EDE5DA] shadow-xs group"
                  >
                    <div
                      className="w-20 h-24 rounded-lg overflow-hidden border border-[#EBE4D8] shrink-0 cursor-pointer bg-[#F6F2EC]"
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setActiveDetailProduct(p);
                      }}
                    >
                      <ProductImage
                        src={img}
                        alt={p.name}
                        color="Gold"
                        category={p.category}
                        aspectRatio="portrait"
                        zoomOnHover={true}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 
                          onClick={() => {
                            setIsWishlistOpen(false);
                            setActiveDetailProduct(p);
                          }}
                          className="font-serif text-sm font-medium text-[#241E1A] line-clamp-1 cursor-pointer hover:text-[#B88E3E] transition-colors"
                        >
                          {p.name}
                        </h4>
                        <p className="font-mono text-xs font-semibold text-[#1F1916] mt-1 tabular-nums">
                          Rs. {p.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => moveToCartFromWishlist(p)}
                          className="flex-1 py-1.5 px-2 bg-[#241E1A] hover:bg-[#3D332D] text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors touch-manipulation"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Move to Bag</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1.5 text-[#A39286] hover:text-[#A83724] border border-[#E0D5C7] rounded-lg transition-colors touch-manipulation"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
