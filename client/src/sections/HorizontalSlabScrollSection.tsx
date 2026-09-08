import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Maximize2 } from 'lucide-react';
import { IProduct } from '../types/index.js';
import { useQuickView } from '../context/QuickViewContext.js';

interface HorizontalSlabScrollProps {
  products: IProduct[];
}

export const HorizontalSlabScrollSection: React.FC<HorizontalSlabScrollProps> = ({ products }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { openQuickView } = useQuickView();

  const slabProducts = products.slice(0, 6);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-68%']);

  return (
    <section ref={targetRef} className="relative h-[260vh] bg-[#171615] text-[#FAF9F5]">
      {/* Sticky Pinned Viewport Container */}
      <div className="sticky top-0 h-screen flex flex-col justify-between overflow-hidden py-8 px-3 sm:px-8 lg:px-12">
        {/* Minimal Section Header */}
        <div className="flex items-end justify-between gap-4 pb-3 border-b border-white/10 z-10">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-showroom-bronze block">
              MONUMENTAL SIZES
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              LARGE FORMAT SLABS (1200×2400 MM)
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase hidden sm:inline-block">
              [ SCROLL TO GLIDE ]
            </span>
            <Link
              to="/catalog"
              className="text-xs font-bold uppercase tracking-architectural text-showroom-bronze hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Motion Carousel */}
        <div className="relative flex-1 flex items-center overflow-hidden my-3 horizontal-scroll-container">
          <motion.div style={{ x }} className="flex gap-4 sm:gap-6 items-center cursor-grab active:cursor-grabbing">
            {slabProducts.map((p, idx) => (
              <div
                key={p._id || idx}
                data-cursor="INSPECT"
                className="relative w-[300px] sm:w-[480px] lg:w-[620px] h-[58vh] sm:h-[65vh] bg-[#22211F] border border-white/10 shrink-0 overflow-hidden group flex flex-col justify-between"
              >
                {/* 100% Visual Image */}
                <div className="relative w-full h-full overflow-hidden bg-black">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-showroom-bronze bg-black/70 px-2 py-0.5 border border-white/10">
                      0{idx + 1} / 0{slabProducts.length}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-black/70 px-2 py-0.5 border border-white/10">
                      {p.size || '1200x2400 mm'}
                    </span>
                  </div>

                  <button
                    onClick={() => openQuickView(p)}
                    className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-showroom-bronze text-white backdrop-blur-md border border-white/20 transition-colors z-20"
                    title="Quick Preview"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Bottom Crisp Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-showroom-bronze block">
                        {p.finish} • {p.material}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold uppercase text-white truncate max-w-xs sm:max-w-md">
                        {p.name}
                      </h3>
                    </div>

                    <Link
                      to={`/product/${p.slug}`}
                      className="shrink-0 p-2 text-white/80 hover:text-white group-hover:translate-x-1 transition-transform"
                    >
                      <ArrowUpRight className="w-5 h-5 text-showroom-bronze" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Minimal Progress Line */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-white/50">
          <span className="font-mono text-[10px] text-showroom-bronze font-bold">
            MONUMENTAL SLABS
          </span>

          <div className="w-40 sm:w-64 h-1 bg-white/15 relative overflow-hidden rounded-full">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 bg-showroom-bronze origin-left"
            />
          </div>

          <span className="font-mono text-[10px] text-white/40">
            0{slabProducts.length} ITEMS
          </span>
        </div>
      </div>
    </section>
  );
};
