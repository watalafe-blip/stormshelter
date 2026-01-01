import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Heart, Home, Clock, Award, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';

import realShelterPhoto from '@assets/Office-SI-Storm-Shelter_(1)_1767252448693.jpg';
import dimensionDiagram from '@assets/Screenshot_2025-12-28_at_4.24.14_PM_1767252552004.png';
import interiorView from '@assets/ChatGPT_Image_Dec_31,_2025,_01_02_10_AM_1767253312476.png';
import lifestyleBackyard from '@assets/generated_images/lifestyle_backyard_closed_hatch.png';

const galleryImages = [
  { src: realShelterPhoto, alt: 'Storm shelter with door open - actual product', label: 'Actual Photo' },
  { src: interiorView, alt: 'Interior view with stairs', label: 'Interior' },
  { src: lifestyleBackyard, alt: 'Installed in suburban backyard', label: 'Lifestyle' },
  { src: dimensionDiagram, alt: 'Shelter dimensions and specifications', label: 'Dimensions' },
];

export default function ProductGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <section className="py-16 bg-gradient-to-b from-stone-50 to-white" data-testid="product-gallery-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-200">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={galleryImages[currentIndex].src}
                  alt={galleryImages[currentIndex].alt}
                  className="w-full h-full object-contain p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  data-testid={`gallery-image-${currentIndex}`}
                />
              </AnimatePresence>
              
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                data-testid="gallery-prev-btn"
              >
                <ChevronLeft className="w-5 h-5 text-stone-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors"
                data-testid="gallery-next-btn"
              >
                <ChevronRight className="w-5 h-5 text-stone-700" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                {currentIndex + 1} / {galleryImages.length}
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex ? 'border-[#E69138] ring-2 ring-[#E69138]/30' : 'border-stone-200 hover:border-stone-400'
                  }`}
                  data-testid={`gallery-thumb-${idx}`}
                >
                  <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Badge variant="outline" className="border-green-600 text-green-700">In Stock</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723]">
                Underground Concrete Storm Shelter
              </h2>
              <p className="text-stone-600">
                FEMA-compliant, EF5 rated. Protects against 250+ MPH winds.
              </p>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-[#3E2723]" data-testid="product-price">$4,999</span>
              <span className="text-lg text-stone-400 line-through">$5,999</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E69138]/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-[#E69138]" />
                </div>
                <span className="text-sm text-[#3E2723]">Peace of Mind</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E69138]/10 flex items-center justify-center">
                  <Home className="w-4 h-4 text-[#E69138]" />
                </div>
                <span className="text-sm text-[#3E2723]">Adds Home Value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E69138]/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#E69138]" />
                </div>
                <span className="text-sm text-[#3E2723]">1-Day Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E69138]/10 flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#E69138]" />
                </div>
                <span className="text-sm text-[#3E2723]">10-Year Warranty</span>
              </div>
            </div>
            
            <div className="bg-stone-100 rounded-lg p-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter zip for shipping estimate" 
                    className="pl-9 bg-white text-sm h-9" 
                    maxLength={5}
                    data-testid="shipping-zip-input"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white"
                  data-testid="calculate-shipping-btn"
                >
                  Calculate
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#technical-specs" className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full h-12 text-base font-bold bg-[#E69138] hover:bg-[#D4842F] text-white"
                  data-testid="view-details-btn"
                >
                  View Details
                </Button>
              </a>
              <a href="#purchase" className="flex-1">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-12 text-base font-bold border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white"
                  data-testid="reserve-deposit-btn"
                >
                  $500 Deposit
                </Button>
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
