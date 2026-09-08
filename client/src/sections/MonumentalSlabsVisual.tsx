import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Maximize2, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { Lightbox } from '../components/common/Lightbox.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

const visualSlabs = [
  {
    title: '1200×2400 MM Statuario Continuous Vein Porcelain',
    spec: 'Zero Water Absorption • Bookmatch Surface',
    tag: 'LARGE FORMAT PORCELAIN',
    url: '/tiles',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1600&q=85',
  },
  {
    title: 'Natural Black Galaxy Granite with Bronzite Crystals',
    spec: '20mm Calibrated Solid Natural Stone Slab',
    tag: 'EXOTIC NATURAL STONE',
    url: '/granite',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1600&q=85',
  },
];

export const MonumentalSlabsVisual: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const lightboxImages = visualSlabs.map((s) => ({
    url: s.image,
    title: s.title,
    subtitle: s.spec,
  }));

  return (
    <section className="py-14 bg-[#171615] text-[#FAF9F5] border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="MONUMENTAL FORMATS"
            title="SLAB TEXTURE PANORAMA"
            linkText="VIEW TILES & STONE"
            linkUrl="/tiles"
          />
        </ScrollReveal>

        {/* 2 Grand Side-by-Side Architectural Visual Slabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {visualSlabs.map((slab, idx) => (
            <ScrollReveal key={idx} direction="clip" delay={idx * 0.1}>
              <div className="group relative bg-[#22211F] border border-white/10 overflow-hidden rounded-[5px]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black rounded-[5px]">
                  <img
                    src={slab.image}
                    alt={slab.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-[5px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[5px]" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-showroom-gold bg-black/70 px-2.5 py-1 backdrop-blur-md border border-white/15 rounded-[5px]">
                      {slab.tag}
                    </span>
                  </div>

                  {/* Inspect Texture Action */}
                  <button
                    onClick={() => {
                      setActiveIdx(idx);
                      setLightboxOpen(true);
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-showroom-bronze text-white backdrop-blur-md border border-white/15 transition-colors z-10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded-[5px]"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Inspect</span>
                  </button>

                  {/* Bottom Pure Visual Typography */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                    <div className="min-w-0 pr-2">
                      <span className="text-[9px] font-mono text-white/70 block mb-0.5 truncate">
                        {slab.spec}
                      </span>
                      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white group-hover:text-showroom-gold transition-colors truncate">
                        {slab.title}
                      </h3>
                    </div>

                    <Link
                      to={slab.url}
                      className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-showroom-bronze flex items-center justify-center text-white backdrop-blur-md border border-white/20 transition-all shrink-0 ml-2 group-hover:scale-110"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={activeIdx}
      />
    </section>
  );
};
