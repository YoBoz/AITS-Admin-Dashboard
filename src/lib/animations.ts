// ──────────────────────────────────────
// Centralized framer-motion animation variants
// ──────────────────────────────────────
import type { Variants, Transition } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25 } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25 } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } },
};

export const slideUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
};

export const pageExit: Variants = {
  hidden: { opacity: 1, x: 0 },
  visible: { opacity: 0, x: -10, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const scaleButton = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.1 } },
};

export const pulseAnimation = {
  scale: [1, 1.6, 1],
  opacity: [1, 0, 1],
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } as Transition,
};

export const shakeAnimation = {
  x: [0, -4, 4, -4, 4, -2, 2, 0],
  transition: { duration: 0.35 } as Transition,
};
