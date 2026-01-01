import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Shield, Truck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';

import realShelterPhoto from '@assets/Office-SI-Storm-Shelter_(1)_1767252448693.jpg';
import dimensionDiagram from '@assets/Screenshot_2025-12-28_at_4.24.14_PM_1767252552004.png';
import interiorView from '@assets/ChatGPT_Image_Dec_31,_2025,_01_02_10_AM_1767253312476.png';
import lifestyleBackyard from '@assets/generated_images/lifestyle_backyard_closed_hatch.png';
import certificationBadge from '@assets/generated_images/fema_certification_badge.png';

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
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#E69138] hover:bg-[#D4842F] text-white">Stock #706900</Badge>
                <Badge variant="outline" className="border-green-600 text-green-700">In Stock</Badge>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723]">
                Slope Top Underground Concrete Storm Shelter
              </h2>
              <p className="text-lg text-stone-600">
                FEMA-compliant, Texas Tech tested storm shelter built to withstand EF5 tornadoes. 
                Protect your family with 5,000 PSI reinforced concrete construction.
              </p>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-[#3E2723]" data-testid="product-price">$4,999</span>
              <span className="text-xl text-stone-400 line-through">$5,999</span>
              <Badge className="bg-red-500 text-white">Save $1,000</Badge>
            </div>
            
            <div className="bg-stone-100 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-[#3E2723] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#E69138]" />
                Key Specifications
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Exterior:</span>
                  <span className="font-medium text-[#3E2723]">80"W × 104"L × 85"H</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Interior:</span>
                  <span className="font-medium text-[#3E2723]">77"W × 101"L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Wall Thickness:</span>
                  <span className="font-medium text-[#3E2723]">4 inches</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Concrete:</span>
                  <span className="font-medium text-[#3E2723]">5,000 PSI</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {[
                'EF5 Tornado Rated - Survives 250+ MPH winds',
                '12 Gauge Steel Door with 3-Point Locking',
                'Turbine Ventilation Cap for fresh air',
                'Non-slip steel stairs with handrail',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#3E2723]">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Truck className="w-6 h-6 text-blue-600" />
              <div className="text-sm">
                <span className="font-semibold text-blue-800">Ships from Missouri</span>
                <span className="text-blue-600"> · Flatbed delivery required</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/product/shelter-001" className="flex-1">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold bg-[#E69138] hover:bg-[#D4842F] text-white"
                  data-testid="view-details-btn"
                >
                  View Full Details
                </Button>
              </Link>
              <Link href="/product/shelter-001" className="flex-1">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full h-14 text-lg font-bold border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white"
                  data-testid="reserve-deposit-btn"
                >
                  $500 Deposit
                </Button>
              </Link>
            </div>
            
            <div className="flex justify-center">
              <img 
                src={certificationBadge} 
                alt="FEMA Certified - Texas Tech Tested" 
                className="h-16 object-contain"
                data-testid="certification-badge"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
