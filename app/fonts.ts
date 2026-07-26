import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

// Persian primary — Yekan Bakh. Weights we actually ship: 100/200/300/400/500/800.
export const yekanBakh = localFont({
  src: [
    { path: "./fonts/YekanBakh-Hairline.ttf", weight: "100", style: "normal" },
    { path: "./fonts/YekanBakh-Thin.ttf", weight: "200", style: "normal" },
    { path: "./fonts/YekanBakh-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/YekanBakh-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/YekanBakh-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/YekanBakh-Heavy.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-yekan",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

// Persian secondary / decorative script — Dast Nevis.
export const dastNevis = localFont({
  src: [{ path: "./fonts/DastNevis.otf", weight: "400", style: "normal" }],
  variable: "--font-dast",
  display: "swap",
  fallback: ["cursive"],
});

// Latin — Montserrat (served from Google, self-hosted at build by next/font).
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});
