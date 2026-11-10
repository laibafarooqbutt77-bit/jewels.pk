import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowRight 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES_CONFIG } from '../data/products';

interface HeaderProps {
  onNavigateHome: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateHome, onSelectCategory }) => {
  const { 
    cartItemCount, 
    wishlist, 
    setIsCartOpen, 
    setIsWishlistOpen, 
    setIsSearchOpen,
    activeCategory
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (id: string) => {
    onSelectCategory(id);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#241E1A] text-[#F3ECE4] text-[11px] md:text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-[#C9B9A6]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFC17B]" />
            <span>Lifetime Waterproof & Anti-Tarnish Warranty</span>
          </div>

          <div className="flex-1 text-center font-medium tracking-wide">
            <span>✨ FREE EXPRESS DELIVERY OVER RS. 2,999 · USE CODE </span>
            <span className="font-semibold text-[#DFC17B] underline decoration-[#DFC17B]/60 underline-offset-2">LUXE20</span>
            <span> FOR 20% OFF</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[#C9B9A6]">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#DFC17B]" />
              <span>COD Available Nationwide</span>
            </div>
            <span className="text-[#6E5D51]">|</span>
            <span>PKR (Rs.)</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#EDE6DC] py-3.5'
            : 'bg-[#FAF8F5] border-b border-[#EDE6DC]/60 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Mobile Hamburger & Search Icon */}
            <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#241E1A] hover:text-[#B88E3E] transition-colors focus:outline-none"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[#4A3E37] hover:text-[#241E1A] transition-colors"
                aria-label="Search jewelry"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Brand Wordmark (Single Text Element per Top Bar Contract) */}
            <div className="flex items-center text-center">
              <button
                onClick={onNavigateHome}
                className="group flex flex-col items-center focus:outline-none"
              >
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] text-[#1F1916] font-medium uppercase group-hover:text-[#B88E3E] transition-colors">
                  Aurelia
                </span>
                <span className="text-[9px] tracking-[0.38em] uppercase text-[#8C7A6E] -mt-1 font-sans">
                  Atelier · Fine Jewels
                </span>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wide text-[#4A3E37]">
              <button
                onClick={onNavigateHome}
                className="hover:text-[#B88E3E] transition-colors relative py-1"
              >
                Home
              </button>

              {/* Shop All with Mega Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="flex items-center gap-1 hover:text-[#B88E3E] transition-colors py-1 group"
                >
                  <span>Collections</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180 text-[#B88E3E]' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {shopDropdownOpen && (
                  <div className="absolute top-full -left-20 pt-3 w-[620px] animate-in fade-in duration-150 z-50">
                    <div className="bg-[#FCFAF8] p-6 rounded-2xl shadow-2xl border border-[#EBE4D8] grid grid-cols-3 gap-6">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E8B7F] block mb-3">
                          Categories
                        </span>
                        <div className="flex flex-col gap-2">
                          {[
                            { id: 'necklaces', label: 'Necklaces' },
                            { id: 'rings', label: 'Rings' },
                            { id: 'earrings', label: 'Earrings' },
                            { id: 'bracelets', label: 'Bracelets' },
                            { id: 'hand-cuffs', label: 'Hand Cuffs' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleCategoryClick(item.id)}
                              className="text-left text-sm text-[#4A3E37] hover:text-[#B88E3E] hover:translate-x-1 transition-all"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E8B7F] block mb-3">
                          Curated Edits
                        </span>
                        <div className="flex flex-col gap-2">
                          {[
                            { id: 'chunky', label: 'Chunky Jewellery' },
                            { id: 'new-arrivals', label: 'New Arrivals' },
                            { id: 'best-sellers', label: 'Best Sellers' },
                            { id: 'sale', label: 'Sale & Offers (20-30% OFF)' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleCategoryClick(item.id)}
                              className={`text-left text-sm transition-all ${
                                item.id === 'sale'
                                  ? 'text-[#C04A3A] font-medium hover:text-[#9F3325]'
                                  : 'text-[#4A3E37] hover:text-[#B88E3E] hover:translate-x-1'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Featured Highlight Card */}
                      <div className="bg-[#F5EFE6] p-4 rounded-xl flex flex-col justify-between border border-[#E7DDD0]">
                        <div>
                          <span className="text-[10px] font-semibold tracking-widest text-[#B88E3E] uppercase block mb-1">
                            Signature Piece
                          </span>
                          <h4 className="font-serif text-base font-semibold text-[#241E1A] leading-tight">
                            The Zephyr Hand Cuff
                          </h4>
                          <p className="text-xs text-[#7A6A5E] mt-1 line-clamp-2">
                            PVD 18k gold over 316L surgical steel. 100% waterproof.
                          </p>
                        </div>
                        <button
                          onClick={() => handleCategoryClick('hand-cuffs')}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#241E1A] hover:text-[#B88E3E] transition-colors"
                        >
                          <span>Explore Cuffs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCategoryClick('necklaces')}
                className={`hover:text-[#B88E3E] transition-colors py-1 ${activeCategory === 'necklaces' ? 'text-[#B88E3E] font-semibold' : ''}`}
              >
                Necklaces
              </button>

              <button
                onClick={() => handleCategoryClick('rings')}
                className={`hover:text-[#B88E3E] transition-colors py-1 ${activeCategory === 'rings' ? 'text-[#B88E3E] font-semibold' : ''}`}
              >
                Rings
              </button>

              <button
                onClick={() => handleCategoryClick('earrings')}
                className={`hover:text-[#B88E3E] transition-colors py-1 ${activeCategory === 'earrings' ? 'text-[#B88E3E] font-semibold' : ''}`}
              >
                Earrings
              </button>

              <button
                onClick={() => handleCategoryClick('hand-cuffs')}
                className={`hover:text-[#B88E3E] transition-colors py-1 ${activeCategory === 'hand-cuffs' ? 'text-[#B88E3E] font-semibold' : ''}`}
              >
                Hand Cuffs
              </button>

              <button
                onClick={() => handleCategoryClick('chunky')}
                className={`hover:text-[#B88E3E] transition-colors py-1 ${activeCategory === 'chunky' ? 'text-[#B88E3E] font-semibold' : ''}`}
              >
                Chunky Edit
              </button>

              <button
                onClick={() => handleCategoryClick('sale')}
                className="text-[#B54130] font-medium hover:text-[#932F20] transition-colors py-1"
              >
                Sale
              </button>
            </nav>

            {/* Right: Search, Wishlist, Cart Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Desktop Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-[#7A6B61] bg-[#F2EDE5] hover:bg-[#EAE3D8] hover:text-[#241E1A] rounded-full transition-colors border border-[#E5DACD]"
                aria-label="Search collections"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search jewellery...</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-[#4A3E37] hover:text-[#241E1A] transition-colors"
                aria-label={`Wishlist with ${wishlist.length} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#B88E3E] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#241E1A] hover:text-[#B88E3E] transition-colors"
                aria-label={`Shopping bag with ${cartItemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#241E1A] text-[#FAF8F5] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-xs bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 z-10 border-r border-[#EBE4D8]">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#EDE6DC]">
                <span className="font-serif text-xl tracking-[0.2em] font-medium text-[#1F1916] uppercase">
                  Aurelia
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#6E5D51] hover:text-[#241E1A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="mt-5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F2EDE5] rounded-xl text-xs text-[#7A6B61] border border-[#E5DACD]"
                >
                  <Search className="w-4 h-4 text-[#8C7A6E]" />
                  <span>Search necklaces, rings, cuffs...</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col gap-1">
                <button
                  onClick={() => {
                    onNavigateHome();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 text-sm font-medium text-[#241E1A] hover:text-[#B88E3E] transition-colors"
                >
                  Home
                </button>

                {CATEGORIES_CONFIG.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex items-center justify-between py-2.5 text-sm font-medium transition-colors ${
                      cat.id === 'sale'
                        ? 'text-[#C04A3A]'
                        : activeCategory === cat.id
                        ? 'text-[#B88E3E]'
                        : 'text-[#4A3E37] hover:text-[#241E1A]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-[#9E8B7F]">({cat.count})</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-6 border-t border-[#EDE6DC] text-xs text-[#7A6B61] space-y-2">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B88E3E]" />
                <span>100% Waterproof Stainless Steel</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#B88E3E]" />
                <span>Cash on Delivery in Pakistan</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
