import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  X,
  Search,
  Grid3X3,
  LayoutGrid,
  RotateCcw,
  Check,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IProduct, ICategory, ICollection } from '../../types/index.js';
import { ProductCard } from '../../components/common/ProductCard.js';
import { CatalogSkeleton } from '../../components/common/SkeletonLoader.js';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [filterOptions, setFilterOptions] = useState<{
    finishes: string[];
    materials: string[];
    sizes: string[];
    surfaces: string[];
    colors: string[];
    brands: string[];
    applications: string[];
  }>({
    finishes: [],
    materials: [],
    sizes: [],
    surfaces: [],
    colors: [],
    brands: [],
    applications: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedFinish, setSelectedFinish] = useState<string>(searchParams.get('finish') || '');
  const [selectedMaterial, setSelectedMaterial] = useState<string>(searchParams.get('material') || '');
  const [selectedSize, setSelectedSize] = useState<string>(searchParams.get('size') || '');
  const [selectedSurface, setSelectedSurface] = useState<string>(searchParams.get('surface') || '');
  const [selectedColor, setSelectedColor] = useState<string>(searchParams.get('color') || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || '');
  const [selectedCollection, setSelectedCollection] = useState<string>(searchParams.get('collection') || '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'featured');

  useEffect(() => {
    const init = async () => {
      try {
        const [catsRes, colsRes, filtersRes] = await Promise.all([
          api.getCategories({ visibleOnly: true }),
          api.getCollections({ visibleOnly: true }),
          api.getFilterOptions(),
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.data);
        if (colsRes.data.success) setCollections(colsRes.data.data);
        if (filtersRes.data.success) setFilterOptions(filtersRes.data.data);
      } catch (e) {
        console.error('Failed to load filter metadata:', e);
      }
    };
    init();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, any> = {
          limit: 100,
          sort: sortBy,
        };
        if (selectedCategory) params.category = selectedCategory;
        if (selectedFinish) params.finish = selectedFinish;
        if (selectedMaterial) params.material = selectedMaterial;
        if (selectedSize) params.size = selectedSize;
        if (selectedSurface) params.surface = selectedSurface;
        if (selectedColor) params.color = selectedColor;
        if (selectedBrand) params.brand = selectedBrand;
        if (selectedCollection) params.collection = selectedCollection;
        const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');

        const res = await api.getProducts(params);
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          const hydrated = res.data.data
            .map(p => {
              const match = MASTER_SHOWROOM_PRODUCTS.find(
                m => m.name.toUpperCase().trim() === p.name.toUpperCase().trim() || m.sku === p.sku
              );
              return match ? { ...p, images: match.images, color: match.color || p.color } : null;
            })
            .filter(Boolean) as IProduct[];

          if (hydrated.length > 0) {
            setProducts(hydrated);
          } else {
            let filtered = [...MASTER_SHOWROOM_PRODUCTS];
            if (selectedCategory) {
              filtered = filtered.filter(
                (p) =>
                  p.categorySlug === selectedCategory ||
                  (typeof p.category === 'object' && p.category?._id === selectedCategory) ||
                  p.category === selectedCategory
              );
            }
            if (selectedFinish) {
              filtered = filtered.filter((p) => p.finish === selectedFinish);
            }
            if (selectedMaterial) {
              filtered = filtered.filter((p) =>
                p.material.toLowerCase().includes(selectedMaterial.toLowerCase())
              );
            }
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              filtered = filtered.filter(
                (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
              );
            }
            setProducts(filtered);
          }
        } else {
          const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');
          let filtered = [...MASTER_SHOWROOM_PRODUCTS];
          if (selectedCategory) {
            filtered = filtered.filter(
              (p) =>
                p.categorySlug === selectedCategory ||
                (typeof p.category === 'object' && p.category?._id === selectedCategory) ||
                p.category === selectedCategory
            );
          }
          if (selectedFinish) {
            filtered = filtered.filter((p) => p.finish === selectedFinish);
          }
          if (selectedMaterial) {
            filtered = filtered.filter((p) =>
              p.material.toLowerCase().includes(selectedMaterial.toLowerCase())
            );
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
              (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
            );
          }
          setProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
        const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');
        setProducts(MASTER_SHOWROOM_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [
    selectedCategory,
    selectedFinish,
    selectedMaterial,
    selectedSize,
    selectedSurface,
    selectedColor,
    selectedBrand,
    selectedCollection,
    searchQuery,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedFinish('');
    setSelectedMaterial('');
    setSelectedSize('');
    setSelectedSurface('');
    setSelectedColor('');
    setSelectedBrand('');
    setSelectedCollection('');
    setSearchQuery('');
    setSortBy('featured');
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedFinish,
    selectedMaterial,
    selectedSize,
    selectedSurface,
    selectedColor,
    selectedBrand,
    selectedCollection,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-showroom-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Catalog Header */}
        <div className="pb-6 mb-6 border-b border-showroom-border flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-1">
              ARCHITECTURAL SPECIFICATION CATALOG
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-showroom-charcoal">
              EXPLORE ALL MATERIALS
            </h1>
            <p className="text-xs text-showroom-muted mt-1 max-w-xl">
              Filter by surface application, dimensions, finishes, and stone varieties with instant layout reflow.
            </p>
          </div>

          {/* Search and Grid Mode Controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <div className="relative">
              <input
                type="text"
                placeholder="Search SKU or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-showroom-border pl-8 pr-3 py-1.5 text-xs text-showroom-charcoal focus:outline-none focus:border-showroom-charcoal w-44 sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-showroom-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-showroom-muted hover:text-showroom-charcoal"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Desktop Grid Switch */}
            <div className="hidden lg:flex items-center border border-showroom-border bg-white rounded-[5px] overflow-hidden">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 ${gridCols === 3 ? 'bg-showroom-charcoal text-white' : 'text-showroom-muted hover:text-showroom-charcoal'}`}
                title="3 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 ${gridCols === 4 ? 'bg-showroom-charcoal text-white' : 'text-showroom-muted hover:text-showroom-charcoal'}`}
                title="4 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-showroom-charcoal text-white text-xs font-bold uppercase tracking-wider rounded-[5px]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
          </div>
        </div>

        {/* Horizontal Quick Filter Pills (Categories) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest shrink-0 transition-all border rounded-[5px] ${
              !selectedCategory
                ? 'bg-showroom-charcoal text-white border-showroom-charcoal'
                : 'bg-white text-showroom-charcoal border-showroom-border hover:border-showroom-charcoal'
            }`}
          >
            All Disciplines ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(selectedCategory === cat._id ? '' : cat._id)}
              className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest shrink-0 transition-all border rounded-[5px] ${
                selectedCategory === cat._id
                  ? 'bg-showroom-bronze text-white border-showroom-bronze'
                  : 'bg-white text-showroom-charcoal border-showroom-border hover:border-showroom-charcoal'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Main Catalog Layout (Sidebar Filters + Animated Product Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-5 border border-showroom-border self-start sticky top-24 rounded-[5px]">
            <div className="flex items-center justify-between pb-3 border-b border-showroom-border">
              <span className="text-xs font-bold uppercase tracking-widest text-showroom-charcoal flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-showroom-bronze" />
                <span>Filters</span>
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[10px] uppercase font-bold text-showroom-bronze hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-muted mb-1.5">
                Sort Sequence
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-showroom-bg border border-showroom-border px-2.5 py-1.5 text-xs text-showroom-charcoal focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="name_asc">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Finish Filter */}
            {filterOptions.finishes.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-muted mb-1.5">
                  Surface Finish
                </label>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {filterOptions.finishes.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(selectedFinish === finish ? '' : finish)}
                      className={`w-full text-left px-2 py-1 text-xs uppercase flex items-center justify-between transition-colors ${
                        selectedFinish === finish
                          ? 'bg-showroom-charcoal text-white font-bold'
                          : 'hover:bg-showroom-sand/50 text-showroom-charcoal'
                      }`}
                    >
                      <span>{finish}</span>
                      {selectedFinish === finish && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions / Size Filter */}
            {filterOptions.sizes.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-muted mb-1.5">
                  Dimensions & Slabs
                </label>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {filterOptions.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`w-full text-left px-2 py-1 text-xs uppercase flex items-center justify-between transition-colors ${
                        selectedSize === size
                          ? 'bg-showroom-charcoal text-white font-bold'
                          : 'hover:bg-showroom-sand/50 text-showroom-charcoal'
                      }`}
                    >
                      <span className="truncate">{size}</span>
                      {selectedSize === size && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Material Filter */}
            {filterOptions.materials.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-muted mb-1.5">
                  Material Composition
                </label>
                <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                  {filterOptions.materials.map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(selectedMaterial === mat ? '' : mat)}
                      className={`w-full text-left px-2 py-1 text-xs uppercase flex items-center justify-between transition-colors ${
                        selectedMaterial === mat
                          ? 'bg-showroom-charcoal text-white font-bold'
                          : 'hover:bg-showroom-sand/50 text-showroom-charcoal'
                      }`}
                    >
                      <span>{mat}</span>
                      {selectedMaterial === mat && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Filter */}
            {filterOptions.brands.length > 0 && (
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-muted mb-1.5">
                  Brand Partner
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {filterOptions.brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                      className={`w-full text-left px-2 py-1 text-xs uppercase flex items-center justify-between transition-colors ${
                        selectedBrand === b
                          ? 'bg-showroom-charcoal text-white font-bold'
                          : 'hover:bg-showroom-sand/50 text-showroom-charcoal'
                      }`}
                    >
                      <span>{b}</span>
                      {selectedBrand === b && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Grid Area (9 cols) */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <CatalogSkeleton count={8} />
            ) : products.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-4 ${
                  gridCols === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                <AnimatePresence>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} aspect="portrait" />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-white border border-showroom-border p-8">
                <p className="font-serif text-lg font-bold uppercase text-showroom-charcoal">
                  No materials match the selected criteria
                </p>
                <p className="text-xs text-showroom-muted mt-1 max-w-sm mx-auto">
                  Try adjusting the surface finish, dimensions, or clearing the search query.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-5 py-2.5 bg-showroom-charcoal text-white text-xs font-bold uppercase tracking-widest"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-showroom-border">
                <span className="font-serif text-base font-bold uppercase text-showroom-charcoal">
                  Filter Catalog
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-showroom-muted hover:text-showroom-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-5">
                {/* Categories */}
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-muted mb-1.5">
                    Category
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left px-2.5 py-1.5 text-xs uppercase flex items-center justify-between ${
                        !selectedCategory ? 'bg-showroom-charcoal text-white font-bold' : ''
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c._id}
                        onClick={() => setSelectedCategory(c._id)}
                        className={`w-full text-left px-2.5 py-1.5 text-xs uppercase flex items-center justify-between ${
                          selectedCategory === c._id ? 'bg-showroom-charcoal text-white font-bold' : ''
                        }`}
                      >
                        <span>{c.name}</span>
                        {selectedCategory === c._id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Finishes */}
                {filterOptions.finishes.length > 0 && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-showroom-muted mb-1.5">
                      Finish
                    </label>
                    <div className="space-y-1">
                      {filterOptions.finishes.map((f) => (
                        <button
                          key={f}
                          onClick={() => setSelectedFinish(selectedFinish === f ? '' : f)}
                          className={`w-full text-left px-2.5 py-1.5 text-xs uppercase flex items-center justify-between ${
                            selectedFinish === f ? 'bg-showroom-charcoal text-white font-bold' : ''
                          }`}
                        >
                          <span>{f}</span>
                          {selectedFinish === f && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-showroom-border space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-showroom-charcoal text-white text-xs font-bold uppercase tracking-widest"
              >
                Apply Filters ({products.length} Items)
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full py-2 bg-showroom-sand/50 text-showroom-charcoal text-xs font-bold uppercase tracking-widest"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
