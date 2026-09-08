import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { ICategory } from '../types/index.js';

interface ModernDisciplinesProps {
  categories?: ICategory[];
}

const disciplinesData = [
  {
    id: '01',
    name: 'Tiles & Slabs',
    subtitle: '1200×2400 MM Porcelain & Slabs',
    specsCount: '5 Curated Specs',
    link: '/tiles',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
    accent: 'from-amber-500/20 to-transparent',
  },
  {
    id: '02',
    name: 'Granite & Natural Stone',
    subtitle: 'Black Galaxy & Exotic Quartzite',
    specsCount: '5 Curated Specs',
    link: '/granite',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    accent: 'from-blue-500/20 to-transparent',
  },
  {
    id: '03',
    name: 'Fine Wood Works',
    subtitle: 'Burma Teak & Acoustic Louvers',
    specsCount: '5 Curated Specs',
    link: '/wood',
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
    accent: 'from-orange-500/20 to-transparent',
  },
  {
    id: '04',
    name: 'Luxury Electrical',
    subtitle: 'Solid Brass Switches & 48V Tracks',
    specsCount: '5 Curated Specs',
    link: '/electrical',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    accent: 'from-emerald-500/20 to-transparent',
  },
];

export const ModernDisciplinesShowcase: React.FC<ModernDisciplinesProps> = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const sectionY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.8]);

  return (
    <section
      id="section-disciplines"
      ref={containerRef}
      className="py-16 bg-[#11100F] text-[#FAF9F5] relative overflow-hidden"
    >
      {/* Ambient Radial Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-showroom-bronze/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Minimal Clean Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between pb-4 mb-6 border-b border-white/10"
        >
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-showroom-gold">
            SHOWROOM DISCIPLINES
          </span>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white/80 hover:text-showroom-gold transition-colors"
          >
            <span>Catalog (20)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* 4 Pure Visual Cards */}
        <motion.div
          style={{ y: sectionY, opacity: sectionOpacity }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {disciplinesData.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <Link
                to={item.link}
                className="relative block aspect-[4/5] rounded-[5px] overflow-hidden bg-[#1E1D1B] border border-white/10 group-hover:border-showroom-gold shadow-lg transition-all duration-300"
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-[5px]"
                  loading="lazy"
                />

                {/* Subtle Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent rounded-[5px]" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="font-mono text-[9px] font-bold text-showroom-gold bg-black/70 px-1.5 py-0.5 border border-white/10 rounded-[5px]">
                    {item.id}
                  </span>
                </div>

                {/* Bottom Pure Title */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white group-hover:text-showroom-gold transition-colors truncate pr-1">
                    {item.name}
                  </h3>
                  <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-showroom-bronze flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-all">
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
