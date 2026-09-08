import React from 'react';
import { IProduct } from '../types/index.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { AsymmetricGrid } from '../components/common/AsymmetricGrid.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface AsymmetricCatalogSectionProps {
  products: IProduct[];
}

export const AsymmetricCatalogSection: React.FC<AsymmetricCatalogSectionProps> = ({ products }) => {
  const displayProducts = products.filter((p) => p.visible).slice(0, 9);

  return (
    <section id="section-asymmetric" className="py-14 bg-showroom-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="CURATED ARCHITECTURAL SELECTIONS"
            title="SHOWROOM HIGHLIGHTS & SLABS"
            subtitle="Large porcelain formats, rare granite slabs, and solid teak doors composed in dense architectural balance."
            linkText="EXPLORE ALL PRODUCTS"
            linkUrl="/catalog"
            count={displayProducts.length}
          />
        </ScrollReveal>

        <AsymmetricGrid products={displayProducts} />
      </div>
    </section>
  );
};
