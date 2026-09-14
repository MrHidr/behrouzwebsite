"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroIntroVideo } from "./HeroIntroVideo";
import { HeroContent } from "./HeroContent";

/**
 * Scroll composition for the home hero (client — scroll-linked motion):
 *
 * - The intro video is `sticky` — pinned in the background; it plays once
 *   after the loader releases and freezes on its last frame.
 * - The content layer is pulled up over it (-mt-100svh) and scrolls normally.
 * - As the first viewport scrolls away, the hero copy LIFTS + FADES (parallax,
 *   like the /about hero) while the pinned video slowly zooms (1 → 1.12) and
 *   dims under a darkening scrim — so the About section doesn't just cover a
 *   static frame, it visibly "takes over" the shot.
 *
 * `children` = whatever slides over the video (the About section).
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);
  // 0 → 1 as the hero screen scrolls out of view.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scrollToNext = () => window.scrollBy({ top: window.innerHeight, behavior: "smooth" });

  // copy: lifts away faster than the scroll (parallax) and fades early
  const textY = useTransform(scrollYProgress, [0, 0.7], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  // video: slow push-in + darkening as the next section takes over
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const dim = useTransform(scrollYProgress, [0.15, 1], [0, 0.5]);

  return (
    <div className="relative">
      <div className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-black">
        <motion.div style={{ scale: videoScale }} className="absolute inset-0">
          <HeroIntroVideo />
        </motion.div>
        <motion.div style={{ opacity: dim }} aria-hidden className="pointer-events-none absolute inset-0 bg-black" />
      </div>

      <div className="relative z-10 -mt-[100svh]">
        {/* Hero text screen — transparent, video shows through, parallaxes up.
            The whole screen (video + copy) is clickable and smooth-scrolls
            to the next section, like the bouncing chevron cue. */}
        <section
          ref={heroRef}
          onClick={scrollToNext}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              scrollToNext();
            }
          }}
          aria-label="Scroll to next section"
          className="relative h-[100svh] cursor-pointer"
        >
          <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-0">
            <HeroContent />
          </motion.div>
        </section>

        {/* the first opaque home section slides over the pinned video */}
        {children}
      </div>
    </div>
  );
}
