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

type FadeProps = {
  p: MotionValue<number>;
  inRange: [number, number];
  outRange?: [number, number];
  rise?: number;
  className?: string;
  children: React.ReactNode;
};

function Fade({ p, inRange, outRange, rise = 26, className, children }: FadeProps) {
  const input = outRange ? [inRange[0], inRange[1], outRange[0], outRange[1]] : [inRange[0], inRange[1]];
  const opacity = useTransform(p, input, outRange ? [0, 1, 1, 0] : [0, 1]);
  const y = useTransform(p, input, outRange ? [rise, 0, 0, -rise * 0.6] : [rise, 0]);
  return (
    <motion.p style={{ opacity, y }} className={className}>
      {children}
    </motion.p>
  );
}

const BIG = "font-display t-mega max-w-[15ch] md:max-w-none";
const SMALL = "mx-auto max-w-[36ch] text-[1.02rem] leading-[1.85] text-muted md:max-w-[44ch] md:text-[1.2rem]";

export function Climax() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Дулаан гэрэл: төгсгөлд хамгийн тод
  const lightOpacity = useTransform(p, [0.8, 0.95], [0, 1]);
  const lightScale = useTransform(p, [0.8, 1], [0.7, 1.05]);
  // Өмнөх бүлгийг хаах
  const groupOut = useTransform(p, [0.76, 0.84], [1, 0]);

  if (reduce) {
    return (
      <section
        aria-label="Хамгийн чухал үг"
        className="relative flex flex-col items-center gap-14 bg-ink-deep px-6 py-40 text-center"
      >
        <Reveal as="p" className="font-display t-mega text-muted">Үнэнийг хэлэхэд…</Reveal>
        <div className="flex flex-col gap-3">
          <Reveal as="p" className={`${BIG} text-ivory`}>Та байгаагүй бол</Reveal>
          <Reveal as="p" className={`${BIG} text-ivory`}>бидний туулсан олон зүйл</Reveal>
          <Reveal as="p" className={`${BIG} italic text-gold-soft`}>илүү хэцүү байх байсан.</Reveal>
        </div>
        <Reveal as="p" className={SMALL}>
          Заримдаа ганц хүний ‘Би та хоёрт итгэж байна’ гэсэн мэдрэмж хүртэл цааш явах асар их хүч болдог юм байна.
        </Reveal>
        <Reveal as="p" className="font-display t-mega italic text-gold-soft">Тэр хүн үргэлж та байсан.</Reveal>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Хамгийн чухал үг" className="relative h-[560svh] bg-ink-deep">
      {/* Дээд талын зөөлөн шилжилт */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[40svh] bg-gradient-to-b from-ink to-transparent"
      />
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Төгсгөлийн дулаан гэрэл */}
        <motion.div
          aria-hidden
          style={{ opacity: lightOpacity, scale: lightScale }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 52% 42% at 50% 52%, rgba(231,184,91,0.26), rgba(231,184,91,0.08) 45%, rgba(231,184,91,0) 72%)",
            }}
          />
        </motion.div>

        {/* 1 · Үнэнийг хэлэхэд… */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <Fade
            p={p}
            inRange={[0.03, 0.11]}
            outRange={[0.18, 0.25]}
            className="font-display t-mega italic text-ivory/80"
          >
            Үнэнийг хэлэхэд…
          </Fade>
        </div>

        {/* 2 · гол өгүүлбэр + жижиг үг */}
        <motion.div
          style={{ opacity: groupOut }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 text-center md:gap-14"
        >
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Fade p={p} inRange={[0.27, 0.35]} className={`${BIG} text-ivory`}>
              Та байгаагүй бол
            </Fade>
            <Fade p={p} inRange={[0.37, 0.45]} className={`${BIG} text-ivory`}>
              бидний туулсан олон зүйл
            </Fade>
            <Fade p={p} inRange={[0.47, 0.55]} className={`${BIG} italic text-gold-soft`}>
              илүү хэцүү байх байсан.
            </Fade>
          </div>
          <Fade p={p} inRange={[0.62, 0.7]} rise={16} className={SMALL}>
            Заримдаа ганц хүний ‘Би та хоёрт итгэж байна’ гэсэн мэдрэмж хүртэл цааш явах асар их хүч болдог юм байна.
          </Fade>
        </motion.div>

        {/* 3 · Тэр хүн үргэлж та байсан. */}
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <Fade
            p={p}
            inRange={[0.85, 0.94]}
            rise={30}
            className="font-display t-mega max-w-[14ch] italic text-gold-soft [text-shadow:0_0_60px_rgba(231,184,91,0.35)]"
          >
            Тэр хүн үргэлж та байсан.
          </Fade>
        </div>
      </div>
    </section>
  );
}
