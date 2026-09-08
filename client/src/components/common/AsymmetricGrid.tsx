import React from 'react';
import { IProduct } from '../../types/index.js';
import { ProductCard } from './ProductCard.js';

interface AsymmetricGridProps {
  products: IProduct[];
}

export const AsymmetricGrid: React.FC<AsymmetricGridProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Row 1: Large Wide Lead + Stacked Column */}
      {products.length >= 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <ProductCard product={products[0]} aspect="landscape" className="h-full" />
          </div>
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {products[1] && <ProductCard product={products[1]} aspect="portrait" />}
            {products[2] && <ProductCard product={products[2]} aspect="portrait" />}
          </div>
        </div>
      )}

      {/* Row 2: 3-column architectural spread */}
      {products.length >= 6 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ProductCard product={products[3]} aspect="portrait" />
          <ProductCard product={products[4]} aspect="portrait" />
          <ProductCard product={products[5]} aspect="portrait" />
        </div>
      )}

      {/* Row 3: Inverted Large Feature (Small left + Large right) */}
      {products.length >= 8 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {products[6] && <ProductCard product={products[6]} aspect="portrait" />}
          </div>
          <div className="lg:col-span-7">
            {products[7] && <ProductCard product={products[7]} aspect="landscape" className="h-full" />}
          </div>
        </div>
      )}

      {/* Remaining items in dense 4-column layout */}
      {products.length > 8 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(8).map((p) => (
            <ProductCard key={p._id} product={p} aspect="portrait" />
          ))}
        </div>
      )}
    </div>
  );
};
