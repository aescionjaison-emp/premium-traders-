import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

interface CreativeScrollIndicatorProps {
  targetId?: string;
  onClick?: () => void;
}

export const CreativeScrollIndicator: React.FC<CreativeScrollIndicatorProps> = ({
  targetId = 'section-categories',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Scroll Down to Discover Materials"
        className="group relative flex items-center justify-center cursor-pointer outline-none focus:outline-none p-1 transition-transform duration-500 hover:scale-105"
      >
        {/* Sonar Radar Wave Pulses (Expanding Energy Waves) */}
        <div className="absolute inset-0 m-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-showroom-gold/30 animate-ping pointer-events-none opacity-40 duration-1000" />
        <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-showroom-bronze/15 blur-xl pointer-events-none group-hover:bg-showroom-gold/25 transition-all duration-700" />

        {/* 1. Outer Geometric Compass Reticle Ring (Clockwise Rotation) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: isHovered ? 8 : 22, ease: 'linear' }}
          className="w-28 h-28 sm:w-32 sm:h-32 absolute inset-0 m-auto pointer-events-none"
        >
          <svg viewBox="0 0 120 120" className="w-full h-full text-showroom-gold/40 group-hover:text-showroom-gold/70 transition-colors">
            {/* Compass Outer Dash Orbit */}
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="3 6"
            />
            {/* 4 Cardinal Coordinate Markers */}
            <line x1="60" y1="2" x2="60" y2="8" stroke="currentColor" strokeWidth="1.5" />
            <line x1="60" y1="112" x2="60" y2="118" stroke="currentColor" strokeWidth="1.5" />
            <line x1="2" y1="60" x2="8" y2="60" stroke="currentColor" strokeWidth="1.5" />
            <line x1="112" y1="60" x2="118" y2="60" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </motion.div>

        {/* 2. Kinetic Typographic Orbit Ring (Counter-Clockwise Rotation) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: isHovered ? 10 : 26, ease: 'linear' }}
          className="w-24 h-24 sm:w-28 sm:h-28 text-white/80 group-hover:text-showroom-gold transition-colors"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <path
                id="innerScrollPath"
                d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
              />
            </defs>
            <text
              fontSize="6.8"
              letterSpacing="0.24em"
              fill="currentColor"
              fontWeight="bold"
              className="font-mono uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              <textPath href="#innerScrollPath" startOffset="0%">
                ✦ SCROLL DOWN ✦ EXPLORE MATERIALS ✦
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* 3. Center Glassmorphic Core with Liquid Gravity Bead */}
        <div className="absolute inset-0 m-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/80 backdrop-blur-md border border-white/20 group-hover:border-showroom-gold group-hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all duration-500 flex items-center justify-center overflow-hidden">
          {/* Internal Laser Beam Track */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Laser Vertical Guideline */}
            <div className="w-[1.5px] h-7 bg-white/15 relative overflow-hidden rounded-full">
              {/* Sliding Liquid Gold Bead with Glow */}
              <motion.div
                animate={{
                  y: [-12, 28],
                  opacity: [0, 1, 1, 0],
                  scaleY: [0.8, 1.3, 1, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="w-full h-3 bg-gradient-to-b from-showroom-gold via-showroom-bronze to-amber-200 rounded-full shadow-[0_0_8px_#c5a059]"
              />
            </div>

            {/* Pulsing Down Arrow */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="absolute bottom-1.5 text-showroom-gold group-hover:text-amber-200 transition-colors drop-shadow-[0_0_4px_rgba(197,160,89,0.8)]"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </motion.div>
          </div>

          {/* Interactive Specular Highlight Rim */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
        </div>
      </button>

      {/* 4. Harmonic Frequency Equalizer Bars (Beneath the Compass) */}
      <div className="flex items-center gap-1 mt-0.5 pointer-events-none">
        {[0.4, 0.8, 1.2, 0.7, 1.0, 0.5, 0.9].map((heightScale, i) => (
          <motion.span
            key={i}
            animate={{
              scaleY: isHovered ? [heightScale, 1.8, 0.3, heightScale] : [heightScale, 0.3, 1.4, heightScale],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.0 + i * 0.15,
              ease: 'easeInOut',
            }}
            className="w-[2px] h-3 bg-gradient-to-t from-showroom-bronze to-showroom-gold origin-bottom rounded-full opacity-80"
          />
        ))}
      </div>

      {/* Caption Tag */}
      <span className="text-[8px] font-mono font-bold tracking-[0.25em] text-white/50 uppercase group-hover:text-showroom-gold transition-colors">
        SCROLL TO ENTER
      </span>
    </div>
  );
};
