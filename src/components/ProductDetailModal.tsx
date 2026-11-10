import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCw, 
  Star, 
  Droplets, 
  ArrowRight
} from 'lucide-react';
import { Product, MetalColor } from '../types/jewellery';
import { useShop } from '../context/ShopContext';
import { ThreeDShowcase } from './ThreeDShowcase';
import { ProductImage } from './ProductImage';
import { ImageMagnifier } from './ImageMagnifier';
import { PRODUCTS } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product, initialColor?: MetalColor) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, setIsCheckoutOpen } = useShop();

  const [selectedColor, setSelectedColor] = useState<MetalColor>('Gold');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'photos' | '3d'>('photos');
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'delivery'>('details');
  const [isAdded, setIsAdded] = useState(false);

  // Sync selectedColor when product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.defaultColor || 'Gold');
      setSelectedImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const relatedProducts = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Active images based on chosen color variant
  const currentImages = (product.imagesByColor && product.imagesByColor[selectedColor]) || product.images;
  const currentMainImage = currentImages[selectedImageIndex] || currentImages[0] || product.images[0] || '';

  const handleColorChange = (color: MetalColor) => {
    setSelectedColor(color);
    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity, currentMainImage);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, quantity, currentMainImage);
    onClose();
    setIsCheckoutOpen(true);
  };

  const availableStock = product.variantStock?.[selectedColor] || product.stock;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden border border-[#EBE4D8] z-10 max-h-[92vh] flex flex-col my-auto">
        {/* Sticky Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4D8] bg-[#FAF8F5]/95 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-[#8A796F]">
            <span className="uppercase tracking-widest text-[#B88E3E] font-medium">Aurelia Fine Jewels</span>
            <span aria-hidden="true">/</span>
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#1F1916] font-medium">{selectedColor} Edition</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2 rounded-full border transition-colors ${
                isFavorited 
                  ? 'bg-[#241E1A] text-[#DFC17B] border-[#241E1A]' 
                  : 'bg-white text-[#5C4F46] border-[#E5DACD] hover:bg-[#F2ECE3]'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#DFC17B]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#5C4F46] hover:text-[#241E1A] hover:bg-[#EDE5DA] rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Visual Showcase (2D Gallery or 3D Interactive) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Mode Toggle: Studio Photography vs 3D Interactive Model */}
              <div className="flex items-center justify-between">
                <div className="flex items-center p-1 bg-[#F0EAE1] rounded-xl border border-[#E2D7C7]">
                  <button
                    onClick={() => setViewMode('photos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'photos'
                        ? 'bg-white text-[#241E1A] shadow-xs'
                        : 'text-[#6E5D51] hover:text-[#241E1A]'
                    }`}
                  >
                    {selectedColor} Photo Gallery
                  </button>
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === '3d'
                        ? 'bg-[#241E1A] text-white shadow-xs'
                        : 'text-[#6E5D51] hover:text-[#241E1A]'
                    }`}
                  >
                    <RotateCw className="w-3 h-3 text-[#DFC17B]" />
                    <span>3D {selectedColor} View</span>
                  </button>
                </div>

                <span className="text-[11px] text-[#8C7A6E] hidden sm:inline">
                  {viewMode === '3d' ? '360° Real-time PBR Rendering' : `Viewing ${selectedColor} Edition`}
                </span>
              </div>

              {/* Display Area */}
              {viewMode === 'photos' ? (
                <div className="flex flex-col gap-3">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#E7DFD5] shadow-xs">
                    <ImageMagnifier
                      src={currentMainImage}
                      alt={`${product.name} in ${selectedColor}`}
                      color={selectedColor}
                      zoomLevel={2.4}
                      magnifierSize={190}
                    />

                    {product.discountPercent > 0 && (
                      <span className="absolute top-4 left-4 z-20 text-xs font-semibold tracking-wider uppercase text-white bg-[#A83724] px-2.5 py-1 rounded shadow-sm pointer-events-none">
                        Save {product.discountPercent}%
                      </span>
                    )}

                    <span className="absolute bottom-4 right-4 z-20 text-[11px] font-medium text-[#1F1916] bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E0D5C7] shadow-xs pointer-events-none">
                      {selectedColor} 316L Finish
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  {currentImages.length > 1 && (
                    <div className="flex items-center gap-3">
                      {currentImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                            selectedImageIndex === idx
                              ? 'border-[#241E1A] ring-1 ring-[#241E1A]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <ProductImage
                            src={img}
                            alt=""
                            color={selectedColor}
                            category={product.category}
                            aspectRatio="square"
                            zoomOnHover={false}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-[460px]">
                  <ThreeDShowcase
                    key={`${product.modelType}-${selectedColor}`}
                    initialModelType={product.modelType || 'ring'}
                    initialColor={selectedColor}
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-[#F5EFE6] rounded-xl border border-[#E8DDCE] text-xs text-[#5C4F46]">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[#B88E3E] shrink-0" />
                  <span>100% Waterproof & Sweatproof</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B88E3E] shrink-0" />
                  <span>Hypoallergenic Surgical Steel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B88E3E] shrink-0" />
                  <span>2–4 Days Express Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Product Title & Reviews */}
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#1F1916] leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-[#B88E3E]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#B88E3E]" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[#1F1916]">{product.rating}</span>
                  <span className="text-xs text-[#8A796F]">({product.reviewsCount} verified reviews)</span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#1F1916] tabular-nums">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="font-mono text-base text-[#9E8B7F] line-through tabular-nums">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-xs text-[#2E6F40] font-medium bg-[#EBF6EE] px-2 py-0.5 rounded">
                    In Stock ({availableStock} units left)
                  </span>
                </div>

                <p className="text-sm text-[#5C4F46] leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Metal Colour Option with Instant Visual State */}
                <div className="mb-6 p-4 rounded-xl bg-white border border-[#EDE5DA]">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5D51] mb-2.5">
                    Select Metal Finish: <span className="text-[#1F1916] font-bold">{selectedColor === 'Gold' ? '18k PVD Gold Plated' : 'Polished Silver Stainless Steel'}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => handleColorChange(c)}
                          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all touch-manipulation ${
                            isSelected
                              ? 'bg-[#1F1916] text-white border-[#1F1916] shadow-sm ring-2 ring-offset-2 ring-[#241E1A]'
                              : 'bg-[#FAF8F5] text-[#4A3E37] border-[#E0D5C7] hover:border-[#241E1A]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full border border-black/10 flex items-center justify-center ${
                              c === 'Gold' 
                                ? 'bg-gradient-to-tr from-[#D4AF37] to-[#F3E3B6]' 
                                : 'bg-gradient-to-tr from-[#CBD5E1] to-[#F1F5F9]'
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          <span>{c} Edition</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6E5D51] mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center w-32 border border-[#E0D5C7] rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-sm font-medium hover:bg-[#F2ECE3] transition-colors touch-manipulation"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-mono text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-sm font-medium hover:bg-[#F2ECE3] transition-colors touch-manipulation"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Purchase Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 touch-manipulation ${
                      isAdded
                        ? 'bg-[#2E6F40] text-white'
                        : 'bg-[#241E1A] hover:bg-[#3D332D] text-white shadow-md'
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
                        <span>Add {selectedColor} To Bag · Rs. {(product.price * quantity).toLocaleString()}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#DFC17B] hover:bg-[#CFAC5E] text-[#241E1A] transition-colors flex items-center justify-center gap-1.5 shadow-sm touch-manipulation"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Information Tabs */}
                <div className="border-t border-[#EBE4D8] pt-4">
                  <div className="flex border-b border-[#EBE4D8] gap-6 text-xs font-semibold mb-3">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`pb-2 transition-colors ${
                        activeTab === 'details'
                          ? 'border-b-2 border-[#241E1A] text-[#1F1916]'
                          : 'text-[#8A796F] hover:text-[#241E1A]'
                      }`}
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => setActiveTab('care')}
                      className={`pb-2 transition-colors ${
                        activeTab === 'care'
                          ? 'border-b-2 border-[#241E1A] text-[#1F1916]'
                          : 'text-[#8A796F] hover:text-[#241E1A]'
                      }`}
                    >
                      Tarnish-Free Care
                    </button>
                    <button
                      onClick={() => setActiveTab('delivery')}
                      className={`pb-2 transition-colors ${
                        activeTab === 'delivery'
                          ? 'border-b-2 border-[#241E1A] text-[#1F1916]'
                          : 'text-[#8A796F] hover:text-[#241E1A]'
                      }`}
                    >
                      Pakistan Shipping
                    </button>
                  </div>

                  <div className="text-xs text-[#5C4F46] leading-relaxed">
                    {activeTab === 'details' && (
                      <ul className="space-y-1.5 list-disc pl-4">
                        <li><strong>Base Metal:</strong> 316L Surgical Stainless Steel ({selectedColor === 'Gold' ? '18k PVD Vacuum Gold Coating' : 'High Mirror Polished Silver Steel'})</li>
                        <li><strong>Weight:</strong> {product.weight || 'Solid stainless steel construction'}</li>
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                    {activeTab === 'care' && (
                      <p>
                        Our vacuum PVD plating is 10 times more resilient than ordinary gold-dipped brass. Wear it in the shower, beach, gym, and when applying fragrance. Clean gently with a soft microfibre cloth to restore high-polish mirror brilliance.
                      </p>
                    )}
                    {activeTab === 'delivery' && (
                      <p>
                        Delivered securely across Pakistan (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Quetta, Multan, and all cities) within 2 to 4 business days. Free shipping on orders over Rs. 2,999. Cash on Delivery (COD) and Bank Transfer supported.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Related Curated Pieces */}
              {relatedProducts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[#EBE4D8]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E5D51] mb-3">
                    Pairs Perfectly With
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {relatedProducts.map((rp) => (
                      <button
                        key={rp.id}
                        onClick={() => {
                          onSelectProduct(rp, selectedColor);
                          setSelectedImageIndex(0);
                        }}
                        className="group text-left flex flex-col gap-1.5"
                      >
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-white border border-[#E8DDCE]">
                          <ProductImage
                            src={rp.imagesByColor?.[selectedColor]?.[0] || rp.images[0]}
                            alt={rp.name}
                            color={selectedColor}
                            category={rp.category}
                            aspectRatio="square"
                            zoomOnHover={true}
                          />
                        </div>
                        <span className="font-serif text-xs font-medium text-[#241E1A] line-clamp-1 group-hover:text-[#B88E3E]">
                          {rp.name}
                        </span>
                        <span className="font-mono text-[11px] font-semibold text-[#6E5D51]">
                          Rs. {rp.price.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
