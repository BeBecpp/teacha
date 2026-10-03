"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const COMMAND = '> teacher.check("Altanzul")';
const CHECKS = ["kindness: unlimited", "patience: unlimited", "support: unlimited", "trust: unlimited"];

type Props = { open: boolean; onClose: () => void };

export function Terminal({ open, onClose }: Props) {
  const reduce = useReducedMotion();
  // step 0: хоосон · 1: команд бичигдэж байна · 2..5: шалгалтууд · 6: result · 7: тайлбар
  const [typed, setTyped] = useState(0);
  const [step, setStep] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      setTyped(0);
      setStep(0);
      return;
    }
    if (reduce) {
      setTyped(COMMAND.length);
      setStep(7);
      return;
    }
    const timers: number[] = [];
    let t = 350;
    setStep(1);
    for (let i = 1; i <= COMMAND.length; i++) {
      t += 38;
      timers.push(window.setTimeout(() => setTyped(i), t));
    }
    t += 450;
    for (let s = 2; s <= 5; s++) {
      timers.push(window.setTimeout(() => setStep(s), t));
      t += 420;
    }
    t += 250;
    timers.push(window.setTimeout(() => setStep(6), t));
    t += 900;
    timers.push(window.setTimeout(() => setStep(7), t));
    return () => timers.forEach(window.clearTimeout);
  }, [open, reduce]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="terminal"
          role="dialog"
          aria-label="Нууц терминал"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 160, damping: 22 }}
          className="fixed inset-x-4 bottom-5 z-50 mx-auto w-auto max-w-[34rem] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f14]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] backdrop-blur-sm md:bottom-8"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#28c840]/80" aria-hidden />
            <span className="ml-3 font-mono text-[0.72rem] text-muted">altanzul@teacher: ~</span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Терминалыг хаах"
              className="ml-auto flex h-11 w-11 -mr-3 items-center justify-center rounded-full text-muted transition-colors hover:text-ivory"
            >
              <X size={16} aria-hidden />
            </button>
          </div>

          <div className="px-5 pb-6 pt-5 font-mono text-[0.82rem] leading-[1.9] text-ivory/90 md:text-[0.9rem]">
            <p className={step === 1 ? "caret" : ""}>
              <span className="text-gold">{COMMAND.slice(0, 1)}</span>
              {COMMAND.slice(1, typed)}
            </p>

            <ul className="mt-3 space-y-0.5">
              {CHECKS.map((c, i) => (
                <li
                  key={c}
                  className="transition-opacity duration-500"
                  style={{ opacity: step >= i + 2 ? 1 : 0 }}
                >
                  <span className="text-sage">✓</span> {c.split(":")[0]}:{" "}
                  <span className="text-gold-soft">{c.split(": ")[1]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 transition-opacity duration-700" style={{ opacity: step >= 6 ? 1 : 0 }}>
              <p className="text-muted">result:</p>
              <p>
                <span className="text-ivory">BEST_TEACHER</span> <span className="text-muted">=</span>{" "}
                <span className="text-gold">true</span>
              </p>
            </div>

            <p
              className="mt-5 border-t border-white/[0.07] pt-4 font-sans text-[0.95rem] leading-relaxed text-gold-soft transition-opacity duration-1000"
              style={{ opacity: step >= 7 ? 1 : 0 }}
            >
              Энийг зөвхөн мэдээлэл зүйн хамгийн сайн багш л олно :)
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
