import { motion, useScroll, useSpring } from "motion/react";

export function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.28 });
  return <motion.div className="page-progress" style={{ scaleX }} aria-hidden="true" />;
}
