"use client";

import { MotionConfig } from "framer-motion";

/** prefers-reduced-motion үед transform/layout хөдөлгөөнийг автоматаар унтраана. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
