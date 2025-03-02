import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PaymentInfo } from '../types';
import { initiatePayment, verifyPayment } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ amount, onClose, onSuccess }: PaymentModalProps) {
  const [provider, setProvider] = useState<'MTN' | 'AIRTEL'>('MTN');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { guestInfo, setGuestInfo } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
      setPhoneNumber(currentUser.phoneNumber || '');
    } else if (guestInfo) {
      setEmail(guestInfo.email || '');
      setPhoneNumber(guestInfo.phoneNumber || '');
    }
  }, [currentUser, guestInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setStatus('processing');
    setError('');
    setIsSubmitting(true);

    // Validate Ugandan phone number
    const phoneRegex = /^(\+256|0)[1-9]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid Ugandan phone number (e.g., 0775123456 or +256775123456)');
      setStatus('idle');
      setIsSubmitting(false);
      return;
    }

    // Validate amount
    if (amount < 100 || amount > 1000000) {
      setError('Amount must be between 100 and 1,000,000 UGX');
      setStatus('idle');
      setIsSubmitting(false);
      return;
    }

    // Save guest info if not logged in
    if (!currentUser) {
      setGuestInfo({ email, phoneNumber });
    }

    try {
      const paymentInfo: PaymentInfo = {
        provider,
        phoneNumber,
        amount,
        currency: 'UGX',
        reference: `CART_${Date.now()}`
      };

      const response = await initiatePayment(paymentInfo);
      
      if (response.success && response.transactionId) {
        setStatus('verifying');
        const verificationResponse = await verifyPayment(response.transactionId);
        
        if (verificationResponse.success) {
          setStatus('success');
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else {
          throw new Error(verificationResponse.message);
        }
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-navy-800 rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-4">Purchase Song</h2>
        
        <div className="mb-6">
          <p className="text-gray-400">
            Total Amount: <span className="text-white">{amount.toLocaleString()} UGX</span>
          </p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-white font-semibold">Payment Successful!</p>
            <p className="text-gray-400">Your download will start automatically</p>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-white font-semibold">Payment Failed</p>
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {!currentUser && (
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for receipt"
                  className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setProvider('MTN')}
                  className={`py-3 px-4 rounded-lg text-center transition ${
                    provider === 'MTN'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-navy-900 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  MTN Mobile Money
                </button>
                <button
                  type="button"
                  onClick={() => setProvider('AIRTEL')}
                  className={`py-3 px-4 rounded-lg text-center transition ${
                    provider === 'AIRTEL'
                      ? 'bg-red-500 text-white'
                      : 'bg-navy-900 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  Airtel Money
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                Mobile Money Number (Ugandan)
              </label>
              <input
                type="tel"
                pattern="^(\+256|0)[1-9]\d{8}$"
                id="phone"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and + symbol
                  if (/^[0-9+]*$/.test(value)) {
                    setPhoneNumber(value);
                  }
                }}
                placeholder="Enter your mobile money number (e.g., 0775123456)"
                className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Format: 0775123456 or +256775123456 (MTN or Airtel Uganda numbers only)
              </p>
            </div>

            <button
              type="submit"
              disabled={status !== 'idle'}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'processing' || status === 'verifying' ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {status === 'processing' ? 'Processing Payment...' : 'Verifying Payment...'}
                  </span>
                </div>
              ) : (
                'Pay Now'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}