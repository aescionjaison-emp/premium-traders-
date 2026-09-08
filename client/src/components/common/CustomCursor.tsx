import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [cursorText, setCursorText] = useState('');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'drag'>('default');
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest(
        'button, a, [data-cursor], .group, [role="button"]'
      ) as HTMLElement | null;

      if (clickable) {
        const customText = clickable.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
          setCursorVariant('hover');
        } else if (clickable.closest('.horizontal-scroll-container')) {
          setCursorText('DRAG');
          setCursorVariant('drag');
        } else if (clickable.tagName === 'A' || clickable.tagName === 'BUTTON') {
          setCursorText('');
          setCursorVariant('hover');
        } else {
          setCursorText('VIEW');
          setCursorVariant('hover');
        }
      } else {
        setCursorText('');
        setCursorVariant('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: cursorX,
        y: cursorY,
      }}
      className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 rounded-full flex items-center justify-center transition-all duration-200 ${
        cursorVariant === 'hover' || cursorVariant === 'drag'
          ? 'w-16 h-16 bg-[#171615]/85 text-[#FAF9F5] backdrop-blur-sm border border-showroom-bronze/40 shadow-lift'
          : 'w-3.5 h-3.5 bg-showroom-bronze/70'
      }`}
    >
      {cursorText && (
        <span className="text-[9px] font-bold uppercase tracking-widest select-none">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
};
