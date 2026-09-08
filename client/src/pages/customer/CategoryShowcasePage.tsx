import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/endpoints.js';
import { IProduct, ICategory } from '../../types/index.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { CatalogSkeleton } from '../../components/common/SkeletonLoader.js';
import { SectionHeading } from '../../components/common/SectionHeading.js';

interface CategoryShowcaseProps {
  forcedSlug?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
}

export const CategoryShowcasePage: React.FC<CategoryShowcaseProps> = ({
  forcedSlug,
  defaultTitle,
  defaultSubtitle,
}) => {
  const { slug } = useParams<{ slug?: string }>();
  const activeSlug = forcedSlug || slug || 'tiles';

  const [products, setProducts] = useState<IProduct[]>([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFinish, setSelectedFinish] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const querySlug =
        activeSlug === 'tiles'
          ? 'tiles'
          : activeSlug === 'granite'
          ? 'granite-marble-natural-stone'
          : activeSlug === 'wood'
          ? 'wood-works-wooden-doors-plywood'
          : activeSlug === 'electrical'
          ? 'electrical-products-lighting-switches'
          : activeSlug;

      try {
        const [catRes, prodsRes] = await Promise.all([
          api.getCategoryBySlug(querySlug).catch(() => ({ data: { success: false, data: null } })),
          api.getProducts({ categorySlug: querySlug, limit: 60 }),
        ]);

        const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');
        const fallbackList = MASTER_SHOWROOM_PRODUCTS.filter(
          (p) =>
            p.categorySlug === querySlug ||
            (typeof p.category === 'object' && p.category?.slug === querySlug)
        ).slice(0, 5);

        if (catRes.data.success && catRes.data.data) setCategory(catRes.data.data);

        if (prodsRes.data.success && prodsRes.data.data && prodsRes.data.data.length > 0) {
          const matched = prodsRes.data.data
            .map((p) => {
              const match = MASTER_SHOWROOM_PRODUCTS.find(
                (m) => m.name.toUpperCase().trim() === p.name.toUpperCase().trim() || m.sku === p.sku
              );
              return match ? { ...p, images: match.images, color: match.color || p.color } : p;
            })
            .filter((p) =>
              fallbackList.some(
                (f) => f.name.toUpperCase().trim() === p.name.toUpperCase().trim() || f.sku === p.sku
              )
            )
            .slice(0, 5);

          setProducts(matched.length === 5 ? matched : fallbackList);
        } else {
          setProducts(fallbackList);
        }
      } catch (e) {
        console.error('Error fetching showcase:', e);
        const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');
        const fallbackList = MASTER_SHOWROOM_PRODUCTS.filter(
          (p) =>
            p.categorySlug === querySlug ||
            (typeof p.category === 'object' && p.category?.slug === querySlug)
        ).slice(0, 5);
        setProducts(fallbackList);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeSlug]);

  const uniqueFinishes = Array.from(new Set(products.map((p) => p.finish))).filter(Boolean);

  const filteredProducts = selectedFinish
    ? products.filter((p) => p.finish === selectedFinish)
    : products;

  const title = defaultTitle || category?.name || activeSlug.toUpperCase();
  const subtitle =
    defaultSubtitle ||
    category?.description ||
    'High specification architectural materials curated for Indian master architecture.';

  return (
    <div className="min-h-screen bg-showroom-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Category Header */}
        <div className="pb-8 mb-8 border-b border-showroom-border">
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-1">
            SHOWROOM DISCIPLINE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-showroom-charcoal">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-showroom-muted mt-2 max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          {/* Quick Sub-Filter by Finish */}
          {uniqueFinishes.length > 0 && (
            <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 hide-scrollbar">
              <button
                onClick={() => setSelectedFinish('')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border shrink-0 transition-all ${
                  !selectedFinish
                    ? 'bg-showroom-charcoal text-white border-showroom-charcoal'
                    : 'bg-white text-showroom-charcoal border-showroom-border hover:border-showroom-charcoal'
                }`}
              >
                All Finishes ({products.length})
              </button>
              {uniqueFinishes.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFinish(selectedFinish === f ? '' : f)}
                  className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border shrink-0 transition-all ${
                    selectedFinish === f
                      ? 'bg-showroom-bronze text-white border-showroom-bronze'
                      : 'bg-white text-showroom-charcoal border-showroom-border hover:border-showroom-charcoal'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <CatalogSkeleton count={8} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} aspect="portrait" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-showroom-border">
            <p className="font-serif text-base font-bold uppercase text-showroom-charcoal">
              No products found in this category
            </p>
            <Link
              to="/catalog"
              className="mt-3 inline-block text-xs uppercase font-bold text-showroom-bronze hover:underline"
            >
              Browse Full Catalog →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
