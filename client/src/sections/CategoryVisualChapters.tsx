import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { IProduct, ICategoryChapters, ICategoryChapterItem } from '../types/index.js';
import { MASTER_SHOWROOM_PRODUCTS } from '../data/showroomCatalogData.js';
import { ProductCard } from '../components/common/ProductCard.js';
import { MaskReveal } from '../components/common/MaskReveal.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface CategoryVisualChaptersProps {
  products: IProduct[];
  chapters?: ICategoryChapters;
}

export const CategoryVisualChapters: React.FC<CategoryVisualChaptersProps> = ({ products, chapters }) => {
  const allProducts = (products && products.length > 0) ? products : MASTER_SHOWROOM_PRODUCTS;

  const graniteData: ICategoryChapterItem = chapters?.granite || {
    id: 'granite',
    num: '01',
    name: 'Granite Collection',
    tagline: 'Natural Stone',
    desc: '',
    coverImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Polished', 'Honed', 'Leathered'],
  };

  const tileData: ICategoryChapterItem = chapters?.tiles || {
    id: 'tiles',
    num: '02',
    name: 'Tile Collection',
    tagline: 'Modern Surfaces',
    desc: '',
    coverImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Glossy', 'Satin Matt', 'Carving'],
  };

  const woodData: ICategoryChapterItem = chapters?.wood || {
    id: 'wood',
    num: '03',
    name: 'Wood Collection',
    tagline: 'Crafted Wood',
    desc: '',
    coverImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Natural Teak', 'Smoked Oak', 'Veneer'],
  };

  const electricalData: ICategoryChapterItem = chapters?.electrical || {
    id: 'electrical',
    num: '04',
    name: 'Electrical Collection',
    tagline: 'Smart Essentials',
    desc: '',
    coverImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    textureImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    spaceImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85',
    finishes: ['Brushed Brass', 'Matte Black', 'Touch Glass'],
  };

  const defaultGraniteProds = MASTER_SHOWROOM_PRODUCTS.filter(
    (p) =>
      p.categorySlug === 'granite-marble-natural-stone' ||
      p.categorySlug === 'granite' ||
      p.sku?.startsWith('GRN') ||
      p.material?.toLowerCase().includes('granite')
  ).slice(0, 4);

  const defaultTileProds = MASTER_SHOWROOM_PRODUCTS.filter(
    (p) =>
      p.categorySlug === 'tiles' ||
      p.sku?.startsWith('TIL') ||
      p.material?.toLowerCase().includes('porcelain')
  ).slice(0, 4);

  const defaultWoodProds = MASTER_SHOWROOM_PRODUCTS.filter(
    (p) =>
      p.categorySlug === 'wood-works-wooden-doors-plywood' ||
      p.categorySlug === 'wood' ||
      p.sku?.startsWith('WOD') ||
      p.material?.toLowerCase().includes('teak')
  ).slice(0, 4);

  const defaultElecProds = MASTER_SHOWROOM_PRODUCTS.filter(
    (p) =>
      p.categorySlug === 'electrical-products-lighting-switches' ||
      p.categorySlug === 'electrical' ||
      p.sku?.startsWith('ELC') ||
      p.name?.toLowerCase().includes('switch') ||
      p.name?.toLowerCase().includes('track') ||
      p.name?.toLowerCase().includes('fan') ||
      p.name?.toLowerCase().includes('downlight')
  ).slice(0, 4);

  let graniteProducts = allProducts
    .filter(
      (p) =>
        p.visible !== false &&
        (p.categorySlug === 'granite-marble-natural-stone' ||
          p.categorySlug === 'granite' ||
          (typeof p.category === 'object' && (p.category?.slug === 'granite-marble-natural-stone' || p.category?.slug === 'granite' || p.category?._id === 'cat-granite')) ||
          p.category === 'cat-granite' ||
          p.sku?.startsWith('GRN') ||
          p.material?.toLowerCase().includes('granite') ||
          p.material?.toLowerCase().includes('marble') ||
          p.material?.toLowerCase().includes('stone') ||
          p.material?.toLowerCase().includes('quartzite'))
    )
    .slice(0, 4);
  if (graniteProducts.length < 4) graniteProducts = defaultGraniteProds;

  let tileProducts = allProducts
    .filter(
      (p) =>
        p.visible !== false &&
        (p.categorySlug === 'tiles' ||
          (typeof p.category === 'object' && (p.category?.slug === 'tiles' || p.category?._id === 'cat-tiles')) ||
          p.category === 'cat-tiles' ||
          p.sku?.startsWith('TIL') ||
          p.material?.toLowerCase().includes('tile') ||
          p.material?.toLowerCase().includes('porcelain') ||
          p.material?.toLowerCase().includes('vitrified') ||
          p.material?.toLowerCase().includes('ceramic'))
    )
    .slice(0, 4);
  if (tileProducts.length < 4) tileProducts = defaultTileProds;

  let woodProducts = allProducts
    .filter(
      (p) =>
        p.visible !== false &&
        (p.categorySlug === 'wood-works-wooden-doors-plywood' ||
          p.categorySlug === 'wood' ||
          (typeof p.category === 'object' && (p.category?.slug === 'wood-works-wooden-doors-plywood' || p.category?.slug === 'wood' || p.category?._id === 'cat-wood')) ||
          p.category === 'cat-wood' ||
          p.sku?.startsWith('WOD') ||
          p.material?.toLowerCase().includes('teak') ||
          p.material?.toLowerCase().includes('wood') ||
          p.material?.toLowerCase().includes('oak') ||
          p.material?.toLowerCase().includes('plywood') ||
          p.material?.toLowerCase().includes('veneer') ||
          p.material?.toLowerCase().includes('door'))
    )
    .slice(0, 4);
  if (woodProducts.length < 4) woodProducts = defaultWoodProds;

  let electricalProducts = allProducts
    .filter(
      (p) =>
        p.visible !== false &&
        (p.categorySlug === 'electrical-products-lighting-switches' ||
          p.categorySlug === 'electrical' ||
          (typeof p.category === 'object' && (p.category?.slug === 'electrical-products-lighting-switches' || p.category?.slug === 'electrical' || p.category?._id === 'cat-elec')) ||
          p.category === 'cat-elec' ||
          p.sku?.startsWith('ELC') ||
          p.name?.toLowerCase().includes('switch') ||
          p.name?.toLowerCase().includes('track') ||
          p.name?.toLowerCase().includes('fan') ||
          p.name?.toLowerCase().includes('downlight') ||
          p.name?.toLowerCase().includes('lighting') ||
          p.material?.toLowerCase().includes('brass') ||
          p.material?.toLowerCase().includes('switch') ||
          p.material?.toLowerCase().includes('light') ||
          p.material?.toLowerCase().includes('fan'))
    )
    .slice(0, 4);
  if (electricalProducts.length < 4) electricalProducts = defaultElecProds;

  return (
    <div className="bg-[#FAF9F5] text-showroom-charcoal">
      {/* ========================================================================= */}
      {/* 1. GRANITE: STONE SLAB → TEXTURE → KITCHEN → PRODUCT COLLECTION */}
      {/* ========================================================================= */}
      <section id="chapter-granite" className="py-14 sm:py-16 border-t border-showroom-border bg-[#F5F2EB]/60">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-showroom-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-showroom-bronze">01 /</span>
              <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
                {graniteData.name || 'Granite Collection'}
              </h2>
            </div>
            <Link
              to="/granite"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-showroom-bronze hover:underline"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 70% Visual Layout: Large Stone Slab + 4 Dynamic Live Product Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* Left Large Slab Visual Mask */}
            <div className="lg:col-span-4 flex flex-col">
              <MaskReveal mode="curtain-up" className="h-full">
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-[5px] group shadow-card flex flex-col justify-between p-4">
                  <img
                    src={graniteData.coverImage || graniteData.image || graniteData.textureImage || graniteData.spaceImage || "https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85"}
                    alt={graniteData.tagline || graniteData.subLabel || "Natural Stone"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 rounded-[5px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />

                  <span className="relative z-10 text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10 w-fit rounded-[5px]">
                    {graniteData.tagline || graniteData.subLabel || "Natural Stone"}
                  </span>

                  <div className="relative z-10 text-white">
                    <h3 className="font-serif text-base font-bold uppercase tracking-tight text-white">
                      {graniteData.name || graniteData.heading || 'Granite Collection'}
                    </h3>
                  </div>
                </div>
              </MaskReveal>
            </div>

            {/* Right Live Product Cards */}
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
      {/* 2. TILES: TILE PATTERN → EXPANSIVE LIVING SPACE → PRODUCT COLLECTION */}
      {/* ========================================================================= */}
      <section id="chapter-tiles" className="py-14 sm:py-16 border-t border-showroom-border bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-showroom-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-showroom-bronze">02 /</span>
              <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
                {tileData.name || tileData.heading || 'Tile Collection'}
              </h2>
            </div>
            <Link
              to={tileData.link || "/tiles"}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-showroom-bronze hover:underline"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* Left Dynamic Live Product Cards */}
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
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-[5px] group shadow-card flex flex-col justify-between p-4">
                  <img
                    src={tileData.coverImage || tileData.image || tileData.spaceImage || tileData.textureImage || "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85"}
                    alt={tileData.tagline || tileData.subLabel || "Modern Surfaces"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 rounded-[5px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />

                  <span className="relative z-10 text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10 w-fit rounded-[5px]">
                    {tileData.tagline || tileData.subLabel || "Modern Surfaces"}
                  </span>

                  <div className="relative z-10 text-white">
                    <h3 className="font-serif text-base font-bold uppercase tracking-tight text-white">
                      {tileData.name || tileData.heading || 'Tile Collection'}
                    </h3>
                  </div>
                </div>
              </MaskReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WOOD WORK: GRAIN TEXTURE → CAMERA ZOOM-OUT → MASTER ENTRANCE DOOR */}
      {/* ========================================================================= */}
      <section id="chapter-wood" className="py-14 sm:py-16 border-t border-showroom-border bg-[#F6F3EC]/70">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-showroom-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-showroom-bronze">03 /</span>
              <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
                {woodData.name || woodData.heading || 'Wood Collection'}
              </h2>
            </div>
            <Link
              to={woodData.link || "/wood"}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-showroom-bronze hover:underline"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* Left Woodwork Craftsmanship Presentation */}
            <div className="lg:col-span-4 flex flex-col">
              <MaskReveal mode="curtain-up" className="h-full">
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-[5px] group shadow-card flex flex-col justify-between p-4">
                  <img
                    src={woodData.coverImage || woodData.image || woodData.textureImage || woodData.spaceImage || "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85"}
                    alt={woodData.tagline || woodData.subLabel || "Crafted Wood"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 rounded-[5px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />

                  <span className="relative z-10 text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10 w-fit rounded-[5px]">
                    {woodData.tagline || woodData.subLabel || "Crafted Wood"}
                  </span>

                  <div className="relative z-10 text-white">
                    <h3 className="font-serif text-base font-bold uppercase tracking-tight text-white">
                      {woodData.name || woodData.heading || 'Wood Collection'}
                    </h3>
                  </div>
                </div>
              </MaskReveal>
            </div>

            {/* Right Dynamic Live Product Cards */}
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
      {/* 4. ELECTRICAL: CLEAN PRODUCT REVEAL IN MODERN ROOM */}
      {/* ========================================================================= */}
      <section id="chapter-electrical" className="py-14 sm:py-16 border-t border-showroom-border bg-[#FAF9F5]">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-showroom-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-showroom-bronze">04 /</span>
              <h2 className="font-serif text-lg sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
                {electricalData.name || electricalData.heading || 'Electrical Collection'}
              </h2>
            </div>
            <Link
              to={electricalData.link || "/electrical"}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-showroom-bronze hover:underline"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
            {/* Left Dynamic Live Product Cards */}
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
                <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full bg-showroom-charcoal border border-showroom-border overflow-hidden rounded-[5px] group shadow-card flex flex-col justify-between p-4">
                  <img
                    src={electricalData.coverImage || electricalData.image || electricalData.spaceImage || electricalData.textureImage || "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85"}
                    alt={electricalData.tagline || electricalData.subLabel || "Smart Essentials"}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 rounded-[5px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-[5px]" />

                  <span className="relative z-10 text-[9px] font-mono font-bold tracking-wider uppercase text-showroom-gold bg-black/70 px-2 py-0.5 border border-white/10 w-fit rounded-[5px]">
                    {electricalData.tagline || "Smart Essentials"}
                  </span>

                  <div className="relative z-10 text-white">
                    <h3 className="font-serif text-base font-bold uppercase tracking-tight text-white">
                      {electricalData.name || 'Electrical Collection'}
                    </h3>
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

