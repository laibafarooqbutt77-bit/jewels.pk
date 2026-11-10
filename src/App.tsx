import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Droplets, 
  Truck, 
  RotateCw, 
  Star, 
  Check, 
  SlidersHorizontal, 
  ChevronRight,
  Flame,
  Instagram,
  Heart
} from 'lucide-react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ThreeDShowcase } from './components/ThreeDShowcase';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistModal } from './components/WishlistModal';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { Footer } from './components/Footer';
import { PRODUCTS, CATEGORIES_CONFIG, REVIEWS } from './data/products';
import { Product, MetalColor } from './types/jewellery';

// Generated High-Fidelity Campaign Assets
const HERO_IMAGE = '/src/assets/images/hero_jewellery_editorial_1794313960106.jpg';
const NECKLACES_EDITORIAL_IMG = '/src/assets/images/category_necklaces_editorial_1794313961259.jpg';
const RINGS_CUFFS_EDITORIAL_IMG = '/src/assets/images/category_rings_cuffs_editorial_1794313961442.jpg';
const WATERPROOF_MACRO_IMG = '/src/assets/images/craftsmanship_waterproof_macro_1794313960723.jpg';

const MainAppContent: React.FC = () => {
  const { 
    activeDetailProduct, 
    setActiveDetailProduct,
    activeCategory,
    setActiveCategory,
    setIsSearchOpen,
    setIsCheckoutOpen
  } = useShop();

  // Filters for Category Catalog View
  const [selectedFinish, setSelectedFinish] = useState<'all' | 'Gold' | 'Silver'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filtered Products for category view
  const categoryProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (activeCategory === 'new-arrivals') {
      list = list.filter((p) => p.isNewArrival);
    } else if (activeCategory === 'best-sellers') {
      list = list.filter((p) => p.isBestSeller);
    } else if (activeCategory === 'chunky') {
      list = list.filter((p) => p.isChunky);
    } else if (activeCategory === 'sale') {
      list = list.filter((p) => p.isSale || p.discountPercent >= 28);
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (selectedFinish !== 'all') {
      list = list.filter((p) => p.colors.includes(selectedFinish)).map((p) => ({
        ...p,
        defaultColor: selectedFinish,
      }));
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [activeCategory, selectedFinish, sortBy]);

  // Curated Subsets for Homepage Sections
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);
  const chunkyPieces = PRODUCTS.filter((p) => p.isChunky).slice(0, 4);
  const everydayEssentials = PRODUCTS.filter((p) => !p.isChunky && p.price < 2600).slice(0, 4);

  const isHomeView = activeCategory === 'all';

  const handleNavigateHome = () => {
    setActiveCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetail = (product: Product, initialColor?: MetalColor) => {
    setActiveDetailProduct({
      ...product,
      defaultColor: initialColor || product.defaultColor || 'Gold',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#241E1A]">
      {/* 1. Header with Sticky Navigation & Announcement Bar */}
      <Header 
        onNavigateHome={handleNavigateHome} 
        onSelectCategory={handleSelectCategory} 
      />

      {/* Main View: Homepage vs Filtered Category Catalog */}
      {isHomeView ? (
        <main className="flex-1">
          {/* 2. Hero Section: Editorial Elegance That Lasts Forever */}
          <section className="relative overflow-hidden bg-[#F6F1EA] border-b border-[#EBE4D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                {/* Hero Editorial Copy */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-[#E2D6C6] text-xs font-semibold uppercase tracking-wider text-[#9C752B] shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>The Autumn / Winter Fine Edit</span>
                  </div>

                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1F1916] leading-[1.08] tracking-tight">
                    Elegance That Lasts Forever.
                  </h1>

                  <p className="text-sm sm:text-base text-[#5C4F46] leading-relaxed max-w-xl">
                    Engineered in 316L surgical stainless steel and plated in genuine 18k PVD gold. 100% waterproof, sweatproof, and guaranteed to never tarnish or irritate sensitive skin.
                  </p>

                  {/* Primary & Secondary Action CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => handleSelectCategory('new-arrivals')}
                      className="px-7 py-3.5 bg-[#241E1A] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 group"
                    >
                      <span>Shop New Arrivals</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <a
                      href="#interactive-3d-studio"
                      className="px-6 py-3.5 bg-white hover:bg-[#F2ECE3] text-[#241E1A] text-xs font-bold uppercase tracking-widest rounded-xl border border-[#D8CABE] transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-[#B88E3E]" />
                      <span>Explore 3D Studio</span>
                    </a>
                  </div>

                  {/* Trust Strips below CTA */}
                  <div className="pt-6 border-t border-[#E8DDD0] grid grid-cols-3 gap-4 text-xs text-[#6B5E55]">
                    <div>
                      <span className="font-semibold text-[#1F1916] block">100% Waterproof</span>
                      <span className="text-[11px] text-[#8C7A6E]">Shower & sea safe</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#1F1916] block">Lifetime Guarantee</span>
                      <span className="text-[11px] text-[#8C7A6E]">Anti-tarnish PVD</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#1F1916] block">TCS Express</span>
                      <span className="text-[11px] text-[#8C7A6E]">2-4 Days in Pakistan</span>
                    </div>
                  </div>
                </div>

                {/* Hero High-Fidelity Editorial Photography */}
                <div className="lg:col-span-6 relative">
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#E7DFD5]">
                    <img
                      src={HERO_IMAGE}
                      alt="Aurelia Atelier luxury jewellery campaign"
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Floating Luxury Spec Card */}
                    <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#E7DFD5] shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF5ED] flex items-center justify-center text-[#B88E3E] shrink-0 border border-[#E5DACD]">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-[#1F1916]">
                            18k PVD Vacuum Coating
                          </h4>
                          <p className="text-[11px] text-[#7A6B61] leading-tight mt-0.5">
                            10x more resilient than standard jewellery plating.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Featured Categories Grid */}
          <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E] block mb-2">
                Curated Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1916]">
                Designed For Daily Immersion
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6B61] mt-2">
                Discover pieces crafted from surgical-grade stainless steel, precision-plated to withstand the elements without fading.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category 1: Necklaces */}
              <div 
                onClick={() => handleSelectCategory('necklaces')}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#E8DDCE] shadow-xs cursor-pointer"
              >
                <img
                  src={NECKLACES_EDITORIAL_IMG}
                  alt="Necklaces collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#DFC17B] mb-1">
                    Fluid Liquid Gold
                  </span>
                  <h3 className="font-serif text-2xl font-medium">Necklaces & Chains</h3>
                  <p className="text-xs text-[#E0D5C7] mt-1 line-clamp-2">
                    Herringbone, paperclip links, and sunburst medallion pendants.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#DFC17B] group-hover:underline">
                    <span>Shop Necklaces</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Category 2: Rings & Cuffs */}
              <div 
                onClick={() => handleSelectCategory('hand-cuffs')}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#E8DDCE] shadow-xs cursor-pointer"
              >
                <img
                  src={RINGS_CUFFS_EDITORIAL_IMG}
                  alt="Rings & Hand Cuffs collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#DFC17B] mb-1">
                    Architectural Forms
                  </span>
                  <h3 className="font-serif text-2xl font-medium">Rings & Hand Cuffs</h3>
                  <p className="text-xs text-[#E0D5C7] mt-1 line-clamp-2">
                    Sculpted open cuffs, hollow dome rings, and ribbed cigar bands.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#DFC17B] group-hover:underline">
                    <span>Shop Hand Cuffs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Category 3: Chunky Statement Collection */}
              <div 
                onClick={() => handleSelectCategory('chunky')}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#E8DDCE] shadow-xs cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80"
                  alt="Chunky jewellery collection"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#DFC17B] mb-1">
                    Bold & Featherweight
                  </span>
                  <h3 className="font-serif text-2xl font-medium">Chunky Jewellery</h3>
                  <p className="text-xs text-[#E0D5C7] mt-1 line-clamp-2">
                    Oversized croissant hoops, heavy Cuban links, and statement earrings.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#DFC17B] group-hover:underline">
                    <span>Explore Chunky Edit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Best Sellers Section */}
          <section className="py-16 bg-white border-y border-[#EBE4D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E] block mb-1">
                    Most Coveted
                  </span>
                  <h2 className="font-serif text-3xl font-medium text-[#1F1916]">
                    Our Best Sellers
                  </h2>
                </div>
                <button
                  onClick={() => handleSelectCategory('best-sellers')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#241E1A] hover:text-[#B88E3E] transition-colors"
                >
                  <span>View All Best Sellers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {bestSellers.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={handleOpenDetail}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 5. Interactive 3D Jewellery Showcase Section (Section 7 from prompt) */}
          <section id="interactive-3d-studio" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5EFE6] rounded-full border border-[#E5DACD] text-xs font-semibold text-[#8C6D28]">
                  <RotateCw className="w-3.5 h-3.5 text-[#B88E3E]" />
                  <span>Real-Time 3D Studio Engine</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1916] leading-tight">
                  Inspect Every Curve in 360° Real-Time 3D
                </h2>

                <p className="text-xs sm:text-sm text-[#5C4F46] leading-relaxed">
                  Experience our jewellery before it arrives. Our real-time Three.js studio renders authentic physical specular reflections across 18k PVD Gold and Polished Silver Stainless Steel. Rotate, zoom, and inspect bevels from every angle.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs text-[#4A3E37]">
                    <div className="w-6 h-6 rounded-full bg-[#EFE8DE] flex items-center justify-center text-[#B88E3E] font-bold">1</div>
                    <span>Switch between Rings, Necklaces, Hoops, and Hand Cuffs</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#4A3E37]">
                    <div className="w-6 h-6 rounded-full bg-[#EFE8DE] flex items-center justify-center text-[#B88E3E] font-bold">2</div>
                    <span>Toggle 18k Champagne Gold or Silver Steel finish</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#4A3E37]">
                    <div className="w-6 h-6 rounded-full bg-[#EFE8DE] flex items-center justify-center text-[#B88E3E] font-bold">3</div>
                    <span>Interactive touch drag rotation & smooth camera zoom</span>
                  </div>
                </div>
              </div>

              {/* 3D Viewer Container */}
              <div className="lg:col-span-7">
                <ThreeDShowcase 
                  initialModelType="cuff" 
                  initialColor="Gold"
                  className="w-full h-[480px] shadow-xl"
                />
              </div>
            </div>
          </section>

          {/* 6. Special Promotional Sale Banner (Section 5 & 11) */}
          <section className="bg-[#241E1A] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#DFC17B]">
                  Limited-Time Promotion
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
                  Up To 30% Off Selected Essentials
                </h2>
                <p className="text-xs sm:text-sm text-[#C9B9A6] max-w-lg">
                  Every order over Rs. 2,999 ships free across Pakistan via TCS Express. Use discount coupon <strong className="text-[#DFC17B] font-mono">LUXE20</strong> for an extra 20% savings.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => handleSelectCategory('sale')}
                  className="px-8 py-3.5 bg-[#DFC17B] hover:bg-[#CFAC5E] text-[#1F1916] text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-lg"
                >
                  Shop Sale Collection
                </button>
              </div>
            </div>
          </section>

          {/* 7. New Arrivals Section */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E] block mb-1">
                  Just In
                </span>
                <h2 className="font-serif text-3xl font-medium text-[#1F1916]">
                  New Arrivals
                </h2>
              </div>
              <button
                onClick={() => handleSelectCategory('new-arrivals')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#241E1A] hover:text-[#B88E3E] transition-colors"
              >
                <span>Explore All New Arrivals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={handleOpenDetail}
                  />
              ))}
            </div>
          </section>

          {/* 8. Chunky Jewellery Collection Section */}
          <section className="py-16 bg-[#F6F1EA] border-y border-[#EBE4D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E] block mb-1">
                    Sculptural Impact
                  </span>
                  <h2 className="font-serif text-3xl font-medium text-[#1F1916]">
                    The Chunky Jewellery Edit
                  </h2>
                </div>
                <button
                  onClick={() => handleSelectCategory('chunky')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#241E1A] hover:text-[#B88E3E] transition-colors"
                >
                  <span>View All Chunky Pieces</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {chunkyPieces.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={handleOpenDetail}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* 9. Craftsmanship & Science Spotlight (Why Choose Us) */}
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#E7DFD5]">
                  <img
                    src={WATERPROOF_MACRO_IMG}
                    alt="Waterproof stainless steel jewellery macro"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E] block">
                  The Science of Durability
                </span>

                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1916] leading-tight">
                  Why 18k PVD Stainless Steel Outlasts Traditional Gold Plating
                </h2>

                <p className="text-xs sm:text-sm text-[#5C4F46] leading-relaxed">
                  Traditional gold-plated jewellery uses cheap brass dipped in a micro-thin layer of gold that turns green within weeks. At Aurelia Atelier, we utilize <strong>Physical Vapor Deposition (PVD)</strong> inside a vacuum chamber.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FAF5ED] border border-[#E5DACD] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F1916]">100% Shower, Gym & Sea Safe</h4>
                      <p className="text-xs text-[#7A6B61] mt-0.5">
                        Water, sea salt, sweat, lotions, and perfumes will never corrode or peel the molecular PVD bond.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FAF5ED] border border-[#E5DACD] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F1916]">Hypoallergenic 316L Surgical Grade</h4>
                      <p className="text-xs text-[#7A6B61] mt-0.5">
                        Free from nickel and lead. Engineered specifically for sensitive skin that reacts to lower-grade costume jewellery.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#FAF5ED] border border-[#E5DACD] flex items-center justify-center text-[#B88E3E] shrink-0 mt-0.5">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1F1916]">Cash on Delivery Across Pakistan</h4>
                      <p className="text-xs text-[#7A6B61] mt-0.5">
                        Dispatched in luxury velvet keepsake boxes with sealed authenticity and warranty certificates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Verified Customer Testimonials */}
          <section className="py-20 bg-white border-t border-[#EBE4D8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E] block mb-2">
                  Client Words
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1916]">
                  Loved by Thousands Across Pakistan
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {REVIEWS.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="p-6 bg-[#FAF8F5] rounded-2xl border border-[#EDE5DA] shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex text-[#B88E3E] mb-3">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#B88E3E]" />
                        ))}
                      </div>
                      <h4 className="font-serif text-base font-semibold text-[#1F1916] mb-2 leading-snug">
                        "{rev.title}"
                      </h4>
                      <p className="text-xs text-[#6B5E55] leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#EBE4D8]">
                      <span className="font-medium text-xs text-[#1F1916] block">{rev.author}</span>
                      <span className="text-[11px] text-[#8C7A6E]">{rev.city} · Verified Purchase</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 11. Instagram Community Showcase (#AureliaJewels) */}
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E] block">
                  #AureliaJewels
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1F1916]">
                  Styled by You
                </h2>
              </div>
              <a
                href="#instagram"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#241E1A] hover:text-[#B88E3E] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#B88E3E]" />
                <span>Follow @AureliaAtelier</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', tag: '@fatima.style' },
                { img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80', tag: '@zara.ch' },
                { img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80', tag: '@hira_khan' },
                { img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80', tag: '@mahnoor.daily' },
              ].map((item, idx) => (
                <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden border border-[#E8DDCE]">
                  <img src={item.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    <span>{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : (
        /* Dedicated Category Catalog View */
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          {/* Breadcrumb & Title */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-[#8A796F] mb-2">
              <button onClick={handleNavigateHome} className="hover:text-[#1F1916] transition-colors">Home</button>
              <span>/</span>
              <span className="capitalize text-[#1F1916] font-medium">
                {CATEGORIES_CONFIG.find((c) => c.id === activeCategory)?.name || activeCategory}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EBE4D8]">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1F1916] capitalize">
                  {CATEGORIES_CONFIG.find((c) => c.id === activeCategory)?.name || activeCategory}
                </h1>
                <p className="text-xs text-[#7A6B61] mt-1">
                  Showing {categoryProducts.length} waterproof 18k PVD stainless steel pieces
                </p>
              </div>

              {/* Filter & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Finish Filter */}
                <div className="flex items-center gap-1 p-1 bg-[#F2EDE5] rounded-xl border border-[#E0D5C7] text-xs">
                  {(['all', 'Gold', 'Silver'] as const).map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        selectedFinish === finish
                          ? 'bg-white text-[#1F1916] shadow-xs'
                          : 'text-[#6E5D51] hover:text-[#1F1916]'
                      }`}
                    >
                      {finish === 'all' ? 'All Metals' : `${finish} Steel`}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3.5 py-2 text-xs bg-white border border-[#E0D5C7] rounded-xl focus:outline-none focus:border-[#241E1A] text-[#241E1A]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {categoryProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="font-serif text-xl text-[#1F1916]">No items found matching the selected filters.</p>
              <button
                onClick={() => {
                  setSelectedFinish('all');
                  setActiveCategory('all');
                }}
                className="px-5 py-2.5 bg-[#241E1A] text-white text-xs font-semibold rounded-xl uppercase tracking-wider"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={handleOpenDetail}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={activeDetailProduct}
        onClose={() => setActiveDetailProduct(null)}
        onSelectProduct={handleOpenDetail}
      />
      <CartDrawer />
      <CheckoutModal />
      <WishlistModal />
      <SearchModal />
      <QuickViewModal />

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainAppContent />
    </ShopProvider>
  );
}
