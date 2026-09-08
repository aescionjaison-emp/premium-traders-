import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { IProduct } from '../types/index.js';

interface DualParallaxProps {
  products: IProduct[];
}

export const DualParallaxScrollSection: React.FC<DualParallaxProps> = ({ products }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Dual directional parallax motion
  const yLeft = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yRight = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const leftItems = products.slice(0, 3);
  const rightItems = products.slice(3, 6);

  return (
    <section ref={containerRef} className="py-16 bg-[#171615] text-[#FAF9F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between pb-4 mb-8 border-b border-white/10">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-showroom-bronze block mb-0.5">
              DUAL PARALLAX DYNAMICS
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              MONOLITHIC TEXTURE DEPTH
            </h2>
          </div>
          <span className="text-[10px] font-mono text-white/40 uppercase hidden sm:inline-block">
            [ OPPOSING PARALLAX VELOCITY ]
          </span>
        </div>

        {/* Dual Parallax Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Left Column (Parallax Up) */}
          <motion.div style={{ y: yLeft }} className="space-y-6">
            {leftItems.map((p, idx) => (
              <Link
                key={p._id || idx}
                to={`/product/${p.slug}`}
                className="group relative block aspect-[16/11] bg-[#22211F] border border-white/10 overflow-hidden"
              >
                <img
                  src={p.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-bronze block">
                      {p.finish} • {p.size}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold uppercase truncate max-w-xs">
                      {p.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-showroom-bronze group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </Link>
            ))}
          </motion.div>

          {/* Right Column (Parallax Down) */}
          <motion.div style={{ y: yRight }} className="space-y-6 pt-0 md:pt-12">
            {rightItems.map((p, idx) => (
              <Link
                key={p._id || idx}
                to={`/product/${p.slug}`}
                className="group relative block aspect-[16/11] bg-[#22211F] border border-white/10 overflow-hidden"
              >
                <img
                  src={p.images[0] || 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-bronze block">
                      {p.finish} • {p.size}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold uppercase truncate max-w-xs">
                      {p.name}
                    </h3>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-showroom-bronze group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
