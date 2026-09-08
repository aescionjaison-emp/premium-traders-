import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Layers, ShieldCheck, Compass, Cpu } from 'lucide-react';
import { MaskReveal } from '../components/common/MaskReveal.js';

interface StorySlide {
  id: string;
  category: string;
  discipline: string;
  title: string;
  materialSpec: string;
  application: string;
  finish: string;
  link: string;
  color: string;
  imageMaterial: string;
  imageInterior: string;
  features: string[];
}

const stories: StorySlide[] = [
  {
    id: '01',
    category: 'EXOTIC NATURAL STONE',
    discipline: 'GRANITE & QUARTZITE',
    title: 'Solid Quarry Slabs & Tactile Veins',
    materialSpec: '20mm Calibrated Ongole Gangsaw Slabs',
    application: 'Seamless Kitchen Islands & Monolithic Vanity Tops',
    finish: 'Mirror Polished / Leathered Finish',
    link: '/granite',
    color: '#C59B63',
    imageMaterial: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    imageInterior: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    features: ['Direct Quarry Selection', 'Custom Edge Chamfering', 'Zero-Absorption Sealing'],
  },
  {
    id: '02',
    category: 'LARGE FORMAT PORCELAIN',
    discipline: 'VITRIFIED SLABS',
    title: '1200×2400 mm Continuous Bookmatch',
    materialSpec: 'Ultra-Dense Porcelain Body • 9mm Profile',
    application: 'Expansive Living Room Floors & Feature Wall Cladding',
    finish: 'High-Gloss Glazed / Silk Matt',
    link: '/tiles',
    color: '#8E9A82',
    imageMaterial: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
    imageInterior: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
    features: ['Precision Rectified Edges', 'Continuous Vein Symmetry', 'Scratch & Stain Immune'],
  },
  {
    id: '03',
    category: 'ARCHITECTURAL MILLWORK',
    discipline: 'FINE WOOD & TEAK DOORS',
    title: 'Solid Burma Teak & Fluted Acoustic Louvers',
    materialSpec: '100% Seasoned Hardwood & IS 710 Marine Ply',
    application: 'Grand Entrance Pivot Doors & Tactile Wall Panelling',
    finish: 'Natural Matte PU / Smoked Teak',
    link: '/wood',
    color: '#A86842',
    imageMaterial: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
    imageInterior: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    features: ['Heavy-Duty German Pivot Gear', 'Moisture Resistant Core', 'Handcrafted Architectural Joinery'],
  },
  {
    id: '04',
    category: 'LUXURY ELECTRICAL APPARATUS',
    discipline: 'SWITCHES & LIGHTING',
    title: 'Solid Brushed Brass & Low-Voltage Tracks',
    materialSpec: 'CNC Machined Brass & Magnetic 48V Modules',
    application: 'Minimalist Architectural Walls & Concealed Coves',
    finish: 'Brushed Brass / Satin Graphite',
    link: '/electrical',
    color: '#BFA15F',
    imageMaterial: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    imageInterior: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
    features: ['Solid Metal Faceplates', 'Modular Mechanism Sockets', 'Anti-Glare High CRI 95+ Fixtures'],
  },
];

export const PinnedMaterialStorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const total = stories.length;
    const index = Math.min(Math.floor(latest * total), total - 1);
    if (index !== activeSlide) {
      setActiveSlide(index);
    }
  });

  const currentStory = stories[activeSlide];

  return (
    <section
      ref={containerRef}
      className="relative bg-[#171615] text-[#FAF9F5] border-t border-white/10"
      style={{ height: '320vh' }}
    >
      {/* Sticky Viewport Shell */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden">
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-showroom-gold" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-showroom-gold uppercase">
              MATERIAL TO SPACE TRANSFORMATION
            </span>
          </div>

          {/* 4 Story Step Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {stories.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  if (containerRef.current) {
                    const top = containerRef.current.offsetTop;
                    const height = containerRef.current.offsetHeight;
                    window.scrollTo({
                      top: top + (height / stories.length) * idx + 20,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`flex items-center gap-1.5 py-1 px-2 text-[10px] font-mono font-bold transition-all ${
                  idx === activeSlide
                    ? 'text-white border-b-2 border-showroom-gold bg-white/10'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span>{s.id}</span>
                <span className="hidden md:inline">{s.discipline.split('&')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center Main Pinned Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center my-auto z-10">
          {/* Left Column: Story Editorial (4 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-showroom-gold bg-black/60 px-2 py-0.5 border border-white/10">
                    CHAPTER {currentStory.id} OF 04
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/70">
                    {currentStory.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white leading-tight">
                  {currentStory.title}
                </h3>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-2">
                    <Layers className="w-3.5 h-3.5 text-showroom-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/50 block">Specification</span>
                      <span className="font-mono text-white/90 text-[11px]">{currentStory.materialSpec}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Compass className="w-3.5 h-3.5 text-showroom-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-white/50 block">Architectural Application</span>
                      <span className="text-white/80 text-[11px]">{currentStory.application}</span>
                    </div>
                  </div>
                </div>

                {/* Micro Bullet Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {currentStory.features.map((feat, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/70 px-2 py-0.5"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                <div className="pt-3">
                  <Link
                    to={currentStory.link}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-wider transition-all rounded-[5px] shadow-md"
                  >
                    <span>View {currentStory.discipline}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Dual Visual Stage (Raw Material + Finished Interior) (7 cols) */}
          <div className="lg:col-span-7 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {/* 1. Raw Slab / Material Close-up */}
                <div className="relative aspect-[4/5] bg-[#22211F] border border-white/10 overflow-hidden group rounded-[5px] shadow-xl">
                  <img
                    src={currentStory.imageMaterial}
                    alt={currentStory.discipline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-[5px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 rounded-[5px]" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/15 backdrop-blur-sm rounded-[5px]">
                      [01. MATERIAL TEXTURE]
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white block">
                      {currentStory.finish}
                    </span>
                  </div>
                </div>

                {/* 2. Finished Indian Interior Space Transformation */}
                <div className="relative aspect-[4/5] bg-[#22211F] border border-white/10 overflow-hidden group rounded-[5px] shadow-xl">
                  <img
                    src={currentStory.imageInterior}
                    alt={currentStory.application}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-[5px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 rounded-[5px]" />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-black/70 px-2 py-0.5 border border-white/15 backdrop-blur-sm rounded-[5px]">
                      [02. SPACE EXECUTION]
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white block truncate">
                      {currentStory.application}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Pinned Progress Line */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/50 z-20">
          <span className="font-mono text-[10px] text-showroom-gold font-bold">
            SCROLL PROGRESSION: CHAPTER 0{activeSlide + 1} / 04
          </span>

          <div className="w-48 sm:w-80 h-1 bg-white/15 relative overflow-hidden rounded-full">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 bg-showroom-gold origin-left"
            />
          </div>

          <span className="font-mono text-[10px] text-white/40">
            [ PINNED SEQUENCE ]
          </span>
        </div>
      </div>
    </section>
  );
};
