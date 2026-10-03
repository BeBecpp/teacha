"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { AmbientPlayer } from "@/lib/ambient";

export function SoundButton() {
  const player = useRef<AmbientPlayer | null>(null);
  const [on, setOn] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const show = window.setTimeout(() => setHint(true), 3500);
    const hide = window.setTimeout(() => setHint(false), 11000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) player.current?.pauseForHidden();
      else player.current?.resumeFromHidden();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      player.current?.stop();
    };
  }, []);

  const toggle = async () => {
    setHint(false);
    if (!player.current) player.current = new AmbientPlayer();
    if (on) {
      player.current.stop();
      setOn(false);
    } else {
      try {
        await player.current.start();
        setOn(true);
      } catch {
        setOn(false);
      }
    }
  };

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-1 md:right-6 md:top-6">
      <AnimatePresence>
        {hint && !on && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none hidden text-[0.74rem] tracking-[0.06em] text-muted sm:block"
          >
            зөөлөн хөгжим
          </motion.span>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Хөгжмийг унтраах" : "Зөөлөн хөгжим асаах"}
        className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-ink/60 text-ivory/80 backdrop-blur-sm transition-colors hover:border-gold/40 hover:text-gold-soft"
      >
        {on ? <Volume2 size={18} strokeWidth={1.6} aria-hidden /> : <VolumeX size={18} strokeWidth={1.6} aria-hidden />}
      </button>
    </div>
  );
}
