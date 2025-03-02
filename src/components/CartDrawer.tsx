import { X, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import PaymentModal from './PaymentModal';
import { useState, useMemo } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, total, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const validPromoCodes = {
    'WELCOME20': { type: 'percentage', value: 20 },
    'FLASH50': { type: 'percentage', value: 50 }
  };

  const discountedTotal = useMemo(() => {
    const discount = validPromoCodes[promoCode as keyof typeof validPromoCodes];
    if (!discount) return total;

    if (discount.type === 'percentage') {
      return total * (1 - discount.value / 100);
    }
    return Math.max(0, total - discount.value);
  }, [total, promoCode]);

  const handleApplyPromo = () => {
    if (!promoCode) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (!validPromoCodes[promoCode as keyof typeof validPromoCodes]) {
      setPromoError('Invalid promo code');
      return;
    }

    setPromoError('');
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setShowPayment(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-navy-800 shadow-xl z-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-navy-900 p-4 rounded-lg">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.artistName}</p>
                    <p className="text-blue-400">{item.price?.toLocaleString()} UGX</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="mt-2 text-sm text-red-400">{promoError}</p>
              )}
            </div>

            <div className="border-t border-gray-700 pt-4 mb-6">
              {promoCode && validPromoCodes[promoCode as keyof typeof validPromoCodes] && (
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-gray-400">{total.toLocaleString()} UGX</span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-gray-400">Total:</span>
                <span className="text-white">{discountedTotal.toLocaleString()} UGX</span>
              </div>
              {promoCode && validPromoCodes[promoCode as keyof typeof validPromoCodes] && (
                <p className="text-sm text-green-400 mt-2">
                  Promo code applied: {validPromoCodes[promoCode as keyof typeof validPromoCodes].value}% off
                </p>
              )}
            </div>

            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Proceed to Payment
            </button>
          </>
        )}
      </div>

      {showPayment && (
        <PaymentModal
          amount={discountedTotal}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}