import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Smartphone, 
  Banknote,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { CheckoutFormData, PlacedOrder } from '../types/jewellery';
import { ProductImage } from './ProductImage';

const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Quetta',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Other City',
];

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    subtotal, 
    shippingFee, 
    discountAmount, 
    total, 
    placeOrder,
    lastPlacedOrder 
  } = useShop();

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    postalCode: '',
    paymentMethod: 'cod',
    orderNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedOrder, setCompletedOrder] = useState<PlacedOrder | null>(null);

  if (!isCheckoutOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phone.trim() || formData.phone.length < 10) {
      errs.phone = 'Valid phone number is required (e.g. 03001234567)';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.address.trim()) errs.address = 'Complete delivery address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const order = placeOrder(formData);
    setCompletedOrder(order);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#241E1A', '#F6E7B0', '#FFFFFF'],
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog Body */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden border border-[#EBE4D8] z-10 max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE4D8] bg-white">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-[0.16em] uppercase font-medium text-[#1F1916]">
              Aurelia
            </span>
            <span className="text-xs text-[#8A796F] font-sans">· Secure Checkout</span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-[#6E5D51] hover:text-[#241E1A] rounded-full hover:bg-[#F2ECE3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 md:p-8">
          {completedOrder ? (
            /* Order Success State */
            <div className="max-w-xl mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#EBF6EE] text-[#2E6F40] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#B88E3E]">
                  Thank You for Your Order
                </span>
                <h2 className="font-serif text-3xl font-medium text-[#1F1916] mt-1">
                  Order {completedOrder.orderId} Confirmed
                </h2>
                <p className="text-xs text-[#6E5D51] mt-2 max-w-md mx-auto leading-relaxed">
                  We have received your order and sent a confirmation email to <strong>{completedOrder.customer.email}</strong>. Our courier dispatch partner will deliver to your address in 2–4 business days.
                </p>
              </div>

              {/* Order Summary Receipt Box */}
              <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] text-left space-y-3 shadow-xs">
                <div className="flex justify-between text-xs pb-3 border-b border-[#F0EAE1]">
                  <span className="text-[#8A796F]">Deliver To:</span>
                  <span className="font-medium text-[#1F1916] text-right">
                    {completedOrder.customer.fullName} · {completedOrder.customer.city}
                  </span>
                </div>

                <div className="flex justify-between text-xs pb-3 border-b border-[#F0EAE1]">
                  <span className="text-[#8A796F]">Payment Method:</span>
                  <span className="font-medium text-[#1F1916] uppercase">
                    {completedOrder.customer.paymentMethod === 'cod' ? 'Cash on Delivery' : completedOrder.customer.paymentMethod.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {completedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-[#5C4F46]">
                      <span>{it.quantity}x {it.product.name} ({it.selectedColor})</span>
                      <span className="font-mono tabular-nums">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-sm font-bold text-[#1F1916] pt-3 border-t border-[#EBE4D8]">
                  <span>Total Payable:</span>
                  <span className="font-mono tabular-nums">Rs. {completedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-[#241E1A] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form & Order Summary Split */
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Delivery & Payment Details */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#1F1916] mb-1">
                    1. Shipping Information
                  </h3>
                  <p className="text-xs text-[#7A6B61]">
                    Enter your delivery address for express dispatch across Pakistan.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#5C4F46] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border ${
                        errors.fullName ? 'border-[#C04A3A]' : 'border-[#E0D5C7]'
                      } focus:outline-none focus:border-[#241E1A]`}
                    />
                    {errors.fullName && <p className="text-[11px] text-[#C04A3A] mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C4F46] mb-1">
                      Phone Number (for Courier SMS) *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0300-1234567"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border ${
                        errors.phone ? 'border-[#C04A3A]' : 'border-[#E0D5C7]'
                      } focus:outline-none focus:border-[#241E1A]`}
                    />
                    {errors.phone && <p className="text-[11px] text-[#C04A3A] mt-1">{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#5C4F46] mb-1">
                      Email Address (for Receipt & Tracking) *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border ${
                        errors.email ? 'border-[#C04A3A]' : 'border-[#E0D5C7]'
                      } focus:outline-none focus:border-[#241E1A]`}
                    />
                    {errors.email && <p className="text-[11px] text-[#C04A3A] mt-1">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#5C4F46] mb-1">
                      Complete Delivery Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House / Apartment #, Street, Block, Phase"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border ${
                        errors.address ? 'border-[#C04A3A]' : 'border-[#E0D5C7]'
                      } focus:outline-none focus:border-[#241E1A]`}
                    />
                    {errors.address && <p className="text-[11px] text-[#C04A3A] mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C4F46] mb-1">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E0D5C7] focus:outline-none focus:border-[#241E1A]"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5C4F46] mb-1">
                      Postal Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="e.g. 54000"
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E0D5C7] focus:outline-none focus:border-[#241E1A]"
                    />
                  </div>
                </div>

                {/* Payment Selection Section */}
                <div className="pt-4 border-t border-[#EBE4D8]">
                  <h3 className="font-serif text-lg font-medium text-[#1F1916] mb-1">
                    2. Payment Method
                  </h3>
                  <p className="text-xs text-[#7A6B61] mb-3">
                    Select your preferred payment method upon order placement.
                  </p>

                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'bg-white border-[#241E1A] shadow-xs'
                        : 'bg-[#F7F3EE] border-[#E5DACD] hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className="mt-1 accent-[#241E1A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#B88E3E]" />
                          <span className="text-xs font-semibold text-[#1F1916]">Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-[11px] text-[#7A6B61] mt-0.5">
                          Pay cash to the courier rider upon delivery at your doorstep. Standard in Pakistan.
                        </p>
                      </div>
                    </label>

                    {/* Direct Bank Transfer */}
                    <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'bank_transfer'
                        ? 'bg-white border-[#241E1A] shadow-xs'
                        : 'bg-[#F7F3EE] border-[#E5DACD] hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'bank_transfer'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'bank_transfer' })}
                        className="mt-1 accent-[#241E1A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#B88E3E]" />
                          <span className="text-xs font-semibold text-[#1F1916]">Direct Bank Transfer</span>
                        </div>
                        <p className="text-[11px] text-[#7A6B61] mt-0.5">
                          Meezan Bank & HBL account details provided immediately on screen for online IBFT.
                        </p>
                      </div>
                    </label>

                    {/* Easypaisa / JazzCash */}
                    <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'easypaisa_jazzcash'
                        ? 'bg-white border-[#241E1A] shadow-xs'
                        : 'bg-[#F7F3EE] border-[#E5DACD] hover:bg-white'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        checked={formData.paymentMethod === 'easypaisa_jazzcash'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'easypaisa_jazzcash' })}
                        className="mt-1 accent-[#241E1A]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#B88E3E]" />
                          <span className="text-xs font-semibold text-[#1F1916]">Easypaisa / JazzCash Mobile Wallet</span>
                        </div>
                        <p className="text-[11px] text-[#7A6B61] mt-0.5">
                          Send payment via mobile wallet app and WhatsApp receipt screenshot to our dispatch team.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary Review */}
              <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#EBE4D8] flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#1F1916] mb-4">
                    Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
                  </h3>

                  {/* Cart preview list */}
                  <div className="max-h-56 overflow-y-auto space-y-3 pr-1 mb-4">
                    {cart.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center gap-3 text-xs">
                        <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#E8DDCE] shrink-0 bg-[#F6F2EC]">
                          <ProductImage
                            src={item.selectedImage || item.product.imagesByColor?.[item.selectedColor]?.[0] || item.product.images[0]}
                            alt={`${item.product.name} in ${item.selectedColor}`}
                            color={item.selectedColor}
                            category={item.product.category}
                            aspectRatio="portrait"
                            zoomOnHover={false}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1F1916] truncate">{item.product.name}</p>
                          <p className="text-[11px] text-[#8C7A6E]">{item.selectedColor} Edition · Qty {item.quantity}</p>
                        </div>
                        <span className="font-mono font-semibold text-[#1F1916] tabular-nums">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="border-t border-[#F0EAE1] pt-3 space-y-2 text-xs text-[#5C4F46]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono tabular-nums text-[#1F1916]">Rs. {subtotal.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#2E6F40]">
                        <span>Coupon Discount</span>
                        <span className="font-mono tabular-nums">- Rs. {discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Express Shipping (Pakistan)</span>
                      <span className="font-mono tabular-nums text-[#1F1916]">
                        {shippingFee === 0 ? <strong className="text-[#2E6F40]">FREE</strong> : `Rs. ${shippingFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-bold text-[#1F1916] pt-3 border-t border-[#EBE4D8]">
                      <span>Total Amount (PKR)</span>
                      <span className="font-mono tabular-nums text-lg">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Order Button */}
                <div className="mt-6 pt-4 border-t border-[#F0EAE1] space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-[#241E1A] hover:bg-[#3D332D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>Place Order · Rs. {total.toLocaleString()}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[10px] text-[#8C7A6E]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B88E3E]" />
                      <span>Encrypted SSL Checkout</span>
                    </span>
                    <span>·</span>
                    <span>7-Day Return Policy</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
