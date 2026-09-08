import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-showroom-border p-3 animate-pulse flex flex-col justify-between">
      <div className="aspect-[4/5] w-full bg-showroom-sand/70 mb-3" />
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-showroom-sand/80" />
        <div className="h-4 w-3/4 bg-showroom-sandDark/70" />
      </div>
    </div>
  );
};

export const CatalogSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
