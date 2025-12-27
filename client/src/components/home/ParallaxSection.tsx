import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  bgImage?: string;
  className?: string;
  overlayColor?: string;
}

export default function ParallaxSection({ children, bgImage, className = "", overlayColor = "bg-black/40" }: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`}>
      {bgImage && (
        <motion.div 
          style={{ y }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }} 
          />
          <div className={`absolute inset-0 ${overlayColor}`} />
        </motion.div>
      )}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        {children}
      </div>
    </section>
  );
}