import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Grid3X3, Layers } from 'lucide-react';
import { IProduct } from '../types/index.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface CuratedShowcaseProps {
  products: IProduct[];
}

export const CuratedShowcaseSection: React.FC<CuratedShowcaseProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: 'ALL DISCIPLINES', count: products.length },
    { id: 'tiles', label: 'TILES & SLABS', count: 5, slug: 'tiles' },
    { id: 'granite', label: 'GRANITE & STONE', count: 5, slug: 'granite-marble-natural-stone' },
    { id: 'wood', label: 'WOOD WORKS', count: 5, slug: 'wood-works-wooden-doors-plywood' },
    { id: 'electrical', label: 'ELECTRICAL', count: 5, slug: 'electrical-products-lighting-switches' },
  ];

  const filteredProducts =
    activeTab === 'all'
      ? products
      : activeTab === 'tiles'
      ? products.filter(
          (p) =>
            p.categorySlug === 'tiles' ||
            (typeof p.category === 'object' && p.category?.slug === 'tiles')
        ).slice(0, 5)
      : activeTab === 'granite'
      ? products.filter(
          (p) =>
            p.categorySlug === 'granite-marble-natural-stone' ||
            (typeof p.category === 'object' && p.category?.slug === 'granite-marble-natural-stone') ||
            p.material.toLowerCase().includes('granite')
        ).slice(0, 5)
      : activeTab === 'wood'
      ? products.filter(
          (p) =>
            p.categorySlug === 'wood-works-wooden-doors-plywood' ||
            (typeof p.category === 'object' && p.category?.slug === 'wood-works-wooden-doors-plywood') ||
            p.material.toLowerCase().includes('wood') ||
            p.material.toLowerCase().includes('teak')
        ).slice(0, 5)
      : products.filter(
          (p) =>
            p.categorySlug === 'electrical-products-lighting-switches' ||
            (typeof p.category === 'object' && p.category?.slug === 'electrical-products-lighting-switches') ||
            p.material.toLowerCase().includes('brass') ||
            p.material.toLowerCase().includes('switch')
        ).slice(0, 5);

  return (
    <section id="section-asymmetric" className="py-14 bg-showroom-bg border-t border-showroom-border">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="ARCHITECTURAL CATALOG MASTER SPEC"
            title="CURATED SHOWROOM SPECIFICATIONS"
            subtitle="Explore all 20 master architectural materials categorized across tiles, exotic granite, seasoned teak, and designer brass electricals."
            linkText="VIEW FULL CATALOG"
            linkUrl="/catalog"
            count={filteredProducts.length}
          />
        </ScrollReveal>

        {/* Clean Discipline Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar border-b border-showroom-border">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-xs font-bold uppercase tracking-architectural whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-showroom-charcoal text-white border-showroom-charcoal shadow-sm'
                    : 'bg-white text-showroom-charcoal border-showroom-border hover:border-showroom-charcoal'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-showroom-bronze text-white' : 'bg-showroom-sand/50 text-showroom-muted'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Neat & Symmetrical Responsive Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                aspect="portrait"
                className="h-full"
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Catalog Action Bar */}
        <div className="mt-8 pt-6 border-t border-showroom-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-showroom-muted font-mono">
            Showing {filteredProducts.length} of {products.length} Curated Architectural Products (5 per Discipline)
          </span>

          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Browse Master Specification Catalog</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
