import React, { useState, useEffect } from 'react';
import { Maximize2 } from 'lucide-react';
import { api } from '../../api/endpoints.js';
import { IGalleryItem } from '../../types/index.js';
import { Lightbox } from '../../components/common/Lightbox.js';

export const InspiredSpacesPage: React.FC = () => {
  const [gallery, setGallery] = useState<IGalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.getGallery({ visibleOnly: true });
        if (res.data.success) {
          setGallery(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ['ALL', 'Tiles', 'Granite', 'Wood', 'Interior', 'Showroom'];

  const filteredItems =
    selectedCategory === 'ALL'
      ? gallery
      : gallery.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const lightboxImages = filteredItems.map((i) => ({
    url: i.image,
    title: i.title,
    subtitle: `${i.category} • ${i.locationOrSpace || 'Architectural Gallery'}`,
  }));

  return (
    <div className="min-h-screen bg-showroom-bg pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 mb-8 border-b border-showroom-border">
          <span className="text-[10px] font-bold uppercase tracking-widest text-showroom-bronze block mb-1">
            ARCHITECTURAL REALISATIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-showroom-charcoal">
            SPACES OF DISTINCTION
          </h1>
          <p className="text-xs sm:text-sm text-showroom-muted mt-1 max-w-2xl">
            A visual chronicle of installed marble looks, exotic stone waterfall islands, handcrafted teak entrances, and glare-free lighting schemes.
          </p>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest shrink-0 transition-all border ${
                  selectedCategory === c
                    ? 'bg-showroom-charcoal text-white border-showroom-charcoal'
                    : 'bg-white text-showroom-charcoal border-showroom-border hover:border-showroom-charcoal'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Masonry / Responsive Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-xs uppercase font-bold tracking-widest text-showroom-muted">
            Loading architectural portfolio...
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => {
                  setActiveIdx(idx);
                  setLightboxOpen(true);
                }}
                className="group relative bg-white border border-showroom-border overflow-hidden cursor-pointer flex flex-col justify-between hover:border-showroom-charcoal hover:shadow-card transition-all"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-showroom-sand">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-3 right-3 p-2 bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-showroom-bronze block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-sm font-bold uppercase tracking-tight line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3 bg-white flex items-center justify-between border-t border-showroom-sand/60 text-showroom-charcoal text-xs">
                  <span className="font-mono text-showroom-muted text-[11px] truncate">
                    {item.locationOrSpace || 'Architectural Specification'}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-showroom-bronze group-hover:underline">
                    Inspect Space →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-showroom-border">
            <p className="font-serif text-base font-bold uppercase text-showroom-charcoal">
              No gallery items found in this section
            </p>
          </div>
        )}
      </div>

      <Lightbox
        images={lightboxImages}
        initialIndex={activeIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
