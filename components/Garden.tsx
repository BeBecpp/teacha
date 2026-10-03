"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Flower } from "./Flower";
import { Reveal } from "./Reveal";
import { Terminal } from "./Terminal";

/* ───────── Ургамлын цуврал SVG-үүд (суурь нь (0,0), дээшээ сөрөг y) ───────── */

const STEM = "#829b72";
const STEM_DEEP = "#5f7753";
const GOLD = "#e7b85b";
const GOLD_SOFT = "#f1d596";
const IVORY = "#f7f3ea";

function Tulip({ h = 150 }: { h?: number }) {
  const k = h / 150;
  return (
    <g transform={`scale(${k})`}>
      <path d="M0 0 C 4 -50 -4 -100 0 -118" stroke={STEM} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 -20 C -30 -34 -40 -66 -36 -92 C -16 -76 -4 -50 0 -20Z" fill={STEM_DEEP} opacity=".75" />
      <path d="M0 -38 C 26 -50 34 -76 30 -98 C 12 -84 2 -62 0 -38Z" fill={STEM} opacity=".6" />
      <g className="head">
        <path d="M0 -112 C -22 -112 -26 -140 -16 -164 C -8 -154 -2 -134 0 -112Z" fill={GOLD} opacity=".9" />
        <path d="M0 -112 C 22 -112 26 -140 16 -164 C 8 -154 2 -134 0 -112Z" fill={GOLD} opacity=".9" />
        <path d="M0 -110 C -14 -122 -12 -152 0 -176 C 12 -152 14 -122 0 -110Z" fill={GOLD_SOFT} />
      </g>
    </g>
  );
}

function Lotus({ h = 130 }: { h?: number }) {
  const k = h / 130;
  return (
    <g transform={`scale(${k})`}>
      <path d="M0 0 C -3 -40 3 -80 0 -104" stroke={STEM} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 -26 C 30 -30 52 -48 56 -72 C 30 -70 8 -54 0 -26Z" fill={STEM} opacity=".6" />
      <g className="head" transform="translate(0 -104)">
        {[-62, -32, 32, 62].map((a) => (
          <ellipse key={a} cx="0" cy="-26" rx="9" ry="30" transform={`rotate(${a})`} fill={GOLD} opacity=".55" />
        ))}
        {[-44, -16, 16, 44].map((a) => (
          <ellipse key={a} cx="0" cy="-30" rx="9.5" ry="34" transform={`rotate(${a})`} fill={GOLD_SOFT} opacity=".8" />
        ))}
        <ellipse cx="0" cy="-30" rx="10" ry="36" fill={IVORY} opacity=".92" />
        <circle cx="0" cy="-2" r="4" fill="#fff3cf" />
      </g>
    </g>
  );
}

function Daisy({ h = 120 }: { h?: number }) {
  const k = h / 120;
  return (
    <g transform={`scale(${k})`}>
      <path d="M0 0 C 5 -36 -4 -70 0 -92" stroke={STEM} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M0 -30 C -24 -30 -38 -46 -40 -62 C -20 -60 -6 -50 0 -30Z" fill={STEM_DEEP} opacity=".7" />
      <g className="head" transform="translate(0 -92)">
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-19" rx="4.6" ry="16" transform={`rotate(${i * 30})`} fill={IVORY} opacity=".88" />
        ))}
        <circle r="8" fill={GOLD} />
        <circle r="3.2" fill="#fff3cf" />
      </g>
    </g>
  );
}

function Sprig({ h = 140 }: { h?: number }) {
  const k = h / 140;
  const leaves: Array<[number, number]> = [
    [-24, 1],
    [-46, -1],
    [-68, 1],
    [-90, -1],
  ];
  return (
    <g transform={`scale(${k})`}>
      <path d="M0 0 C -6 -50 6 -100 0 -132" stroke={STEM} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {leaves.map(([y, d], i) => (
        <path
          key={i}
          d={`M0 ${y} C ${d * 22} ${y - 4} ${d * 36} ${y - 14} ${d * 38} ${y - 26} C ${d * 20} ${y - 22} ${d * 6} ${y - 12} 0 ${y}Z`}
          fill={i % 2 ? STEM : STEM_DEEP}
          opacity=".7"
        />
      ))}
      <g className="head" transform="translate(0 -132)">
        <circle r="6" fill={GOLD} />
        <circle cx="-9" cy="10" r="3.2" fill={GOLD_SOFT} opacity=".9" />
        <circle cx="9" cy="14" r="3" fill={GOLD_SOFT} opacity=".8" />
      </g>
    </g>
  );
}

type Item = {
  kind: "tulip" | "lotus" | "daisy" | "sprig";
  x: number;
  h: number;
  d: number; // delay (s)
  sw: number; // sway (s)
  o?: number;
};

// viewBox 0 0 1000 380, суурь нь y=370
const ITEMS: Item[] = [
  { kind: "sprig", x: 70, h: 120, d: 0.9, sw: 9, o: 0.7 },
  { kind: "daisy", x: 150, h: 128, d: 0.3, sw: 7.5 },
  { kind: "tulip", x: 235, h: 170, d: 0.6, sw: 8.5 },
  { kind: "sprig", x: 305, h: 150, d: 1.2, sw: 10, o: 0.8 },
  { kind: "lotus", x: 372, h: 150, d: 0.1, sw: 8 },
  { kind: "daisy", x: 440, h: 100, d: 1.5, sw: 6.8, o: 0.85 },
  { kind: "tulip", x: 565, h: 118, d: 1.0, sw: 9.2, o: 0.9 },
  { kind: "lotus", x: 630, h: 168, d: 0.4, sw: 7.8 },
  { kind: "sprig", x: 700, h: 138, d: 1.4, sw: 9.6, o: 0.8 },
  { kind: "tulip", x: 770, h: 172, d: 0.2, sw: 8.8 },
  { kind: "daisy", x: 845, h: 134, d: 0.8, sw: 7.2 },
  { kind: "lotus", x: 925, h: 118, d: 1.3, sw: 9, o: 0.85 },
];

const KINDS = { tulip: Tulip, lotus: Lotus, daisy: Daisy, sprig: Sprig };

export function Garden() {
  const gardenRef = useRef<HTMLDivElement>(null);
  const show = useInView(gardenRef, { once: true, amount: 0.35 });
  const [open, setOpen] = useState(false);
  const clicks = useRef(0);
  const lastClick = useRef(0);

  const onSecret = () => {
    const now = performance.now();
    clicks.current = now - lastClick.current > 2200 ? 1 : clicks.current + 1;
    lastClick.current = now;
    if (clicks.current >= 3) {
      clicks.current = 0;
      setOpen(true);
    }
  };

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), 30000);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <section aria-labelledby="garden-title" className="relative overflow-hidden pt-28 md:pt-44">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 id="garden-title" className="font-display t-title text-ivory">
            Таны өгсөн итгэл бүр <br className="hidden sm:block" />
            хаа нэгтээ <span className="italic text-gold-soft">цэцэг</span> болж үлддэг байх.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 md:mt-24">
          <p className="font-display text-[1.75rem] italic text-ivory/90 md:text-[2.3rem]">
            Баярлалаа, Алтанзул багшаа.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 md:mt-20" duration={1.8}>
          <p className="font-display t-mega text-ivory">
            Багш нарын баярын мэнд хүргэе. <span className="inline-block not-italic">❤️</span>
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 md:mt-14" duration={1.8}>
          <p className="font-display text-[1.35rem] tracking-[0.04em] text-gold-soft md:text-[1.7rem]">
            Баярбаясгалан <span className="px-1 text-muted">&amp;</span> Хүслэн
          </p>
        </Reveal>
      </div>

      {/* Цэцэрлэг */}
      <div
        ref={gardenRef}
        data-show={show}
        className="garden relative mt-16 h-[300px] w-full md:mt-24 md:h-[430px]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(130,155,114,0.2), rgba(130,155,114,0) 70%)",
          }}
        />
        <svg
          viewBox="0 0 1000 380"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
          focusable="false"
        >
          {ITEMS.map((it, i) => {
            const Plant = KINDS[it.kind];
            return (
              <g key={i} transform={`translate(${it.x} 372)`} opacity={it.o ?? 1}>
                <g className="grow" style={{ "--d": `${it.d}s` } as React.CSSProperties}>
                  <g className="sway" style={{ "--d": `${it.d}s`, "--sw": `${it.sw}s` } as React.CSSProperties}>
                    <Plant h={it.h} />
                  </g>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Эхний цэцэг — дахин энд. 3 дарвал нууц нээгдэнэ */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <button
            type="button"
            onClick={onSecret}
            aria-label="Төгсгөлийн цэцэг"
            className="garden-secret relative mb-[101px] block w-[190px] rounded-full md:mb-[140px] md:w-[280px]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[-40%] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(231,184,91,0.3), rgba(231,184,91,0.08) 40%, rgba(231,184,91,0) 65%)",
                opacity: show ? 1 : 0,
                transition: "opacity 3s ease 0.6s",
              }}
            />
            <div
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "translateY(0)" : "translateY(30px)",
                transition: "opacity 2.2s ease 0.2s, transform 2.4s cubic-bezier(.16,1,.3,1) 0.2s",
              }}
            >
              <Flower staticOpen={1} stemFade={false} className="relative h-auto w-full" />
            </div>
          </button>
        </div>
      </div>

      <Terminal open={open} onClose={close} />
    </section>
  );
}
