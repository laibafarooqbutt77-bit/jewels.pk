import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Droplets, 
  Mail, 
  ArrowRight, 
  Check, 
  Instagram, 
  Facebook, 
  Sparkles 
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1F1916] text-[#F3EDE6] pt-16 pb-12 border-t border-[#382E28]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Promise Strip (4 Core Pillars) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-[#382E28]">
          <div className="flex items-start gap-3">
            <Droplets className="w-5 h-5 text-[#DFC17B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">100% Waterproof</h4>
              <p className="text-[11px] text-[#A6978C] mt-0.5">Shower, swim, and sweat without ever removing.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#DFC17B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">18k PVD Gold Coating</h4>
              <p className="text-[11px] text-[#A6978C] mt-0.5">Vacuum bonded to 316L surgical steel. Never fades.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#DFC17B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Nationwide Delivery</h4>
              <p className="text-[11px] text-[#A6978C] mt-0.5">Free delivery across Pakistan on orders Rs. 2,999+.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-[#DFC17B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Cash on Delivery</h4>
              <p className="text-[11px] text-[#A6978C] mt-0.5">Pay conveniently upon receipt with 7-day exchange.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-14 border-b border-[#382E28]">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif text-2xl tracking-[0.2em] uppercase font-medium text-white block">
              Aurelia
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#B8A697] block -mt-2">
              Atelier · Fine Jewels
            </span>
            <p className="text-xs text-[#A6978C] leading-relaxed max-w-sm">
              Crafting architectural, waterproof stainless steel jewellery designed for effortless everyday wear. Elevated luxury made to live with you through every shower, swim, and sunlit moment.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#C9B9A8]">
              <a href="#instagram" className="p-2 bg-[#2D241F] rounded-full hover:text-white hover:bg-[#3D332D] transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="p-2 bg-[#2D241F] rounded-full hover:text-white hover:bg-[#3D332D] transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#A6978C]">
              <li>
                <button onClick={() => onSelectCategory('necklaces')} className="hover:text-white transition-colors">
                  Necklaces & Chains
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('rings')} className="hover:text-white transition-colors">
                  Dome & Signet Rings
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('earrings')} className="hover:text-white transition-colors">
                  Chunky Hoops & Huggies
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('hand-cuffs')} className="hover:text-white transition-colors">
                  Open Hand Cuffs
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('chunky')} className="hover:text-white transition-colors">
                  Chunky Statement Edit
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-[#A6978C]">
              <li><a href="#care" className="hover:text-white transition-colors">Waterproof Care Guide</a></li>
              <li><a href="#shipping" className="hover:text-white transition-colors">Pakistan Shipping Rates</a></li>
              <li><a href="#track" className="hover:text-white transition-colors">Track TCS Order</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">7-Day Returns & Exchanges</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQs & Ring Sizing</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              The Aurelia Circle
            </h4>
            <p className="text-xs text-[#A6978C] leading-relaxed">
              Subscribe to unlock private seasonal sales, new 3D collection drops, and an immediate 20% discount coupon code.
            </p>

            {subscribed ? (
              <div className="p-3 bg-[#2D241F] rounded-xl border border-[#DFC17B]/40 text-xs text-[#DFC17B] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Welcome to the circle! Use code <strong>LUXE20</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-[#2B231E] border border-[#42352D] rounded-xl text-white placeholder-[#78695E] focus:outline-none focus:border-[#DFC17B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#DFC17B] hover:bg-[#CFAC5E] text-[#1F1916] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                  >
                    Join
                  </button>
                </div>
                <span className="text-[10px] text-[#78695E] block">
                  By subscribing, you agree to our Privacy Policy. No spam, ever.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6B61]">
          <p>© {new Date().getFullYear()} Aurelia Atelier Ltd. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px] text-[#A6978C]">
            <span>Cash on Delivery</span>
            <span>·</span>
            <span>Meezan Bank</span>
            <span>·</span>
            <span>HBL</span>
            <span>·</span>
            <span>Easypaisa</span>
            <span>·</span>
            <span>JazzCash</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
