import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Caveat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Монгол кирилл (Ө, Ү) нь "cyrillic-ext" дэд олонлогт байдаг тул хоёуланг нь ачаална.
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-manrope",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Алтанзул багшдаа",
  description:
    "Багш нарын баярын мэнд хүргэе, Алтанзул багшаа. — Баярбаясгалан & Хүслэн",
  robots: { index: false, follow: false },
  applicationName: "Алтанзул багшдаа",
};

export const viewport: Viewport = {
  themeColor: "#0B0C10",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="mn"
      className={`${cormorant.variable} ${manrope.variable} ${caveat.variable} ${jetbrains.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
