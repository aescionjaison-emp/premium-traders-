import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { IMaterialsLifeSlide } from '../types/index.js';

interface MaterialsComeToLifeSectionProps {
  slides?: IMaterialsLifeSlide[];
}

const defaultSlides: IMaterialsLifeSlide[] = [
  {
    num: '01',
    category: 'GRANITE',
    name: 'Natural Stone',
    desc: 'Raw Slabs → Finished Spaces',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    accent: '#D4AF37',
  },
  {
    num: '02',
    category: 'TILES',
    name: 'Modern Surfaces',
    desc: 'Continuous Vein Porcelain',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1400&q=85',
    accent: '#C5A059',
  },
  {
    num: '03',
    category: 'WOOD WORK',
    name: 'Crafted Wood',
    desc: 'Solid Teak & Architectural Joinery',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
    accent: '#8C6239',
  },
  {
    num: '04',
    category: 'ELECTRICAL',
    name: 'Smart Essentials',
    desc: 'Solid Brass & Magnetic Tracks',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85',
    textureImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=85',
    highlight: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1400&q=85',
    accent: '#D4AF37',
  },
];

export const MaterialsComeToLifeSection: React.FC<MaterialsComeToLifeSectionProps> = ({ slides: propSlides }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeSlides: IMaterialsLifeSlide[] = (propSlides && propSlides.length > 0) ? propSlides : defaultSlides;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const total = activeSlides.length;
    const index = Math.min(Math.floor(latest * total), total - 1);
    if (index !== activeIdx) {
      setActiveIdx(index);
    }
  });

  const current = activeSlides[activeIdx] || activeSlides[0];
  const currentLink = `/${(current.category || '').toLowerCase().replace(/\s+/g, '')}`;


  return (
    <section
      ref={containerRef}
      id="section-materials-life"
      className="relative bg-[#141312] text-[#FAF9F5] border-t border-white/10"
      style={{ height: '320vh' }}
    >
      {/* Sticky Pinned Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden">
        {/* Top Minimal Step Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-showroom-gold uppercase">
              MATERIALS COME TO LIFE
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeSlides.map((s, i) => (
              <button
                key={s.num || i}
                onClick={() => {
                  if (containerRef.current) {
                    const top = containerRef.current.offsetTop;
                    const height = containerRef.current.offsetHeight;
                    window.scrollTo({
                      top: top + (height / activeSlides.length) * i + 10,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`py-0.5 px-2 text-[10px] font-mono font-bold transition-all ${
                  i === activeIdx
                    ? 'text-white border-b-2 border-showroom-gold bg-white/10'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {s.num || `0${i+1}`} {s.category}
              </button>
            ))}
          </div>
        </div>

        {/* Center Main Stage: Editorial Typography (Left) + Transformation Image Stage (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center my-auto z-10">
          {/* Left Minimal Editorial (4 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.num || activeIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-showroom-gold bg-black/60 px-2 py-0.5 border border-white/15">
                    {current.num || `0${activeIdx + 1}`} / 04
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/70">
                    {current.category}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white leading-[1.05] whitespace-pre-line">
                  {current.name || current.headline}
                </h3>

                <div className="pt-2">
                  <Link
                    to={current.link || currentLink}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-wider transition-all rounded-[5px] shadow-md group"
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Dual Visual Canvas (7 cols) */}
          <div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.num || activeIdx}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {/* 1. Texture Sensation */}
                <div className="relative aspect-[4/5] bg-[#1E1D1B] border border-white/10 overflow-hidden group rounded-[5px] shadow-2xl">
                  <img
                    src={current.textureImage || current.imageTexture || current.image}
                    alt={current.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-[5px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />
                  <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono font-bold uppercase tracking-wider text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10 rounded-[5px]">
                    MATERIAL TEXTURE
                  </span>
                </div>

                {/* 2. Finished Living Space */}
                <div className="relative aspect-[4/5] bg-[#1E1D1B] border border-white/10 overflow-hidden group rounded-[5px] shadow-2xl">
                  <img
                    src={current.highlight || current.imageSpace || current.image}
                    alt={current.name || current.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-[5px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />
                  <span className="absolute bottom-2.5 left-2.5 text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-black/70 px-2 py-0.5 border border-white/10 rounded-[5px]">
                    FINISHED SPACE
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Pinned Progress Line */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/50 z-20">
          <span className="font-mono text-[10px] text-showroom-gold font-bold">
            SCROLL PROGRESSION: {current.num || `0${activeIdx + 1}`} / 04
          </span>

          <div className="w-40 sm:w-64 h-1 bg-white/15 relative overflow-hidden rounded-full">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 bg-showroom-gold origin-left"
            />
          </div>

          <span className="font-mono text-[10px] text-white/40">
            [ PINNED TRANSFORMATION ]
          </span>
        </div>
      </div>
    </section>
  );
};
