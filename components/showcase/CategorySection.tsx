"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CATEGORY_SCENES,
  DEFAULT_SCENE_BG,
  SHOWCASE_CATEGORIES,
  SHOWCASE_DEFAULT,
  type ScenePos,
} from "@/lib/site";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

const CATS = SHOWCASE_CATEGORIES;
const N = CATS.length;

const spring = { type: "spring" as const, stiffness: 260, damping: 34 };

/**
 * Locks the section height to the viewport height captured at load, updating
 * ONLY when the width changes (orientation / desktop resize) — not on the
 * height changes a mobile URL bar causes while scrolling. That's what stops the
 * section from "jumping" as the address bar collapses.
 */
function useLockedHeight() {
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    let w = window.innerWidth;
    const set = () => setH(window.innerHeight);
    set();
    const onResize = () => {
      if (window.innerWidth !== w) {
        w = window.innerWidth;
        set();
      }
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", set);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", set);
    };
  }, []);
  return h;
}

export function CategorySection() {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const [active, setActive] = useState(SHOWCASE_DEFAULT);
  const [mobile, setMobile] = useState(false);
  const lockedH = useLockedHeight();

  useEffect(() => {
    // "Mobile" scene positions are tuned for PORTRAIT (widths in % of a
    // narrow viewport). A landscape phone is wide but short, so it reads the
    // DESKTOP positions instead — proportionate to the wide stage — and the
    // svh clamp below keeps bottles inside the short viewport.
    const mq = window.matchMedia("(max-width: 1023px) and (orientation: portrait)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const GAP1 = mobile ? 150 : 300;
  const GAP2 = mobile ? 100 : 200;
  const baseTitleFa = mobile ? 34 : 80;
  const baseCaption = mobile ? 13 : 30;
  // English names run longer than their Persian counterparts, so they get
  // their own (smaller) scale and are allowed to wrap onto two lines instead
  // of forcing the rail wider.
  const baseTitleEn = mobile ? 17 : 38;

  const offsetFor = (d: number) =>
    d === 0 ? 0 : Math.sign(d) * (GAP1 + (Math.abs(d) - 1) * GAP2);

  const wrap = (i: number) => ((i % N) + N) % N;
  const dist = (i: number) => {
    let d = i - active;
    d = ((d % N) + N) % N;
    if (d > N / 2) d -= N;
    return d;
  };
  const scaleFor = (d: number) => (d === 0 ? 1 : Math.abs(d) === 1 ? 0.7 : 0.4);

  // Touch-swipe over the PRODUCT area (not just the names rail): a horizontal
  // drag changes category; a real tap still navigates. `touch-action: pan-y`
  // keeps vertical page scroll native while we own horizontal gestures.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const onBottlesTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    swiped.current = false;
  };
  const onBottlesTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true; // horizontal → change category (matches the rail)
      setActive((a) => wrap(a + (dx < 0 ? 1 : -1)));
    }
    touchStart.current = null;
  };
  // Cancel the Link navigation if the gesture was a swipe, not a tap.
  const onBottlesClickCapture = (e: React.MouseEvent) => {
    if (swiped.current) {
      e.preventDefault();
      e.stopPropagation();
      swiped.current = false;
    }
  };

  const cat = CATS[active];
  const scene = CATEGORY_SCENES[cat.slug];
  const bg = scene?.bg ?? DEFAULT_SCENE_BG;

  // Desktop: 8% taller than viewport so bottles clear the category titles and
  // the next section slides over nicely. Mobile portrait: keep the section at
  // ~90% of the viewport so there is no large void between the category rail
  // (top) and the product bottles (absolute bottom-0).
  const sectionStyle = lockedH
    ? { height: Math.round(lockedH * (mobile ? 0.90 : 1.08)) }
    : undefined;

  return (
    <section
      id="categories"
      aria-label="دسته‌بندی محصولات"
      style={sectionStyle}
      className="relative flex h-[90svh] min-h-[540px] w-full flex-col overflow-hidden bg-[#2a0a0a] py-14 max-lg:landscape:min-h-0 max-lg:landscape:py-8 lg:h-[108svh] lg:min-h-[620px] lg:py-12"
    >
      {/* ---------- background (splash) ---------- */}
      <AnimatePresence>
        <motion.img
          key={bg}
          src={bg}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/[0.06] backdrop-blur-[3px]" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

      {/* ---------- product bottles: staggered entrance + gentle float ---------- */}
      <Link
        href={`/products/${cat.slug}`}
        aria-label={cat.fa}
        className="absolute inset-0 z-10"
        style={{ touchAction: "pan-y" }}
        onTouchStart={onBottlesTouchStart}
        onTouchEnd={onBottlesTouchEnd}
        onClickCapture={onBottlesClickCapture}
      >
        <div className="relative mx-auto h-full w-full max-w-[1512px]">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={cat.slug}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {scene ? (
                scene.products.map((p, i) => {
                  const pos: ScenePos = mobile ? p.m : p.d;
                  const amp = (mobile ? 6 : 11) + i * 2;
                  return (
                    <div
                      key={i}
                      className="absolute bottom-0"
                      style={{
                        left: `${pos.left}%`,
                        width: `${pos.width}%`,
                        // short-landscape guard: a bottle can never outgrow
                        // the viewport height, whatever % of width it asks for
                        maxWidth: "46svh",
                        transform: `translateX(-50%) translateY(${pos.bleed}%)`,
                        zIndex: pos.z,
                      }}
                    >
                      {/* entrance — plays when the section scrolls into view */}
                      <motion.div
                        initial={{ opacity: 0, y: 70, scale: 0.92 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.75,
                          delay: 0.12 + i * 0.14,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {/* continuous float */}
                        <motion.div
                          animate={{ y: [0, -amp, 0] }}
                          transition={{
                            duration: 5 + i * 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.src}
                            alt=""
                            className="h-auto w-full select-none"
                            style={{ transform: `rotate(${pos.rotate}deg)` }}
                            draggable={false}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  );
                })
              ) : (
                <span className="absolute inset-x-0 bottom-[28%] flex justify-center">
                  <span className={`rounded-full bg-black/40 px-5 py-2 ${en ? "font-montserrat" : "font-yekan"} text-sm font-extrabold text-white/90 backdrop-blur`}>
                    {t(STR.common.productsSoon)}
                  </span>
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Link>

      {/* ---------- Click hint ---------- */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-30 px-4 text-center ${en ? "font-montserrat" : "font-yekan"} text-[13px] font-medium text-white/50 lg:text-[15px]`}
      >
        {t(STR.common.clickImageHint)}
      </motion.p>

      {/* ---------- Category rail (smooth draggable slider) ---------- */}
      <div className="relative z-30 mt-1 h-[120px] w-full overflow-hidden lg:h-[150px]">
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          drag="x"
          dragSnapToOrigin
          dragElastic={0.16}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            const steps = Math.round(info.offset.x / GAP1);
            if (steps) setActive(wrap(active - steps));
          }}
        >
          {CATS.map((c, i) => {
            const d = dist(i);
            const hidden = Math.abs(d) > 2;
            return (
              <motion.div
                key={c.slug}
                className="absolute left-1/2 top-1/2 w-max"
                animate={{
                  x: offsetFor(d),
                  opacity: hidden ? 0 : 1,
                  color: d === 0 ? "#ffffff" : "rgba(255,255,255,0.5)",
                }}
                transition={spring}
                style={{ pointerEvents: hidden ? "none" : "auto" }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <motion.button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={en ? c.en : c.fa}
                    aria-current={d === 0}
                    className={
                      en
                        ? "flex select-none flex-col items-center text-center uppercase outline-none"
                        : "flex w-max select-none flex-col items-center whitespace-nowrap uppercase outline-none"
                    }
                    style={en ? { originX: 0.5, originY: 0.5, width: mobile ? 130 : 260 } : { originX: 0.5, originY: 0.5 }}
                    animate={{ scale: scaleFor(d) }}
                    transition={spring}
                  >
                    {en ? (
                      // English mode: English only, smaller, wraps to 2 lines.
                      <span
                        className="font-montserrat font-extrabold leading-[1.08]"
                        style={{ fontSize: baseTitleEn }}
                      >
                        {c.en}
                      </span>
                    ) : (
                      <>
                        <span className="font-yekan font-extrabold leading-none" style={{ fontSize: baseTitleFa }}>
                          {c.fa}
                        </span>
                        <span className="mt-1 font-montserrat font-extrabold leading-none" style={{ fontSize: baseCaption }}>
                          {c.en}
                        </span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* arrows (desktop) */}
      <button
        type="button"
        onClick={() => setActive(wrap(active - 1))}
        aria-label="قبلی"
        className="absolute left-3 top-1/2 z-40 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors duration-300 hover:bg-white/25 lg:grid xl:left-8"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        onClick={() => setActive(wrap(active + 1))}
        aria-label="بعدی"
        className="absolute right-3 top-1/2 z-40 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors duration-300 hover:bg-white/25 lg:grid xl:right-8"
      >
        <ChevronRight />
      </button>

      {/* dots (mobile) */}
      <div className="relative z-30 mt-4 flex justify-center gap-2 lg:hidden">
        {CATS.map((c, i) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-label={c.fa}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === active ? 20 : 8,
              backgroundColor: i === active ? "#ffffff" : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
