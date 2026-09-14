"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { REVEAL_MS, useIntro } from "@/components/intro/IntroProvider";

const ease = [0.22, 1, 0.36, 1] as const;

// Lossless WebP keeps every source pixel while reducing transfer size.
// Selection is derived directly from the pathname so the server and first
// client render always agree.
const LOADING_BACKGROUNDS = [
  "/media/site/LoadingBack1.webp",
  "/media/site/LoadingBack3.webp",
  "/media/site/LoadingBack2.webp",
] as const;

function loadingBackgroundFor(pathname: string) {
  const hash = Array.from(pathname).reduce(
    (value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0,
    0,
  );
  return LOADING_BACKGROUNDS[hash % LOADING_BACKGROUNDS.length];
}

/**
 * Branded loading screen. Timing lives in IntroProvider; this component renders
 * a full-screen sauce texture that starts BLACK & WHITE and blooms into full
 * colour while the assets load, with the Behrouz emblem on a black disc.
 *
 * When the intro releases, the whole panel SHUTTERS UP (slides off the top,
 * کرکره‌ای به بالا) to reveal the page beneath — on the home page that's the
 * hero video, which is already playing by the time the shutter clears.
 */
export function Loader() {
  const { phase, variant } = useIntro();
  const pathname = usePathname();
  const revealing = phase !== "loading";
  // Keep the panel mounted until the shutter-up FINISHES, then drop it — never
  // jump straight to `phase === "done"` (that would cut the reveal short on
  // "plain" pages, which skip the intermediate "intro" phase entirely).
  const [gone, setGone] = useState(false);
  const backgroundSrc = loadingBackgroundFor(pathname);

  useEffect(() => {
    if (!revealing) {
      setGone(false); // a new navigation started a fresh loading cycle
      return;
    }
    const id = window.setTimeout(() => setGone(true), REVEAL_MS + 120);
    return () => window.clearTimeout(id);
  }, [revealing]);

  const visible = !gone;
  const cinematic = variant === "cinematic";
  // How long the black&white → full-colour bloom takes (tied to the hold time
  // so it lands on full colour just as the shutter goes up).
  const colorMs = cinematic ? 1900 : 900;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] overflow-hidden bg-black"
          initial={{ y: "0%" }}
          // shutter up: the whole section slides off the top
          animate={{ y: revealing ? "-100%" : "0%" }}
          transition={{ duration: REVEAL_MS / 1000, ease }}
        >
          {/* sauce texture — starts B&W + dim, blooms into full colour */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ filter: "grayscale(1) saturate(0.35) brightness(0.6)" }}
            animate={{ filter: "grayscale(0) saturate(1.08) brightness(1)" }}
            transition={{ duration: colorMs / 1000, ease }}
          >
            <motion.div
              key={backgroundSrc}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.025 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease }}
            >
              <Image
                src={backgroundSrc}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          {/* faint darkening so the emblem + progress stay legible */}
          <div className="absolute inset-0 bg-black/15" />

          {/* centre: white-backed Behrouz emblem + progress */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.68, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.65, ease }}
              className="relative grid size-32 place-items-center rounded-full bg-white p-2 shadow-[0_22px_70px_rgba(0,0,0,.32)] sm:size-36"
            >
              <motion.span
                aria-hidden
                className="absolute -inset-2 -z-10 rounded-full border-2 border-white/70"
                animate={{ scale: [0.94, 1.16], opacity: [0.75, 0] }}
                transition={{ duration: 1.45, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="relative size-full"
                animate={{ scale: [1, 1.035, 1], y: [0, -2, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/media/site/behrouz-logo.png"
                  alt="بهروز"
                  fill
                  priority
                  sizes="160px"
                  className="object-contain"
                />
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28, ease }}
              className="mt-4 font-yekan text-[15px] font-extrabold text-white drop-shadow-md sm:text-[16px]"
            >
              دوست من سلام
            </motion.p>

            {/* slim indeterminate progress */}
            <div className="mt-5 h-[3px] w-28 overflow-hidden rounded-full bg-white/25">
              <motion.div
                className="h-full w-1/2 rounded-full bg-white"
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
