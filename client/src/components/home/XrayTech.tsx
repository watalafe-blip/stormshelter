import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import imgConcrete from '@assets/generated_images/concrete_storm_shelter_exterior.png';
import imgRebar from '@assets/generated_images/steel_rebar_cage_structure_for_shelter.png';
import videoSafe from '@assets/generated_videos/family_safe_in_underground_shelter_during_tornado.mp4';
import videoDestruction from '@assets/generated_videos/tornado_destruction_without_shelter_protection.mp4';

export default function XrayTech() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeVideo, setActiveVideo] = useState<'safe' | 'destruction'>('destruction');
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;

    setSliderPosition(Math.min(100, Math.max(0, position)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
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

          {/* Interactive X-Ray Slider */}
          <div className="flex-1 w-full max-w-xl mx-auto">
            <div 
              ref={containerRef}
              className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-ew-resize select-none ring-4 ring-white/10 shadow-2xl"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              {/* Background Image (Concrete) */}
              <img 
                src={imgConcrete} 
                alt="Concrete Exterior" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
              />
              
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-white/70">
                Exterior
              </div>

              {/* Foreground Image (Rebar/X-Ray) - Clipped */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img 
                  src={imgRebar} 
                  alt="Internal Structure" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none scale-105" // Slight scale to emphasize 'inside'
                />
                 <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay pointer-events-none"></div>
                 <div className="absolute top-4 left-4 bg-red-600/80 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-widest text-white shadow-lg animate-pulse">
                   <ShieldAlert size={12} className="inline mr-1" /> Structural Scan
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
                    Drag to X-Ray
                 </span>
              </div>
            </div>
          </div>

        </div>

        {/* Video Comparison Section */}
        <div className="mt-32 pt-24 border-t border-white/20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-bold leading-tight mb-6">
              Why This <span className="text-[#FFD700]">Decision</span> Matters
            </h2>
            <p className="text-xl text-stone-300 leading-relaxed">
              Toggle between what happens with and without a Home Defend shelter.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Video Toggle Buttons */}
            <div className="flex gap-4 mb-8 justify-center">
              <Button
                onClick={() => setActiveVideo('destruction')}
                className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-all ${
                  activeVideo === 'destruction'
                    ? 'bg-red-600/80 text-white shadow-lg'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20'
                }`}
              >
                Without Shelter
              </Button>
              <Button
                onClick={() => setActiveVideo('safe')}
                className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-all ${
                  activeVideo === 'safe'
                    ? 'bg-green-600/80 text-white shadow-lg'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20'
                }`}
              >
                With Shelter
              </Button>
            </div>

            {/* Video Player */}
            <motion.div
              key={activeVideo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-4 ring-white/10"
            >
              <video
                src={activeVideo === 'safe' ? videoSafe : videoDestruction}
                autoPlay
                muted={isMuted}
                loop
                className="w-full h-auto"
              />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur p-2 rounded-lg transition-all"
                >
                  {isMuted ? (
                    <VolumeX size={20} className="text-white" />
                  ) : (
                    <Volume2 size={20} className="text-white" />
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-sm backdrop-blur ${
                activeVideo === 'safe'
                  ? 'bg-green-600/80 text-white'
                  : 'bg-red-600/80 text-white'
              }`}>
                {activeVideo === 'safe' ? '✓ Protected' : '✗ Exposed'}
              </div>
            </motion.div>

            {/* Comparison Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center">
                <h4 className="text-[#FFD700] font-bold text-lg mb-2">Safety Rating</h4>
                <p className={`text-3xl font-extrabold ${activeVideo === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                  {activeVideo === 'safe' ? '100%' : '0%'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center">
                <h4 className="text-[#FFD700] font-bold text-lg mb-2">Family Security</h4>
                <p className={`text-3xl font-extrabold ${activeVideo === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                  {activeVideo === 'safe' ? 'Secured' : 'At Risk'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg text-center">
                <h4 className="text-[#FFD700] font-bold text-lg mb-2">Peace of Mind</h4>
                <p className={`text-3xl font-extrabold ${activeVideo === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                  {activeVideo === 'safe' ? 'Guaranteed' : 'Lost'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}