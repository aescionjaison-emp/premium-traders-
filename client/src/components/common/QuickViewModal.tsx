import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, ArrowUpRight, Check, Share2, Layers } from 'lucide-react';
import { useQuickView } from '../../context/QuickViewContext.js';
import { useSettings } from '../../context/SettingsContext.js';
import { useToast } from '../../context/ToastContext.js';

export const QuickViewModal: React.FC = () => {
  const { selectedProduct, isOpen, closeQuickView, openEnquiry } = useQuickView();
  const { settings } = useSettings();
  const { success } = useToast();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!isOpen || !selectedProduct) return null;

  const images =
    selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : selectedProduct.categorySlug === 'granite-marble-natural-stone'
      ? ['https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85']
      : selectedProduct.categorySlug === 'wood-works-wooden-doors-plywood'
      ? ['https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=85']
      : selectedProduct.categorySlug === 'electrical-products-lighting-switches'
      ? ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85']
      : ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=85'];

  const handleWhatsAppQuote = () => {
    const cleanPhone = (settings.whatsapp || '919876543210').replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello ${settings.businessName}, I am inquiring about the architectural material: "${selectedProduct.name}" (SKU: ${selectedProduct.sku}, Finish: ${selectedProduct.finish}, Size: ${selectedProduct.size}). Please share pricing and availability.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: `Check out ${selectedProduct.name} at ${settings.businessName}`,
        url: window.location.origin + `/product/${selectedProduct.slug}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/product/${selectedProduct.slug}`);
      success('Product link copied to clipboard');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 bg-showroom-charcoal/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-4xl bg-white shadow-2xl border border-showroom-border overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row rounded-[5px]"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-showroom-charcoal hover:text-white rounded-[5px] border border-showroom-border shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: 55% Image Canvas */}
          <div className="w-full md:w-[55%] bg-showroom-ivory p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-showroom-border">
            <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-white border border-showroom-border/60 rounded-[5px]">
              <img
                src={images[selectedImageIdx]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`w-14 h-14 shrink-0 border overflow-hidden transition-all rounded-[5px] ${
                      selectedImageIdx === i
                        ? 'border-showroom-charcoal scale-95 shadow-sm'
                        : 'border-showroom-border opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: 45% Specifications & Actions */}
          <div className="w-full md:w-[45%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-showroom-bg">
            <div>
              <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-showroom-bronze mb-2">
                <span>{selectedProduct.brand || 'Showroom Architectural'}</span>
                <span className="font-mono text-showroom-muted">{selectedProduct.sku}</span>
              </div>

              <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-showroom-charcoal">
                {selectedProduct.name}
              </h2>

              {selectedProduct.collectionName && (
                <div className="flex items-center gap-1 text-xs font-semibold text-showroom-muted uppercase tracking-wider mt-1">
                  <Layers className="w-3.5 h-3.5 text-showroom-bronze" />
                  <span>{selectedProduct.collectionName}</span>
                </div>
              )}

              {/* Core Attributes */}
              <div className="grid grid-cols-2 gap-2 mt-6 p-3 bg-white border border-showroom-border rounded-[5px]">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-muted block">
                    Finish
                  </span>
                  <span className="text-xs font-bold uppercase text-showroom-charcoal">
                    {selectedProduct.finish}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-muted block">
                    Dimensions
                  </span>
                  <span className="text-xs font-bold uppercase text-showroom-charcoal">
                    {selectedProduct.size}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-muted block">
                    Material
                  </span>
                  <span className="text-xs font-bold uppercase text-showroom-charcoal">
                    {selectedProduct.material}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-muted block">
                    Surface
                  </span>
                  <span className="text-xs font-bold uppercase text-showroom-charcoal">
                    {selectedProduct.surface || 'Universal'}
                  </span>
                </div>
              </div>

              {/* Applications */}
              {selectedProduct.applications && selectedProduct.applications.length > 0 && (
                <div className="mt-4">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-muted block mb-1.5">
                    Recommended Applications
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.applications.map((app, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-showroom-sand/80 text-showroom-charcoal border border-showroom-border rounded-[5px]"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-2.5 pt-4 border-t border-showroom-border">
              <button
                onClick={() => {
                  closeQuickView();
                  openEnquiry(selectedProduct);
                }}
                className="w-full py-3 bg-showroom-charcoal text-[#FAF9F5] text-xs font-bold uppercase tracking-architectural hover:bg-showroom-charcoalLight transition-all flex items-center justify-center gap-2 rounded-[5px]"
              >
                <MessageSquare className="w-4 h-4 text-showroom-bronze" />
                <span>Submit Specification Enquiry</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleWhatsAppQuote}
                  className="py-2.5 px-3 bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366]/25 border border-[#25D366]/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-[5px]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-2.5 px-3 bg-white hover:bg-showroom-sand border border-showroom-border text-showroom-charcoal text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-[5px]"
                >
                  <Share2 className="w-3.5 h-3.5 text-showroom-muted" />
                  <span>Share</span>
                </button>
              </div>

              <Link
                to={`/product/${selectedProduct.slug}`}
                onClick={closeQuickView}
                className="block text-center text-xs font-bold uppercase tracking-architectural text-showroom-bronze hover:underline pt-1"
              >
                View full product specifications & spreads →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
