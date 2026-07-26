"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { REVEAL_MS, useIntro } from "@/components/intro/IntroProvider";

const ease = [0.22, 1, 0.36, 1] as const;

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
  const revealing = phase !== "loading";
  // Keep the panel mounted until the shutter-up FINISHES, then drop it — never
  // jump straight to `phase === "done"` (that would cut the reveal short on
  // "plain" pages, which skip the intermediate "intro" phase entirely).
  const [gone, setGone] = useState(false);

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
            <Image
              src="/media/site/sauceTexture.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          {/* faint darkening so the emblem + progress stay legible */}
          <div className="absolute inset-0 bg-black/15" />

          {/* centre: black-backed Behrouz emblem + progress */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="relative grid size-24 place-items-center rounded-full bg-black shadow-2xl"
            >
              <motion.span
                aria-hidden
                className="absolute -inset-1 rounded-full bg-black/60 blur-lg"
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <Image
                src="/media/site/logo.png"
                alt="بهروز"
                width={60}
                height={60}
                priority
                className="relative"
              />
            </motion.div>

            {/* slim indeterminate progress */}
            <div className="h-[3px] w-28 overflow-hidden rounded-full bg-white/25">
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
