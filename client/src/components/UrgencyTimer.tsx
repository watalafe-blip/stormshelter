import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { isGoogleShoppingVisitor, getActiveOffer } from '@/lib/urlParams';

interface UrgencyTimerProps {
  durationMinutes?: number;
  className?: string;
}

const TIMER_STORAGE_KEY = 'google_shopping_timer';

function getStoredEndTime(): number | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(TIMER_STORAGE_KEY);
  if (stored) {
    const endTime = parseInt(stored, 10);
    if (!isNaN(endTime) && endTime > Date.now()) {
      return endTime;
    }
  }
  return null;
}

function setStoredEndTime(endTime: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TIMER_STORAGE_KEY, endTime.toString());
  }
}

export default function UrgencyTimer({ durationMinutes = 15, className = '' }: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!isGoogleShoppingVisitor()) return;

    let endTime = getStoredEndTime();
    
    if (!endTime) {
      endTime = Date.now() + durationMinutes * 60 * 1000;
      setStoredEndTime(endTime);
    }

    const updateTimer = () => {
      const remaining = Math.max(0, endTime! - Date.now());
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setIsExpired(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [durationMinutes]);

  if (!isGoogleShoppingVisitor()) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (isExpired) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`} data-testid="timer-expired">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold">This offer has expired</span>
        </div>
      </div>
    );
  }

  const isUrgent = timeLeft < 5 * 60 * 1000;

  return (
    <div 
      className={`${isUrgent ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-200'} border rounded-lg p-4 ${className}`}
      data-testid="urgency-timer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-600 animate-pulse' : 'text-orange-600'}`} />
          <span className={`font-bold ${isUrgent ? 'text-red-700' : 'text-orange-700'}`}>
            Offer ends in:
          </span>
        </div>
        <span 
          className={`text-2xl font-mono font-black ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}
          data-testid="countdown-display"
        >
          {formattedTime}
        </span>
      </div>
      <p className={`text-sm mt-2 ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
        {isUrgent ? 'Hurry! Limited time remaining!' : 'Reserve now to lock in this special price'}
      </p>
    </div>
  );
}
