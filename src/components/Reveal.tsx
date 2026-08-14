import { ReactNode } from "react";
import { motion } from "motion/react";
import { useMotionConfig } from "../motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header";
  amount?: number;
};

export function Reveal({ children, className, as = "div", amount = 0.22 }: RevealProps) {
  const { fadeUp, reduced } = useMotionConfig();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={fadeUp}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Tag>
  );
}
