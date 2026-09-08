import React from 'react';
import { IBrand } from '../types/index.js';

interface BrandMarqueeProps {
  brands?: IBrand[];
}

const defaultBrandNames = [
  'VARMORA GRANITO',
  'KAJARIA CERAMICS',
  'SOMANY CERAMICS',
  'SCHNEIDER ELECTRIC',
  'LEGRAND ARTEOR',
  'CENTURY PLY',
  'GREENLAM VENEERS',
  'HAVELLS STUDIO',
];

export const BrandMarqueeSection: React.FC<BrandMarqueeProps> = ({ brands }) => {
  const brandList =
    brands && brands.length > 0 ? brands.map((b) => b.name) : defaultBrandNames;

  return (
    <div className="py-6 bg-[#171615] text-[#FAF9F5] overflow-hidden border-y border-showroom-charcoalLight/60">
      <div className="flex select-none whitespace-nowrap animate-none">
        <div className="flex items-center gap-8 sm:gap-14 text-xs sm:text-sm font-bold tracking-architectural uppercase text-white/75">
          {brandList.concat(brandList).map((b, i) => (
            <React.Fragment key={i}>
              <span className="hover:text-showroom-bronze transition-colors cursor-default">
                {b}
              </span>
              <span className="text-showroom-bronze text-sm font-serif">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
