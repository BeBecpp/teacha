"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

type Keyword = {
  label: string;
  quote: string;
  /** desktop байрлал (%) */
  x: number;
  y: number;
  /** mobile байрлал (%) */
  mx: number;
  my: number;
  dur: number;
  delay: number;
  fx: number;
  fy: number;
};

const KEYWORDS: Keyword[] = [
  {
    label: "Итгэл",
    quote: "Бид өөрсдөөсөө эргэлзэх үед хүртэл та бидэнд итгэдэг байсан.",
    x: 14, y: 30, mx: 28, my: 10, dur: 7.5, delay: -1, fx: 8, fy: -10,
  },
  {
    label: "Дэмжлэг",
    quote: "Хийхийг хүссэн зүйл бүрийг маань эхлээд ойлгохыг хичээдэг байсан.",
    x: 34, y: 14, mx: 72, my: 20, dur: 9, delay: -4, fx: -9, fy: 8,
  },
  {
    label: "Тэвчээр",
    quote: "Нэг зүйлийг олон дахин асуухад ч та залхдаггүй, дахин тайлбарлаж өгдөг байсан.",
    x: 57, y: 26, mx: 30, my: 31, dur: 8.2, delay: -2, fx: 10, fy: 9,
  },
  {
    label: "Эрх чөлөө",
    quote: "Бидэнд өөрсдийнхөөрөө туршиж, алдаж, дахин оролдох зай үлдээдэг байсан.",
    x: 80, y: 16, mx: 70, my: 42, dur: 10, delay: -6, fx: -7, fy: -9,
  },
  {
    label: "Боломж",
    quote: "Таны нээж өгсөн нэг хаалга бидний хувьд бүхэл бүтэн зам болсон.",
    x: 22, y: 64, mx: 27, my: 53, dur: 8.6, delay: -3, fx: 9, fy: 8,
  },
  {
    label: "Хамгаалалт",
    quote: "Бусад нь биднийг буруу ойлгоход ч таны хоолой үргэлж бидний талд байсан.",
    x: 46, y: 52, mx: 68, my: 63, dur: 9.4, delay: -5, fx: -8, fy: 10,
  },
  {
    label: "Зөвлөгөө",
    quote: "Замаасаа төөрөх үед минь нэг өгүүлбэрээр зөв чиглэлийг заадаг байсан.",
    x: 70, y: 70, mx: 33, my: 74, dur: 7.8, delay: -2.5, fx: 8, fy: -8,
  },
  {
    label: "Урам",
    quote: "Бидний хийж буй зүйл үнэ цэнэтэй гэдгийг та үргэлж мэдрүүлдэг байсан.",
    x: 88, y: 46, mx: 72, my: 85, dur: 9.8, delay: -7, fx: -9, fy: -7,
  },
  {
    label: "Итгэлцэл",
    quote: "Таны итгэлд бид үйлдлээрээ хариулахыг үргэлж хичээсэн.",
    x: 8, y: 86, mx: 24, my: 94, dur: 8.9, delay: -1.5, fx: 7, fy: -9,
  },
];

// Дэвсгэр одод — тогтмол (SSR/CSR зөрөхгүй)
const STARS = Array.from({ length: 44 }, (_, i) => ({
  x: (i * 53.7 + 11) % 100,
  y: (i * 37.9 + 7) % 100,
  size: 1 + ((i * 7) % 3) * 0.6,
  dur: 3.5 + ((i * 13) % 6),
  delay: -((i * 17) % 9),
  lo: 0.05 + ((i * 3) % 4) * 0.04,
  hi: 0.28 + ((i * 11) % 5) * 0.08,
}));

export function Constellation() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : KEYWORDS[active];
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Мессеж нүдний өмнө байхгүй бол л аажуухан харуулна
  useEffect(() => {
    if (active === null) return;
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 24 || r.top < 0) {
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
  }, [active, reduce]);

  return (
    <section
      aria-labelledby="constellation-title"
      className="relative overflow-hidden bg-gradient-to-b from-ink via-surface/60 to-ink px-5 py-28 md:py-44"
    >
      <div className="mx-auto max-w-5xl">
        <header className="text-center">
          <Reveal>
            <p className="eyebrow mb-5">од бүр нэг баярлалаа</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="constellation-title" className="font-display t-title mx-auto max-w-[18ch] text-ivory">
              Танд баярлах шалтгаан маш олон.
            </h2>
          </Reveal>
        </header>

        <Reveal className="mt-12 md:mt-16" duration={1.8} y={0}>
          {/* Одод */}
          <div className="relative mx-auto h-[500px] w-full md:h-[480px]">
            {STARS.map((s, i) => (
              <span
                key={i}
                aria-hidden
                className="star"
                style={
                  {
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: s.size,
                    height: s.size,
                    "--dur": `${s.dur}s`,
                    "--delay": `${s.delay}s`,
                    "--lo": s.lo,
                    "--hi": s.hi,
                  } as React.CSSProperties
                }
              />
            ))}

            {/* Одод хоорондын нарийн шугам */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 hidden h-full w-full md:block"
            >
              <polyline
                points={KEYWORDS.map((k) => `${k.x},${k.y}`).join(" ")}
                fill="none"
                stroke="rgba(231,184,91,0.16)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="2 6"
              />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full md:hidden"
            >
              <polyline
                points={KEYWORDS.map((k) => `${k.mx},${k.my}`).join(" ")}
                fill="none"
                stroke="rgba(231,184,91,0.14)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="2 6"
              />
            </svg>

            <ul className="contents">
              {KEYWORDS.map((k, i) => (
                <li
                  key={k.label}
                  className="kw"
                  style={{ "--x": `${k.x}%`, "--y": `${k.y}%`, "--mx": `${k.mx}%`, "--my": `${k.my}%` } as React.CSSProperties}
                >
                  <div
                    className="kw-float"
                    style={
                      {
                        "--dur": `${k.dur}s`,
                        "--delay": `${k.delay}s`,
                        "--fx": `${k.fx}px`,
                        "--fy": `${k.fy}px`,
                      } as React.CSSProperties
                    }
                  >
                    <button
                      type="button"
                      className="kw-button"
                      aria-pressed={active === i}
                      aria-controls="constellation-message"
                      onClick={() => setActive(active === i ? null : i)}
                    >
                      <span className="kw-dot" aria-hidden />
                      <span className="kw-label">{k.label}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Мессеж */}
        <div
          id="constellation-message"
          ref={stageRef}
          role="status"
          aria-live="polite"
          className="relative mx-auto mt-6 flex min-h-[210px] max-w-xl items-start justify-center text-center md:mt-10 md:min-h-[190px]"
        >
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.label}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-[28px] border border-gold/20 bg-gradient-to-b from-gold/[0.07] to-transparent px-7 py-8 md:px-10 md:py-10"
              >
                <p className="font-display text-[1.9rem] text-gold-soft md:text-[2.2rem]">{current.label}</p>
                <span aria-hidden className="mx-auto my-4 block h-px w-10 bg-gold/50" />
                <p className="font-display text-[1.45rem] font-medium leading-[1.5] text-ivory md:text-[1.75rem]">
                  “{current.quote}”
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="pt-6 text-[0.95rem] text-muted"
              >
                Нэг одыг сонгоод үзээрэй.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
