import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, MessageSquare } from 'lucide-react';
import { useQuickView } from '../../context/QuickViewContext.js';

interface LightboxProps {
  images: { url: string; title?: string; subtitle?: string }[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const { openEnquiry } = useQuickView();

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentItem = images[currentIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-showroom-bronze uppercase">
              {currentIndex + 1} / {images.length}
            </span>
            {currentItem.title && (
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
                {currentItem.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                openEnquiry();
              }}
              className="px-3 py-1.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 rounded-[5px]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire Slab</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors rounded-[5px]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Image View */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="relative max-w-6xl max-h-[85vh] w-full p-4 flex flex-col items-center justify-center"
        >
          <img
            src={currentItem.url}
            alt={currentItem.title || 'Architectural Material Fullscreen'}
            className="max-h-[75vh] w-auto max-w-full object-contain shadow-2xl border border-white/10 rounded-[5px]"
          />
          {currentItem.subtitle && (
            <p className="text-xs text-white/70 tracking-wider text-center mt-3 uppercase">
              {currentItem.subtitle}
            </p>
          )}
        </motion.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all rounded-[5px]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all rounded-[5px]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </AnimatePresence>
  );
};
