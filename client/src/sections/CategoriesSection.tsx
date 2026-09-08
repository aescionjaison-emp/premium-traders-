import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ICategory } from '../types/index.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface CategoriesSectionProps {
  categories: ICategory[];
}

const defaultDisciplines = [
  {
    _id: 'cat-tiles',
    name: 'Tiles & Slabs',
    slug: 'tiles',
    itemCount: 5,
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85',
    url: '/tiles',
  },
  {
    _id: 'cat-granite',
    name: 'Granite & Natural Stone',
    slug: 'granite-marble-natural-stone',
    itemCount: 5,
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=800&q=85',
    url: '/granite',
  },
  {
    _id: 'cat-wood',
    name: 'Wood Works & Doors',
    slug: 'wood-works-wooden-doors-plywood',
    itemCount: 5,
    image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=85',
    url: '/wood',
  },
  {
    _id: 'cat-elec',
    name: 'Electrical & Lighting',
    slug: 'electrical-products-lighting-switches',
    itemCount: 5,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=85',
    url: '/electrical',
  },
];

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const cats =
    categories && categories.length > 0
      ? categories.filter((c) => c.visible).slice(0, 4)
      : defaultDisciplines;

  return (
    <section className="py-8 bg-showroom-bg">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="CURATED SHOWROOM DISCIPLINES"
            title="SELECT DISCIPLINE (5 PRODUCTS EACH)"
            linkText="VIEW ALL 20 PRODUCTS"
            linkUrl="/catalog"
          />
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cats.map((cat, idx) => {
            const url =
              cat.slug === 'tiles'
                ? '/tiles'
                : cat.slug === 'granite-marble-natural-stone' || cat.slug === 'granite'
                ? '/granite'
                : cat.slug === 'wood-works-wooden-doors-plywood' || cat.slug === 'wood'
                ? '/wood'
                : cat.slug === 'electrical-products-lighting-switches' || cat.slug === 'electrical'
                ? '/electrical'
                : `/catalog?category=${cat._id}`;

            const imgSrc =
              cat.image && !cat.image.includes('photo-1600585154340') && !cat.image.includes('photo-1600596542815') && !cat.image.includes('photo-1618221195710')
                ? cat.image
                : cat.slug === 'tiles'
                ? 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85'
                : cat.slug === 'granite-marble-natural-stone' || cat.slug === 'granite'
                ? 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=800&q=85'
                : cat.slug === 'wood-works-wooden-doors-plywood' || cat.slug === 'wood'
                ? 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=85'
                : 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=85';

            return (
              <ScrollReveal key={cat._id || idx} direction="clip" delay={idx * 0.08}>
                <Link
                  to={url}
                  className="group relative bg-white border border-showroom-border overflow-hidden hover:border-showroom-charcoal hover:shadow-card transition-all flex flex-col justify-between"
                >
                  {/* Pure Visual Image Canvas */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-showroom-ivory">
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-white/80 bg-black/60 px-2 py-0.5 border border-white/10">
                        0{idx + 1}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-showroom-gold bg-black/60 px-2 py-0.5 border border-white/10">
                        5 PRODUCTS
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                      <div>
                        <h3 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-tight">
                          {cat.name}
                        </h3>
                        <span className="text-[9px] text-white/70 font-mono block mt-0.5">
                          5 Curated Specs
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-showroom-bronze group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
