import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Maximize2,
  MessageSquare,
  Check,
  Share2,
  ShieldCheck,
  ChevronRight,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IProduct } from '../../types/index.js';
import { useQuickView } from '../../context/QuickViewContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { useToast } from '../../context/ToastContext.js';
import { Lightbox } from '../../components/common/Lightbox.js';
import { ProductCard } from '../../components/common/ProductCard.js';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { openEnquiry } = useQuickView();
  const { settings } = useSettings();
  const { success } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.data.success && res.data.data) {
          setProduct(res.data.data);
          setActiveImageIdx(0);

          // Fetch related
          const relRes = await api.getRelatedProducts(res.data.data._id);
          if (relRes.data.success) {
            setRelated(relRes.data.data);
          }
        } else {
          const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');
          const matched = MASTER_SHOWROOM_PRODUCTS.find(p => p.slug === slug || slug?.includes(p.sku.toLowerCase()) || p.name.toLowerCase() === slug?.replace(/-/g, ' '));
          if (matched) {
            setProduct(matched);
            setRelated(MASTER_SHOWROOM_PRODUCTS.filter(p => p._id !== matched._id && p.categorySlug === matched.categorySlug).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
        const { MASTER_SHOWROOM_PRODUCTS } = await import('../../data/showroomCatalogData.js');
        const matched = MASTER_SHOWROOM_PRODUCTS.find(p => p.slug === slug || slug?.includes(p.sku.toLowerCase()) || p.name.toLowerCase() === slug?.replace(/-/g, ' '));
        if (matched) {
          setProduct(matched);
          setRelated(MASTER_SHOWROOM_PRODUCTS.filter(p => p._id !== matched._id && p.categorySlug === matched.categorySlug).slice(0, 4));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-showroom-bg pt-28 pb-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-showroom-border border-t-showroom-bronze rounded-full animate-spin mb-4" />
        <span className="text-xs uppercase font-bold tracking-widest text-showroom-muted">
          Loading Material Spread...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-showroom-bg pt-32 pb-20 text-center">
        <h2 className="font-serif text-2xl font-bold uppercase text-showroom-charcoal">
          Product Not Found
        </h2>
        <Link
          to="/catalog"
          className="mt-4 inline-block px-5 py-2.5 bg-showroom-charcoal text-white text-xs font-bold uppercase tracking-widest"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85'];

  const handleWhatsAppQuote = () => {
    const cleanPhone = (settings.whatsapp || '919876543210').replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${settings.businessName}, I am inquiring about "${product.name}" (SKU: ${product.sku}, Size: ${product.size}, Finish: ${product.finish}). Please share live pricing and lead times.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `View ${product.name} at ${settings.businessName}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard');
    }
  };

  const lightboxImages = images.map((img) => ({
    url: img,
    title: product.name,
    subtitle: `${product.finish} • ${product.size} • SKU: ${product.sku}`,
  }));

  const categoryName = typeof product.category === 'object' ? product.category.name : 'Catalog';

  return (
    <div className="min-h-screen bg-showroom-bg pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-showroom-muted py-4 mb-2">
          <Link to="/" className="hover:text-showroom-charcoal">
            Showroom
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/catalog" className="hover:text-showroom-charcoal">
            Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-showroom-charcoal truncate font-bold">{product.name}</span>
        </nav>

        {/* 60 / 40 Luxury Spread Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-showroom-border">
          {/* Left: 60% Image Spread & Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Primary Viewport */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-showroom-ivory border border-showroom-border group rounded-[5px]">
              <img
                src={images[activeImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out cursor-zoom-in rounded-[5px]"
                onClick={() => setLightboxOpen(true)}
              />

              {/* Inspect Button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 px-3 py-2 bg-black/60 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-1.5 transition-colors rounded-[5px]"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Zoom Texture</span>
              </button>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative aspect-square border overflow-hidden transition-all rounded-[5px] ${
                      activeImageIdx === i
                        ? 'border-showroom-charcoal ring-1 ring-showroom-charcoal'
                        : 'border-showroom-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-[5px]" />
                  </button>
                ))}
              </div>
            )}

            {/* Installation Previews if available */}
            {product.installationImages && product.installationImages.length > 0 && (
              <div className="pt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-2">
                  Installed Space Spread
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {product.installationImages.map((inst, i) => (
                    <div
                      key={i}
                      className="aspect-[16/10] bg-showroom-ivory border border-showroom-border overflow-hidden rounded-[5px]"
                    >
                      <img src={inst} alt="Installed reference" className="w-full h-full object-cover rounded-[5px]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: 40% Product Specification Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-widest text-showroom-bronze mb-2">
                <span>{categoryName}</span>
                <span className="font-mono text-showroom-muted">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-showroom-charcoal leading-tight">
                {product.name}
              </h1>

              {/* Collection Badge */}
              {product.collectionName && (
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-showroom-muted mt-2">
                  <Layers className="w-4 h-4 text-showroom-bronze" />
                  <span>{product.collectionName}</span>
                </div>
              )}

              {/* Core Spec Key-Value Matrix */}
              <div className="mt-6 border border-showroom-border bg-white divide-y divide-showroom-sand/60 rounded-[5px] overflow-hidden">
                <div className="grid grid-cols-2 p-3 text-xs">
                  <span className="uppercase font-bold text-showroom-muted">Finish</span>
                  <span className="uppercase font-bold text-showroom-charcoal text-right">
                    {product.finish}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 text-xs">
                  <span className="uppercase font-bold text-showroom-muted">Dimensions</span>
                  <span className="uppercase font-bold text-showroom-charcoal text-right">
                    {product.size}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 text-xs">
                  <span className="uppercase font-bold text-showroom-muted">Material Spec</span>
                  <span className="uppercase font-bold text-showroom-charcoal text-right">
                    {product.material}
                  </span>
                </div>
                <div className="grid grid-cols-2 p-3 text-xs">
                  <span className="uppercase font-bold text-showroom-muted">Surface Application</span>
                  <span className="uppercase font-bold text-showroom-charcoal text-right">
                    {product.surface || 'Floor & Wall'}
                  </span>
                </div>
                {product.bodyType && (
                  <div className="grid grid-cols-2 p-3 text-xs">
                    <span className="uppercase font-bold text-showroom-muted">Body Type</span>
                    <span className="uppercase font-bold text-showroom-charcoal text-right">
                      {product.bodyType}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-2 p-3 text-xs">
                  <span className="uppercase font-bold text-showroom-muted">Brand / Manufacturer</span>
                  <span className="uppercase font-bold text-showroom-charcoal text-right">
                    {product.brand || 'Showroom Architectural'}
                  </span>
                </div>
              </div>

              {/* Technical Specifications from DB */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-2">
                    Architectural Performance Data
                  </span>
                  <div className="border border-showroom-border bg-white divide-y divide-showroom-sand/60 rounded-[5px] overflow-hidden">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="grid grid-cols-2 p-2.5 text-[11px]">
                        <span className="font-medium text-showroom-muted uppercase">{spec.key}</span>
                        <span className="font-bold text-showroom-charcoal text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications Tags */}
              {product.applications && product.applications.length > 0 && (
                <div className="mt-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-2">
                    Recommended Usage
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.applications.map((app, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold uppercase px-2.5 py-1 bg-showroom-sand/80 text-showroom-charcoal border border-showroom-border rounded-[5px]"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions & WhatsApp Floating Bar */}
            <div className="pt-6 space-y-3 border-t border-showroom-border">
              <button
                onClick={() => openEnquiry(product)}
                className="w-full py-3.5 bg-showroom-charcoal hover:bg-showroom-charcoalLight text-white text-xs font-bold uppercase tracking-architectural flex items-center justify-center gap-2 shadow-lg transition-all rounded-[5px]"
              >
                <MessageSquare className="w-4 h-4 text-showroom-bronze" />
                <span>Submit Specification Enquiry</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWhatsAppQuote}
                  className="py-3 px-4 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-[5px]"
                >
                  <Check className="w-4 h-4" />
                  <span>Direct WhatsApp</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-3 px-4 bg-white hover:bg-showroom-sand border border-showroom-border text-showroom-charcoal text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-[5px]"
                >
                  <Share2 className="w-4 h-4 text-showroom-muted" />
                  <span>Share Spread</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-showroom-muted pt-2">
                <ShieldCheck className="w-4 h-4 text-showroom-bronze shrink-0" />
                <span>Authentic factory calibrated batches & direct quarry selection guarantee.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Carousel / Grid */}
        {related.length > 0 && (
          <div className="pt-14">
            <div className="pb-4 mb-6 border-b border-showroom-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-0.5">
                  RELATED SELECTION
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
                  YOU MAY ALSO SPECIFY
                </h2>
              </div>
              <Link
                to="/catalog"
                className="text-xs font-bold uppercase tracking-architectural text-showroom-charcoal hover:text-showroom-bronze flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {related.map((rel) => (
                <ProductCard key={rel._id} product={rel} aspect="portrait" showQuickView={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={activeImageIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
