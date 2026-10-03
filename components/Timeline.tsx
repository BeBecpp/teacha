"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

const ITEMS = [
  {
    title: "Итгэл",
    text: "Бидний санааг сонсож, туршиж үзэх боломжийг үргэлж өгсөн.",
  },
  {
    title: "Эрх чөлөө",
    text: "‘Болохгүй’ гэж хаахын оронд яаж болохыг нь хамт боддог байсан.",
  },
  {
    title: "Хамгаалалт",
    text: "Бусад хүмүүс биднийг буруу ойлгох үед ч бидний талд зогсдог байсан.",
  },
  {
    title: "Чиглэл",
    text: "Мэдэхгүй зүйл болгонд маань зааж, зөвлөж, дараагийн алхмыг харуулдаг байсан.",
  },
  {
    title: "Урам",
    text: "Бидний хийж байгаа зүйл үнэ цэнтэй гэдгийг мэдрүүлдэг байсан.",
  },
];

export function Timeline() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.6 });

  return (
    <section aria-labelledby="timeline-title" className="relative px-5 py-28 md:px-8 md:py-44">
      <div className="mx-auto max-w-5xl">
        <header className="mb-20 text-center md:mb-32">
          <Reveal>
            <p className="eyebrow mb-5">дурсамж</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 id="timeline-title" className="font-display t-title text-ivory">
              Таны бидэнд өгсөн зүйлс
            </h2>
          </Reveal>
        </header>

        <div ref={ref} className="relative">
          {/* Босоо шугам: суурь + гүйлгэхэд алтлаг дүүрэх хэсэг */}
          <div
            aria-hidden
            className="absolute bottom-3 top-3 left-[13px] w-px bg-ivory/10 md:left-1/2 md:-translate-x-1/2"
          />
          <motion.div
            aria-hidden
            style={{ scaleY: reduce ? 1 : fill }}
            className="absolute bottom-3 top-3 left-[13px] w-px origin-top bg-gradient-to-b from-gold/0 via-gold/80 to-gold md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="relative flex flex-col gap-16 md:gap-28">
            {ITEMS.map((item, i) => {
              const right = i % 2 === 1;
              return (
                <li
                  key={item.title}
                  className="grid grid-cols-[28px_1fr] items-start gap-x-5 md:grid-cols-[1fr_28px_1fr] md:gap-x-12"
                >
                  {/* Node */}
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.3 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5, margin: "0px 0px -18% 0px" }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 order-1 mt-[0.9rem] flex h-7 w-7 items-center justify-center bg-ink md:order-2"
                  >
                    <span className="glow-dot" />
                  </motion.span>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5, margin: "0px 0px -8% 0px" }}
                    transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`order-2 col-start-2 md:col-start-auto ${
                      right ? "md:order-3 md:text-left" : "md:order-1 md:text-right"
                    }`}
                  >
                    <p className="eyebrow mb-3 text-gold/80">0{i + 1}</p>
                    <h3 className="font-display text-[2.1rem] text-ivory md:text-[2.9rem]">{item.title}</h3>
                    <p
                      className={`mt-3 max-w-[34ch] text-[1.02rem] leading-[1.75] text-muted md:text-[1.08rem] ${
                        right ? "" : "md:ml-auto"
                      }`}
                    >
                      {item.text}
                    </p>
                  </motion.div>

                  {/* Хоосон нүд (desktop alternate) */}
                  <span aria-hidden className={`hidden md:block ${right ? "md:order-1" : "md:order-3"}`} />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
