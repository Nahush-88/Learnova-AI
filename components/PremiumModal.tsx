import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { StarIcon, XIcon } from './icons';
import { PREMIUM_PRICE_INR } from '../constants';

interface PremiumModalProps {
  onClose: () => void;
  onUpgradeSuccess: () => void;
  currentUser: User;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUpgradeSuccess, currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = () => {
    setIsLoading(true);
    setError(null);

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      setError("Payment gateway is not configured. Please contact support.");
      setIsLoading(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: PREMIUM_PRICE_INR * 100, // Amount in paise (e.g., 39 INR = 3900 paise)
      currency: "INR",
      name: "Learnova AI Premium",
      description: "Lifetime Premium Access",
      // IMPORTANT: In a production app, you must generate an order_id from your backend
      // and pass it here. This is crucial for security and tracking.
      // order_id: "order_...", 
      handler: function (response: any) {
        // This function is called after a successful payment.
        console.log("Payment Successful:", response);
        // CRITICAL: In a real app, send `response` (razorpay_payment_id, razorpay_order_id, razorpay_signature)
        // to your backend server to verify the payment signature.
        // Only after successful server-side verification should you grant premium status.
        // For this project, we'll proceed directly.
        onUpgradeSuccess();
      },
      prefill: {
        name: currentUser.displayName || "",
        email: currentUser.email || "",
        contact: "", // You can request and prefill this if available
      },
      notes: {
        userId: currentUser.uid,
        address: "Learnova AI Purchase"
      },
      theme: {
        color: "#06B6D4" // Your brand color
      },
      modal: {
        ondismiss: function() {
          // This function is called when the user closes the modal without paying.
          console.log("Razorpay modal dismissed.");
          setIsLoading(false);
        }
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        console.error("Payment Failed:", response);
        setError(`Payment failed: ${response.error.description} (Reason: ${response.error.reason})`);
        setIsLoading(false);
      });
      rzp.open();
    } catch (e) {
      console.error("Razorpay Error:", e);
      setError("Could not initialize payment gateway. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full transform transition-all animate-fadeInScaleUp">
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-3 sm:mb-4">
            <StarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mr-2 sm:mr-3" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-800 leading-tight">Unlock Learnova Premium!</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300">
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {error && (
            <div className="p-2 sm:p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                {error}
            </div>
        )}

        <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
          You've reached your free query limit or are trying to access a premium feature. Upgrade to Learnova Premium for:
        </p>
        
        <ul className="space-y-2 sm:space-y-2.5 mb-6 sm:mb-8 text-sm sm:text-base text-slate-700">
          <li className="flex items-center"><StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-2.5 flex-shrink-0" /> Unlimited AI Queries</li>
          <li className="flex items-center"><StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-2.5 flex-shrink-0" /> Unlimited PDF Exports</li>
          <li className="flex items-center"><StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-2.5 flex-shrink-0" /> Priority Support (Coming Soon)</li>
          <li className="flex items-center"><StarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-2.5 flex-shrink-0" /> Ad-Free Experience (Coming Soon)</li>
        </ul>
        
        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3.5 text-base sm:text-lg font-medium text-white bg-gradient-to-r from-brand-DEFAULT to-purple-600 hover:from-brand-dark hover:to-purple-700 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all duration-150 disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? 'Processing...' : `Upgrade Now for ₹${PREMIUM_PRICE_INR}/month`}
        </button>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-3 sm:mt-4 text-center">
          You are in test mode. No real money will be charged.
        </p>
      </div>
    </div>
  );
};