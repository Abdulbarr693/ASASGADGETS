import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Truck, 
  CreditCard
} from 'lucide-react';
import { Product, Order, User } from '../types';
import { formatNaira } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface CheckoutModalProps {
  product: Product | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  product,
  currentUser,
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const { isDark } = useTheme();
  const [shippingAddress, setShippingAddress] = useState('12 Victoria Island Crescent, Lagos, Nigeria');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen || !product) return null;

  const shippingFee = 15000; // ₦15,000 insured express delivery
  const grandTotal = product.price + shippingFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyerId: currentUser.id,
          buyerName: currentUser.name,
          buyerEmail: currentUser.email,
          shippingAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create escrow order');
      }

      const order: Order = await response.json();
      setCompletedOrder(order);
      onOrderCreated(order);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div 
        id="checkout-modal-card"
        className={`border w-full max-w-xl rounded-2xl shadow-2xl p-5 sm:p-6 relative transition-all ${
          isDark 
            ? 'bg-[#0F172A] border-slate-700/80 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
          }`}
          aria-label="Close checkout modal"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation Screen */
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Escrow Payment Locked & Secured!
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Order <strong className="text-cyan-500 font-mono">#{completedOrder.id}</strong> has been initiated.
              </p>
            </div>

            {/* Escrow Inspection Guarantee Banner */}
            <div className={`border rounded-xl p-4 text-left space-y-2 ${
              isDark ? 'bg-[#1E293B] border-slate-700/80' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>48-Hour Inspection Timer Activated</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your funds ({formatNaira(completedOrder.total)}) are locked in the ASAS neutral escrow vault. Once tracking indicates delivery, your 48-hour inspection window starts. The seller will only be paid if the gadget matches the serial number and condition description.
              </p>
              <div className={`flex items-center justify-between pt-2 border-t text-[11px] font-mono ${
                isDark ? 'border-slate-700/70 text-slate-400' : 'border-slate-200 text-slate-500'
              }`}>
                <span>Serial Lock: {completedOrder.serialNumber}</span>
                <span className="text-emerald-500 font-bold">STATUS: ESCROW HELD</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-colors cursor-pointer shadow-md shadow-cyan-500/25"
            >
              Continue Shopping / Track Order
            </button>
          </div>
        ) : (
          /* Checkout Form Screen */
          <form onSubmit={handleCheckout} className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Escrow Checkout Guarantee
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Funds released only after physical inspection
                </p>
              </div>
            </div>

            {/* Item Mini Card */}
            <div className={`flex items-center gap-3 p-3 border rounded-xl ${
              isDark ? 'bg-[#1E293B] border-slate-700/70' : 'bg-slate-50 border-slate-200'
            }`}>
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-14 h-14 rounded-lg object-cover bg-slate-200 dark:bg-slate-950 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {product.title}
                </div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Vendor: {product.vendorName}
                </div>
                <div className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                  {formatNaira(product.price)}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <Truck className="w-3.5 h-3.5 text-cyan-500" />
                Delivery Address (Nigeria)
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500 ${
                  isDark 
                    ? 'bg-[#0B1120] border-slate-700/70 text-white' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white'
                }`}
              />
            </div>

            {/* Payment Method simulation */}
            <div>
              <label className={`block text-xs font-medium mb-1 flex items-center gap-1.5 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <CreditCard className="w-3.5 h-3.5 text-cyan-500" />
                Payment Method (Escrow Hold)
              </label>
              <div className={`p-3 border rounded-xl flex items-center justify-between text-xs ${
                isDark ? 'bg-[#1E293B] border-slate-700/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-5 rounded border flex items-center justify-center font-bold text-[9px] ${
                    isDark ? 'bg-[#0B1120] border-slate-700 text-slate-300' : 'bg-white border-slate-300 text-slate-700'
                  }`}>
                    VERVE
                  </div>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>•••• •••• •••• 5061 (Direct Bank/Card Escrow)</span>
                </div>
                <span className="text-emerald-500 font-mono text-[11px] font-bold">VERIFIED</span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className={`p-3 border rounded-xl space-y-1.5 text-xs ${
              isDark ? 'bg-[#0B1120] border-slate-700/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>Gadget Price:</span>
                <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatNaira(product.price)}</span>
              </div>
              <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>Insured Nationwide Delivery:</span>
                <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatNaira(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-cyan-600 dark:text-cyan-400">
                <span>Escrow Guarantee Protection:</span>
                <span className="font-mono font-bold">FREE (₦0)</span>
              </div>
              <div className={`flex justify-between text-sm font-bold pt-2 border-t ${
                isDark ? 'border-slate-700/70 text-white' : 'border-slate-200 text-slate-900'
              }`}>
                <span>Total Escrow Amount:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono text-base">{formatNaira(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              id="btn-confirm-escrow-checkout"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <span>Securing Escrow Vault...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Authorize & Place In Escrow ({formatNaira(grandTotal)})</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
