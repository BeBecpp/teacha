import { useId, type CSSProperties } from "react";

type Petal = {
  /** Бүрэн дэлбээлсэн үеийн өнцөг (deg) */
  a: number;
  /** Бөглөө үеийн өнцөг (deg) */
  c: number;
  /** Урт/өргөний харьцаа */
  s: number;
  ring: 0 | 1 | 2;
};

// Ар талаас урд тал руу: гаднах → дунд → дотор
const PETALS: Petal[] = [
  { a: -84, c: -15, s: 1, ring: 0 },
  { a: 84, c: 15, s: 1, ring: 0 },
  { a: -58, c: -10, s: 1.06, ring: 0 },
  { a: 58, c: 10, s: 1.06, ring: 0 },
  { a: -70, c: -8, s: 0.9, ring: 1 },
  { a: 70, c: 8, s: 0.9, ring: 1 },
  { a: -30, c: -5, s: 1, ring: 1 },
  { a: 30, c: 5, s: 1, ring: 1 },
  { a: -40, c: -4, s: 0.7, ring: 2 },
  { a: 40, c: 4, s: 0.7, ring: 2 },
  { a: 0, c: 0, s: 0.84, ring: 2 },
];

const PETAL_PATH = "M0 0 C -36 -34 -46 -104 0 -164 C 46 -104 36 -34 0 0 Z";
const LEAF_PATH = "M0 0 C -48 -4 -88 -28 -100 -72 C -54 -68 -14 -40 0 0 Z";

const STAMENS: Array<[number, number]> = [
  [-22, -74],
  [-11, -90],
  [0, -98],
  [11, -90],
  [22, -74],
  [-6, -66],
  [7, -68],
];

type FlowerProps = {
  className?: string;
  style?: CSSProperties;
  /** Хэрэв өгвөл --open-ийг статикаар тогтооно (цэцэрлэгт ашиглана) */
  staticOpen?: number;
  /** Иш болон навчийг харуулах эсэх */
  stem?: boolean;
  /** Ишний доод хэсэг бүдгэрэх эсэх (intro-д true, цэцэрлэгт false) */
  stemFade?: boolean;
  title?: string;
};

export function Flower({ className, style, staticOpen, stem = true, stemFade = true, title }: FlowerProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const g0 = `${uid}-r0`;
  const g1 = `${uid}-r1`;
  const g2 = `${uid}-r2`;
  const gs = `${uid}-stem`;
  const gh = `${uid}-heart`;

  const rootStyle = {
    ...(staticOpen !== undefined ? { ["--open" as string]: staticOpen } : null),
    ...style,
  } as CSSProperties;

  const rings = [g0, g1, g2];

  return (
    <svg
      viewBox="0 0 400 400"
      className={`flower ${className ?? ""}`}
      style={rootStyle}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={g0} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7d5a1d" />
          <stop offset="1" stopColor="#d2a049" />
        </linearGradient>
        <linearGradient id={g1} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#a87b2c" />
          <stop offset="1" stopColor="#efc775" />
        </linearGradient>
        <linearGradient id={g2} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#dcbc7c" />
          <stop offset="1" stopColor="#fff4d6" />
        </linearGradient>
        <radialGradient id={gh}>
          <stop offset="0" stopColor="#fff3cf" stopOpacity="0.95" />
          <stop offset="1" stopColor="#e7b85b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={gs} gradientUnits="userSpaceOnUse" x1="0" y1="285" x2="0" y2={stemFade ? 438 : 600}>
          <stop offset="0" stopColor="#829b72" />
          <stop offset="0.55" stopColor="#6f8761" stopOpacity="0.85" />
          <stop offset="1" stopColor="#4d6444" stopOpacity={stemFade ? 0 : 0.85} />
        </linearGradient>
      </defs>

      {stem && (
        <g>
          <path
            d="M200 285 C 196 360 208 470 200 600"
            fill="none"
            stroke={`url(#${gs})`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g transform={`translate(200 ${stemFade ? 340 : 438})`}>
            <path className="leaf" d={LEAF_PATH} fill="#829b72" opacity="0.6" />
          </g>
          <g transform={`translate(200 ${stemFade ? 376 : 486}) scale(-0.8 0.8)`}>
            <path className="leaf" d={LEAF_PATH} fill="#829b72" opacity="0.5" />
          </g>
        </g>
      )}

      <g transform="translate(200 285)">
        {/* Тавгийн навч */}
        <path d="M0 0 C -26 4 -44 -6 -50 -30 C -26 -26 -8 -16 0 0 Z" fill="#6f8761" opacity="0.75" />
        <path d="M0 0 C 26 4 44 -6 50 -30 C 26 -26 8 -16 0 0 Z" fill="#6f8761" opacity="0.75" />

        {PETALS.map((p, i) => (
          <path
            key={i}
            className="petal"
            d={PETAL_PATH}
            fill={`url(#${rings[p.ring]})`}
            style={{ ["--a" as string]: p.a, ["--c" as string]: p.c, ["--s" as string]: p.s } as CSSProperties}
          />
        ))}

        <circle className="heart" cx="0" cy="-58" r="34" fill={`url(#${gh})`} />
        <g className="stamens" fill="#fff3cf">
          {STAMENS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.4" />
          ))}
        </g>
      </g>
    </svg>
  );
}
