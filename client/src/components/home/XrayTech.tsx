import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldAlert } from 'lucide-react';
import imgRebar from '@assets/generated_images/steel_rebar_cage_structure_for_shelter.png';
import imgClosed from '@assets/generated_images/underground_concrete_shelter_closed_buried_ground.png';
import imgOpen from '@assets/generated_images/shelter_with_open_door_showing_interior_access.png';
import imgDestroyed from '@assets/generated_images/destroyed_home_after_tornado.png';
import imgProtected from '@assets/Copilot_20251228_211116_1766981162862.png';

export default function XrayTech() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [outcomeSliderPosition, setOutcomeSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const outcomeContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOutcomeDragging, setIsOutcomeDragging] = useState(false);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleOutcomeMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isOutcomeDragging || !outcomeContainerRef.current) return;

    const rect = outcomeContainerRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setOutcomeSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const handleOutcomeMouseDown = () => setIsOutcomeDragging(true);
  const handleOutcomeMouseUp = () => setIsOutcomeDragging(false);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    document.addEventListener('mouseup', handleOutcomeMouseUp);
    document.addEventListener('touchend', handleOutcomeMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      document.removeEventListener('mouseup', handleOutcomeMouseUp);
      document.removeEventListener('touchend', handleOutcomeMouseUp);
    };
  }, []);

  return (
    <section className="py-24 bg-stone-900 text-white overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="flex-1 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E69138]/10 text-[#E69138] border border-[#E69138]/20 text-sm font-bold tracking-wider uppercase">
              <Scan size={16} /> Why Choose Home Defend
            </div>
            
            <h2 className="text-4xl md:text-5xl font-sans font-bold leading-tight">
              Protect What Matters <span className="text-[#E69138]">Most</span>.
            </h2>
            
            <p className="text-xl text-stone-300 leading-relaxed">
              It’s not just about concrete and steel—it’s about the feeling of absolute security when the sky turns dark. 
              Our shelters provide a sanctuary where fear is replaced by safety, ensuring your family’s legacy survives any storm.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <h4 className="text-[#E69138] font-bold text-lg mb-2">Unshakable Peace of Mind</h4>
                <p className="text-sm text-stone-400">Sleep soundly knowing you have a permanent, fail-safe plan just steps away from your back door.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <h4 className="text-[#E69138] font-bold text-lg mb-2">Invest in Survival</h4>
                <p className="text-sm text-stone-400">A one-time investment that protects your family for generations. Can you put a price on their safety?</p>
              </div>
            </div>
          </div>

          {/* Before/After Impact Slider */}
          <div className="flex-1 w-full max-w-xl mx-auto">
            <div 
              ref={containerRef}
              className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-ew-resize select-none ring-4 ring-white/10 shadow-2xl"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              {/* Before - Destroyed Home */}
              <img 
                src={imgDestroyed} 
                alt="Home destroyed" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
              />
              
              <div className="absolute top-4 left-4 bg-red-600/80 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                Without Shelter
              </div>

              {/* After - Protected Home (Clipped) */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  src={imgProtected} 
                  alt="Home protected" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                 <div className="absolute top-4 right-4 bg-green-600/80 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                   With Shelter
                 </div>
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-[#E69138] shadow-[0_0_20px_rgba(230,145,56,0.5)] z-20"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#E69138] rounded-full flex items-center justify-center shadow-lg transform active:scale-110 transition-transform">
                  <Scan size={20} className="text-[#3E2723]" />
                </div>
              </div>
              
              {/* Instruction Hint */}
              <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                 <span className="bg-black/50 backdrop-blur text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Drag to Compare
                 </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}