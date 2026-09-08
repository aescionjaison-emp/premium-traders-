import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Eye } from 'lucide-react';
import { IProduct } from '../../types/index.js';
import { useQuickView } from '../../context/QuickViewContext.js';

interface ProductCardProps {
  product: IProduct;
  aspect?: 'portrait' | 'landscape' | 'square' | 'wide';
  className?: string;
  showQuickView?: boolean;
}

export const getShortProductName = (name: string): string => {
  if (!name) return 'Material';
  
  // Clean prefix noise words
  let cleaned = name
    .replace(/^premium\s+/i, '')
    .replace(/^exotic\s+/i, '')
    .replace(/^luxury\s+/i, '')
    .replace(/^natural\s+/i, '')
    .replace(/^solid\s+/i, '')
    .replace(/^traditional\s+/i, '')
    .replace(/^\d+x\d+\s*(mm)?\s*/i, '')
    .replace(/^\d+mm\s*/i, '')
    .trim();

  // Specific common mappings
  if (/black\s*galaxy/i.test(cleaned)) return 'Black Galaxy';
  if (/statuario/i.test(cleaned)) return 'Statuario White';
  if (/calacatta/i.test(cleaned)) return 'Calacatta Gold';
  if (/teak.*entrance|entrance.*door/i.test(cleaned)) return 'Teak Entrance';
  if (/teak/i.test(cleaned) && /door/i.test(cleaned)) return 'Teak Door';
  if (/smoked\s*oak|oak.*louver/i.test(cleaned)) return 'Smoked Oak';
  if (/marine\s*ply/i.test(cleaned)) return 'Marine Ply';
  if (/brass.*switch|switch.*board/i.test(cleaned)) return 'Brass Switch';
  if (/magnetic.*track|track.*light/i.test(cleaned)) return 'Magnetic Track';
  if (/bldc|fan/i.test(cleaned)) return 'Silent Fan';
  if (/crystal.*white/i.test(cleaned)) return 'Crystal White';
  if (/river.*gold|river.*white/i.test(cleaned)) return 'River Gold';
  if (/tan.*brown/i.test(cleaned)) return 'Tan Brown';
  if (/steel.*grey/i.test(cleaned)) return 'Steel Grey';
  if (/armani/i.test(cleaned)) return 'Armani Gold';
  if (/onyx/i.test(cleaned)) return 'Onyx Jade';
  if (/bottochino/i.test(cleaned)) return 'Bottochino Classic';

  // Fallback to first 2 words
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return words.join(' ');
  return `${words[0]} ${words[1]}`;
};

export const getCategoryShortName = (product: IProduct): string => {
  const cat = (product.categorySlug || (typeof product.category === 'object' ? product.category?.slug : product.category) || '').toLowerCase();
  const mat = (product.material || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();
  if (cat.includes('elec') || mat.includes('brass') || mat.includes('switch') || mat.includes('light') || mat.includes('fan') || name.includes('switch') || name.includes('light') || name.includes('fan') || sku.includes('elc')) return 'Electrical';
  if (cat.includes('granite') || mat.includes('granite') || mat.includes('stone') || mat.includes('quartzite') || sku.includes('grn')) return 'Granite';
  if (cat.includes('wood') || mat.includes('wood') || mat.includes('teak') || mat.includes('door') || mat.includes('plywood') || sku.includes('wod')) return 'Wood';
  if (cat.includes('tile') || mat.includes('tile') || mat.includes('porcelain') || mat.includes('vitrified') || sku.includes('til')) return 'Tiles';
  return 'Material';
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  aspect = 'portrait',
  className = '',
  showQuickView = true,
}) => {
  const { openQuickView } = useQuickView();
  const shortName = getShortProductName(product.name);
  const categoryShort = getCategoryShortName(product);

  const aspectClass =
    aspect === 'portrait'
      ? 'aspect-[4/5]'
      : aspect === 'landscape'
      ? 'aspect-[16/10]'
      : aspect === 'wide'
      ? 'aspect-[21/9]'
      : 'aspect-square';

  const imageUrl =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : product.categorySlug === 'granite-marble-natural-stone' || product.material?.toLowerCase().includes('granite')
      ? 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=800&q=85'
      : product.categorySlug === 'wood-works-wooden-doors-plywood' || product.material?.toLowerCase().includes('wood') || product.material?.toLowerCase().includes('teak')
      ? 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=85'
      : product.categorySlug === 'electrical-products-lighting-switches' || product.material?.toLowerCase().includes('brass') || product.material?.toLowerCase().includes('switch')
      ? 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=85'
      : 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=85';

  const secondaryImage =
    product.images && product.images.length > 1 ? product.images[1] : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: 'easeOut' } }}
      className={`group relative bg-white border border-showroom-border hover:border-showroom-charcoal hover:shadow-lift transition-all duration-300 flex flex-col justify-between h-full overflow-hidden rounded-[5px] ${className}`}
    >
      {/* Visual Image Viewport */}
      <div className="relative w-full overflow-hidden bg-showroom-ivory rounded-t-[5px]">
        <Link to={`/product/${product.slug}`} className={`relative w-full ${aspectClass} block overflow-hidden`}>
          <img
            src={imageUrl}
            alt={shortName}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              secondaryImage ? 'group-hover:opacity-0' : ''
            }`}
          />
          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={shortName}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            />
          )}
        </Link>

        {/* Floating Quick Preview Action */}
        {showQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            className="absolute bottom-2 right-2 p-1.5 bg-black/75 hover:bg-showroom-bronze text-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md backdrop-blur-sm z-20 rounded-sm"
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Structured Minimal Editorial Details: Short Name (max 2 words) + Category + Arrow */}
      <div className="p-3 bg-white border-t border-showroom-border/70 flex items-center justify-between">
        <Link to={`/product/${product.slug}`} className="min-w-0 pr-2 block flex-1">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-showroom-charcoal group-hover:text-showroom-bronze transition-colors truncate">
            {shortName}
          </h3>
          <span className="text-[10px] uppercase font-mono text-showroom-muted block truncate mt-0.5">
            {categoryShort}
          </span>
        </Link>

        <Link
          to={`/product/${product.slug}`}
          className="w-6 h-6 rounded-full bg-showroom-sand/50 group-hover:bg-showroom-bronze flex items-center justify-center text-showroom-charcoal group-hover:text-white transition-all shrink-0 ml-1 group-hover:scale-105"
        >
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
};
