"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ABOUT_MEDIA, BRAND } from "@/lib/site";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { UpRightBox } from "@/components/ui/icons";

// #fefefd, so the fade blends seamlessly into the section background.
const BLEND = "254,254,253";

// White gradient overlays lifted verbatim from Figma so they match exactly.
// Desktop: fades the photo out towards the left (the text side).
const DESKTOP_GRAD = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1008 1008' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23g)'/><defs><radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-68.233 -35.35 49.348 -214.32 774.67 587)'><stop stop-color='rgba(${BLEND},0)' offset='0'/><stop stop-color='rgba(${BLEND},1)' offset='1'/></radialGradient></defs></svg>")`;
// Mobile: fades the photo out towards the top (the text side).
const MOBILE_GRAD = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 653 653' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23g)'/><defs><radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-0.40733 -38.027 105.11 -28.232 501.84 380.27)'><stop stop-color='rgba(${BLEND},0)' offset='0'/><stop stop-color='rgba(${BLEND},1)' offset='1'/></radialGradient></defs></svg>")`;

/** Copy block (logo → title → body → button). Alignment via text-align only. */
function AboutCopy({ align }: { align: "side" | "center" }) {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  return (
    <motion.div
      dir={en ? "ltr" : "rtl"}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      // "side" = hug the reading edge (right in fa, left in en); text-align
      // follows the locale direction automatically via `dir` + text-start.
      className={align === "side" ? "text-start" : "text-center"}
    >
      <Image
        src={BRAND.logo}
        alt=""
        width={90}
        height={90}
        className="mb-2 inline-block size-[68px] align-middle lg:size-[90px]"
      />
      <h2 className={`${font} font-extrabold leading-none text-[#302929] ${en ? "text-[34px] lg:text-[52px]" : "text-[40px] lg:text-[64px]"}`}>
        {t(STR.about.title)}
      </h2>
      <p className={`mx-auto mt-4 max-w-[42ch] ${font} text-[14.5px] font-normal leading-[1.7] tracking-[-0.01em] text-[#302929] sm:text-[15px] lg:mx-0 lg:mt-5 lg:max-w-none ${en ? "lg:text-[16px]" : "lg:text-[18px]"}`}>
        {t(STR.about.storyHome)}
      </p>
      <div className="mt-6">
        <Link
          href="/about"
          className="group inline-flex items-center gap-1.5 rounded-[32px] bg-white p-2.5 align-middle shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className={`${font} text-[15px] font-extrabold text-[#f51414] lg:text-[16px]`}>
            {t(STR.about.cta)}
          </span>
          <UpRightBox className="size-6 text-[#f51414] transition-transform duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * "About Behrouz". The factory photo bleeds out of the section, softened by a
 * white gradient that fades it into the background on the text side — left→right
 * on desktop, top→bottom on mobile (both taken straight from Figma).
 */
export function AboutSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fefefd]">
      {/* ---------- Desktop ---------- */}
      <div className="relative mx-auto hidden min-h-[100svh] w-full max-w-[1512px] lg:block">
        {/* oversized square photo, anchored right, bleeding top/bottom */}
        <div className="pointer-events-none absolute right-[-2vw] top-1/2 aspect-square h-[118%] -translate-y-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ABOUT_MEDIA.image}
            alt=""
            className="absolute inset-0 size-full select-none object-cover"
            draggable={false}
          />
          <div className="absolute inset-0" style={{ backgroundImage: DESKTOP_GRAD }} />
        </div>

        {/* text column: physical left ~2/5, vertically centered */}
        <div dir="ltr" className="relative z-10 flex min-h-[100svh] items-center justify-start">
          <div className="w-2/5 max-w-[560px] pl-[6vw] pr-6">
            <AboutCopy align="side" />
          </div>
        </div>
      </div>

      {/* ---------- Mobile: copy on top, photo rises up behind it ----------
          The photo block keeps a guaranteed visible height and slides UP under
          the copy (negative margin + lower z-index), so with the shortened copy
          both the text and the factory photo are always fully in view without a
          tall empty gap. */}
      <div className="relative flex flex-col pb-[6vh] lg:hidden">
        <div className="relative z-10 px-6 pt-28">
          <AboutCopy align="center" />
        </div>
        <div className="relative z-0 -mt-6 h-[52svh] min-h-[300px]">
          {/* min() clamp: 150vw in portrait, height-derived in short landscape
              so the square photo can't blow up on a rotated phone */}
          <div className="pointer-events-none absolute left-1/2 top-0 aspect-square w-[min(150vw,180svh)] max-w-none -translate-x-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ABOUT_MEDIA.imageMobile}
              alt=""
              className="absolute inset-0 size-full select-none object-cover"
              draggable={false}
            />
            <div className="absolute inset-0" style={{ backgroundImage: MOBILE_GRAD }} />
          </div>
        </div>
      </div>
    </section>
  );
}
