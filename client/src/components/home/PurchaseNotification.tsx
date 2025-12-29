import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin } from 'lucide-react';

const RECENT_PURCHASES = [
  { location: "Springfield, MO", time: "2 hours ago" },
  { location: "Tulsa, OK", time: "4 hours ago" },
  { location: "Little Rock, AR", time: "5 hours ago" },
  { location: "Wichita, KS", time: "8 hours ago" },
  { location: "Joplin, MO", time: "12 hours ago" },
  { location: "Fort Smith, AR", time: "1 day ago" },
  { location: "Edmond, OK", time: "1 day ago" },
];

export default function PurchaseNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(RECENT_PURCHASES[0]);

  useEffect(() => {
    // Show first notification after 5 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      // Hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }, 5000);

    // Then show every 20 seconds
    const interval = setInterval(() => {
      const randomPurchase = RECENT_PURCHASES[Math.floor(Math.random() * RECENT_PURCHASES.length)];
      setCurrentPurchase(randomPurchase);
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 0 }}
          className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 bg-white border border-[#E69138]/30 rounded-lg shadow-xl p-4 max-w-xs flex items-center gap-4"
        >
          <div className="bg-[#E69138]/10 p-2 rounded-full">
            <CheckCircle2 className="text-[#E69138] h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#3E2723]">Verified Purchase</p>
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
              <MapPin size={10} />
              <span>{currentPurchase.location}</span>
              <span className="mx-1">•</span>
              <span>{currentPurchase.time}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
