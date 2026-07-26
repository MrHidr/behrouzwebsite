"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HERO_LINK } from "@/lib/heroConfig";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useIntroPhase } from "@/components/intro/IntroProvider";
import { ArrowDown } from "@/components/ui/icons";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const line = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroContent() {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const titleFont = en ? "font-montserrat" : "font-yekan";
  const phase = useIntroPhase();
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
      {/* darkening gradient anchored to the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/60 via-black/25 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        // Hold hidden while the intro video plays; the provider flips to
        // `done` when playback passes ~3s, so the copy staggers in over the
        // shot's final second and settles as the video freezes.
        animate={phase === "done" ? "show" : "hidden"}
        className="relative flex flex-col items-center gap-2 px-6 pb-14 text-center sm:gap-3 sm:pb-20 lg:pb-28"
        // viewport-fit=cover: clear the notch (landscape) & home indicator
        style={{
          paddingLeft: "max(1.5rem, env(safe-area-inset-left))",
          paddingRight: "max(1.5rem, env(safe-area-inset-right))",
        }}
      >
        <motion.p
          variants={line}
          className={
            en
              ? "font-montserrat text-[18px] font-medium italic text-white/85 sm:text-[22px] lg:text-[26px]"
              : "font-dast text-[22px] text-white/90 sm:text-[28px] lg:text-[32px]"
          }
        >
          {t(STR.hero.script)}
        </motion.p>

        <motion.h1
          variants={line}
          className={`${titleFont} font-extrabold leading-[1.08] text-white ${
            en
              ? "max-w-[16ch] text-[30px] sm:text-[44px] lg:text-[62px]"
              : "text-[34px] leading-[1.05] sm:text-[52px] lg:text-[80px]"
          }`}
        >
          {t(STR.hero.title)}
        </motion.h1>

        <motion.div variants={line} className="pointer-events-auto">
          <Link
            href={HERO_LINK}
            onClick={(e) => e.stopPropagation()}
            className={`group inline-flex items-center gap-1 ${titleFont} text-[15px] font-medium text-white/75 transition-colors duration-300 hover:text-white sm:text-[18px] lg:text-[20px]`}
          >
            <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-white/70 after:transition-transform after:duration-300 group-hover:after:origin-left group-hover:after:scale-x-100">
              {t(STR.hero.eyebrow)}
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* scroll-down cue: appears after the copy settles, gently bounces, and
          jumps one viewport down to the About section on click */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }}
        aria-label={en ? "Scroll down" : "به پایین بروید"}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "done" ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease }}
        className="pointer-events-auto absolute bottom-4 left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full border border-white/30 bg-white/5 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 sm:size-12 lg:bottom-6"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <motion.span
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="size-5" />
        </motion.span>
      </motion.button>
    </div>
  );
}
