// FILE LOCATION: client/src/components/UrgencyTimer.tsx
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function UrgencyTimer() {
  // Calculate time remaining from when user first saw the offer
  const getInitialTime = () => {
    if (typeof window === 'undefined') {
      return { hours: 47, minutes: 59, seconds: 59 };
    }

    const stored = sessionStorage.getItem('offerExpiry');
    if (stored) {
      const expiry = new Date(stored);
      const now = new Date();
      const diff = Math.max(0, expiry.getTime() - now.getTime());
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    } else {
      // First time visitor - set 48 hour expiry
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 48);
      sessionStorage.setItem('offerExpiry', expiry.toISOString());
      
      return { hours: 47, minutes: 59, seconds: 59 };
    }
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev; // Timer expired
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show message if timer expired
  if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-lg">
        <div className="text-center">
          <p className="font-bold text-lg mb-1">⏰ Offer Expired</p>
          <p className="text-sm">Contact us for current pricing and availability</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm md:text-base">Special Offer Ends In:</span>
        </div>
        <div className="flex gap-2 font-mono text-xl md:text-2xl font-bold">
          <span className="bg-red-700 px-3 py-2 rounded min-w-[3rem] text-center">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="flex items-center">:</span>
          <span className="bg-red-700 px-3 py-2 rounded min-w-[3rem] text-center">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="flex items-center">:</span>
          <span className="bg-red-700 px-3 py-2 rounded min-w-[3rem] text-center">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
