"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import type { AnimationPlaybackControls } from "framer-motion";
import { Flower } from "./Flower";

const HOLD_SECONDS = 1.8;

// Тогтмол байрлалтай, санамсаргүй бус "тоос" — SSR/CSR зөрөхгүй
const MOTES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 3) * 0.37;
  const radius = 34 + ((i * 37) % 22); // %
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 46 + Math.sin(angle) * radius * 0.92,
    size: 2 + ((i * 5) % 3),
    o: 0.35 + ((i * 13) % 5) * 0.12,
    dx: ((i % 5) - 2) * 7,
    dy: -18 - ((i * 7) % 5) * 9,
    dur: 5 + ((i * 11) % 5),
    delay: -((i * 3) % 7),
  };
});

export function Intro() {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const holdAnim = useRef<AnimationPlaybackControls | null>(null);
  const bloomedRef = useRef(false);
  const holdStartedAt = useRef(0);
  const hintTimer = useRef<number | null>(null);

  const hold = useMotionValue(0);
  const open = useMotionValue(0);

  const [holding, setHolding] = useState(false);
  const [bloomed, setBloomed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [retry, setRetry] = useState(false);

  // DOM-ийг React-ээр дамжуулалгүй, шууд CSS хувьсагчаар шинэчилнэ (60fps)
  useMotionValueEvent(hold, "change", (v) => {
    stageRef.current?.style.setProperty("--hold", v.toFixed(4));
    if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - v);
    if (!bloomedRef.current) {
      // Барьж байх үед бөглөө аажмаар сэхрэн, 40%-ийг нээнэ
      const eased = 1 - Math.pow(1 - v, 2);
      open.set(eased * 0.4);
    }
  });
  useMotionValueEvent(open, "change", (v) => {
    stageRef.current?.style.setProperty("--open", v.toFixed(4));
  });

  // Дэлбээлэх хүртэл scroll түгжинэ, дараа нь чөлөөлнө
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!revealed) {
      root.style.overflow = "hidden";
      root.style.overscrollBehavior = "none";
    } else {
      root.style.overflow = "";
      root.style.overscrollBehavior = "";
    }
    return () => {
      root.style.overflow = "";
      root.style.overscrollBehavior = "";
    };
  }, [revealed]);

  const bloom = useCallback(() => {
    if (bloomedRef.current) return;
    bloomedRef.current = true;
    setBloomed(true);
    setHolding(false);
    try {
      navigator.vibrate?.([14, 50, 22]);
    } catch {
      /* ignore */
    }
    const duration = reduce ? 1.1 : 2.8;
    animate(open, 1, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => window.setTimeout(() => setRevealed(true), reduce ? 200 : 450),
    });
  }, [open, reduce]);

  const start = useCallback(() => {
    if (bloomedRef.current) return;
    holdAnim.current?.stop();
    holdStartedAt.current = performance.now();
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    setRetry(false);
    setHolding(true);
    const remaining = HOLD_SECONDS * (1 - hold.get());
    holdAnim.current = animate(hold, 1, {
      duration: Math.max(remaining, 0.05),
      ease: "linear",
      onComplete: bloom,
    });
  }, [bloom, hold]);

  const cancel = useCallback(() => {
    if (bloomedRef.current) return;
    holdAnim.current?.stop();
    setHolding(false);
    const progressed = hold.get();
    if (progressed > 0.02 && progressed < 1) {
      setRetry(true);
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
      hintTimer.current = window.setTimeout(() => setRetry(false), 3200);
    }
    holdAnim.current = animate(hold, 0, {
      duration: 0.25 + progressed * 0.9,
      ease: "easeOut",
    });
  }, [hold]);

  useEffect(
    () => () => {
      holdAnim.current?.stop();
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    },
    [],
  );

  const state = bloomed ? "bloomed" : holding ? "holding" : "idle";

  const scrollNext = () => {
    const next = document.getElementById("first-message");
    next?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      aria-label="Эхлэл"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-4"
    >
      <div ref={stageRef} className="intro-stage flex w-full max-w-6xl flex-col items-center py-10 text-center">
        <div className="intro-wash" aria-hidden />

        {/* Kicker — дэлбээлсний дараа зай нь хураагдана */}
        <div
          className="overflow-hidden transition-[max-height,margin] duration-[1600ms] ease-out"
          style={{ maxHeight: bloomed ? 0 : 90, marginBottom: bloomed ? 0 : "clamp(1.25rem, 3svh, 2rem)" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: bloomed ? 0 : 1, y: 0 }}
            transition={{ duration: bloomed ? 0.8 : 1.6, delay: bloomed ? 0 : 0.9 }}
            className="font-display text-[1.7rem] italic leading-tight text-ivory/90 md:text-[2.1rem]"
          >
            Алтанзул багшдаа…
          </motion.p>
        </div>

        {/* Flower + ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative transition-[width] duration-[2200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: bloomed
              ? "clamp(150px, min(38vw, 25svh), 230px)"
              : "clamp(220px, min(54vw, 40svh), 340px)",
            aspectRatio: "1 / 1",
          }}
        >
          <div className="intro-glow" aria-hidden />
          {MOTES.map((m, i) => (
            <span
              key={i}
              className="mote"
              aria-hidden
              style={
                {
                  "--x": `${m.x}%`,
                  "--y": `${m.y}%`,
                  "--size": `${m.size}px`,
                  "--o": m.o,
                  "--dx": `${m.dx}px`,
                  "--dy": `${m.dy}px`,
                  "--dur": `${m.dur}s`,
                  "--delay": `${m.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}

          <button
            type="button"
            data-state={state}
            disabled={bloomed}
            aria-label="Цэцгийг дэлбээлүүлэхийн тулд хоёр секунд орчим дарж барина уу"
            className="flower-button absolute inset-0 rounded-full"
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                /* pointer already released */
              }
              start();
            }}
            onPointerUp={cancel}
            onPointerCancel={cancel}
            onLostPointerCapture={cancel}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault();
                start();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") cancel();
            }}
            onBlur={cancel}
          >
            <Flower className="absolute inset-0 h-full w-full" />

            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full"
              style={{ opacity: bloomed ? 0 : 1, transition: "opacity 1.2s ease" }}
              aria-hidden
            >
              <circle className="ring-track" cx="50" cy="50" r="48.6" fill="none" strokeWidth="0.45" />
              <circle
                ref={ringRef}
                className="ring-progress"
                cx="50"
                cy="50"
                r="48.6"
                fill="none"
                strokeWidth="0.9"
                pathLength={1}
              />
            </svg>
          </button>
        </motion.div>

        {/* Hint ⇄ Reveal — нэг нүдэнд давхарласан тул байрлал үсрэхгүй */}
        <div className="mt-5 grid w-full place-items-start justify-items-center md:mt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: bloomed ? 0 : 1 }}
            transition={{ duration: bloomed ? 0.7 : 1.6, delay: bloomed ? 0 : 1.9 }}
            style={{ gridArea: "1 / 1" }}
            className="pt-2"
            aria-hidden={bloomed}
          >
            <p className="font-display text-[1.45rem] text-ivory md:text-[1.75rem]">Энэ цэцгийг дэлбээлүүлээрэй.</p>
            <p
              className="mt-3 text-[0.8rem] tracking-[0.04em] text-muted transition-colors duration-500"
              style={{ color: retry ? "#f1d596" : undefined }}
              role="status"
            >
              {retry ? "Бага зэрэг удаан барьж байгаарай…" : "дарж, барьж байгаарай"}
            </p>
          </motion.div>

          <div style={{ gridArea: "1 / 1" }} className="flex w-full flex-col items-center" aria-hidden={!bloomed}>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display t-hero max-w-[min(100%,19ch)] text-ivory md:max-w-[26ch]"
            >
              Багш нарын баярын мэнд хүргэе, <span className="italic text-gold-soft">Алтанзул багшаа.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance mt-5 max-w-[36ch] text-[1.02rem] leading-relaxed text-muted md:mt-7 md:text-[1.15rem]"
            >
              Танд хэлэхийг хүсдэг байсан хэдэн үг бий.
            </motion.p>
            <motion.button
              type="button"
              onClick={scrollNext}
              tabIndex={revealed ? 0 : -1}
              aria-label="Доош гүйлгэх"
              initial={{ opacity: 0 }}
              animate={{ opacity: revealed ? 1 : 0 }}
              transition={{ duration: 1.4, delay: 1.9 }}
              className="absolute bottom-3 left-1/2 flex min-h-11 min-w-11 -translate-x-1/2 flex-col items-center gap-2 rounded-full px-4 py-2 md:bottom-5"
            >
              <span className="eyebrow text-[0.62rem]">доош</span>
              <span className="scroll-cue-line" aria-hidden />
            </motion.button>
          </div>
        </div>

        <p className="sr-only-live" aria-live="polite">
          {bloomed ? "Цэцэг дэлбээлэв." : ""}
        </p>
      </div>
    </section>
  );
}
