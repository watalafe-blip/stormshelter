import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldAlert } from 'lucide-react';
import imgRebar from '@assets/generated_images/steel_rebar_cage_structure_for_shelter.png';
import imgClosed from '@assets/generated_images/underground_concrete_shelter_closed_buried_ground.png';
import imgOpen from '@assets/generated_images/shelter_with_open_door_showing_interior_access.png';
import imgDestroyed from '@assets/generated_images/destroyed_home_after_tornado.png';
import imgProtected from '@assets/generated_images/concrete_storm_shelter_with_open_white_door.png';

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 text-sm font-bold tracking-wider uppercase">
              <Scan size={16} /> Proprietary Tech
            </div>
            
            <h2 className="text-4xl md:text-5xl font-sans font-bold leading-tight">
              See What Others <span className="text-[#FFD700]">Hide</span>.
            </h2>
            
            <p className="text-xl text-stone-300 leading-relaxed">
              While other companies cut corners with thin walls and minimal reinforcement, we invite you to look closer. Our 
              <span className="text-white font-bold"> Mono-Pour™ Technology</span> integrates a 
              massive steel rebar cage directly into 6,000 PSI concrete.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <h4 className="text-[#FFD700] font-bold text-lg mb-2">Double Rebar Grid</h4>
                <p className="text-sm text-stone-400">#4 Steel Rebar placed every 12 inches on center, creating an impenetrable cage.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <h4 className="text-[#FFD700] font-bold text-lg mb-2">Zero Cold Joints</h4>
                <p className="text-sm text-stone-400">Poured as a single solid unit to eliminate weak points and water intrusion.</p>
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
                className="absolute top-0 bottom-0 w-1 bg-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)] z-20"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg transform active:scale-110 transition-transform">
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

        {/* Before/After Image Comparison Section */}
        <div className="mt-32 pt-24 border-t border-white/20">

          <div className="max-w-4xl mx-auto">
            {/* Before/After Slider */}
            <div 
              ref={outcomeContainerRef}
              className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize select-none ring-4 ring-white/10 shadow-2xl"
              onMouseMove={handleOutcomeMove}
              onTouchMove={handleOutcomeMove}
              onMouseDown={handleOutcomeMouseDown}
              onTouchStart={handleOutcomeMouseDown}
            >
              {/* Before - Closed Shelter */}
              <img 
                src={imgClosed} 
                alt="Shelter closed" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
              />
              
              <div className="absolute bottom-4 left-4 bg-stone-800/80 backdrop-blur px-4 py-2 rounded text-sm font-bold uppercase tracking-widest text-white">
                Closed
              </div>

              {/* After - Open Shelter (Clipped) */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - outcomeSliderPosition}% 0 0)` }}
              >
                <img 
                  src={imgOpen} 
                  alt="Shelter open" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                />
                 <div className="absolute bottom-4 right-4 bg-green-600/80 backdrop-blur px-4 py-2 rounded text-sm font-bold uppercase tracking-widest text-white">
                   Open
                 </div>
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)] z-20"
                style={{ left: `${outcomeSliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg transform active:scale-110 transition-transform">
                  <Scan size={20} className="text-[#3E2723]" />
                </div>
              </div>
              
              {/* Instruction Hint */}
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
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