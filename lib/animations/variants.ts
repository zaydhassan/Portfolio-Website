import type { Variants, Transition } from "motion/react";

export const easeExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const easeSpring: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const baseTransition: Transition = {
  duration: 0.7,
  ease: easeExpo,
};

/** Fade + rise reveal, triggered when scrolled into view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: baseTransition,
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: easeExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(10px)" },
  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: baseTransition },
};

/** Container that staggers its children. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0.05): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Word-by-word headline reveal. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeExpo },
  },
};

/** Character reveal for large headlines. */
export const charReveal: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeExpo },
  },
};

export const viewportOnce = { once: true, amount: 0.4 } as const;
export const viewportReveal = { once: true, amount: 0.25 } as const;