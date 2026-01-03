import { AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function UrgencyBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-amber-500 to-orange-500 relative overflow-hidden" data-testid="urgency-banner-section">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hidden md:flex w-16 h-16 rounded-full bg-white/20 items-center justify-center"
            >
              <AlertTriangle className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Tornado Season Is Approaching
              </h3>
              <p className="text-white/90 text-lg">
                Don't wait until it's too late. Delivery slots fill up fast as storm season nears.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Clock className="w-5 h-5" />
              <span>Limited slots available this month</span>
            </div>
            <Button 
              size="lg"
              className="bg-[#3E2723] hover:bg-[#5D4037] text-white px-8 h-14 text-lg font-bold shadow-xl"
              onClick={() => {
                const element = document.getElementById('purchase');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="button-urgency-cta"
            >
              Reserve Your Shelter <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
