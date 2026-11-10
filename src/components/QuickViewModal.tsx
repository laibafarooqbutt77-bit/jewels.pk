import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, Star, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { MetalColor } from '../types/jewellery';
import { ProductImage } from './ProductImage';

export const QuickViewModal: React.FC = () => {
  const { 
    activeQuickViewProduct, 
    setActiveQuickViewProduct, 
    addToCart, 
    setActiveDetailProduct 
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<MetalColor>('Gold');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (activeQuickViewProduct) {
      setSelectedColor(activeQuickViewProduct.defaultColor || 'Gold');
      setQuantity(1);
    }
  }, [activeQuickViewProduct]);

  if (!activeQuickViewProduct) return null;

  const product = activeQuickViewProduct;

  // Active image based on selected color
  const currentImages = (product.imagesByColor && product.imagesByColor[selectedColor]) || product.images;
  const currentImage = currentImages[0] || product.images[0] || '';

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity, currentImage);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleFullDetails = () => {
    setActiveQuickViewProduct(null);
    setActiveDetailProduct({
      ...product,
      defaultColor: selectedColor,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setActiveQuickViewProduct(null)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden border border-[#EBE4D8] z-10 flex flex-col sm:flex-row my-auto">
        <button
          onClick={() => setActiveQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 p-1.5 bg-white/80 backdrop-blur-xs rounded-full text-[#6E5D51] hover:text-[#241E1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div 
          onClick={handleFullDetails}
          className="sm:w-1/2 aspect-square sm:aspect-auto bg-[#F6F2EC] relative cursor-pointer group"
          title="Click to inspect macro details"
        >
          <ProductImage
            src={currentImage}
            alt={`${product.name} in ${selectedColor}`}
            color={selectedColor}
            category={product.category}
            aspectRatio="square"
            zoomOnHover={true}
          />
          {product.discountPercent > 0 && (
            <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-white bg-[#A83724] px-2 py-0.5 rounded shadow-xs">
              Save {product.discountPercent}%
            </span>
          )}
          <span className="absolute bottom-3 right-3 text-[10px] font-medium text-[#1F1916] bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#E0D5C7] shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
            🔍 Inspect Macro Details
          </span>
        </div>

        {/* Product Content */}
        <div className="sm:w-1/2 p-6 flex flex-col justify-between bg-white">
          <div>
            <div className="text-[11px] text-[#8C7A6E] uppercase tracking-wider mb-1">
              {product.category.replace('-', ' ')} · {selectedColor} Edition
            </div>

            <h3 className="font-serif text-xl font-medium text-[#1F1916] leading-snug">
              {product.name}
            </h3>

            <div className="flex items-center gap-1.5 my-2 text-xs">
              <div className="flex text-[#B88E3E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#B88E3E]" />
                ))}
              </div>
              <span className="font-medium text-[#1F1916]">{product.rating}</span>
            </div>

            <div className="flex items-baseline gap-2 my-3">
              <span className="font-mono text-xl font-bold text-[#1F1916] tabular-nums">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-mono text-xs text-[#9E8B7F] line-through tabular-nums">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-[#6E5D51] leading-relaxed line-clamp-3 mb-4">
              {product.shortDescription}
            </p>

            {/* Color Swatches */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6B61] block mb-1.5">
                Finish: {selectedColor === 'Gold' ? '18k PVD Gold' : 'Polished Silver Steel'}
              </span>
              <div className="flex gap-2">
                {product.colors.map((c) => {
                  const isSelected = selectedColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all touch-manipulation ${
                        isSelected
                          ? 'border-[#241E1A] bg-[#241E1A] text-white shadow-xs'
                          : 'border-[#E0D5C7] text-[#4A3E37] hover:bg-[#F4EFEB]'
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          c === 'Gold' ? 'bg-[#D4AF37]' : 'bg-[#CBD5E1]'
                        }`}
                      />
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A6B61]">
                Qty:
              </span>
              <div className="flex items-center border border-[#E0D5C7] rounded-lg bg-[#FAF8F5]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[#EDE5DA] touch-manipulation"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[#EDE5DA] touch-manipulation"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#F0EAE1]">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 touch-manipulation ${
                isAdded
                  ? 'bg-[#2E6F40] text-white'
                  : 'bg-[#241E1A] hover:bg-[#3D332D] text-white shadow-sm'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added {selectedColor} To Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {selectedColor} To Bag</span>
                </>
              )}
            </button>

            <button
              onClick={handleFullDetails}
              className="w-full py-2 text-center text-xs font-medium text-[#7A6B61] hover:text-[#241E1A] transition-colors flex items-center justify-center gap-1 touch-manipulation"
            >
              <span>View Full Product Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
