"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Reveal } from "./Reveal";

const PARAGRAPHS = [
  "Бид хоёрт үргэлж итгэж, дэмжиж, мэдэхгүй зүйл бүрийг маань зааж чиглүүлж, хүссэн зүйлээ туршиж үзэх боломж олгодог танд үнэхээр их баярладаг.",
  "Заримдаа бидний хийж байгаа зүйлийг бусад хүн ойлгохгүй, эсвэл биднийг зэмлэх үе гардаг байсан ч та бидний талд зогсож, учрыг маань ойлгож, хамгаалж, улам хичээх урам өгдөг байсан.",
  "Та бидэнд зөвхөн хичээл заагаад зогсохгүй өөрсдийн сонирхсон зүйлээ хөгжүүлэх, шинийг турших, алдаа гаргахаас айхгүй байх боломжийг үргэлж өгсөн.",
  "Бидний санааг сонсож, “болохгүй” гэж хаахын оронд яаж болохыг нь хамт боддог багштай байна гэдэг үнэхээр азтай хэрэг.",
  "Та байгаагүй бол бид хоёрын туулсан олон зүйл илүү хэцүү байх байсан.",
  "Бидний одоо сурч, бүтээж, хийж байгаа зүйлсэд таны өгсөн итгэл, боломж, зөвлөгөө маш том хувь нэмэртэй.",
];

const P_CLASS =
  "font-display text-[1.32rem] font-semibold leading-[1.7] tracking-normal text-[#2b241b] [text-wrap:pretty] md:text-[1.5rem] md:leading-[1.72]";

export function Letter() {
  const sigRef = useRef<HTMLDivElement>(null);
  const sigInView = useInView(sigRef, { once: true, amount: 0.8 });

  return (
    <section aria-labelledby="letter-title" className="relative overflow-x-clip px-4 py-28 md:py-44">
      {/* Цаадах дулаан гэрэл */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 40% 42% at 50% 50%, rgba(231,184,91,0.13), rgba(231,184,91,0) 70%)",
        }}
      />

      <motion.article
        initial={{ opacity: 0, y: 70, rotate: -1.4 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ type: "spring", stiffness: 55, damping: 16, mass: 1.1 }}
        className="paper relative mx-auto max-w-[44rem] rounded-[6px] px-[1.4rem] py-14 md:rounded-[8px] md:px-[4.5rem] md:py-[4.5rem]"
      >
        {/* Дээд талын жижиг ургамлын тэмдэг */}
        <svg
          aria-hidden
          viewBox="0 0 60 40"
          className="mx-auto mb-8 h-9 w-14"
          fill="none"
          stroke="#8a5f14"
          strokeWidth="1.2"
          strokeLinecap="round"
        >
          <path d="M30 38V14" />
          <path d="M30 14c-6-3-8-8-6-12 6 1 8 6 6 12Z" fill="#c9953a" fillOpacity=".35" />
          <path d="M30 14c6-3 8-8 6-12-6 1-8 6-6 12Z" fill="#c9953a" fillOpacity=".35" />
          <path d="M30 26c-7 0-12-3-14-8 7-1 12 2 14 8Z" />
          <path d="M30 30c7 0 12-3 14-8-7-1-12 2-14 8Z" />
        </svg>

        <h2
          id="letter-title"
          className="font-display text-[1.9rem] font-semibold italic leading-tight text-[#2b241b] [text-wrap:pretty] md:text-[2.5rem]"
        >
          Хүндэт Алтанзул багшдаа,
        </h2>

        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:gap-7">
          {PARAGRAPHS.map((text, i) => (
            <Reveal key={i} as="p" className={P_CLASS} y={14} duration={1.2} amount={0.35}>
              {text}
            </Reveal>
          ))}

          <Reveal as="p" className={`${P_CLASS} text-[#2b241b]`} y={14} amount={0.35}>
            Биднийг үргэлж ойлгож, хамгаалж, дэмждэгт тань баярлалаа.
          </Reveal>

          <Reveal as="p" className={`${P_CLASS} font-semibold`} y={14} amount={0.35}>
            Танд үнэхээр их баярлалаа, багшаа.
          </Reveal>

          <Reveal as="p" className={`${P_CLASS} italic text-[#6b4a10]`} y={14} amount={0.35}>
            Багш нарын баярын мэнд хүргэе.
          </Reveal>
        </div>

        {/* Гарын үсэг */}
        <div ref={sigRef} className="mt-10 md:mt-14">
          <div className="relative inline-block">
            <p
              className={`signature font-hand text-[2.35rem] font-semibold leading-[1.15] text-[#3a2c14] md:text-[3.1rem] ${
                sigInView ? "is-writing" : ""
              }`}
            >
              — Баярбаясгалан &amp; Хүслэн
            </p>
            <svg
              aria-hidden
              viewBox="0 0 320 18"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 h-3 w-full"
              fill="none"
            >
              <motion.path
                d="M4 12C60 4 120 15 170 9S270 6 316 11"
                stroke="#8a5f14"
                strokeWidth="1.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={sigInView ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.1, delay: 2.6, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
