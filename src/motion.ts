import type { Transition, Variants } from "motion/react";
import { useReducedMotion } from "motion/react";

export const easeOut = [0.16, 1, 0.3, 1] as const;

const instant: Transition = { duration: 0 };

export function useMotionConfig() {
  const reduced = !!useReducedMotion();

  const fadeUp: Variants = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.72, ease: easeOut },
        },
      };

  const fade: Variants = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.55, ease: easeOut } },
      };

  const stagger: Variants = reduced
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
      };

  const spring: Transition = reduced
    ? instant
    : { type: "spring", stiffness: 420, damping: 28, mass: 0.7 };

  const cardTransition: Transition = reduced
    ? instant
    : { duration: 0.45, ease: easeOut };

  return { reduced, fadeUp, fade, stagger, spring, cardTransition };
}
