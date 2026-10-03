"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Reveal } from "./Reveal";

type LineProps = {
  p: MotionValue<number>;
  /** [fadeInStart, fadeInEnd] */
  inRange: [number, number];
  /** [fadeOutStart, fadeOutEnd] */
  outRange?: [number, number];
  className?: string;
  children: React.ReactNode;
};

function ScrollLine({ p, inRange, outRange, className, children }: LineProps) {
  const opacity = useTransform(
    p,
    outRange ? [inRange[0], inRange[1], outRange[0], outRange[1]] : [inRange[0], inRange[1]],
    outRange ? [0, 1, 1, 0] : [0, 1],
  );
  const y = useTransform(
    p,
    outRange ? [inRange[0], inRange[1], outRange[0], outRange[1]] : [inRange[0], inRange[1]],
    outRange ? [30, 0, 0, -22] : [30, 0],
  );
  return (
    <motion.p style={{ opacity, y }} className={className}>
      {children}
    </motion.p>
  );
}

const DIM = "font-display t-line text-ivory/70";
const BRIGHT = "font-display t-line italic text-ivory";

export function FirstMessage() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const warm = useTransform(p, [0.6, 0.86], [0, 1]);
  const lastColor = useTransform(p, [0.7, 0.9], ["#f7f3ea", "#f4d9a0"]);
  const lastOpacity = useTransform(p, [0.7, 0.8], [0, 1]);
  const lastY = useTransform(p, [0.7, 0.8], [30, 0]);

  if (reduce) {
    return (
      <section
        id="first-message"
        aria-label="Эхний захиа"
        className="relative flex min-h-svh flex-col items-center justify-center gap-20 px-6 py-32 text-center"
      >
        <div className="flex flex-col gap-4">
          <Reveal as="p" className={DIM}>Хүн бүр биднийг ойлгох албагүй байсан.</Reveal>
          <Reveal as="p" className={BRIGHT} delay={0.2}>Харин та ойлгодог байсан.</Reveal>
        </div>
        <div className="flex flex-col gap-4">
          <Reveal as="p" className={DIM}>Хүн бүр бидэнд итгэх албагүй байсан.</Reveal>
          <Reveal as="p" className="font-display t-line italic text-gold-soft" delay={0.2}>Харин та итгэдэг байсан.</Reveal>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="first-message" aria-label="Эхний захиа" className="relative h-[420svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-6 text-center">
        {/* Сүүлийн мөр гарах үед дулаарах гэрэл */}
        <motion.div
          aria-hidden
          style={{ opacity: warm }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 48% at 50% 54%, rgba(231,184,91,0.2), rgba(231,184,91,0.06) 48%, rgba(231,184,91,0) 72%)",
            }}
          />
        </motion.div>

        {/* A хос */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 md:gap-7">
          <ScrollLine p={p} inRange={[0.04, 0.14]} outRange={[0.42, 0.5]} className={`${DIM} max-w-[16ch] md:max-w-[28ch]`}>
            Хүн бүр биднийг ойлгох албагүй байсан.
          </ScrollLine>
          <ScrollLine p={p} inRange={[0.2, 0.3]} outRange={[0.44, 0.52]} className={`${BRIGHT} max-w-[16ch] md:max-w-[28ch]`}>
            Харин та ойлгодог байсан.
          </ScrollLine>
        </div>

        {/* B хос */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 md:gap-7">
          <ScrollLine p={p} inRange={[0.54, 0.64]} className={`${DIM} max-w-[16ch] md:max-w-[28ch]`}>
            Хүн бүр бидэнд итгэх албагүй байсан.
          </ScrollLine>
          <motion.p
            style={{ opacity: lastOpacity, y: lastY, color: lastColor }}
            className="font-display t-line max-w-[16ch] md:max-w-[28ch] italic"
          >
            Харин та итгэдэг байсан.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
