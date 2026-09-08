import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Maximize2, ArrowUpRight } from 'lucide-react';
import { IProduct } from '../types/index.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { Lightbox } from '../components/common/Lightbox.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface GraniteShowcaseProps {
  products: IProduct[];
}

export const GraniteShowcaseSection: React.FC<GraniteShowcaseProps> = ({ products }) => {
  const graniteProducts = products
    .filter(
      (p) =>
        p.visible &&
        (p.categorySlug === 'granite-marble-natural-stone' ||
          (typeof p.category === 'object' && p.category?.slug === 'granite-marble-natural-stone') ||
          p.material.toLowerCase().includes('granite') ||
          p.material.toLowerCase().includes('marble') ||
          p.material.toLowerCase().includes('stone') ||
          p.material.toLowerCase().includes('quartzite'))
    )
    .slice(0, 5);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const lightboxImages = graniteProducts.map((p) => ({
    url: p.images[0] || '',
    title: `${p.name} — ${p.finish}`,
    subtitle: `${p.size} • ${p.material} • SKU: ${p.sku}`,
  }));

  return (
    <section id="section-granite" className="py-14 bg-showroom-ivory/60 border-t border-showroom-border">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="NATURAL STONE DISCIPLINE"
            title="EXOTIC GRANITE & QUARTZITE SLABS"
            subtitle="Curated collection of 5 solid natural stone and quartzite surfaces straight from high-yield quarries."
            linkText="EXPLORE ALL STONE (5)"
            linkUrl="/granite"
            count={graniteProducts.length}
          />
        </ScrollReveal>

        {/* Neat Symmetrical 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {graniteProducts.map((p, idx) => (
            <ScrollReveal key={p._id || idx} direction="clip" delay={idx * 0.06}>
              <ProductCard product={p} aspect="portrait" className="h-full" />
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={activeIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
};
