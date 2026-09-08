import React from 'react';
import { IProduct } from '../types/index.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface ElectricalStripProps {
  products: IProduct[];
}

export const ElectricalStripSection: React.FC<ElectricalStripProps> = ({ products }) => {
  const electricalProducts = products
    .filter(
      (p) =>
        p.visible &&
        (p.categorySlug === 'electrical-products-lighting-switches' ||
          (typeof p.category === 'object' && p.category?.slug === 'electrical-products-lighting-switches') ||
          p.material.toLowerCase().includes('brass') ||
          p.material.toLowerCase().includes('switch') ||
          p.material.toLowerCase().includes('lighting') ||
          p.material.toLowerCase().includes('fan') ||
          p.material.toLowerCase().includes('glass'))
    )
    .slice(0, 5);

  return (
    <section id="section-electrical" className="py-14 bg-showroom-ivory/50 border-t border-showroom-border">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="PRECISION APPARATUS & LIGHTING"
            title="BRASS SWITCHES & MAGNETIC LIGHTING"
            subtitle="Curated 5 solid metal switch plates, crystal glass modules, 48V magnetic tracks, and luxury BLDC fans."
            linkText="EXPLORE ELECTRICAL (5)"
            linkUrl="/electrical"
            count={electricalProducts.length}
          />
        </ScrollReveal>

        {/* Neat Symmetrical 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {electricalProducts.map((p, idx) => (
            <ScrollReveal key={p._id || idx} direction="clip" delay={idx * 0.06}>
              <ProductCard product={p} aspect="portrait" className="h-full" />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
