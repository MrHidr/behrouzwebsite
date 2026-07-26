"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_SCENES, PRODUCT_CATEGORIES, type ScenePos } from "@/lib/site";
import type { Bi, Locale } from "@/lib/i18n";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { CatalogCategory, CatalogProduct, ProductVariant } from "@/lib/catalog";
import { BarcodeIcon, CubeIcon, WeightIcon } from "@/components/ui/icons";
import { CategoryNavRow } from "./CategoryNavRow";

const ease = [0.22, 1, 0.36, 1] as const;

const faDigits = (s: string) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
const seqLabel = (n: number, locale: Locale) => {
  const s = String(n).padStart(2, "0");
  return locale === "fa" ? faDigits(s) : s;
};

/** Blends a hex colour with white at `amount` (0–1) into a fully OPAQUE hex —
 *  used instead of an alpha channel so section backgrounds never look
 *  translucent / let anything bleed through during the sticky-stack scroll. */
function tintWithWhite(hex: string, amount: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c: number) => Math.round(c * amount + 255 * (1 - amount));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

/** One rendered card = one product *variant* (sizes are never merged). */
type Card = {
  product: CatalogProduct;
  variant: ProductVariant;
  /** product ships in several sizes → weight chip distinguishes the cards */
  multi: boolean;
  /** 1-based position within the sub-category (editorial numbering) */
  seq: number;
  total: number;
};

type Block =
  | { kind: "divider"; z: number; subId: string; title: Bi; color: string; first: boolean }
  | { kind: "cards"; z: number; color: string; subTitle: Bi; cards: Card[]; sticky: boolean; anchorId?: string };

export function CategoryDetailPage({ data }: { data: CatalogCategory }) {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const [mobile, setMobile] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    // Portrait-only: landscape phones are wide-but-short, so they use the
    // DESKTOP scene positions (proportionate to a wide stage); the svh clamp
    // on each bottle keeps them inside the short viewport.
    const mq = window.matchMedia("(max-width: 1023px) and (orientation: portrait)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const scene = data.hasScene ? CATEGORY_SCENES[data.slug] : undefined;
  const multiSub = data.subs.length > 1;

  const scrollTo = (id: string) => {
    document.getElementById(`sub-${id}`)?.scrollIntoView({ behavior: "smooth" });
  };
  const bottleSubId = (i: number) => (multiSub ? data.subs[i]?.id : data.subs[0]?.id);

  // Flatten each sub into variant-level cards, chunked ≤2 per screen.
  // Dividers exist only between sub-categories (multi-sub pages); the last
  // screen of each sub (except the final one) is sticky, so ONLY the next
  // sub's divider performs the "comes over the previous section" reveal —
  // screens within a sub scroll normally.
  const blocks: Block[] = [];
  let z = 1;
  data.subs.forEach((sub, si) => {
    if (multiSub) {
      blocks.push({ kind: "divider", z: z++, subId: sub.id, title: sub.sectionTitle, color: sub.color, first: si === 0 });
    }
    const cards: Card[] = sub.products.flatMap((p) =>
      p.variants.map((v) => ({
        product: p,
        variant: v,
        multi: p.variants.length > 1,
        seq: 0,
        total: 0,
      }))
    );
    cards.forEach((c, i) => {
      c.seq = i + 1;
      c.total = cards.length;
    });
    // Default rhythm is pairs of 2. When `fullWidthEvery` is set (e.g. jams),
    // every Nth card breaks the pairing and renders alone/full-width.
    const chunks: Card[][] = [];
    const everyN = data.fullWidthEvery;
    if (everyN && everyN > 1) {
      for (let i = 0; i < cards.length; ) {
        const posInCycle = i % everyN;
        if (posInCycle === everyN - 1) {
          chunks.push(cards.slice(i, i + 1));
          i += 1;
        } else {
          chunks.push(cards.slice(i, i + 2));
          i += 2;
        }
      }
    } else {
      for (let i = 0; i < cards.length; i += 2) chunks.push(cards.slice(i, i + 2));
    }
    const isLastSub = si === data.subs.length - 1;
    chunks.forEach((chunk, ci) => {
      blocks.push({
        kind: "cards",
        z: z++,
        color: sub.color,
        subTitle: sub.sectionTitle,
        cards: chunk,
        sticky: multiSub && ci === chunks.length - 1 && !isLastSub,
        // single-sub pages have no divider, so the first screen carries the anchor
        anchorId: !multiSub && ci === 0 ? `sub-${sub.id}` : undefined,
      });
    });
  });

  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative flex h-[100svh] min-h-[640px] w-full flex-col overflow-hidden bg-[#2a0a0a] max-lg:landscape:min-h-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.bg} alt="" className="pointer-events-none absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-black/[0.06] backdrop-blur-[3px]" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />

        {scene && (
          <div className="pointer-events-none absolute inset-0 z-10">
            <div className="relative mx-auto h-full w-full max-w-[1512px]">
              {scene.products.map((p, i) => {
                const pos: ScenePos = mobile ? p.m : p.d;
                const desktopLeft = [16, 30, 44][i] ?? pos.left * 0.55;
                const left = mobile ? pos.left : desktopLeft;
                const subId = bottleSubId(i);
                const focused = hovered === subId;
                const dimmed = hovered !== null && !focused;
                const amp = (mobile ? 6 : 11) + i * 2;
                return (
                  <div
                    key={i}
                    className="pointer-events-auto absolute bottom-0 cursor-pointer"
                    style={{
                      left: `${left}%`,
                      width: `${pos.width}%`,
                      // short-landscape guard: bottles never outgrow the viewport height
                      maxWidth: "44svh",
                      transform: `translateX(-50%) translateY(${pos.bleed}%)`,
                      zIndex: focused ? 40 : pos.z,
                    }}
                    onMouseEnter={() => subId && setHovered(subId)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => subId && scrollTo(subId)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 70, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.75, delay: 0.15 + i * 0.14, ease }}
                    >
                      <motion.div
                        animate={{
                          y: [0, -amp, 0],
                          scale: focused ? 1.08 : 1,
                          filter: dimmed ? "blur(4px) brightness(0.7)" : "blur(0px) brightness(1)",
                        }}
                        transition={{
                          y: { duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 },
                          scale: { duration: 0.5, ease },
                          filter: { duration: 0.4, ease },
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.src} alt="" className="h-auto w-full select-none" style={{ transform: `rotate(${pos.rotate}deg)` }} draggable={false} />
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* top breadcrumb nav */}
        <div className="relative z-30 flex justify-center px-4 pt-24 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="no-scrollbar flex max-w-full items-center gap-2 overflow-x-auto rounded-[32px] bg-black/25 p-1.5 backdrop-blur-md"
          >
            <span className={`hidden shrink-0 px-3 text-[13px] font-extrabold text-white sm:block ${font}`}>
              {t(STR.nav.productsMenuTitle)}
            </span>
            {PRODUCT_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/products/${c.slug}`}
                className={`shrink-0 rounded-[20px] px-3 py-2 text-[13px] whitespace-nowrap transition-colors duration-300 ${font} ${
                  c.slug === data.slug ? "bg-white font-extrabold text-behrouz-ink" : "font-medium text-white/70 hover:text-white"
                }`}
              >
                {en ? c.labelEn : c.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* title + sub buttons — pinned to the physical RIGHT in both
            directions (bottles occupy the left), with reading order restored
            inside via the locale dir. */}
        <div className="relative z-30 mt-auto w-full px-6 pb-16 lg:pb-20">
          <div dir="ltr" className="flex w-full flex-col items-center gap-5 lg:items-end lg:pr-[8vw]">
            <motion.div
              dir={en ? "ltr" : "rtl"}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
              className="flex flex-col items-center text-center lg:items-end lg:text-right"
            >
              {en ? (
                <>
                  <h1 className="font-montserrat text-[52px] font-extrabold uppercase leading-none text-white lg:text-[92px]">{data.title.en}</h1>
                  <p className="font-yekan text-[20px] font-extrabold text-white/90 lg:text-[28px]">{data.title.fa}</p>
                </>
              ) : (
                <>
                  <h1 className="font-yekan text-[72px] font-extrabold uppercase leading-none text-white lg:text-[120px]">{data.title.fa}</h1>
                  <p className="font-montserrat text-[22px] font-extrabold uppercase text-white lg:text-[32px]">{data.title.en}</p>
                </>
              )}
            </motion.div>

            {multiSub && (
              <motion.div
                dir={en ? "ltr" : "rtl"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease }}
                className="no-scrollbar flex max-w-full items-center gap-2.5 overflow-x-auto px-1"
              >
                {data.subs.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseEnter={() => setHovered(s.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => scrollTo(s.id)}
                    className={`shrink-0 whitespace-nowrap rounded-[32px] px-4 py-3 ${font} text-[15px] font-medium text-white backdrop-blur-md transition-colors duration-300 lg:text-[16px]`}
                    style={{ backgroundColor: hovered === s.id ? s.color : "rgba(0,0,0,0.25)" }}
                  >
                    {t(s.label)}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ============ DIVIDERS + PRODUCT SCREENS ============ */}
      <div className="relative">
        {blocks.map((b, i) =>
          b.kind === "divider" ? (
            <SubDivider key={i} z={b.z} id={`sub-${b.subId}`} title={b.title} color={b.color} first={b.first} />
          ) : (
            <ProductScreen key={i} z={b.z} color={b.color} subTitle={b.subTitle} cards={b.cards} sticky={b.sticky} anchorId={b.anchorId} />
          )
        )}
      </div>

      <CategoryNavRow currentSlug={data.slug} />
    </div>
  );
}

/* Half-height divider between sub-categories: big locale title, the
   other-language caption, a zigzag underline, and a colour-tinted → white
   gradient. Scrolls up over the previous sub's pinned last screen. */
function SubDivider({
  z,
  id,
  title,
  color,
  first,
}: {
  z: number;
  id: string;
  title: Bi;
  color: string;
  first: boolean;
}) {
  const { locale, t } = useLocale();
  const en = locale === "en";
  return (
    <section
      id={id}
      style={{
        zIndex: z,
        // opaque colour→white gradient (no alpha) so nothing shows through
        // while this section scrolls up over the previous sticky screen.
        background: first ? "#ffffff" : `linear-gradient(180deg, ${tintWithWhite(color, 0.22)} 0%, #ffffff 82%)`,
      }}
      className="relative flex h-[55svh] min-h-[360px] w-full flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col items-center px-6 text-center"
      >
        <h2
          className={`${en ? "font-montserrat text-[44px] lg:text-[64px]" : "font-yekan text-[52px] lg:text-[80px]"} font-extrabold uppercase leading-none text-behrouz-ink`}
        >
          {t(title)}
        </h2>
        <span
          className={`mt-3 ${en ? "font-yekan text-[15px]" : "font-montserrat text-[13px] uppercase tracking-[0.2em]"} font-bold text-behrouz-ink/35`}
        >
          {en ? title.fa : title.en}
        </span>
        <ZigzagUnderline color={color} />
      </motion.div>
    </section>
  );
}

function ZigzagUnderline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 240 14" preserveAspectRatio="none" fill="none" className="mt-4 h-3.5 w-[min(260px,60vw)]" aria-hidden>
      <path
        d="M2 9 Q 17 1 32 9 T 62 9 T 92 9 T 122 9 T 152 9 T 182 9 T 212 9 T 238 9"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Full-bleed white screen holding 1–2 variant cards. */
function ProductScreen({
  z,
  color,
  subTitle,
  cards,
  sticky,
  anchorId,
}: {
  z: number;
  color: string;
  subTitle: Bi;
  cards: Card[];
  sticky: boolean;
  anchorId?: string;
}) {
  const two = cards.length > 1;
  return (
    <section
      id={anchorId}
      style={{ zIndex: z }}
      // Sticky-stacking ("comes over the previous section") only applies on
      // `lg`+, where 2-card chunks sit side-by-side within one viewport. On
      // mobile, 2 cards stack vertically (taller than 100svh) — a sticky
      // element taller than the viewport pins its TOP slice in place and
      // never scrolls its own overflow into view, so the second product
      // could never appear until the next sub-category's divider covered it.
      // Below `lg` we just drop sticky entirely and let screens scroll normally.
      className={`relative flex min-h-[100svh] w-full items-center overflow-hidden bg-white py-24 lg:py-16 ${
        sticky ? "lg:sticky lg:top-0" : ""
      }`}
    >
      <div className={`mx-auto grid w-full max-w-[1400px] items-center gap-y-20 px-6 lg:gap-x-4 lg:px-10 ${two ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        {cards.map((card) => (
          <ProductCard key={`${card.product.id}-${card.seq}`} card={card} color={color} subTitle={subTitle} big={!two} sideBySide={!two} />
        ))}
      </div>
    </section>
  );
}

/* Staggered reveal for one variant card: kicker → name → media → details. */
const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

function ProductCard({
  card,
  color,
  subTitle,
  big,
  sideBySide,
}: {
  card: Card;
  color: string;
  subTitle: Bi;
  big: boolean;
  /** true when this is the only product on its screen → media sits beside
   *  the text instead of behind it. */
  sideBySide: boolean;
}) {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const { product, variant, multi, seq, total } = card;
  const imgH = sideBySide ? "h-[42vh] lg:h-[62vh]" : "h-[52vh] lg:h-[50vh]";

  const kicker = (
    <motion.span
      variants={cardItem}
      dir={en ? "ltr" : "rtl"}
      className={`flex items-center gap-2 ${font} text-[12px] font-semibold text-behrouz-ink/35 ${en ? "uppercase tracking-[0.18em]" : "tracking-normal"}`}
    >
      <span>{en ? subTitle.en : subTitle.fa}</span>
      <span className="h-px w-5" style={{ backgroundColor: `${color}66` }} />
      <span style={{ color }}>{seqLabel(seq, locale)}</span>
      <span className="text-behrouz-ink/25">/ {seqLabel(total, locale)}</span>
    </motion.span>
  );

  const name = (
    <motion.h3
      variants={cardItem}
      className={`relative z-10 mt-1 ${font} font-extrabold leading-[1.05] text-behrouz-ink ${
        big
          ? en
            ? "text-[40px] lg:text-[64px]"
            : "text-[52px] lg:text-[80px]"
          : en
            ? "text-[32px] lg:text-[44px]"
            : "text-[40px] lg:text-[56px]"
      }`}
    >
      {t(product.name)}
    </motion.h3>
  );

  const chip = multi && (
    <motion.span
      variants={cardItem}
      dir="auto"
      className={`mt-2 rounded-full px-4 py-1.5 ${font} text-[14px] font-extrabold text-white`}
      style={{ backgroundColor: color }}
    >
      {t(variant.weight)}
    </motion.span>
  );

  const subtitle = (
    <motion.p variants={cardItem} className={`mt-2 ${font} text-[17px] font-medium text-behrouz-ink/55 lg:text-[19px]`}>
      {t(product.subtitle)}
    </motion.p>
  );

  const feature = product.feature && (
    <motion.p variants={cardItem} className={`mt-2 ${font} text-[13px] font-extrabold`} style={{ color }}>
      {t(product.feature)}
    </motion.p>
  );

  const ingredients = (
    <motion.p variants={cardItem} className={`mt-3 max-w-[520px] ${font} text-[13.5px] font-medium leading-7 text-behrouz-ink/65`}>
      <span className="font-extrabold text-behrouz-ink/45">{t(STR.common.ingredients)}: </span>
      {t(product.ingredients)}
    </motion.p>
  );

  const specs = (
    <motion.div variants={cardItem} className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
      <Spec icon={<BarcodeIcon className="size-5" />} color={color} label={t(STR.common.code)} value={variant.code} latin />
      <Spec icon={<WeightIcon className="size-5" />} color={color} label={t(STR.common.weight)} value={t(variant.weight)} />
      <Spec icon={<CubeIcon className="size-5" />} color={color} label={t(STR.common.dimensions)} value={t(variant.size)} />
    </motion.div>
  );

  const media = (
    <HoverMedia
      image={product.image}
      video={product.hoverVideo}
      alt={t(product.subtitle)}
      heightClass={imgH}
      placeholderLetter={t(product.name).slice(0, 1)}
      placeholderColor={color}
    />
  );

  // ---- Single product on the screen: media beside the title & details ----
  if (sideBySide) {
    return (
      <motion.div
        variants={cardStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="flex flex-col-reverse items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-16"
      >
        <motion.div variants={cardItem} className="w-full max-w-[440px] shrink-0 lg:w-[42%]">
          {media}
        </motion.div>
        <div className="flex w-full flex-col items-center text-center lg:w-[52%] lg:items-start lg:text-start">
          {kicker}
          {name}
          {chip}
          {subtitle}
          {feature}
          {ingredients}
          {specs}
        </div>
      </motion.div>
    );
  }

  // ---- Two products on the screen: the photo sits BEHIND the text (depth),
  // large and centered, with the text stack layered on top of it. ----
  return (
    <motion.div
      variants={cardStagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative flex min-h-[74vh] w-full flex-col items-center justify-center text-center lg:min-h-[78vh]"
    >
      {/* photo — absolutely centered behind everything (lower z, no pointer
          capture outside its own visible pixels since the media element
          keeps its own hover handlers) */}

      {/* text stack — sits IN FRONT of the photo */}
      <div className="relative z-10 flex flex-col items-center">
        {kicker}
        {name}
        {chip}
      </div>
          {media}

      <div className="relative z-10 flex flex-col items-center">
        {subtitle}
        {feature}
        {ingredients}
        {specs}
      </div>
    </motion.div>
  );
}

/* Product media: no shadow, a slight contrast lift (1.1), and no decorative
   background art — activation just plays the video / lifts the image.

   The splash videos run as a forward→reverse "boomerang" while ACTIVE:
   forward at 1×, then a fast (4×) reverse back to frame 0, then forward again.
   Deactivating mid-forward starts the fast reverse; deactivating mid-reverse
   just lets it finish to frame 0. Re-activating mid-reverse also lets it reach
   frame 0 first, then plays forward — the reverse leg is never interrupted.

   What counts as "active":
   - fine pointers (desktop): hover;
   - coarse/no-hover pointers (phones & tablets): the media being ~55% in the
     viewport, via IntersectionObserver — so on mobile the splash plays itself
     as you scroll to it, no tap needed. */
function HoverMedia({
  image,
  video,
  alt,
  heightClass,
  placeholderLetter,
  placeholderColor,
}: {
  image?: string;
  video?: string;
  alt: string;
  heightClass: string;
  placeholderLetter: string;
  placeholderColor: string;
}) {
  const { t } = useLocale();
  const [hovered, setHovered] = useState(false);
  const vRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const rewinding = useRef(false);
  const activeRef = useRef(false);

  const playForward = () => {
    cancelAnimationFrame(rafRef.current);
    rewinding.current = false;
    vRef.current?.play().catch(() => {});
  };

  /** Fast (4×) reverse to frame 0; when it lands, loop forward again if still active. */
  const rewindToStart = () => {
    const v = vRef.current;
    if (!v || rewinding.current) return;
    v.pause();
    if (v.currentTime <= 0.03) return;
    rewinding.current = true;
    let last = performance.now();
    const step = (now: number) => {
      if (!rewinding.current || !vRef.current) return;
      const dt = (now - last) / 1000;
      last = now;
      const next = vRef.current.currentTime - dt * 4; // 4× fast rewind
      if (next <= 0.03) {
        try { vRef.current.currentTime = 0; } catch {}
        rewinding.current = false;
        if (activeRef.current) playForward(); // boomerang: forward again
        return;
      }
      try { vRef.current.currentTime = next; } catch {}
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const activate = () => {
    activeRef.current = true;
    setHovered(true);
    // Mid-reverse: let it reach frame 0 — its completion restarts forward.
    if (!rewinding.current) playForward();
  };
  const deactivate = () => {
    activeRef.current = false;
    setHovered(false);
    // Mid-reverse: nothing to do — it finishes to frame 0 and stops there.
    if (!rewinding.current) rewindToStart();
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Coarse-pointer autoplay: drive activation from viewport visibility.
  useEffect(() => {
    if (!video) return;
    const wrap = wrapRef.current;
    const v = vRef.current;
    if (!wrap || !v) return;
    if (!window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) activate();
        else deactivate();
      },
      { threshold: 0.55 }
    );
    io.observe(wrap);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  if (video) {
    return (
      <div
        ref={wrapRef}
        className={`flex items-center justify-center ${heightClass}`}
        onMouseEnter={activate}
        onMouseLeave={deactivate}
      >
        <motion.video
          ref={vRef}
          muted
          playsInline
          preload="metadata"
          poster={image}
          onEnded={rewindToStart} // end of the forward leg → fast reverse
          animate={{ scale: hovered ? 1.05 : 1, y: hovered ? -8 : 0 }}
          transition={{ duration: 0.5, ease }}
          className="h-full w-auto select-none object-contain contrast-[1.1]"
        >
          <source src={video} type="video/mp4" />
        </motion.video>
      </div>
    );
  }

  if (image) {
    return (
      <div className={`flex items-center justify-center ${heightClass}`} onMouseEnter={activate} onMouseLeave={deactivate}>
        <motion.img
          src={image}
          alt={alt}
          animate={{ scale: hovered ? 1.06 : 1, y: hovered ? -10 : 0 }}
          transition={{ duration: 0.5, ease }}
          className="h-full w-auto select-none object-contain contrast-[1.1]"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${heightClass}`}>
      <div
        className="flex aspect-square h-[70%] flex-col items-center justify-center gap-2 rounded-[28px]"
        style={{ backgroundColor: `${placeholderColor}14` }}
      >
        <span className="font-yekan text-[48px] font-extrabold" style={{ color: placeholderColor }}>{placeholderLetter}</span>
        <span className="font-yekan text-[11px] font-medium text-behrouz-ink/40">{t(STR.common.imageSoon)}</span>
      </div>
    </div>
  );
}

function Spec({
  icon,
  color,
  label,
  value,
  latin,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
  /** true for content that's ALWAYS Latin digits (barcodes) — these render in
   *  Montserrat regardless of locale, matching how Latin numerals render
   *  everywhere else on the site (e.g. the footer's phone numbers). Localized
   *  quantities (weight/dimensions) instead follow the label's own font, so
   *  Persian digits render in Yekan and Latin digits render in Montserrat. */
  latin?: boolean;
}) {
  const { locale } = useLocale();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  const valueFont = latin ? "font-montserrat" : font;
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: color }}>
        {icon}
      </span>
      <span className="flex flex-col items-start">
        <span className={`${font} text-[12px] font-extrabold text-behrouz-ink/40`}>{label}</span>
        <span dir={latin ? "ltr" : "auto"} className={`${valueFont} text-[15px] font-extrabold text-behrouz-ink`}>{value}</span>
      </span>
    </div>
  );
}
