import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, Eye, Sparkles } from 'lucide-react';
import { IProduct, IExploreMaterialItem } from '../types/index.js';
import { useQuickView } from '../context/QuickViewContext.js';

import { getShortProductName, getCategoryShortName } from '../components/common/ProductCard.js';

interface ExploreMaterialsProps {
  products?: IProduct[];
  exploreMaterials?: IExploreMaterialItem[];
}

interface MaterialShowcaseCard {
  id: string;
  category: string;
  name: string;
  link: string;
  image: string;
}

const defaultShowcaseItems: MaterialShowcaseCard[] = [
  {
    id: '01',
    category: 'Granite',
    name: 'Black Galaxy',
    link: '/granite',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: '02',
    category: 'Tiles',
    name: 'Statuario White',
    link: '/tiles',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: '03',
    category: 'Wood',
    name: 'Smoked Oak',
    link: '/wood',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: '04',
    category: 'Doors',
    name: 'Teak Entrance',
    link: '/wood',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: '05',
    category: 'Surfaces',
    name: 'Marine Ply',
    link: '/wood',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: '06',
    category: 'Electrical',
    name: 'Brass Switch',
    link: '/electrical',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
  },
];

export const ExploreMaterialsHorizontalSection: React.FC<ExploreMaterialsProps> = ({ products, exploreMaterials }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { openQuickView } = useQuickView();
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);

  const displayItems = (exploreMaterials && exploreMaterials.length > 0)
    ? exploreMaterials.map((m, idx) => ({
        id: m.id || `0${idx + 1}`,
        category: m.category || m.subtitle || 'Material',
        name: m.name,
        link: m.link || `/${(m.category || 'catalog').toLowerCase().replace(/\s+/g, '')}`,
        image: m.image,
      }))
    : defaultShowcaseItems;


  return (
    <section
      ref={containerRef}
      className="relative bg-[#11100F] text-[#FAF9F5] border-t border-white/10"
      style={{ minHeight: '260vh' }}
    >
      {/* Sticky Desktop Viewport Container */}
      <div className="sticky top-0 h-screen flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 z-20">
          <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-tight text-white">
            Explore Materials
          </h2>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-showroom-gold hover:underline"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Glide Track (Desktop Transform / Mobile Scroll) */}
        <div className="relative flex-1 flex items-center overflow-x-auto sm:overflow-hidden hide-scrollbar my-4">
          <motion.div
            style={!shouldReduceMotion ? { x: xTransform } : {}}
            className="flex gap-4 sm:gap-6 items-center shrink-0 pr-12"
          >
            {displayItems.map((item, idx) => (
              <div
                key={item.id}
                className="relative w-[260px] sm:w-[380px] lg:w-[440px] h-[52vh] sm:h-[60vh] bg-[#1A1918] border border-white/10 hover:border-showroom-gold transition-all duration-300 rounded-[5px] overflow-hidden flex flex-col justify-between group shrink-0 shadow-2xl"
              >
                {/* Visual Image Viewport */}
                <div className="relative w-full h-full overflow-hidden bg-black rounded-[5px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-[5px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />

                  {/* Top Number */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/15 backdrop-blur-sm rounded-[5px]">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Bottom Pure Details: Short Name (max 2 words) + Category + Arrow */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                    <div className="min-w-0 pr-2">
                      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white group-hover:text-showroom-gold transition-colors truncate">
                        {item.name}
                      </h3>
                      <span className="text-[10px] uppercase font-mono text-white/70 block mt-0.5">
                        {item.category}
                      </span>
                    </div>

                    <Link
                      to={item.link}
                      className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-showroom-bronze flex items-center justify-center text-white backdrop-blur-md border border-white/20 transition-all shrink-0 ml-2 group-hover:scale-110"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Horizontal Progress Meter */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/50 z-20">
          <span className="font-mono text-[10px] text-showroom-gold font-bold">
            SHOWROOM SAMPLES: 06 DISCIPLINES
          </span>

          <div className="w-40 sm:w-64 h-1 bg-white/15 relative overflow-hidden rounded-full">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 bg-showroom-gold origin-left"
            />
          </div>

          <span className="font-mono text-[10px] text-white/40">
            [ HORIZONTAL GLIDE ]
          </span>
        </div>
      </div>
    </section>
  );
};
