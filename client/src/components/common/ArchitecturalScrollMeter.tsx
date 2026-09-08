import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ArchitecturalScrollMeter: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollPercentage(Math.round(latest * 100));
      setIsVisible(latest > 0.05 && latest < 0.98);
    });
  }, [scrollYProgress]);

  if (!isVisible) return null;

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-2 pointer-events-none select-none">
      {/* Percentage Gauge */}
      <span className="font-mono text-[9px] font-bold text-showroom-bronze tracking-widest bg-black/80 px-1.5 py-0.5 rounded border border-white/10 backdrop-blur-md">
        {scrollPercentage.toString().padStart(2, '0')}%
      </span>

      {/* Architectural Ruler Bar */}
      <div className="relative w-1 h-36 bg-black/30 backdrop-blur-sm rounded-full overflow-hidden border border-white/10">
        {/* Dynamic Spring Fill */}
        <motion.div
          style={{ scaleY }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-showroom-bronze to-showroom-gold origin-top rounded-full"
        />
      </div>

      {/* Vertical Discipline Micro-Label */}
      <span className="font-mono text-[8px] text-white/40 tracking-widest uppercase [writing-mode:vertical-lr] rotate-180 mt-1">
        SPEC ELEVATION
      </span>
    </div>
  );
};
