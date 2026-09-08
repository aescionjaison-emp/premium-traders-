import React, { useState } from 'react';
import { Maximize2, ArrowUpRight } from 'lucide-react';
import { IGalleryItem } from '../types/index.js';
import { SectionHeading } from '../components/common/SectionHeading.js';
import { Lightbox } from '../components/common/Lightbox.js';
import { ScrollReveal } from '../components/common/ScrollReveal.js';

interface InspiredSpacesProps {
  galleryItems?: IGalleryItem[];
}

const defaultSpaces: IGalleryItem[] = [
  {
    _id: 'space-1',
    title: '1200x2400mm Statuario Carrara Porcelain Slab Surface',
    category: 'Tiles & Porcelain',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85',
    locationOrSpace: 'Mirror Polish Surface',
    aspectRatio: '16:9',
    featured: true,
    visible: true,
    displayOrder: 1,
  },
  {
    _id: 'space-2',
    title: 'Monolithic Black Galaxy Granite Slab with Golden Bronzite Specks',
    category: 'Granite & Marble',
    image: 'https://images.unsplash.com/photo-1567360425618-1594206637d2?auto=format&fit=crop&w=1200&q=85',
    locationOrSpace: 'Quarry Mirror Polish',
    aspectRatio: '16:9',
    featured: true,
    visible: true,
    displayOrder: 2,
  },
  {
    _id: 'space-3',
    title: 'Acoustic Smoked Oak Fluted Architectural Slat Louvers',
    category: 'Wood Works & Louvers',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85',
    locationOrSpace: 'Acoustic Timber Battens',
    aspectRatio: '16:9',
    featured: true,
    visible: true,
    displayOrder: 3,
  },
  {
    _id: 'space-4',
    title: 'Solid Brushed Brass Modular Switch Faceplate Hardware',
    category: 'Electrical & Lighting',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=85',
    locationOrSpace: 'Satin Brushed Apparatus',
    aspectRatio: '16:9',
    featured: true,
    visible: true,
    displayOrder: 4,
  },
];

export const InspiredSpacesSection: React.FC<InspiredSpacesProps> = ({ galleryItems }) => {
  const items = galleryItems && galleryItems.length > 0 ? galleryItems : defaultSpaces;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const lightboxImages = items.map((i) => ({
    url: i.image,
    title: i.title,
    subtitle: `${i.category} • ${i.locationOrSpace || 'Material Portfolio'}`,
  }));

  return (
    <section id="section-spaces" className="py-14 bg-showroom-ivory/60 border-y border-showroom-border">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <SectionHeading
            smallLabel="MATERIAL PORTFOLIO"
            title="SURFACE & HARDWARE TEXTURES"
            linkText="VIEW ALL MATERIALS"
            linkUrl="/inspired-spaces"
          />
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.slice(0, 4).map((item, idx) => (
            <ScrollReveal key={item._id || idx} direction="clip" delay={idx * 0.08}>
              <div
                onClick={() => {
                  setActiveIdx(idx);
                  setLightboxOpen(true);
                }}
                className="group relative bg-white border border-showroom-border overflow-hidden cursor-pointer flex flex-col justify-between hover:border-showroom-charcoal hover:shadow-card transition-all"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-showroom-sand">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-2.5 right-2.5 p-1.5 bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-showroom-gold block mb-0.5">
                      {item.category}
                    </span>
                    <h4 className="font-serif text-xs sm:text-sm font-bold uppercase line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    {item.locationOrSpace && (
                      <p className="text-[9px] text-white/70 truncate mt-0.5">
                        {item.locationOrSpace}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-white border-t border-showroom-border flex items-center justify-between text-showroom-charcoal">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-showroom-muted">
                    INSPECT SPEC
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-showroom-bronze group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={activeIdx}
      />
    </section>
  );
};
