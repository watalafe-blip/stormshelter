import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface ScarcityPopupProps {
  discountAmount?: number;
  expiresAt?: Date | null;
}

export default function ScarcityPopup({ discountAmount: defaultDiscount = 400 }: ScarcityPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isDismissed, setIsDismissed] = useState(false);
  const [reminderExpiry, setReminderExpiry] = useState<Date | null>(null);
  const [discount, setDiscount] = useState(defaultDiscount);

  useEffect(() => {
    const dismissed = localStorage.getItem('scarcity_popup_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const sessionToken = localStorage.getItem('cart_session_token');
    if (!sessionToken) return;

    const checkAbandonedSession = async () => {
      try {
        const response = await fetch(`/api/cart-sessions/${sessionToken}`);
        if (!response.ok) return;
        
        const session = await response.json();
        if (session.status === 'abandoned') {
          const reminderRes = await fetch(`/api/cart-sessions/${sessionToken}/reminder`);
          const reminderData = await reminderRes.json();
          
          if (reminderData.hasActiveReminder) {
            if (reminderData.expiresAt) {
              setReminderExpiry(new Date(reminderData.expiresAt));
            }
            if (reminderData.discountAmount) {
              setDiscount(parseFloat(reminderData.discountAmount));
            }
            setTimeout(() => setIsVisible(true), 2000);
          }
        }
      } catch (error) {
        console.error('Error checking abandoned session:', error);
      }
    };

    checkAbandonedSession();
  }, []);

  useEffect(() => {
    if (!reminderExpiry) return;

    const updateTimeLeft = () => {
      const now = new Date();
      const diff = reminderExpiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [reminderExpiry]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem('scarcity_popup_dismissed', Date.now().toString());
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
          data-testid="scarcity-popup"
        >
          <div className="bg-white rounded-xl shadow-2xl border-2 border-[#E69138] overflow-hidden">
            <div className="bg-[#E69138] text-white px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <Truck size={18} />
                <span>Limited Time Offer!</span>
              </div>
              <button 
                onClick={handleDismiss}
                className="hover:bg-white/20 rounded p-1 transition-colors"
                data-testid="btn-dismiss-popup"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-3">
              <p className="text-[#3E2723] font-semibold text-lg">
                Complete your deposit today and save <span className="text-[#E69138] font-bold">${discount}</span> on shipping!
              </p>
              
              {timeLeft && timeLeft !== 'Expired' && (
                <div className="flex items-center gap-2 text-sm text-stone-600 bg-stone-50 px-3 py-2 rounded-lg">
                  <Clock size={16} className="text-[#E69138]" />
                  <span>Offer expires in: <strong className="text-[#3E2723]">{timeLeft}</strong></span>
                </div>
              )}
              
              <Link href="/booking">
                <Button 
                  className="w-full bg-[#E69138] hover:bg-[#D4842F] text-white font-bold"
                  data-testid="btn-claim-discount"
                >
                  Claim My Discount
                </Button>
              </Link>
              
              <p className="text-xs text-center text-stone-500">
                This exclusive offer is valid for 24 hours only.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useCartAbandonmentTracking() {
  useEffect(() => {
    const generateToken = () => {
      return 'cart_' + Math.random().toString(36).substring(2, 15);
    };

    let sessionToken = localStorage.getItem('cart_session_token');
    if (!sessionToken) {
      sessionToken = generateToken();
      localStorage.setItem('cart_session_token', sessionToken);
    }

    const createOrUpdateSession = async () => {
      try {
        await fetch('/api/cart-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken })
        });
      } catch (error) {
        console.error('Error creating cart session:', error);
      }
    };

    createOrUpdateSession();

    const handleBeforeUnload = () => {
      const email = localStorage.getItem('customer_email');
      if (sessionToken) {
        const blob = new Blob([JSON.stringify({ email })], { type: 'application/json' });
        navigator.sendBeacon(
          `/api/cart-sessions/${sessionToken}/abandon`,
          blob
        );
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const email = localStorage.getItem('customer_email');
        if (sessionToken && email) {
          fetch(`/api/cart-sessions/${sessionToken}/abandon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            keepalive: true
          }).catch(() => {});
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
