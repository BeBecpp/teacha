"use client";

import { useId, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

type Pt = [number, number];
type Bez = [Pt, Pt, Pt, Pt];

function bezier([p0, p1, p2, p3]: Bez, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

const toD = ([p0, p1, p2, p3]: Bez) =>
  `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;

type Scene = {
  viewBox: string;
  w: number;
  h: number;
  light: Pt;
  a: Bez;
  b: Bez;
  /** градиентийн чиглэл (userSpaceOnUse) */
  grad: { x1: number; y1: number; x2: number; y2: number };
  labelA: Pt;
  labelB: Pt;
};

const WIDE: Scene = {
  viewBox: "0 0 1200 620",
  w: 1200,
  h: 620,
  light: [1010, 205],
  a: [[70, 520], [370, 590], [570, 360], [850, 318]],
  b: [[70, 330], [340, 150], [620, 400], [880, 128]],
  grad: { x1: 70, y1: 0, x2: 1000, y2: 0 },
  labelA: [0, 36],
  labelB: [0, -26],
};

const TALL: Scene = {
  viewBox: "0 0 400 760",
  w: 400,
  h: 760,
  light: [200, 96],
  a: [[84, 700], [34, 540], [112, 390], [118, 236]],
  b: [[318, 700], [372, 520], [292, 380], [284, 226]],
  grad: { x1: 0, y1: 700, x2: 0, y2: 120 },
  labelA: [0, 38],
  labelB: [0, 38],
};

function Orb({
  t,
  path,
  offset,
  label,
  tone,
  fontSize,
}: {
  t: MotionValue<number>;
  path: Bez;
  offset: Pt;
  label: string;
  tone: "ivory" | "sage";
  fontSize: number;
}) {
  const cx = useTransform(t, (v) => bezier(path, v)[0]);
  const cy = useTransform(t, (v) => bezier(path, v)[1]);
  const lx = useTransform(t, (v) => bezier(path, v)[0] + offset[0]);
  const ly = useTransform(t, (v) => bezier(path, v)[1] + offset[1]);
  const core = tone === "ivory" ? "#fff8e8" : "#d4e6c4";
  const halo = tone === "ivory" ? "rgba(255,243,214,0.55)" : "rgba(160,196,140,0.55)";

  return (
    <g>
      <motion.circle cx={cx} cy={cy} r={30} fill={halo} opacity={0.35} />
      <motion.circle cx={cx} cy={cy} r={15} fill={halo} opacity={0.55} />
      <motion.circle cx={cx} cy={cy} r={6.5} fill={core} />
      <motion.text
        x={lx}
        y={ly}
        textAnchor="middle"
        fontSize={fontSize}
        letterSpacing="0.02em"
        fill="#f7f3ea"
        fillOpacity={0.82}
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
      >
        {label}
      </motion.text>
    </g>
  );
}

function PathScene({
  scene,
  p,
  className,
  hidden,
}: {
  scene: Scene;
  p: MotionValue<number>;
  className: string;
  hidden?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const tA = useTransform(p, [0.1, 0.82], [0, 0.9]);
  const tB = useTransform(p, [0.1, 0.82], [0, 0.88]);
  const [lx, ly] = scene.light;
  const g = scene.grad;

  return (
    <svg
      viewBox={scene.viewBox}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden={hidden}
      role="img"
      aria-label="Хоёр жижиг гэрэл алтан гэрэл рүү чиглэн явж байна"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${uid}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff3cf" stopOpacity="1" />
          <stop offset="0.14" stopColor="#f6d58f" stopOpacity="0.95" />
          <stop offset="0.38" stopColor="#e7b85b" stopOpacity="0.34" />
          <stop offset="1" stopColor="#e7b85b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-lit`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
          <stop offset="0" stopColor="#f7f3ea" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="#f1d596" stopOpacity="0.62" />
          <stop offset="1" stopColor="#ffe8b0" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${uid}-dim`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
          <stop offset="0" stopColor="#f7f3ea" stopOpacity="0.1" />
          <stop offset="1" stopColor="#e7b85b" stopOpacity="0.32" />
        </linearGradient>
      </defs>

      {/* Алтан гэрэл (Алтанзул багш) */}
      <g className="halo">
        <circle cx={lx} cy={ly} r={scene.w > 800 ? 340 : 230} fill={`url(#${uid}-sun)`} opacity={0.55} />
        <circle cx={lx} cy={ly} r={scene.w > 800 ? 120 : 82} fill={`url(#${uid}-sun)`} />
      </g>
      <text
        x={lx}
        y={ly + (scene.w > 800 ? 92 : 70)}
        textAnchor="middle"
        fontSize={scene.w > 800 ? 21 : 23}
        fill="#f1d596"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
      >
        Алтанзул багш
      </text>

      {/* Замууд — бүдэг суурь */}
      <path d={toD(scene.a)} fill="none" stroke={`url(#${uid}-dim)`} strokeWidth={1.4} strokeDasharray="1 7" strokeLinecap="round" />
      <path d={toD(scene.b)} fill="none" stroke={`url(#${uid}-dim)`} strokeWidth={1.4} strokeDasharray="1 7" strokeLinecap="round" />

      {/* Явсан зам — гэрэлд гэрэлтэнэ */}
      <motion.path d={toD(scene.a)} fill="none" stroke={`url(#${uid}-lit)`} strokeWidth={1.8} strokeLinecap="round" style={{ pathLength: tA }} />
      <motion.path d={toD(scene.b)} fill="none" stroke={`url(#${uid}-lit)`} strokeWidth={1.8} strokeLinecap="round" style={{ pathLength: tB }} />

      <Orb t={tA} path={scene.a} offset={scene.labelA} label="Баярбаясгалан" tone="ivory" fontSize={scene.w > 800 ? 17 : 19} />
      <Orb t={tB} path={scene.b} offset={scene.labelB} label="Хүслэн" tone="sage" fontSize={scene.w > 800 ? 17 : 19} />
    </svg>
  );
}

export function TwoLights() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const fixed = useTransform(scrollYProgress, () => 0.78);
  const p = reduce ? fixed : scrollYProgress;

  const captionOpacity = useTransform(p, [0.74, 0.9], [0, 1]);
  const captionY = useTransform(p, [0.74, 0.9], [18, 0]);

  return (
    <section
      ref={ref}
      aria-label="Хоёр сурагч, нэг багш"
      className={`relative bg-gradient-to-b from-ink via-ink-deep to-ink ${reduce ? "py-24" : "h-[300svh]"}`}
    >
      <div className={reduce ? "relative" : "sticky top-0 flex h-svh flex-col overflow-hidden"}>
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pt-6 md:px-8">
          {/* Desktop / tablet: хэвтээ */}
          <PathScene
            scene={WIDE}
            p={p}
            className="hidden h-full max-h-[78svh] w-full max-w-[1280px] overflow-visible md:landscape:block"
          />
          {/* Mobile: босоо */}
          <PathScene
            scene={TALL}
            p={p}
            hidden
            className="block h-full max-h-[74svh] w-full max-w-[460px] overflow-visible md:landscape:hidden"
          />
        </div>

        <motion.p
          style={{ opacity: captionOpacity, y: captionY }}
          className="font-display mx-auto max-w-[30ch] px-6 pb-[max(2.5rem,6svh)] text-center text-[1.35rem] italic leading-[1.5] text-ivory md:max-w-[52ch] md:text-[2rem]"
        >
          Зарим хүн замыг чинь зааж өгдөггүй.
          <br />
          Зүгээр л замаар чинь явах зориг өгдөг.
        </motion.p>
      </div>
    </section>
  );
}
