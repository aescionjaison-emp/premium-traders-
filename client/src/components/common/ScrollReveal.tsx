import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'clip';
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'clip',
  delay = 0,
  duration = 0.8,
  className = '',
}) => {
  const getVariants = () => {
    switch (direction) {
      case 'clip':
        return {
          hidden: { opacity: 0, clipPath: 'inset(12% 0% 12% 0%)', scale: 0.96 },
          visible: {
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.92 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: 40 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -40 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
      case 'up':
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
          },
        };
    }
  };

  return (
    <motion.div
      variants={getVariants() as any}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
