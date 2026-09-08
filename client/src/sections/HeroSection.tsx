import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { IHeroSlide } from '../types/index.js';

interface HeroSectionProps {
  slides?: IHeroSlide[];
}

// Local root video path provided for user: /videos/hero.mp4 or /hero.mp4
const LOCAL_HERO_VIDEO = '/videos/hero.mp4';
const FALLBACK_ONLINE_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-marble-surface-41484-large.mp4';

const defaultSlide: IHeroSlide & { videoUrl?: string } = {
  smallLabel: 'Premium Materials',
  heading: 'Beautiful Spaces.',
  subheading: '',
  image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=2400&q=85',
  videoUrl: LOCAL_HERO_VIDEO,
  ctaText: 'Explore Collection',
  ctaLink: '/catalog',
  badge: '',
};

export const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Active slide info directly from CMS config
  const activeSlide = (slides && slides.length > 0 && slides[0]) ? slides[0] : defaultSlide;

  const initialVideo = activeSlide.videoUrl || LOCAL_HERO_VIDEO;
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(initialVideo);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    if (activeSlide.videoUrl) {
      setCurrentVideoSrc(activeSlide.videoUrl);
      setHasVideoError(false);
    }
  }, [activeSlide.videoUrl]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  // Handle video source fallback if local /videos/hero.mp4 hasn't been provided yet
  const handleVideoError = () => {
    if (currentVideoSrc === LOCAL_HERO_VIDEO) {
      // Try root /hero.mp4 or fallback to cloud video loop
      const customUrl = activeSlide.videoUrl && activeSlide.videoUrl !== LOCAL_HERO_VIDEO ? activeSlide.videoUrl : FALLBACK_ONLINE_VIDEO;
      setCurrentVideoSrc(customUrl);
    } else if (currentVideoSrc !== FALLBACK_ONLINE_VIDEO) {
      setCurrentVideoSrc(FALLBACK_ONLINE_VIDEO);
    } else {
      setHasVideoError(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy handled with muted playsInline
      });
    }
  }, [currentVideoSrc]);

  const handleScrollDown = () => {
    const nextSection = document.getElementById('section-disciplines') || document.getElementById('section-categories');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[620px] overflow-hidden bg-black flex flex-col justify-between text-white"
    >
      {/* 1. Full Page Background Video Viewport */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {!hasVideoError ? (
          <video
            ref={videoRef}
            src={currentVideoSrc}
            poster={activeSlide.image}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onError={handleVideoError}
            className="w-full h-full object-cover scale-100"
          />
        ) : (
          <img
            src={activeSlide.image}
            alt={activeSlide.heading}
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}

        {/* Luminous High-Visibility Cinematic Overlay (Soft Scrim for Crisp Video Visibility) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* 2. Main Full-Page Editorial Overlay */}
      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-32 sm:pt-36 pb-6 flex-1 flex flex-col justify-between">
        {/* Center / Left Content */}
        <div className="my-auto max-w-2xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.1 },
              },
            }}
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.3em] text-showroom-gold block mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            >
              {activeSlide.smallLabel || 'Premium Materials'}
            </motion.span>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-[1.02] mb-6 whitespace-pre-line drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
            >
              {activeSlide.heading || 'Beautiful Spaces.'}
            </motion.h1>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex items-center gap-3 pt-2"
            >
              <Link
                to={activeSlide.ctaLink || '/catalog'}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-showroom-bronze hover:bg-showroom-bronzeHover text-white text-xs font-bold uppercase tracking-architectural transition-all shadow-2xl rounded-[5px] group hover:scale-[1.02] active:scale-95"
              >
                <span>{activeSlide.ctaText || 'Explore Collection'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* 3. Bottom Glassmorphic Category Strip & Scroll Down Indicator */}
        <div className="pt-6 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 border-t border-white/15">
          {/* 4 Quick Category Triggers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full sm:w-auto flex-1 max-w-3xl">
            {[
              { label: 'Granite', link: '/granite' },
              { label: 'Tiles', link: '/tiles' },
              { label: 'Wood', link: '/wood' },
              { label: 'Electrical', link: '/electrical' },
            ].map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="px-3.5 py-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-showroom-gold flex items-center justify-between group transition-all rounded-[5px] shadow-md"
              >
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-architectural text-white/90 group-hover:text-showroom-gold transition-colors">
                  {cat.label}
                </span>
                <ArrowRight className="w-3 h-3 text-white/50 group-hover:text-showroom-gold group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>

          {/* Scroll Down Indicator */}
          <button
            onClick={handleScrollDown}
            className="hidden lg:flex items-center gap-3 group cursor-pointer text-white/80 hover:text-showroom-gold transition-all duration-300 pl-4 py-1"
            aria-label="Scroll to explore showroom"
          >
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-white/70 group-hover:text-showroom-gold transition-colors">
              SCROLL DOWN
            </span>
            <div className="w-5 h-9 rounded-full border border-white/40 group-hover:border-showroom-gold flex items-start justify-center p-1 backdrop-blur-md bg-black/40 transition-colors">
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 bg-showroom-gold rounded-full shadow-[0_0_6px_#c5a059]"
              />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
