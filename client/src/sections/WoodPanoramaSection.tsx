import React from 'react';
import { Link } from 'react-router-dom';
import { IProduct } from '../types/index.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface WoodPanoramaProps {
  products: IProduct[];
}

export const WoodPanoramaSection: React.FC<WoodPanoramaProps> = ({ products }) => {
  const woodProducts = products
    .filter(
      (p) =>
        p.visible &&
        (p.categorySlug === 'wood-works-wooden-doors-plywood' ||
          (typeof p.category === 'object' && p.category?.slug === 'wood-works-wooden-doors-plywood') ||
          p.material.toLowerCase().includes('teak') ||
          p.material.toLowerCase().includes('wood') ||
          p.material.toLowerCase().includes('oak') ||
          p.material.toLowerCase().includes('plywood') ||
          p.material.toLowerCase().includes('veneer'))
    )
    .slice(0, 5);

  return (
    <section id="section-wood" className="py-14 bg-showroom-bg border-t border-showroom-border">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="FINE WOODWORKS & DOORS"
            title="BURMA TEAK & ARCHITECTURAL LOUVERS"
            subtitle="Curated 5 solid seasoned hardwood doors, marine plywood sheets, and acoustic fluted slat systems."
            linkText="EXPLORE WOODWORKS (5)"
            linkUrl="/wood"
            count={woodProducts.length}
          />
        </ScrollReveal>

        {/* Neat Symmetrical 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {woodProducts.map((p, idx) => (
            <ScrollReveal key={p._id || idx} direction="clip" delay={idx * 0.06}>
              <ProductCard product={p} aspect="portrait" className="h-full" />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
