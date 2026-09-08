import React, { useState, useEffect } from 'react';
import { api } from '../../api/endpoints.js';
import {
  IHomepageConfig,
  ICategory,
  IBrand,
  IProduct,
} from '../../types/index.js';

// Visual, Cinematic Showroom Sections
import { HeroSection } from '../../sections/HeroSection.js';
import { MaterialsComeToLifeSection } from '../../sections/MaterialsComeToLifeSection.js';
import { CategoryVisualChapters } from '../../sections/CategoryVisualChapters.js';
import { ExploreMaterialsHorizontalSection } from '../../sections/ExploreMaterialsHorizontalSection.js';
import { BrandMarqueeSection } from '../../sections/BrandMarqueeSection.js';
import { ContactStripSection } from '../../sections/ContactStripSection.js';

export const HomePage: React.FC = () => {
  const [config, setConfig] = useState<IHomepageConfig | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configRes, catsRes, brandsRes, prodsRes] = await Promise.all([
          api.getHomepageConfig().catch(() => ({ data: { success: false, data: null } })),
          api.getCategories({ visibleOnly: true }).catch(() => ({ data: { success: false, data: null } })),
          api.getBrands({ visibleOnly: true }).catch(() => ({ data: { success: false, data: null } })),
          api.getProducts({ limit: 40 }).catch(() => ({ data: { success: false, data: null } })),
        ]);

        if (configRes.data?.success && configRes.data.data) {
          setConfig(configRes.data.data);
        }
        if (catsRes.data?.success && catsRes.data.data && catsRes.data.data.length > 0) {
          setCategories(catsRes.data.data);
        }
        if (brandsRes.data?.success && brandsRes.data.data && brandsRes.data.data.length > 0) {
          setBrands(brandsRes.data.data);
        }
        if (prodsRes.data?.success && prodsRes.data.data && prodsRes.data.data.length > 0) {
          setProducts(prodsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-showroom-bg pt-28 pb-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-showroom-border border-t-showroom-bronze rounded-full animate-spin mb-4" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-showroom-muted">
          Loading Showroom...
        </span>
      </div>
    );
  }

  // Default fallback sections if none in database
  const defaultSections = [
    { id: 'hero', visible: true, displayOrder: 1 },
    { id: 'materials_life', visible: true, displayOrder: 2 },
    { id: 'category_chapters', visible: true, displayOrder: 3 },
    { id: 'explore_materials', visible: true, displayOrder: 4 },
    { id: 'brand_marquee', visible: true, displayOrder: 5 },
    { id: 'contact_strip', visible: true, displayOrder: 6 },
  ];

  const activeSections = (config?.sections && config.sections.length > 0)
    ? [...config.sections].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : defaultSections;

  const renderSectionComponent = (secId: string) => {
    switch (secId) {
      case 'hero':
        return <HeroSection key="hero" slides={config?.heroSlides} />;
      case 'materials_life':
        return <MaterialsComeToLifeSection key="materials_life" slides={config?.materialsComeToLife} />;
      case 'category_chapters':
      case 'chapter_granite':
      case 'chapter_tiles':
      case 'chapter_wood':
      case 'chapter_electrical':
        return <CategoryVisualChapters key="category_chapters" products={products} chapters={config?.categoryChapters} />;
      case 'explore_materials':
        return (
          <ExploreMaterialsHorizontalSection
            key="explore_materials"
            products={products}
            exploreMaterials={config?.exploreMaterials}
          />
        );
      case 'brand_marquee':
        return <BrandMarqueeSection key="brand_marquee" brands={brands} />;
      case 'contact_strip':
        return <ContactStripSection key="contact_strip" />;
      default:
        return null;
    }
  };

  // Dedup in case multiple chapter sub-ids are present
  const renderedKeys = new Set<string>();

  return (
    <div className="min-h-screen bg-showroom-bg text-showroom-charcoal relative">
      {activeSections
        .filter((sec) => sec.visible !== false)
        .map((sec) => {
          const compKey = (sec.id.startsWith('chapter_') || sec.id === 'category_chapters') ? 'category_chapters' : sec.id;
          if (renderedKeys.has(compKey)) return null;
          renderedKeys.add(compKey);
          return renderSectionComponent(sec.id);
        })}
    </div>
  );
};

