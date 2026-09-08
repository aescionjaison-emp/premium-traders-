import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ICollection } from '../types/index.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface CollectionsSectionProps {
  collections: ICollection[];
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ collections }) => {
  const displayCols = collections.filter((c) => c.visible).slice(0, 3);

  return (
    <section className="py-14 bg-showroom-bg">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="CURATED SUITES"
            title="MASTER COLLECTIONS"
            linkText="VIEW ALL SUITES"
            linkUrl="/catalog?view=collections"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {displayCols.map((col, idx) => (
            <ScrollReveal key={col._id || idx} direction="clip" delay={idx * 0.1}>
              <Link
                to={`/catalog?collection=${encodeURIComponent(col.name)}`}
                className="group relative bg-white border border-showroom-border overflow-hidden hover:border-showroom-charcoal hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-showroom-sand">
                  <img
                    src={
                      col.image && !col.image.includes('photo-1600585154340') && !col.image.includes('photo-1600596542815') && !col.image.includes('photo-1618221195710')
                        ? col.image
                        : [
                            'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85',
                            'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=800&q=85',
                            'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=85',
                            'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=85',
                          ][idx % 4]
                    }
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-bronze block mb-0.5">
                        SUITE 0{idx + 1}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold uppercase tracking-tight leading-snug">
                        {col.name}
                      </h3>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-showroom-bronze group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
