"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: "div" | "p" | "h2" | "h3" | "span";
  amount?: number;
};

/** Нэг удаа, зөөлөн, transform + opacity-оор л гарч ирнэ. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  duration = 1.3,
  className,
  as = "div",
  amount = 0.4,
}: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -6% 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}
