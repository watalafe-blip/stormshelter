
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { heroSlides } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroVideo from '@/assets/hero_video.mp4';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // We only use the first slide content for the video hero
  const slide = heroSlides[0];

  return (
    <div className="relative h-[800px] w-full overflow-hidden bg-stone-900">
      <AnimatePresence mode="wait">
        <motion.div
          key="hero-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="max-w-4xl px-4 space-y-8">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter drop-shadow-lg leading-none"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-[#fdfaf5]/90 font-medium max-w-2xl mx-auto"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                  <Button 
                    size="lg" 
                    className="rounded-md px-10 text-lg h-16 bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F] border-none font-bold uppercase tracking-wide shadow-xl transform hover:scale-105 transition-all"
                    onClick={() => {
                      const element = document.getElementById('purchase');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {slide.cta} <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-900 to-transparent z-10" />
    </div>
  );
}
