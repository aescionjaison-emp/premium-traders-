import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StickyCategoryNav: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('tiles');

  const navs = [
    { label: 'TILES', id: 'section-categories' },
    { label: 'CURATED SLABS', id: 'section-asymmetric' },
    { label: 'GRANITE', id: 'section-granite' },
    { label: 'WOODWORKS', id: 'section-wood' },
    { label: 'ELECTRICAL', id: 'section-electrical' },
    { label: 'SPACES', id: 'section-spaces' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 450px
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check which section is in viewport
      for (const item of navs) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 200) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1.5 p-1.5 bg-[#171615]/90 backdrop-blur-md border border-white/20 shadow-lift rounded-full text-white"
        >
          {navs.map((nav) => {
            const isActive = activeSection === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => scrollToSection(nav.id)}
                className={`relative px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-architectural rounded-full transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activePill"
                    className="absolute inset-0 bg-showroom-bronze rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span>{nav.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
