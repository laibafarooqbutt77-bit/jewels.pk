import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product, MetalColor } from '../types/jewellery';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product, initialColor?: MetalColor) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setActiveQuickViewProduct,
    setActiveDetailProduct,
    recordRecentlyViewed 
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<MetalColor>(product.defaultColor || 'Gold');
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Get current images based on selected color variant
  const currentImages = (product.imagesByColor && product.imagesByColor[selectedColor]) || product.images;
  const primaryImage = currentImages[0] || product.images[0] || '';
  const secondaryImage = currentImages[1] || primaryImage;

  const displayImage = isHovered && secondaryImage ? secondaryImage : primaryImage;

  const handleColorSelect = (e: React.MouseEvent, color: MetalColor) => {
    e.stopPropagation();
    setSelectedColor(color);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedColor, 1, primaryImage);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveQuickViewProduct({
      ...product,
      defaultColor: selectedColor,
    });
  };

  const handleCardClick = () => {
    recordRecentlyViewed(product.id);
    const productWithSelectedColor = {
      ...product,
      defaultColor: selectedColor,
    };
    if (onOpenDetail) {
      onOpenDetail(productWithSelectedColor, selectedColor);
    } else {
      setActiveDetailProduct(productWithSelectedColor);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#EBE4D8] hover:border-[#D5C6B5] transition-all duration-300 hover:shadow-lg cursor-pointer"
    >
      {/* Image Container with ProductImage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F6F2EC]">
        {/* Subtle Text Tag (Unboxed tag, no pill badge spam) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
          {product.isBestSeller && (
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#1F1916] bg-white/95 backdrop-blur-md px-2 py-0.5 rounded shadow-xs border border-[#E7DFD5]">
              Bestseller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8C6D28] bg-[#FBF7EE]/95 px-2 py-0.5 rounded shadow-xs border border-[#EADBBD]">
              New In
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[10px] font-medium tracking-wide text-[#A83724] bg-[#FDF2F0]/95 px-1.5 py-0.5 rounded border border-[#F5D5CE]">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFavorited
              ? 'bg-[#1F1916] text-[#DFC17B]'
              : 'bg-white/80 text-[#5C4F46] hover:bg-white hover:text-[#1F1916]'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#DFC17B]' : ''}`} />
        </button>

        {/* Dynamic Product Image */}
        <ProductImage
          src={displayImage}
          alt={`${product.name} in ${selectedColor}`}
          color={selectedColor}
          category={product.category}
          aspectRatio="portrait"
          zoomOnHover={true}
        />

        {/* 3D Model Availability Tag */}
        {product.modelType && (
          <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white rounded text-[10px] tracking-wide pointer-events-none">
            <span className={`w-1.5 h-1.5 rounded-full ${selectedColor === 'Gold' ? 'bg-[#DFC17B]' : 'bg-[#E2E8F0]'}`} />
            <span>3D {selectedColor} Available</span>
          </div>
        )}

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickView}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/95 hover:bg-white text-[#241E1A] text-xs font-semibold rounded-lg shadow-md backdrop-blur-sm border border-[#E5DACD] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-1 p-4 bg-white">
        {/* Unboxed Metadata Line with typographic dot separator */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#8A796F] mb-1">
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <span aria-hidden="true">·</span>
          <span>Waterproof 316L</span>
        </div>

        {/* Product Title */}
        <h3 className="font-serif text-[15px] sm:text-base font-medium text-[#241E1A] group-hover:text-[#B88E3E] transition-colors line-clamp-1 leading-snug">
          {product.name}
        </h3>

        {/* Interactive Colour Selector with Active Visual State */}
        <div className="flex items-center justify-between my-2.5">
          <div className="flex items-center gap-2">
            {product.colors.map((c) => {
              const isSelected = selectedColor === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={(e) => handleColorSelect(e, c)}
                  aria-label={`Select ${c} color variant`}
                  className={`relative flex items-center justify-center p-1 rounded-full transition-all touch-manipulation min-w-[28px] min-h-[28px] ${
                    isSelected
                      ? 'ring-2 ring-offset-2 ring-[#241E1A]'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border border-black/10 shadow-xs flex items-center justify-center ${
                      c === 'Gold'
                        ? 'bg-gradient-to-tr from-[#D4AF37] to-[#F3E3B6]'
                        : 'bg-gradient-to-tr from-[#CBD5E1] to-[#F1F5F9]'
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F1916]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-medium text-[#7A6B61]">
            {selectedColor === 'Gold' ? '18k PVD Gold' : 'Silver Steel'}
          </span>
        </div>

        {/* Pricing in Pakistani Rupees (PKR) */}
        <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-[#F2ECE3]">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm sm:text-base font-semibold text-[#1F1916] tabular-nums">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-mono text-xs text-[#9E8B7F] line-through tabular-nums">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`p-2 rounded-lg border transition-all duration-200 touch-manipulation ${
              isAdded
                ? 'bg-[#2E6F40] border-[#2E6F40] text-white'
                : 'bg-[#FAF8F5] border-[#E5DACD] text-[#241E1A] hover:bg-[#241E1A] hover:text-white'
            }`}
            aria-label={`Add ${product.name} in ${selectedColor} to cart`}
            title={`Add ${selectedColor} to bag`}
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
