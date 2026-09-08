import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface MaskRevealProps {
  children: React.ReactNode;
  mode?: 'curtain-up' | 'curtain-down' | 'curtain-side' | 'scale-reveal' | 'soft-fade';
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const MaskReveal: React.FC<MaskRevealProps> = ({
  children,
  mode = 'curtain-up',
  delay = 0,
  duration = 0.9,
  className = '',
  once = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const getVariants = () => {
    switch (mode) {
      case 'curtain-up':
        return {
          hidden: { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.8 },
          visible: {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'curtain-down':
        return {
          hidden: { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.8 },
          visible: {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'curtain-side':
        return {
          hidden: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.8 },
          visible: {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'scale-reveal':
        return {
          hidden: { scale: 1.08, opacity: 0.3 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'soft-fade':
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: duration * 0.8, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants as any}
      className={className}
    >
      {children}
    </motion.div>
  );
};
