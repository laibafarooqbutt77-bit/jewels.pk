import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types/jewellery';
import { ProductImage } from './ProductImage';

const SUGGESTIONS = [
  'Herringbone Chain',
  'Dome Ring',
  'Croissant Hoops',
  'Open Hand Cuff',
  'Waterproof Set',
  'Paperclip Necklace',
  'Pearl Choker',
  'Signet Ring',
];

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveDetailProduct } = useShop();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subCategory.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (product: Product) => {
    setIsSearchOpen(false);
    setActiveDetailProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-16 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden border border-[#EBE4D8] z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#EBE4D8] bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8C7A6E]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search necklaces, chunky rings, cuffs, earrings..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-[#1F1916] placeholder-[#A39286]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8C7A6E] hover:text-[#1F1916] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#6E5D51] hover:text-[#241E1A] hover:bg-[#F2ECE3] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions Bar */}
        <div className="px-5 py-3 bg-[#F4EFEB] border-b border-[#EBE4D8] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#8C7A6E] font-medium shrink-0">Popular:</span>
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="px-2.5 py-1 bg-white hover:bg-[#241E1A] hover:text-white text-[#5C4F46] rounded-lg transition-colors border border-[#E2D8CC] shrink-0 text-[11px] touch-manipulation"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-[#8A796F]">
              <Sparkles className="w-6 h-6 text-[#B88E3E] mx-auto mb-2 opacity-60" />
              <span>Type a product keyword above to search over 40+ luxury stainless steel jewellery pieces.</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif text-base text-[#1F1916]">
                No jewellery found for "{query}"
              </p>
              <p className="text-xs text-[#8A796F]">
                Try searching for 'herringbone', 'cuff', 'dome ring', or 'hoops'.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#8C7A6E] uppercase tracking-wider mb-2">
                Found {filteredProducts.length} Results
              </div>
              {filteredProducts.map((p) => {
                const img = p.imagesByColor?.Gold?.[0] || p.images[0];
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="flex items-center gap-4 p-2.5 rounded-xl bg-white hover:bg-[#F5EFE6] border border-[#EDE5DA] transition-colors cursor-pointer group"
                  >
                    <div className="w-14 h-16 rounded-lg overflow-hidden border border-[#E8DDCE] shrink-0 bg-[#F6F2EC]">
                      <ProductImage
                        src={img}
                        alt={p.name}
                        color="Gold"
                        category={p.category}
                        aspectRatio="portrait"
                        zoomOnHover={false}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-medium text-[#1F1916] group-hover:text-[#B88E3E] transition-colors truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#8C7A6E] mt-0.5">
                        <span className="capitalize">{p.category.replace('-', ' ')}</span>
                        <span>·</span>
                        <span className="text-[#2E6F40] font-medium">In Stock</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-semibold text-[#1F1916] tabular-nums block">
                        Rs. {p.price.toLocaleString()}
                      </span>
                      {p.originalPrice > p.price && (
                        <span className="font-mono text-[10px] text-[#A39286] line-through tabular-nums">
                          Rs. {p.originalPrice.toLocaleString()}
                        </span>
                      )}
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
