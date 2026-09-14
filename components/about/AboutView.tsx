"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { STR, CONTACT_INFO } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export function AboutView() {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.14, 1.26]);

  return (
    <div className="relative bg-white">
      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative flex h-[100svh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-behrouz-ink">
        <motion.img
          style={{ y: heroY, scale: heroScale }}
          src="/media/site/BehrouzAbout.webp"
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/55" />

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } } }} className="relative z-10 flex flex-col items-center px-6 text-center">
          <motion.span variants={reveal} className="mb-2 font-dast text-[24px] text-white/85 lg:text-[32px]">
            {t(STR.about.tagline)}
          </motion.span>
          <motion.h1 variants={reveal} className={`${font} text-[52px] font-extrabold uppercase leading-none text-white lg:text-[104px]`}>
            {t(STR.about.title)}
          </motion.h1>
          <motion.span variants={reveal} className={`mt-6 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[14px] font-semibold text-white backdrop-blur ${font} ${en ? "uppercase tracking-wide" : "tracking-normal"}`}>
            {t(STR.about.since)}
          </motion.span>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} className="h-10 w-6 rounded-full border-2 border-white/40 p-1.5">
            <div className="mx-auto h-2 w-1 rounded-full bg-white/70" />
          </motion.div>
        </motion.div>
      </section>

      {/* ============ STORY (text + photo) ============ */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="text-start">
            <Kicker font={font} color="var(--r)">{t(STR.about.kicker)}</Kicker>
            <h2 className={`${font} mt-3 text-[36px] font-extrabold leading-tight text-behrouz-ink lg:text-[52px]`}>
              {t(STR.about.storyTitle)}
            </h2>
            <p className={`${font} mt-5 text-[15px] font-medium leading-8 text-behrouz-ink/70 lg:text-[17px]`}>
              {t(STR.about.story)}
            </p>
          </motion.div>
          <PhotoFrame
            src="/media/site/behrouzFactory.jpg"
            desc={locale === "en" ? "Heritage / founding era — vintage Behrouz factory or archive photo (1977)" : "میراث و دوران تأسیس — تصویر قدیمی کارخانه یا آرشیو بهروز (۱۳۵۶)"}
            font={font}
          />
        </div>
      </Section>

      {/* ============ MINIMAL STAT BAND (no photo) ============ */}
      <section className="bg-behrouz-red py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-6 text-center sm:grid-cols-3">
          {[
            { n: "۱۹۷۷", l: locale === "en" ? "Since" : "از سال", en: "1977" },
            { n: "۴", l: locale === "en" ? "Product families" : "خانواده محصول", en: "4" },
            { n: "۳", l: locale === "en" ? "Continents served" : "قاره", en: "3" },
          ].map((s, i) => (
            <motion.div key={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}>
              {/* Persian digits render in Yekan, Latin digits in Montserrat —
                  never the other way round, or the numerals fall back to an
                  unstyled system font. */}
              <div className={`${font} text-[56px] font-black leading-none lg:text-[72px]`}>{en ? s.en : s.n}</div>
              <div className={`${font} mt-2 text-[15px] font-semibold text-white/80`}>{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ PORTFOLIO ============ */}
      <Section>
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} className="text-center">
          <Kicker font={font}>{t(STR.about.portfolioTitle)}</Kicker>
          <h2 className={`${font} mt-3 text-[34px] font-extrabold leading-tight text-behrouz-ink lg:text-[48px]`}>
            {t(STR.about.portfolioTitle)}
          </h2>
          <p className={`${font} mx-auto mt-4 max-w-[560px] text-[15px] font-medium text-behrouz-ink/60 lg:text-[17px]`}>
            {t(STR.about.portfolioSub)}
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {[
            { img: "/media/sauces/ketchup-scene.webp", fa: "کچاپ", en: "Ketchup", c: "#e42e1d" },
            { img: "/media/sauces/standard-mayo.webp", fa: "مایونز", en: "Mayonnaise", c: "#1f3a8f" },
            { img: "/media/jam/strawberry-jam.webp", fa: "مربا", en: "Jams", c: "#c0223a" },
            { img: "/media/lime-juice/lime-large.webp", fa: "آبلیمو", en: "Lemon juice", c: "#7a9a1c" },
          ].map((p, i) => (
            <motion.div
              key={i}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
              className="group flex flex-col items-center rounded-[28px] bg-black/[0.02] p-6 transition-colors duration-300 hover:bg-black/[0.04]"
            >
              <div className="flex h-[180px] items-end justify-center lg:h-[220px]">
                {p.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.img} alt={locale === "en" ? p.en : p.fa} className="h-full w-auto object-contain transition-transform duration-500 ease-smooth group-hover:-translate-y-2 group-hover:scale-105" />
                ) : (
                  <div className="grid size-[130px] place-items-center rounded-2xl" style={{ backgroundColor: `${p.c}14` }}>
                    <span className="font-yekan text-[40px] font-extrabold" style={{ color: p.c }}>{p.fa.slice(0, 1)}</span>
                  </div>
                )}
              </div>
              <span className={`${font} mt-4 text-[18px] font-extrabold text-behrouz-ink`}>{locale === "en" ? p.en : p.fa}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ============ QUALITY — From Farm to Shelf (photo + text) ============ */}
      <section className="bg-[#0f1a0c] py-20 text-white lg:py-28">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 lg:grid-cols-2 lg:gap-16">
          <PhotoFrame
            dark
            src="/media/site/fromFarm.jpg"
            desc={locale === "en" ? "Farm to shelf — fresh tomatoes/fields at harvest, or temperature-controlled delivery trucks" : "از مزرعه تا قفسه — گوجه‌فرنگی و مزارع تازه هنگام برداشت، یا کامیون‌های یخچال‌دار"}
            font={font}
          />
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="text-start">
            <span className={`${font} text-[13px] font-semibold text-behrouz-red ${en ? "uppercase tracking-widest" : "tracking-normal"}`}>{t(STR.about.qualityTitle)}</span>
            <h2 className={`${font} mt-3 text-[34px] font-extrabold leading-tight lg:text-[50px]`}>{t(STR.about.qualityTitle)}</h2>
            <p className={`${font} mt-5 text-[15px] font-medium leading-8 text-white/70 lg:text-[17px]`}>{t(STR.about.quality)}</p>
          </motion.div>
        </div>
      </section>

      {/* ============ STANDARDS (minimal, no photo) ============ */}
      <Section>
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} className="text-center">
          <Kicker font={font}>{t(STR.about.standardsTitle)}</Kicker>
          <p className={`${font} mx-auto mt-4 max-w-[560px] text-[15px] font-medium text-behrouz-ink/60 lg:text-[17px]`}>
            {t(STR.about.standardsSub)}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {CONTACT_INFO.standards.map((s, i) => (
              <motion.span
                key={s}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border-2 border-behrouz-ink/10 px-7 py-4 font-montserrat text-[20px] font-black text-behrouz-ink lg:text-[26px]"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </Section>
    </div>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-6">{children}</div>
    </section>
  );
}

function Kicker({ children, font }: { children: React.ReactNode; font: string; color?: string }) {
  return (
    <span className={`${font} inline-flex items-center gap-2 text-[13px] font-extrabold text-behrouz-red ${font === "font-montserrat" ? "uppercase tracking-widest" : "tracking-normal"}`}>
      <span className="h-px w-6 bg-behrouz-red" />
      {children}
    </span>
  );
}

/* Real photo when the asset exists; otherwise a branded, labelled slot that
   describes the image to generate. */
function PhotoFrame({
  src,
  desc,
  font,
  dark,
}: {
  src?: string;
  desc: string;
  font: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px]"
    >
      {/* fallback / caption layer (behind — shown if the image is missing) */}
      <div className={`absolute inset-0 z-0 flex flex-col items-center justify-center gap-3 p-8 text-center ${dark ? "bg-white/5" : "bg-black/[0.03]"}`}>
        <svg viewBox="0 0 24 24" className={`size-10 ${dark ? "text-white/40" : "text-behrouz-ink/25"}`} fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 17l5-4 4 3 3-2 4 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={`${font} max-w-[320px] text-[13px] font-medium ${dark ? "text-white/50" : "text-behrouz-ink/45"}`}>{desc}</span>
      </div>
      {/* real photo on top; hides itself if the asset doesn't exist yet */}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="absolute inset-0 z-10 size-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </motion.div>
  );
}
