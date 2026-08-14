import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useMotionConfig } from "../motion";

type CtaButtonProps = {
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export function CtaButton({
  children,
  className = "",
  arrow = true,
  type = "button",
  onClick,
}: CtaButtonProps) {
  const { reduced, spring } = useMotionConfig();

  return (
    <motion.button
      type={type}
      className={`cta ${className}`.trim()}
      onClick={onClick}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={spring}
    >
      {children}
      {arrow ? <ArrowRight className="cta-arrow" aria-hidden="true" /> : null}
    </motion.button>
  );
}
