import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IProduct } from '../types/index.js';

interface VelocityMarqueeProps {
  products: IProduct[];
}

export const VelocityMarqueeStrip: React.FC<VelocityMarqueeProps> = ({ products }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const items = products.slice(0, 8);

  return (
    <div ref={containerRef} className="py-6 bg-[#171615] overflow-hidden border-y border-white/10">
      <div className="flex gap-4 select-none whitespace-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
          className="flex gap-4 shrink-0"
        >
          {items.concat(items).map((p, idx) => (
            <Link
              key={idx}
              to={`/product/${p.slug}`}
              className="relative w-56 sm:w-72 aspect-[16/10] bg-[#22211F] border border-white/10 overflow-hidden shrink-0 group block"
            >
              <img
                src={p.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=85'}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 text-white">
                <span className="text-[8px] font-bold uppercase tracking-widest text-showroom-bronze block">
                  {p.finish}
                </span>
                <span className="text-[11px] font-bold uppercase truncate block">
                  {p.name}
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
