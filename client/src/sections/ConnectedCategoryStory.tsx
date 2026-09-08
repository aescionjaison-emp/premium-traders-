import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Layers, ShieldCheck, Check } from 'lucide-react';
import { IProduct } from '../types/index.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { MaskReveal } from '../components/common/MaskReveal.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface ConnectedCategoryStoryProps {
  products: IProduct[];
}

export const ConnectedCategoryStory: React.FC<ConnectedCategoryStoryProps> = ({ products }) => {
  // Filter products dynamically for each category
  const graniteProducts = products
    .filter(
      (p) =>
        p.visible &&
        (p.categorySlug === 'granite-marble-natural-stone' ||
          p.material?.toLowerCase().includes('granite') ||
          p.material?.toLowerCase().includes('marble') ||
          p.material?.toLowerCase().includes('stone') ||
          p.material?.toLowerCase().includes('quartzite'))
    )
    .slice(0, 4);

  const tileProducts = products
    .filter(
      (p) =>
        p.visible &&
        (p.categorySlug === 'tiles' ||
          p.material?.toLowerCase().includes('tile') ||
          p.material?.toLowerCase().includes('porcelain') ||
          p.material?.toLowerCase().includes('vitrified') ||
          p.material?.toLowerCase().includes('ceramic'))
    )
    .slice(0, 4);

  const woodProducts = products
    .filter(
      (p) =>
        p.visible &&
        (p.categorySlug === 'wood-works-wooden-doors-plywood' ||
          p.material?.toLowerCase().includes('teak') ||
          p.material?.toLowerCase().includes('wood') ||
          p.material?.toLowerCase().includes('oak') ||
          p.material?.toLowerCase().includes('plywood') ||
          p.material?.toLowerCase().includes('veneer') ||
          p.material?.toLowerCase().includes('door'))
    )
    .slice(0, 4);

  const electricalProducts = products
    .filter(
      (p) =>
        p.visible &&
        (p.categorySlug === 'electrical-products-lighting-switches' ||
          p.material?.toLowerCase().includes('brass') ||
          p.material?.toLowerCase().includes('switch') ||
          p.material?.toLowerCase().includes('light') ||
          p.material?.toLowerCase().includes('fan'))
    )
    .slice(0, 4);

  return (
    <div className="bg-[#FAF9F5] text-showroom-charcoal">
      {/* ========================================================================= */}
      {/* 1. CHAPTER 01: GRANITE & NATURAL STONE (Heavy, Architectural, Slab Depth) */}
      {/* ========================================================================= */}
      <section id="story-granite" className="py-16 sm:py-20 border-t border-showroom-border bg-[#F5F2EB]/50">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          {/* Chapter Lead Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-showroom-border">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-showroom-bronze">
                  CHAPTER 01 / 04 • QUARRY SURFACES
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-showroom-charcoal">
                EXOTIC NATURAL GRANITE & QUARTZITE
              </h2>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-[10px] font-mono text-showroom-muted uppercase tracking-wider">
                [ 20MM GANGSAW SLABS ]
              </span>
              <Link
                to="/granite"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-showroom-charcoal hover:bg-showroom-bronze text-white text-xs font-bold uppercase tracking-wider transition-all rounded-sm"
              >
                <span>Explore All Stone</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Connected Grid: 1 Hero Visual Slab (Left) + 4 Live Dynamic Product Cards (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left Large Stone Slab Presentation */}
            <div className="lg:col-span-4 flex flex-col">
              <MaskReveal mode="curtain-up" className="h-full">
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-sm group shadow-card flex flex-col justify-between p-5">
                  <img
                    src="https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85"
                    alt="Exotic Granite Slabs"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-75"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                  {/* Top Badge */}
                  <div className="relative z-10">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10">
                      QUARRY DIRECT
                    </span>
                  </div>

                  {/* Bottom Editorial Content */}
                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-mono text-showroom-gold block mb-1">
                      HIGH-DENSITY COMPACTNESS
                    </span>
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-white mb-2">
                      Tactile Quartzite & Black Galaxy
                    </h3>
                    <p className="text-[11px] text-white/80 leading-relaxed font-sans mb-3">
                      Solid 20mm calibrated slabs for heavy-duty kitchen countertops, islands, and vanity surfaces.
                    </p>
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-white/70">
                      <span>Zero Absorption</span>
                      <span>Mirror Polish</span>
                    </div>
                  </div>
                </div>
              </MaskReveal>
            </div>

            {/* Right Dynamic Live Product Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {graniteProducts.map((p, idx) => (
                <ScrollReveal key={p._id || idx} direction="up" delay={idx * 0.08}>
                  <ProductCard product={p} aspect="portrait" className="h-full shadow-subtle" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHAPTER 02: TILES & PORCELAIN (Bright, Modern Architectural Spaces) */}
      {/* ========================================================================= */}
      <section id="story-tiles" className="py-16 sm:py-20 border-t border-showroom-border bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          {/* Chapter Lead Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-showroom-border">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-showroom-bronze">
                  CHAPTER 02 / 04 • MONUMENTAL FORMATS
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-showroom-charcoal">
                LARGE FORMAT TILES & PORCELAIN
              </h2>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-[10px] font-mono text-showroom-muted uppercase tracking-wider">
                [ 1200×2400 MM BOOKMATCH ]
              </span>
              <Link
                to="/tiles"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-showroom-charcoal hover:bg-showroom-bronze text-white text-xs font-bold uppercase tracking-wider transition-all rounded-sm"
              >
                <span>Explore All Tiles</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Connected Grid: 4 Live Product Cards (Left) + 1 Interior Transformation (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left Dynamic Live Product Cards Grid */}
            <div className="lg:col-span-8 order-2 lg:order-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {tileProducts.map((p, idx) => (
                <ScrollReveal key={p._id || idx} direction="up" delay={idx * 0.08}>
                  <ProductCard product={p} aspect="portrait" className="h-full shadow-subtle" />
                </ScrollReveal>
              ))}
            </div>

            {/* Right Large Tile Interior Reveal */}
            <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col">
              <MaskReveal mode="curtain-side" className="h-full">
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-sm group shadow-card flex flex-col justify-between p-5">
                  <img
                    src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85"
                    alt="Porcelain Slabs"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                  <div className="relative z-10">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10">
                      VITRIFIED PORCELAIN
                    </span>
                  </div>

                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-mono text-showroom-gold block mb-1">
                      SEAMLESS FLOOR & WALL FLOW
                    </span>
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-white mb-2">
                      Continuous Vein Vitrified Slabs
                    </h3>
                    <p className="text-[11px] text-white/80 leading-relaxed font-sans mb-3">
                      Ultra-low grout joints with high-definition Italian glaze aesthetics for living and bathroom suites.
                    </p>
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-white/70">
                      <span>9mm Profile</span>
                      <span>Stain Immune</span>
                    </div>
                  </div>
                </div>
              </MaskReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CHAPTER 03: WOOD WORKS & DOORS (Warm, Craft-Focused, Architectural) */}
      {/* ========================================================================= */}
      <section id="story-wood" className="py-16 sm:py-20 border-t border-showroom-border bg-[#F6F3EC]/70">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          {/* Chapter Lead Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-showroom-border">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-showroom-bronze">
                  CHAPTER 03 / 04 • HARDWOOD & JOINERY
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-showroom-charcoal">
                FINE WOODWORKS & BURMA TEAK DOORS
              </h2>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-[10px] font-mono text-showroom-muted uppercase tracking-wider">
                [ SEASONED TEAK & MARINE PLY ]
              </span>
              <Link
                to="/wood"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-showroom-charcoal hover:bg-showroom-bronze text-white text-xs font-bold uppercase tracking-wider transition-all rounded-sm"
              >
                <span>Explore Woodworks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Connected Grid: 1 Hero Visual Door (Left) + 4 Live Dynamic Product Cards (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left Woodwork Craftsmanship Presentation */}
            <div className="lg:col-span-4 flex flex-col">
              <MaskReveal mode="curtain-up" className="h-full">
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-sm group shadow-card flex flex-col justify-between p-5">
                  <img
                    src="https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85"
                    alt="Fine Woodworks"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                  <div className="relative z-10">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10">
                      SEASONED HARDWOOD
                    </span>
                  </div>

                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-mono text-showroom-gold block mb-1">
                      ARCHITECTURAL JOINERY
                    </span>
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-white mb-2">
                      Master Entrance Portals & Fluted Panelling
                    </h3>
                    <p className="text-[11px] text-white/80 leading-relaxed font-sans mb-3">
                      Solid Burma teak pivot portals, calibrated 710 marine plywood sheets, and acoustic fluted slat systems.
                    </p>
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-white/70">
                      <span>Bespoke Dimensions</span>
                      <span>PU Matte Finish</span>
                    </div>
                  </div>
                </div>
              </MaskReveal>
            </div>

            {/* Right Dynamic Live Product Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {woodProducts.map((p, idx) => (
                <ScrollReveal key={p._id || idx} direction="up" delay={idx * 0.08}>
                  <ProductCard product={p} aspect="portrait" className="h-full shadow-subtle" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CHAPTER 04: ELECTRICAL APPARATUS (Minimal, Modern, Modular Brass) */}
      {/* ========================================================================= */}
      <section id="story-electrical" className="py-16 sm:py-20 border-t border-showroom-border bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          {/* Chapter Lead Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-showroom-border">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-showroom-bronze">
                  CHAPTER 04 / 04 • PRECISION APPARATUS
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-showroom-charcoal">
                LUXURY SWITCHES & ARCHITECTURAL LIGHTING
              </h2>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="text-[10px] font-mono text-showroom-muted uppercase tracking-wider">
                [ SOLID BRASS & 48V TRACKS ]
              </span>
              <Link
                to="/electrical"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-showroom-charcoal hover:bg-showroom-bronze text-white text-xs font-bold uppercase tracking-wider transition-all rounded-sm"
              >
                <span>Explore Electrical</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Connected Grid: 4 Live Product Cards (Left) + 1 Precision Apparatus Detail (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left Dynamic Live Product Cards Grid */}
            <div className="lg:col-span-8 order-2 lg:order-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {electricalProducts.map((p, idx) => (
                <ScrollReveal key={p._id || idx} direction="up" delay={idx * 0.08}>
                  <ProductCard product={p} aspect="portrait" className="h-full shadow-subtle" />
                </ScrollReveal>
              ))}
            </div>

            {/* Right Precision Switchplate Presentation */}
            <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col">
              <MaskReveal mode="curtain-side" className="h-full">
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-sm group shadow-card flex flex-col justify-between p-5">
                  <img
                    src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85"
                    alt="Luxury Switches"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                  <div className="relative z-10">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10">
                      CNC SOLID METAL
                    </span>
                  </div>

                  <div className="relative z-10 text-white">
                    <span className="text-[9px] font-mono text-showroom-gold block mb-1">
                      TACTILE MICRO-SWITCHGEAR
                    </span>
                    <h3 className="font-serif text-lg font-bold uppercase tracking-tight text-white mb-2">
                      Brushed Brass & Magnetic Track Light
                    </h3>
                    <p className="text-[11px] text-white/80 leading-relaxed font-sans mb-3">
                      Solid brass switch plates, low-voltage magnetic track modules, and whisper-quiet BLDC architectural fans.
                    </p>
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-mono text-white/70">
                      <span>Modular Sockets</span>
                      <span>High CRI 95+</span>
                    </div>
                  </div>
                </div>
              </MaskReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
