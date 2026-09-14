"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  ManagedImage as Image,
  ManagedPageProvider,
  useManagedPageContent,
} from "@/components/cms/ManagedPageContent";
import { ArrowForward } from "@/components/ui/icons";
import { localizeDigits } from "@/lib/locale-digits";
import type { ManagedPage } from "@/lib/cms-content";

type PageKind = "about" | "innovation" | "operations";
type Localized = { fa: string; en: string };

const ease = [0.22, 1, 0.36, 1] as const;
const fade = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

const heroContent: Record<PageKind, {
  eyebrow: Localized;
  title: Localized;
  lead: Localized;
  mark: string;
  image: string;
  imageAlt: Localized;
  accent: string;
}> = {
  about: {
    eyebrow: { fa: "صنایع غذایی بهروز نیک · از ۱۳۵۶", en: "Behrouz Nik Food Industries · Since 1977" },
    title: { fa: "از ۱۳۵۶،\nهمراه طعم‌های آشنا", en: "Since 1977.\nPart of familiar tastes." },
    lead: {
      fa: "بهروز فقط یک سبد محصول نیست؛ پژوهش، تولید، کنترل کیفیت و پخش در کنار هم کار می‌کنند تا طعمی آشنا و کیفیتی قابل اتکا به سفره مردم برسد.",
      en: "Behrouz is more than a product portfolio. Research, production, quality control and distribution work together to bring familiar taste and dependable quality to everyday tables.",
    },
    mark: "۱۳۵۶",
    image: "/media/site/BehrouzAbout.webp",
    imageAlt: { fa: "کارخانه صنایع غذایی بهروز", en: "Behrouz Food Industries factory" },
    accent: "#f3383a",
  },
  innovation: {
    eyebrow: { fa: "تحقیق و توسعه؛ از بازار تا محصول", en: "R&D, from market to product" },
    title: { fa: "نوآوری در خدمت\nکیفیت پایدار", en: "Innovation for\nlasting quality." },
    lead: {
      fa: "واحد تحقیق و توسعه بهروز با رصد بازار، همکاری با تحقیقات بازار و تکیه بر دانش روز، نیاز مصرف‌کننده را به فرمولاسیون‌های سلامت‌محور و بهبودهای قابل سنجش در مواد اولیه و محصول تبدیل می‌کند.",
      en: "Behrouz R&D turns consumer needs into health-focused formulations and measurable improvements in ingredients and products through market monitoring, insight collaboration and current science.",
    },
    mark: "R&D",
    image: "/media/site/fromFarm.jpg",
    imageAlt: { fa: "مواد اولیه کشاورزی تازه", en: "Fresh agricultural ingredients" },
    accent: "#5f8f62",
  },
  operations: {
    eyebrow: { fa: "از ماده اولیه تا رهایش", en: "From raw material to release" },
    title: { fa: "تولید دقیق،\nکیفیت قابل پیگیری", en: "Precise production.\nTraceable quality." },
    lead: {
      fa: "هر محصول در یک مسیر شفاف حرکت می‌کند: پذیرش مواد اولیه، تولید، آزمون و رهایش؛ مسیری که کیفیت را در هر ایستگاه قابل پیگیری می‌کند.",
      en: "Every product follows a visible path: raw-material approval, production, testing and release, with quality traceable at every station.",
    },
    mark: "۲۰K",
    image: "/media/site/behrouzFactory.jpg",
    imageAlt: { fa: "محوطه کارخانه بهروز", en: "Behrouz factory complex" },
    accent: "#e8a438",
  },
};

const heroNavigation: Record<PageKind, { href: string; label: Localized }[]> = {
  about: [
    { href: "#story", label: { fa: "تاریخچه", en: "History" } },
    { href: "#scale", label: { fa: "بهروز در یک نگاه", en: "At a glance" } },
    { href: "#values", label: { fa: "ارزش‌ها", en: "Values" } },
    { href: "#awards", label: { fa: "افتخارات", en: "Achievements" } },
  ],
  innovation: [
    { href: "#story", label: { fa: "فعالیت‌های تحقیق و توسعه", en: "R&D activities" } },
    { href: "#portfolio", label: { fa: "چرخه نوآوری و کیفیت", en: "Innovation & quality" } },
    { href: "#labs", label: { fa: "آزمایشگاه", en: "Laboratories" } },
    { href: "#agriculture", label: { fa: "کشاورزی", en: "Agriculture" } },
    { href: "#quality", label: { fa: "کنترل کیفیت", en: "Quality control" } },
  ],
  operations: [
    { href: "#story", label: { fa: "مسیر محصول", en: "Product journey" } },
    { href: "#factory", label: { fa: "کارخانه", en: "Factory" } },
    { href: "#handoff", label: { fa: "رهایش محصول", en: "Product release" } },
  ],
};

function useCopy() {
  const { locale, pick } = useManagedPageContent();
  const number = (value: string | number) => localizeDigits(value, locale);
  return { locale, pick, number, font: locale === "en" ? "font-montserrat" : "font-yekan" };
}

export function CorporatePage({ kind, hero }: { kind: PageKind; hero?: ManagedPage }) {
  return (
    <ManagedPageProvider page={hero}>
      <CorporatePageBody kind={kind} hero={hero} />
    </ManagedPageProvider>
  );
}

function CorporatePageBody({ kind, hero }: { kind: PageKind; hero?: ManagedPage }) {
  const { locale, pick, font } = useCopy();
  const { isSectionVisible } = useManagedPageContent();
  return (
    <div dir={locale === "fa" ? "rtl" : "ltr"} className="overflow-hidden bg-[#f7f4ed] text-[#181512]">
      {isSectionVisible("hero") && <CorporateHero kind={kind} content={hero || heroContent[kind]} />}
      {kind === "about" && <AboutExperience />}
      {kind === "innovation" && <InnovationExperience />}
      {kind === "operations" && <OperationsExperience />}
      {isSectionVisible("crossJourney") && <CrossJourney current={kind} />}
      {isSectionVisible("nextStep") && <section className="relative overflow-hidden bg-[#181512] px-6 py-20 text-white lg:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[.08]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="relative mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <span className={`${font} text-[14px] font-extrabold text-white/50 ${locale === "en" ? "uppercase tracking-[.15em]" : "tracking-normal"}`}>
              {pick({ fa: "مرحله بعد", en: "Next step" })}
            </span>
            <h2 className={`${font} mt-4 max-w-[740px] text-[36px] font-black leading-[1.25] sm:text-[48px] lg:text-[64px]`}>
              {pick({ fa: "نتیجه این مسیر را در محصولات ببینید.", en: "See the result of this work in the products." })}
            </h2>
          </div>
          <Link href="/#categories" className={`${font} inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-[14px] font-extrabold text-[#181512] transition-transform hover:-translate-y-1`}>
            {pick({ fa: "مشاهده محصولات", en: "Explore products" })}
            <ArrowIcon />
          </Link>
        </motion.div>
      </section>}
    </div>
  );
}

function CorporateHero({ kind, content }: { kind: PageKind; content: ManagedPage | (typeof heroContent)[PageKind] }) {
  const { locale, pick, number, font } = useCopy();
  const { isSectionVisible } = useManagedPageContent();
  const pageNavigation = heroNavigation[kind].filter((item) => isSectionVisible(item.href.slice(1)));
  const reduce = useReducedMotion();
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#181512] text-white">
      <motion.div initial={{ opacity: 0, scale: 1.07 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 1.4, ease }} className="absolute inset-0">
        <Image src={content.image} alt={pick(content.imageAlt)} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,.9)_0%,rgba(9,8,7,.64)_46%,rgba(9,8,7,.2)_100%)] rtl:bg-[linear-gradient(270deg,rgba(9,8,7,.9)_0%,rgba(9,8,7,.64)_46%,rgba(9,8,7,.2)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
      <div className="absolute inset-0 opacity-[.13]" style={{ backgroundImage: `linear-gradient(90deg, transparent 49.8%, rgba(255,255,255,.12) 50%, transparent 50.2%), linear-gradient(transparent 49.8%, rgba(255,255,255,.12) 50%, transparent 50.2%)`, backgroundSize: "72px 72px" }} />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1480px] items-center px-6 pb-48 pt-32 sm:px-10 sm:pb-40 lg:px-16 lg:pb-44 lg:pt-28">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: reduce ? 0 : .12, delayChildren: .15 } } }} className="relative w-full max-w-[880px]">
          <motion.span variants={fade} className={`${font} inline-flex items-center gap-3 text-[14px] font-extrabold text-white/60 ${locale === "en" ? "uppercase tracking-[.14em]" : "tracking-normal"}`}>
            <i className="h-px w-8" style={{ backgroundColor: content.accent }} />
            {pick(content.eyebrow)}
          </motion.span>
          <motion.h1 variants={fade} className={`${font} mt-7 whitespace-pre-line text-[48px] font-black leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,.25)] sm:text-[64px] lg:text-[80px] xl:text-[92px] ${locale === "en" ? "tracking-[-.035em]" : "tracking-normal"}`}>
            {pick(content.title)}
          </motion.h1>
          <motion.p variants={fade} className={`${font} mt-7 max-w-[650px] text-[15px] font-medium leading-8 text-white/72 sm:text-[17px] lg:text-[19px] lg:leading-9`}>
            {pick(content.lead)}
          </motion.p>
          <motion.span aria-hidden variants={fade} className="pointer-events-none absolute -bottom-20 start-[58%] hidden select-none font-montserrat text-[130px] font-black leading-none tracking-[-.08em] text-white/[.045] xl:block">
            {content.mark}
          </motion.span>
        </motion.div>
      </div>
      <nav aria-label={pick({ fa: "بخش‌های این صفحه", en: "Sections on this page" })} className="absolute inset-x-4 bottom-4 z-20 rounded-[28px] border border-white/15 bg-black/30 p-2 backdrop-blur-xl sm:inset-x-7 lg:inset-x-auto lg:bottom-7 lg:start-1/2 lg:w-[min(100%-3.5rem,1120px)] lg:-translate-x-1/2 rtl:lg:translate-x-1/2">
        <div className="grid grid-cols-2 gap-1 sm:flex sm:items-center">
          <span className={`${font} hidden px-4 text-[12px] font-extrabold text-white/45 lg:block`}>
            {pick({ fa: "در این صفحه", en: "On this page" })}
          </span>
          {pageNavigation.map((item, index) => (
            <a key={item.href} href={item.href} className={`${font} group flex min-h-11 flex-1 items-center justify-between gap-3 rounded-[18px] px-3 py-2 text-[13px] font-bold text-white/78 transition-colors hover:bg-white/10 hover:text-white sm:px-4`}>
              <span><i className={`${font} me-2 text-[9px] not-italic text-white/30`}>{number(`0${index + 1}`)}</i>{pick(item.label)}</span>
              <ArrowIcon />
            </a>
          ))}
        </div>
      </nav>
    </section>
  );
}

const history = [
  { year: { fa: "۱۳۵۶", en: "1977" }, title: { fa: "آغاز بهروز", en: "Behrouz begins" }, text: { fa: "شروع فعالیت صنایع غذایی بهروز در مجموعه صنعتی جاده کرج–قزوین.", en: "Behrouz Food Industries begins operations at its industrial site on the Karaj–Qazvin road." } },
  { year: { fa: "۱۳۷۰", en: "1991" }, title: { fa: "مرکز تحقیقات", en: "Research centre" }, text: { fa: "مرکز تحقیقات صنایع غذایی بهروز فعالیت خود را برای توسعه محصول و کیفیت آغاز کرد.", en: "The food research centre begins its work on product development and quality." } },
  { year: { fa: "۱۳۷۱", en: "1992" }, title: { fa: "پروانه تحقیق و توسعه", en: "R&D licence" }, text: { fa: "دریافت پروانه تحقیق و توسعه در بخش خصوصی صنایع غذایی کشور.", en: "An early private-sector food-industry research and development licence is awarded." } },
  { year: { fa: "۱۳۷۸", en: "1999" }, title: { fa: "سازمان پخش", en: "Distribution network" }, text: { fa: "راه‌اندازی سازمان پخش بهروز برای ارتباط مستقیم‌تر با بازار و مصرف‌کننده.", en: "Behrouz establishes its distribution organisation for a closer link to market and consumers." } },
  { year: { fa: "۱۳۹۰–۱۳۹۱", en: "2011–2012" }, title: { fa: "فصل تازه", en: "A new chapter" }, text: { fa: "انتقال مالکیت و آغاز دوره‌ای تازه برای توسعه تولید، تنوع و کیفیت.", en: "A change in ownership opens a new chapter in production, variety and quality." } },
];

function AboutExperience() {
  const { locale, pick, number, font } = useCopy();
  const { isSectionVisible } = useManagedPageContent();
  const [active, setActive] = useState(0);
  const historyMarkerPosition = locale === "fa" ? 90 - active * 20 : 10 + active * 20;
  const values = [
    { n: "01", title: { fa: "برتری و رشد", en: "Growth through excellence" }, text: { fa: "سنجش مداوم عملکرد با معیارهای معتبر و بهترکردن آنچه امروز انجام می‌دهیم.", en: "Measuring performance against credible standards and improving how we work today." } },
    { n: "02", title: { fa: "خلاقیت و انعطاف", en: "Creative adaptability" }, text: { fa: "پاسخ‌گویی به تغییر بازار از راه تجربه، یادگیری و پذیرش ریسک سنجیده.", en: "Responding to change through learning, experimentation and measured risk." } },
    { n: "03", title: { fa: "تجارت سالم", en: "Fair business" }, text: { fa: "رقابت بر پایه کیفیت، صداقت و احترام به قوانین و مصرف‌کننده.", en: "Competing through quality, integrity, lawful conduct and consumer respect." } },
    { n: "04", title: { fa: "ارزشمندی کارکنان", en: "People matter" }, text: { fa: "محیطی برای رشد استعداد، اعتماد متقابل و فرصت برابر.", en: "A workplace built for talent, mutual trust and equal opportunity." } },
    { n: "05", title: { fa: "اعتبار اجتماعی", en: "Social credibility" }, text: { fa: "توجه به سلامت، رفاه جامعه و ایفای مسئولیت شهروندی سازمانی.", en: "A commitment to health, public welfare and responsible citizenship." } },
  ];
  const stats = [
    { value: { fa: "۲۰٬۰۰۰", en: "20,000" }, unit: { fa: "متر مربع", en: "sqm" }, label: { fa: "مساحت مجموعه کارخانه", en: "factory complex" } },
    { value: { fa: "۵٬۰۰۰", en: "5,000" }, unit: { fa: "متر مربع", en: "sqm" }, label: { fa: "فضای تولید، اداری و انبار", en: "production, offices and storage" } },
    { value: { fa: "+۲۵۰", en: "250+" }, unit: { fa: "نفر", en: "people" }, label: { fa: "نیروی انسانی در فصل تولید", en: "during production season" } },
    { value: { fa: "۵۵", en: "55" }, unit: { fa: "پروانه", en: "licences" }, label: { fa: "پروانه ساخت محصولات", en: "for manufactured products" } },
  ];
  return (
    <>
      {isSectionVisible("story") && <section id="story" className="scroll-mt-24 bg-[#f7f4ed] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle eyebrow={{ fa: "نزدیک پنج دهه، پنج نقطه عطف", en: "Nearly five decades, five milestones" }} title={{ fa: "پنج تصمیم که بهروز امروز را ساخته‌اند.", en: "Five decisions that shaped Behrouz today." }} />
          <div className="mt-14 hidden sm:block">
            <div className="rounded-[30px] border border-black/10 bg-white p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className={`${font} text-[12px] font-extrabold text-[#181512]/55`}>{pick({ fa: "روی هر سال بروید یا کلیک کنید", en: "Hover over or select a year" })}</p>
                <span className={`${font} inline-flex items-center gap-2 rounded-full bg-[#f3383a]/[.08] px-3 py-2 text-[10px] font-black text-[#f3383a]`}><i className="size-1.5 rounded-full bg-[#f3383a]" />{pick({ fa: "رودمپ تعاملی", en: "Interactive roadmap" })}</span>
              </div>
              <div className="relative grid grid-cols-5 gap-2">
                <div className="pointer-events-none absolute inset-x-[9%] top-[23px] h-px bg-black/10" />
                {history.map((item, index) => (
                  <button key={item.title.en} type="button" aria-pressed={active === index} aria-controls="history-detail" onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} className={`group relative z-10 flex min-h-[150px] cursor-pointer flex-col items-center rounded-[20px] border px-2 py-3 text-center outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#f3383a] focus-visible:ring-offset-2 ${active === index ? "border-[#f3383a]/25 bg-[#fff5f3] shadow-[0_12px_32px_rgba(24,21,18,.08)]" : "border-transparent bg-transparent hover:border-black/10 hover:bg-[#f7f4ed]"}`}>
                    <span className={`${font} grid size-11 place-items-center rounded-full border text-[11px] font-black transition-all ${active === index ? "border-[#f3383a] bg-[#f3383a] text-white shadow-[0_8px_24px_rgba(243,56,58,.28)]" : "border-black/10 bg-[#f7f4ed] text-black/45 group-hover:border-[#f3383a]/40 group-hover:text-[#f3383a]"}`}>{number(index + 1)}</span>
                    <span dir="ltr" className={`${font} mt-3 text-[16px] font-black transition-colors lg:text-[17px] ${active === index ? "text-[#f3383a]" : "text-[#181512]/50 group-hover:text-[#181512]"}`}>{pick(item.year)}</span>
                    <span className={`${font} mt-1 text-[12px] font-bold leading-5 text-[#181512]/60 lg:text-[13px]`}>{pick(item.title)}</span>
                    <span className={`${font} mt-auto pt-2 text-[9px] font-black transition-opacity ${active === index ? "text-[#f3383a] opacity-100" : "text-[#181512]/30 opacity-0 group-hover:opacity-100"}`}>{active === index ? pick({ fa: "در حال نمایش ↓", en: "Showing below ↓" }) : pick({ fa: "نمایش جزئیات", en: "View details" })}</span>
                  </button>
                ))}
              </div>
              <div className="relative mt-5 pt-3">
                <motion.span aria-hidden className="absolute top-0 size-0 border-x-[9px] border-t-[10px] border-x-transparent border-t-[#f3383a]" animate={{ left: `${historyMarkerPosition}%` }} transition={{ duration: .3, ease }} style={{ transform: "translateX(-50%)" }} />
                <AnimatePresence mode="wait">
                  <motion.article id="history-detail" key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .28 }} className="grid min-h-[170px] gap-5 rounded-[24px] bg-[#181512] p-6 text-white md:grid-cols-[auto_1fr] md:items-center md:p-7">
                    <span className={`${font} text-[54px] font-black leading-none text-white/10`}>{number(`0${active + 1}`)}</span>
                    <div><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><h3 className={`${font} text-[22px] font-black sm:text-[24px]`}>{pick(history[active].title)}</h3><span dir="ltr" className={`${font} text-[13px] font-black text-[#f3383a]`}>{pick(history[active].year)}</span></div><p className={`${font} mt-3 max-w-[78ch] text-[14px] font-medium leading-8 text-white/65 sm:text-[15px] lg:text-[17px] lg:leading-9`}>{pick(history[active].text)}</p></div>
                  </motion.article>
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-3 sm:hidden">
            {history.map((item, index) => (
              <div key={item.title.en} className="grid gap-2">
                <button type="button" aria-expanded={active === index} aria-controls={`history-detail-mobile-${index}`} onClick={() => setActive(index)} className={`relative flex min-h-[72px] cursor-pointer items-center gap-4 rounded-[20px] border p-4 text-start transition-colors ${active === index ? "border-[#f3383a] bg-[#f3383a] text-white" : "border-black/10 bg-white text-[#181512]"}`}>
                  <span className={`${font} grid size-9 shrink-0 place-items-center rounded-full border border-current/20 text-[10px] font-black`}>{number(`0${index + 1}`)}</span>
                  <span className="flex-1"><strong dir="ltr" className={`${font} block text-[16px] font-black`}>{pick(item.year)}</strong><small className={`${font} mt-1 block text-[14px] font-bold leading-6 opacity-65`}>{pick(item.title)}</small></span>
                  <span aria-hidden className={`${font} text-[18px] font-black transition-transform ${active === index ? "rotate-45" : ""}`}>＋</span>
                </button>
                <AnimatePresence initial={false}>
                  {active === index && (
                    <motion.article id={`history-detail-mobile-${index}`} initial={{ opacity: 0, height: 0, y: -6 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -6 }} transition={{ duration: .28 }} className="overflow-hidden rounded-[22px] bg-[#181512] text-white">
                      <div className="p-5"><div className="flex items-baseline justify-between gap-3"><h3 className={`${font} text-[20px] font-black lg:text-[23px]`}>{pick(item.title)}</h3><span dir="ltr" className={`${font} text-[12px] font-black text-[#f3383a]`}>{pick(item.year)}</span></div><p className={`${font} mt-3 text-[14px] font-medium leading-8 text-white/65`}>{pick(item.text)}</p></div>
                    </motion.article>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {isSectionVisible("scale") && <section id="scale" className="scroll-mt-24 bg-[#181512] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle light eyebrow={{ fa: "بهروز در یک نگاه", en: "Behrouz at a glance" }} title={{ fa: "چند عدد از بهروز امروز.", en: "A few numbers behind Behrouz today." }} />
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[32px] bg-white/10 lg:grid-cols-4">
            {stats.map((item, index) => (
              <motion.div key={item.label.en} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: .45 }} transition={{ delay: index * .08 }} className="relative min-h-[175px] bg-[#181512] p-5 sm:min-h-[260px] sm:p-7">
                <span className={`${font} text-[11px] font-semibold tracking-[.2em] text-white/30`}>{number(`0${index + 1}`)}</span>
                <div className="mt-7 sm:mt-16"><strong className={`${font} block text-[34px] font-black leading-none text-white sm:text-[56px]`}>{pick(item.value)}</strong><span className={`${font} mt-2 block text-[13px] font-bold text-[#f3383a] sm:text-[14px]`}>{pick(item.unit)}</span><p className={`${font} mt-3 max-w-[20ch] text-[14px] leading-7 text-white/60 sm:mt-5 lg:text-[16px] lg:leading-8`}>{pick(item.label)}</p></div>
              </motion.div>
            ))}
          </div>
          <p className={`${font} mt-5 text-[10px] text-white/30`}>{pick({ fa: "* ارقام این بخش بر پایه آخرین اطلاعات ارائه‌شده شرکت تنظیم شده‌اند.", en: "* Figures in this section reflect the latest information supplied by the company." })}</p>
        </div>
      </section>}

      {isSectionVisible("values") && <section id="values" className="scroll-mt-24 bg-[#e9e3d7] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle eyebrow={{ fa: "ارزش‌ها در عمل", en: "Values in action" }} title={{ fa: "پنج اصل؛ هر روز، در هر تصمیم.", en: "Five principles, present in every decision." }} />
          <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {values.map((value, index) => (
              <motion.article key={value.n} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} transition={{ delay: index * .06 }} className={`group relative min-h-[205px] overflow-hidden rounded-[26px] p-6 sm:min-h-[290px] ${index === 0 ? "bg-[#f3383a] text-white" : "bg-[#f7f4ed] text-[#181512]"}`}>
                <span className={`${font} text-[12px] font-black opacity-40`}>{number(value.n)}</span>
                <div className="absolute inset-x-6 bottom-6"><h3 className={`${font} text-[20px] font-black leading-tight lg:text-[23px]`}>{pick(value.title)}</h3><p className={`${font} mt-4 text-[13px] font-medium leading-7 opacity-65 lg:text-[16px] lg:leading-8`}>{pick(value.text)}</p></div>
                <span className={`${font} absolute -end-8 -top-9 text-[120px] font-black leading-none opacity-[.045] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>{number(index + 1)}</span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>}

      {isSectionVisible("awards") && <section id="awards" className="scroll-mt-24 bg-[#f3383a] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <div><span className="font-montserrat text-[110px] font-black leading-[.75] tracking-[-.08em] sm:text-[150px]">200<span className="text-[48px]">+</span></span><h2 className={`${font} mt-7 text-[30px] font-black`}>{pick({ fa: "تندیس و تقدیر", en: "awards and recognitions" })}</h2><p className={`${font} mt-4 text-[14px] leading-8 text-white/70 lg:text-[17px] lg:leading-9`}>{pick({ fa: "بیش از ۲۰۰ تقدیر در حوزه‌های کیفیت، نوآوری، صادرات، استاندارد و مسئولیت اجتماعی.", en: "More than 200 recognitions across quality, innovation, exports, standards and social responsibility." })}</p></div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-white/25 sm:grid-cols-3">
            {[{fa:"واحد نمونه کشوری",en:"National model unit"},{fa:"گواهی حلال جهانی",en:"Global halal certification"},{fa:"جایزه پژوهش شهاب",en:"Shahab research award"},{fa:"واحد نمونه استاندارد",en:"Model standards unit"},{fa:"صنعت سبز منتخب",en:"Selected green industry"},{fa:"صادرکننده نمونه",en:"Model exporter"}].map((award, i) => <div key={award.en} className="min-h-[118px] bg-[#f3383a] p-5"><span className={`${font} text-[10px] text-white/40`}>{number(`0${i+1}`)}</span><p className={`${font} mt-6 text-[14px] font-extrabold leading-7`}>{pick(award)}</p></div>)}
          </div>
        </div>
      </section>}
    </>
  );
}

const researchSteps = [
  { id: "01", title: { fa: "رصد مستمر بازار ایران", en: "Continuous market monitoring" }, text: { fa: "بازار ایران و عملکرد محصولات در حال تولید به‌طور مستمر بررسی می‌شود تا فرصت‌های بهبود شناسایی و توان رقابت با دیگر برندها تقویت شود.", en: "The Iranian market and current products are continuously reviewed to identify improvements and strengthen competitiveness." } },
  { id: "02", title: { fa: "همکاری با تحقیقات بازار", en: "Market research collaboration" }, text: { fa: "ارتباط مستمر با واحد تحقیقات بازار، نیازها و ترجیحات مصرف‌کنندگان را به ایده‌های نو و محصولات متناسب با بازار تبدیل می‌کند.", en: "Ongoing collaboration with market research turns consumer needs and preferences into relevant ideas and new products." } },
  { id: "03", title: { fa: "ارتقای مواد اولیه", en: "Better raw materials" }, text: { fa: "کیفیت مواد اولیه مصرفی ارزیابی و بهبود داده می‌شود تا کیفیت محصول نهایی نیز به‌صورت پایدار ارتقا پیدا کند.", en: "Ingredients are evaluated and improved so the quality of the final product can advance consistently." } },
  { id: "04", title: { fa: "فرمولاسیون سلامت‌محور", en: "Health-focused formulation" }, text: { fa: "فرمولاسیون محصولات با توجه به سلامت مصرف‌کنندگان و با هدف ایجاد انتخاب‌هایی مسئولانه‌تر طراحی و بازنگری می‌شود.", en: "Product formulations are designed and refined with consumer health and more responsible choices in mind." } },
  { id: "05", title: { fa: "پیوند صنعت و دانشگاه", en: "Industry–academia collaboration" }, text: { fa: "زمینه استفاده کاربردی از پژوهش‌های علمی فراهم می‌شود تا دانش دانشگاهی به راه‌حل‌های قابل اجرا در صنعت غذا تبدیل شود.", en: "Scientific research is translated into practical solutions by creating stronger links between academia and the food industry." } },
  { id: "06", title: { fa: "حضور در رویدادهای تخصصی", en: "Industry and scientific events" }, text: { fa: "با حمایت و حضور در کنگره‌ها، همایش‌ها و نمایشگاه‌های ملی و بین‌المللی، تازه‌ترین دستاوردها با فعالان صنعت و مخاطبان به اشتراک گذاشته می‌شود.", en: "Participation in national and international congresses, conferences and exhibitions helps share new achievements with the industry and its audiences." } },
  { id: "07", title: { fa: "همکاری‌های داخلی و بین‌المللی", en: "Local and global collaboration" }, text: { fa: "ارتباط مستمر با شرکت‌های داخلی و خارجی، تبادل دانش، حمایت از تولیدکنندگان ایرانی و بهره‌گیری سنجیده از دستاوردهای نوین جهانی را ممکن می‌کند.", en: "Ongoing ties with local and international companies enable knowledge exchange, support Iranian producers and informed use of global advances." } },
  { id: "08", title: { fa: "فناوری‌های نو و هوش مصنوعی", en: "Emerging technology and AI" }, text: { fa: "علوم و فناوری‌های روز دنبال می‌شوند و امکان استفاده مسئولانه از هوش مصنوعی در پژوهش، توسعه محصول و بهبود فرایندها سنجیده می‌شود.", en: "Emerging science and technology are monitored, including the responsible use of AI in research, product development and process improvement." } },
];

const innovationQualityLoop = [
  { title: { fa: "شناخت بازار", en: "Understand the market" }, text: { fa: "نیاز مصرف‌کننده و عملکرد محصولات موجود رصد می‌شود.", en: "Consumer needs and current product performance are monitored." }, c: "#e9bf52" },
  { title: { fa: "تعریف مسئله", en: "Define the challenge" }, text: { fa: "داده‌های بازار به یک هدف روشن برای پژوهش و بهبود تبدیل می‌شوند.", en: "Market insights become a clear research and improvement objective." }, c: "#e56a52" },
  { title: { fa: "پژوهش و فرمولاسیون", en: "Research & formulate" }, text: { fa: "دانش علمی، مواد اولیه و فناوری برای ساخت راه‌حل مناسب کنار هم قرار می‌گیرند.", en: "Science, ingredients and technology come together to shape the right solution." }, c: "#6ba678" },
  { title: { fa: "آزمون و کنترل کیفیت", en: "Test & assure quality" }, text: { fa: "ایمنی، ویژگی‌های فیزیکوشیمی و تجربه حسی محصول ارزیابی می‌شوند.", en: "Safety, physicochemical properties and sensory performance are evaluated." }, c: "#5e8db8" },
  { title: { fa: "بازخورد و بهبود", en: "Learn & improve" }, text: { fa: "نتیجه به بازار بازمی‌گردد و بازخورد، چرخه بعدی نوآوری را آغاز می‌کند.", en: "The product returns to market, where feedback starts the next innovation cycle." }, c: "#a884b6" },
];

function InnovationExperience() {
  const { locale, pick, number, font } = useCopy();
  const { isSectionVisible } = useManagedPageContent();
  const [step, setStep] = useState(0);
  const qualities = [
    { fa: "مواد اولیه", en: "Raw materials" },
    { fa: "حین تولید", en: "In process" },
    { fa: "محصول نهایی", en: "Final product" },
    { fa: "پیش از ترخیص", en: "Before release" },
    { fa: "بازخورد بازار", en: "Market feedback" },
  ];
  return (
    <>
      {isSectionVisible("story") && <section id="story" className="scroll-mt-24 bg-[#eef1e7] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle eyebrow={{ fa: "فعالیت‌های واحد تحقیق و توسعه", en: "Research & development activities" }} title={{ fa: "هشت مسیر برای تبدیل نیاز بازار به محصول بهتر.", en: "Eight ways market needs become better products." }} />
          <div className="mt-14 grid gap-5 lg:grid-cols-[.75fr_1.25fr]">
            <div className="flex flex-col justify-between rounded-[30px] bg-[#234b35] p-7 text-white sm:p-9">
              <span className="font-montserrat text-[72px] font-black leading-none text-white/10">{researchSteps[step].id}</span>
              <AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><h3 className={`${font} text-[28px] font-black`}>{pick(researchSteps[step].title)}</h3><p className={`${font} mt-4 text-[15px] font-medium leading-8 text-white/65 lg:text-[17px] lg:leading-9`}>{pick(researchSteps[step].text)}</p></motion.div></AnimatePresence>
            </div>
            <div className="rounded-[30px] border border-[#234b35]/10 bg-[#f8faf5] p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {researchSteps.map((item, index) => <button key={item.id} type="button" aria-pressed={step === index} onClick={() => setStep(index)} className={`flex min-h-[76px] items-center gap-4 rounded-[18px] border p-4 text-start transition-all ${step === index ? "border-[#234b35] bg-[#234b35] text-white" : "border-[#234b35]/10 bg-white text-[#181512] hover:border-[#234b35]/35"}`}><span className={`${font} text-[11px] font-black opacity-45`}>{number(item.id)}</span><span className={`${font} text-[14px] font-extrabold leading-6`}>{pick(item.title)}</span></button>)}
              </div>
            </div>
          </div>
        </div>
      </section>}

      {isSectionVisible("portfolio") && <section id="portfolio" className="scroll-mt-24 bg-[#181512] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle light eyebrow={{ fa: "چرخه نوآوری و کیفیت", en: "The innovation–quality cycle" }} title={{ fa: "از شناخت نیاز تا بهبود دوباره؛ یک مسیر پیوسته.", en: "From understanding a need to improving again—a continuous path." }} />
          <p className={`${font} mt-6 max-w-[72ch] text-[15px] font-medium leading-8 text-white/60 lg:text-[17px] lg:leading-9`}>{pick({ fa: "در بهروز، نوآوری ایده‌ای جدا از کیفیت نیست؛ تحقیق و توسعه نیاز بازار را به راه‌حل تبدیل می‌کند و کنترل کیفیت، ارزش و قابلیت اتکای آن راه‌حل را در هر مرحله می‌سنجد.", en: "At Behrouz, innovation is not separate from quality: R&D turns market needs into solutions, while quality control measures their value and reliability at every stage." })}</p>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5">
            {innovationQualityLoop.map((item, i) => (
              <motion.div
                key={item.title.en}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: .4 }}
                className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 p-5 sm:min-h-[240px] sm:p-6 lg:min-h-[300px]"
              >
                <div className="flex items-center justify-between"><span className={`${font} text-[11px] text-white/30`}>{number(`0${i + 1}`)}</span><span className="size-3 rounded-full" style={{ backgroundColor: item.c }} /></div>
                <div><span className="mb-5 block h-1 w-10 rounded-full" style={{ backgroundColor: item.c }} /><h3 className={`${font} text-[18px] font-black leading-8 text-white sm:text-[20px]`}>{pick(item.title)}</h3><p className={`${font} mt-3 text-[13px] font-medium leading-7 text-white/55 lg:text-[14px]`}>{pick(item.text)}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>}

      {isSectionVisible("labs") && <section id="labs" className="scroll-mt-24 bg-[#f7f4ed] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle eyebrow={{ fa: "آزمایشگاه و ارزیابی حسی", en: "Laboratory & sensory evaluation" }} title={{ fa: "کیفیت، یک امتیاز واحد نیست.", en: "Quality is never a single score." }} />
            <p className={`${font} mt-7 max-w-[60ch] text-[15px] font-medium leading-8 text-black/60`}>{pick({ fa: "هر نمونه از سه جهت بررسی می‌شود: ویژگی‌های فیزیکوشیمی، ایمنی میکروبی و ارزیابی حسی. نتیجه زمانی تأیید می‌شود که داده آزمایشگاه و تجربه مصرف‌کننده با هم سازگار باشند.", en: "Each sample is assessed for physicochemical properties, microbial safety and sensory performance. Approval comes only when laboratory data and consumer experience align." })}</p>
            <div className="mt-8 grid grid-cols-3 gap-2">{[{fa:"فیزیکوشیمی",en:"Physicochemical"},{fa:"میکروبیولوژی",en:"Microbiology"},{fa:"ارزیابی حسی",en:"Sensory"}].map((lab,i)=><div key={lab.en} className="rounded-[18px] border border-black/10 bg-white p-3 sm:rounded-[20px] sm:p-5"><span className="font-montserrat text-[9px] text-black/30 sm:text-[10px]">LAB <b className={font}>{number(`0${i+1}`)}</b></span><p className={`${font} mt-4 text-[13px] font-black leading-6 sm:mt-7 sm:text-[14px]`}>{pick(lab)}</p></div>)}</div>
          </div>
          <SensoryRadar />
        </div>
      </section>}

      {isSectionVisible("agriculture") && <section id="agriculture" className="scroll-mt-24 bg-[#dfe8d9] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle eyebrow={{ fa: "تحقیقات کشاورزی", en: "Agricultural research" }} title={{ fa: "مزرعه، اولین آزمایشگاه ماست.", en: "The farm is our first laboratory." }} />
          <div className="mt-14 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <div className="relative min-h-[330px] overflow-hidden rounded-[32px] sm:min-h-[430px]">
              <Image src="/media/site/fromFarm.jpg" alt={pick({fa:"کشت محصولات کشاورزی",en:"Agricultural crop cultivation"})} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex flex-wrap gap-2">{[{fa:"گوجه‌فرنگی",en:"Tomato"},{fa:"فلفل",en:"Pepper"},{fa:"کاهو",en:"Lettuce"},{fa:"بادمجان",en:"Eggplant"},{fa:"ذرت",en:"Corn"}].map(x=><span key={x.en} className={`${font} rounded-full border border-white/25 bg-black/15 px-4 py-2 text-[13px] font-bold text-white backdrop-blur-md`}>{pick(x)}</span>)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">{[{n:"GPS",fa:"کشاورزی دقیق",en:"Precision farming"},{n:"GIS",fa:"تحلیل جغرافیایی",en:"Geospatial analysis"},{n:"RS",fa:"سنجش از راه دور",en:"Remote sensing"},{n:"HYDRO",fa:"کشت هیدروپونیک",en:"Hydroponics"}].map((tech,i)=><div key={tech.n} className="flex min-h-[160px] flex-col justify-between rounded-[24px] bg-[#234b35] p-4 text-white sm:min-h-[205px] sm:rounded-[26px] sm:p-5"><span className="font-montserrat text-[24px] font-black text-[#cadd77] sm:text-[30px]">{tech.n}</span><div><span className={`${font} text-[10px] text-white/35 sm:text-[11px]`}>{number(`0${i+1}`)}</span><p className={`${font} mt-2 text-[18px] font-black leading-8 sm:text-[20px]`}>{pick({ fa: tech.fa, en: tech.en })}</p></div></div>)}</div>
          </div>
        </div>
      </section>}

      {isSectionVisible("quality") && <section id="quality" className="scroll-mt-24 bg-[#f7f4ed] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionTitle eyebrow={{ fa: "سیستم کنترل کیفیت", en: "Quality control system" }} title={{ fa: "پنج دروازه؛ هیچ میان‌بری وجود ندارد.", en: "Five gates. No shortcuts." }} />
          <div className="mt-10 sm:mt-14"><div className="grid items-stretch gap-4 sm:flex sm:min-w-[820px] sm:gap-2">{qualities.map((q,i)=><div key={q.en} className="relative flex min-h-[155px] flex-1 flex-col justify-between rounded-[24px] border border-black/10 bg-white p-5 sm:min-h-[240px]"><span className={`${font} text-[30px] font-black text-[#234b35]/10 sm:text-[34px]`}>{number(`0${i+1}`)}</span><div><span className="mb-3 block h-1 w-10 rounded-full bg-[#5f8f62]"/><h3 className={`${font} text-[16px] font-black lg:text-[20px]`}>{pick(q)}</h3><p className={`${font} mt-2 text-[13px] font-medium leading-6 text-black/55 sm:mt-3 lg:text-[15px] lg:leading-7`}>{pick({fa:"نمونه‌برداری، آزمون، ثبت نتیجه و تصمیم روشن.",en:"Sample, test, record and make a clear decision."})}</p></div>{i < qualities.length-1 && <span className="absolute -bottom-5 left-1/2 z-10 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-[#f7f4ed] text-[#234b35] sm:-end-3 sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0"><span className="sm:hidden">↓</span><ArrowForward rtl={locale === "fa"} className="hidden size-3.5 sm:block" /></span>}</div>)}</div></div>
        </div>
      </section>}
    </>
  );
}

function SensoryRadar() {
  const { pick, number, font } = useCopy();
  const labels = [{fa:"طعم",en:"Taste"},{fa:"بو",en:"Aroma"},{fa:"رنگ",en:"Colour"},{fa:"بافت",en:"Texture"},{fa:"ویسکوزیته",en:"Viscosity"}];
  const center = { x: 210, y: 205 }, radius = 142;
  const points = labels.map((_,i)=>{const a=-Math.PI/2+i*Math.PI*2/5; return {x:center.x+Math.cos(a)*radius,y:center.y+Math.sin(a)*radius}});
  const data=[.86,.72,.92,.76,.82].map((v,i)=>({x:center.x+(points[i].x-center.x)*v,y:center.y+(points[i].y-center.y)*v}));
  const poly=(p:{x:number;y:number}[])=>p.map(x=>`${x.x},${x.y}`).join(" ");
  return <div className="rounded-[32px] bg-[#181512] p-5 text-white sm:p-8"><div className="flex items-center justify-between"><span className={`${font} text-[14px] font-black`}>{pick({fa:"پروفایل حسی نمونه",en:"Sample sensory profile"})}</span><span className="font-montserrat text-[10px] text-white/30">SENSORY / <b className={font}>{number("05")}</b></span></div><svg viewBox="0 0 420 420" className="mt-2 w-full" role="img" aria-label={pick({fa:"نمودار ارزیابی حسی محصول",en:"Product sensory evaluation chart"})}>{[.25,.5,.75,1].map(r=><polygon key={r} points={poly(points.map(p=>({x:center.x+(p.x-center.x)*r,y:center.y+(p.y-center.y)*r})))} fill="none" stroke="rgba(255,255,255,.12)"/>)}{points.map((p,i)=><line key={i} x1={center.x} y1={center.y} x2={p.x} y2={p.y} stroke="rgba(255,255,255,.12)"/>)}<polygon points={poly(data)} fill="rgba(202,221,119,.24)" stroke="#cadd77" strokeWidth="3"/>{data.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="5" fill="#cadd77"/>)}{points.map((p,i)=><text key={i} x={center.x+(p.x-center.x)*1.13} y={center.y+(p.y-center.y)*1.13} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,.65)" fontSize="13" fontFamily="inherit">{pick(labels[i])}</text>)}</svg></div>;
}

function OperationsExperience() {
  const { locale, pick, number, font } = useCopy();
  const { isSectionVisible } = useManagedPageContent();
  const [batch, setBatch] = useState(0);
  const stages = [
    { title:{fa:"پذیرش ماده اولیه",en:"Raw material intake"}, code:"GATE 01", text:{fa:"بررسی مجوز تأمین‌کننده، نمونه‌برداری و تأیید آزمایشگاه پیش از ورود به تولید.",en:"Supplier approval, sampling and laboratory sign-off before production entry."}},
    { title:{fa:"آماده‌سازی و تولید",en:"Preparation & production"}, code:"LINE 02", text:{fa:"فرایند مصوب، اتوماسیون ماشین‌آلات و کنترل پارامترهای کلیدی در خط.",en:"Approved process, machine automation and control of critical line parameters."}},
    { title:{fa:"کنترل حین تولید",en:"In-process control"}, code:"QC 03", text:{fa:"نمونه‌برداری منظم و آزمون ویژگی‌های فیزیکی و شیمیایی برای حفظ یکنواختی.",en:"Regular sampling and physicochemical testing to maintain consistency."}},
    { title:{fa:"محصول نهایی",en:"Final product"}, code:"LAB 04", text:{fa:"آزمون میکروبی، فیزیکوشیمی و حسی محصول بسته‌بندی‌شده.",en:"Microbial, physicochemical and sensory testing of the packed product."}},
    { title:{fa:"قرنطینه و رهایش",en:"Quarantine & release"}, code:"PASS 05", text:{fa:"تنها پس از تأیید همه نتایج، مجوز توزیع و فروش صادر می‌شود.",en:"Distribution and sale are released only after all results are approved."}},
    { title:{fa:"توزیع و بازخورد",en:"Distribution & feedback"}, code:"LOOP 06", text:{fa:"محصول وارد شبکه بازار می‌شود و بازخورد دوباره به تحقیق و توسعه بازمی‌گردد.",en:"The product enters the market network and feedback returns to R&D."}},
  ];
  return <>
    {isSectionVisible("story") && <section id="story" className="scroll-mt-24 bg-[#f7f4ed] px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto max-w-[1280px]"><SectionTitle eyebrow={{fa:"مسیر یک بچ محصول",en:"A product batch journey"}} title={{fa:"شش مرحله پیش از ورود هر محصول به بازار.",en:"Six stages before a product enters the market."}}/><div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-[.7fr_1.3fr]"><AnimatePresence mode="wait"><motion.article key={batch} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="flex min-h-[250px] flex-col justify-between rounded-[30px] bg-[#e8a438] p-6 text-[#181512] sm:min-h-[310px] sm:p-8"><span className="font-montserrat text-[11px] font-black tracking-[.16em] opacity-45">{number(stages[batch].code)}</span><div><span className={`${font} text-[58px] font-black leading-none opacity-10 sm:text-[74px]`}>{number(`0${batch+1}`)}</span><h3 className={`${font} mt-3 text-[24px] font-black sm:mt-4 sm:text-[28px]`}>{pick(stages[batch].title)}</h3><p className={`${font} mt-3 text-[14px] font-medium leading-8 opacity-65 sm:mt-4 sm:text-[15px] lg:text-[17px] lg:leading-9`}>{pick(stages[batch].text)}</p></div></motion.article></AnimatePresence><div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">{stages.map((s,i)=><button key={s.code} onClick={()=>setBatch(i)} aria-pressed={batch===i} className={`min-h-[104px] rounded-[22px] border p-4 text-start transition-all sm:min-h-[145px] sm:rounded-[24px] sm:p-5 ${batch===i?"border-[#181512] bg-[#181512] text-white":"border-black/10 bg-white text-[#181512] hover:border-black/30"}`}><span className={`${font} text-[10px] opacity-35`}>{number(`0${i+1}`)}</span><p className={`${font} mt-4 text-[14px] font-black leading-7 sm:mt-8 lg:text-[16px]`}>{pick(s.title)}</p></button>)}</div></div></div></section>}

    {isSectionVisible("factory") && <section id="factory" className="scroll-mt-24 bg-[#181512] px-6 py-20 text-white lg:px-10 lg:py-28"><div className="mx-auto max-w-[1280px]"><SectionTitle light eyebrow={{fa:"کارخانه به‌عنوان یک سیستم",en:"The factory as a system"}} title={{fa:"جریان تولید؛ از ورود تا رهایش.",en:"Production flow, from intake to release."}}/><div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-[1.3fr_.7fr]"><FactoryFlow/><div className="grid grid-cols-2 gap-3">{[{n:{fa:"۲۰٬۰۰۰",en:"20,000"},u:{fa:"متر مربع",en:"sqm"},l:{fa:"کل مجموعه",en:"site area"}},{n:{fa:"۵٬۰۰۰",en:"5,000"},u:{fa:"متر مربع",en:"sqm"},l:{fa:"تولید و پشتیبانی",en:"production & support"}},{n:{fa:"۲۵۰",en:"250"},u:{fa:"نفر",en:"people"},l:{fa:"فصل تولید",en:"production season"}},{n:{fa:"۵۵",en:"55"},u:{fa:"پروانه",en:"licences"},l:{fa:"محصول",en:"products"}}].map((x,i)=><div key={i} className="flex min-h-[155px] flex-col justify-between rounded-[22px] border border-white/10 p-4 sm:min-h-[195px] sm:rounded-[24px] sm:p-5"><span className={`${font} text-[10px] text-white/25`}>{number(`0${i+1}`)}</span><div><strong className={`${font} text-[28px] font-black text-[#e8a438] sm:text-[34px]`}>{pick(x.n)}</strong><span className={`${font} ms-2 text-[13px] text-white/50`}>{pick(x.u)}</span><p className={`${font} mt-3 text-[14px] font-bold leading-7 text-white/70`}>{pick(x.l)}</p></div></div>)}</div></div></div></section>}

    {isSectionVisible("handoff") && <section id="handoff" className="scroll-mt-24 bg-[#e9e3d7] px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-[1280px] gap-8 rounded-[32px] bg-[#181512] p-7 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14"><div><span className={`${font} text-[14px] font-extrabold text-[#e8a438]`}>{pick({fa:"رهایش و تحویل",en:"Release and handoff"})}</span><h2 className={`${font} mt-4 max-w-[760px] text-[34px] font-black leading-tight sm:text-[48px]`}>{pick({fa:"پس از تأیید، مسیر بازار آغاز می‌شود.",en:"Once approved, the route to market begins."})}</h2><p className={`${font} mt-5 max-w-[680px] text-[15px] leading-8 text-white/65 lg:text-[18px] lg:leading-9`}>{pick({fa:"بعد از تأیید نتایج آزمایشگاهی و رهایش نهایی، محصول برای توزیع به شرکت پخش بهروز تحویل می‌شود.",en:"After laboratory approval and final release, the product is handed to Behrouz Distribution for delivery to market."})}</p></div><Link href="/distribution" className={`${font} inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#e8a438] px-6 py-3 text-[15px] font-black text-[#181512]`}>{pick({fa:"مشاهده شبکه پخش",en:"Explore distribution"})}<ArrowIcon/></Link></div></section>}
  </>;
}

function FactoryFlow(){
  const {locale,pick,number,font}=useCopy();
  const reduce=useReducedMotion();
  const stages=[
    {title:{fa:"مواد اولیه",en:"Raw materials"},text:{fa:"ورود و ثبت",en:"Receive & log"}},
    {title:{fa:"آزمایشگاه",en:"Laboratory"},text:{fa:"نمونه و تأیید",en:"Sample & approve"}},
    {title:{fa:"تولید",en:"Production"},text:{fa:"فرایند کنترل‌شده",en:"Controlled process"}},
    {title:{fa:"سردخانه",en:"Cold storage"},text:{fa:"نگهداری پایدار",en:"Stable storage"}},
    {title:{fa:"انبار محصول",en:"Finished goods"},text:{fa:"ثبت و آماده‌سازی",en:"Log & prepare"}},
    {title:{fa:"رهایش و بارگیری",en:"Release & dispatch"},text:{fa:"تأیید و خروج",en:"Approve & dispatch"}},
  ];
  const xs=locale==="fa"?[86,50,14,14,50,86]:[14,50,86,86,50,14];
  const ys=[25,25,25,75,75,75];
  const path=`M ${xs[0]} ${ys[0]} H ${xs[1]} H ${xs[2]} V ${ys[3]} H ${xs[4]} H ${xs[5]}`;
  return <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#201d19] p-5 sm:min-h-[430px] sm:p-7">
    <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle,rgba(255,255,255,.35) 1px,transparent 1px)",backgroundSize:"24px 24px"}}/>
    <div className="relative sm:hidden">
      <div className="absolute bottom-7 start-[17px] top-7 w-px bg-gradient-to-b from-[#e8a438]/25 via-[#e8a438] to-[#f3383a]/40"/>
      {!reduce&&<motion.span className="absolute start-[13px] top-7 z-20 size-[9px] rounded-full bg-white shadow-[0_0_18px_6px_rgba(232,164,56,.75)]" animate={{top:["3%","94%"]}} transition={{duration:5.5,repeat:Infinity,ease:"linear"}}/>}
      <div className="grid gap-3 ps-10">{stages.map((stage,i)=><div key={stage.title.en} className="relative flex min-h-[86px] items-center justify-between rounded-[20px] border border-white/10 bg-white/[.035] p-4"><span className="absolute -start-[31px] grid size-5 place-items-center rounded-full border border-[#e8a438]/60 bg-[#201d19]"><i className="size-1.5 rounded-full bg-[#e8a438]"/></span><div><span className={`${font} text-[10px] font-black text-[#e8a438]`}>{number(`0${i+1}`)}</span><h3 className={`${font} mt-1 text-[16px] font-black`}>{pick(stage.title)}</h3></div><p className={`${font} max-w-[110px] text-[12px] font-bold leading-6 text-white/45`}>{pick(stage.text)}</p></div>)}</div>
    </div>
    <div className="relative hidden min-h-[374px] sm:block">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <path d={path} fill="none" stroke="rgba(232,164,56,.28)" strokeWidth=".7" strokeDasharray="2 1.4" vectorEffect="non-scaling-stroke"/>
        {!reduce&&<circle r="1.25" fill="#fff" className="drop-shadow-[0_0_7px_#e8a438]"><animateMotion dur="7s" repeatCount="indefinite" path={path}/></circle>}
      </svg>
      {stages.map((stage,i)=><div key={stage.title.en} className="absolute flex min-h-[110px] w-[24%] -translate-x-1/2 -translate-y-1/2 flex-col justify-between rounded-[22px] border border-white/10 bg-[#201d19]/95 p-4 shadow-[0_10px_28px_rgba(0,0,0,.18)]" style={{left:`${xs[i]}%`,top:`${ys[i]}%`}}><div className="flex items-center justify-between"><span className={`${font} text-[10px] font-black text-[#e8a438]`}>{number(`0${i+1}`)}</span><span className="size-2 rounded-full bg-[#e8a438] shadow-[0_0_12px_#e8a438]"/></div><div><h3 className={`${font} text-[15px] font-black lg:text-[20px]`}>{pick(stage.title)}</h3><p className={`${font} mt-1 text-[11px] font-bold leading-5 text-white/40 lg:text-[13px] lg:leading-6`}>{pick(stage.text)}</p></div></div>)}
    </div>
  </div>
}

function CrossJourney({ current }: { current: PageKind }) {
  const { pick, number, font } = useCopy();
  const pages = [
    { key: "about", href: "/about", index: "01", title: { fa: "درباره بهروز", en: "About Behrouz" }, desc: { fa: "ریشه‌ها، مقیاس و ارزش‌ها", en: "Origins, scale and values" } },
    { key: "innovation", href: "/innovation", index: "02", title: { fa: "نوآوری و کیفیت", en: "Innovation & quality" }, desc: { fa: "پژوهش، آزمایش و کنترل", en: "Research, testing and control" } },
    { key: "operations", href: "/production", index: "03", title: { fa: "تولید", en: "Production" }, desc: { fa: "کارخانه، فرایند و رهایش", en: "Factory, process and release" } },
  ] as const;
  return <section className="border-y border-black/10 bg-[#f7f4ed] px-6 py-16 lg:px-10 lg:py-20"><div className="mx-auto max-w-[1280px]"><div className="mb-8 flex items-end justify-between"><div><span className={`${font} text-[14px] font-extrabold text-black/45`}>{pick({fa:"برای شناخت بهروز",en:"Explore Behrouz"})}</span><h2 className={`${font} mt-2 text-[28px] font-black`}>{pick({fa:"سه بخش از یک مسیر",en:"Three parts of one journey"})}</h2></div><span className={`${font} hidden text-[10px] text-black/25 sm:block`}>{number("01")} — {number("03")}</span></div><div className="grid gap-3 md:grid-cols-3">{pages.map(page=><Link key={page.key} href={page.href} aria-current={current===page.key?"page":undefined} className={`group flex min-h-[130px] items-end justify-between rounded-[24px] border p-5 transition-all sm:min-h-[160px] ${current===page.key?"border-[#f3383a] bg-[#f3383a] text-white":"border-black/10 bg-white hover:-translate-y-1 hover:border-black/25"}`}><div><span className={`${font} text-[10px] opacity-35`}>{number(page.index)}</span><h3 className={`${font} mt-4 text-[18px] font-black sm:mt-6 lg:text-[21px]`}>{pick(page.title)}</h3><p className={`${font} mt-2 text-[13px] font-medium leading-6 opacity-55 lg:text-[15px] lg:leading-7`}>{pick(page.desc)}</p></div><span className={`grid size-10 place-items-center rounded-full ${current===page.key?"bg-white text-[#f3383a]":"bg-[#181512] text-white"}`}><ArrowIcon/></span></Link>)}</div></div></section>;
}

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: Localized; title: Localized; light?: boolean }) {
  const { locale, pick, font } = useCopy();
  return <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: .45 }}><span className={`${font} inline-flex items-center gap-3 text-[14px] font-extrabold ${locale === "en" ? "uppercase tracking-[.1em]" : "tracking-normal"} ${light ? "text-white/50" : "text-black/50"}`}><i className={`h-px w-7 ${light ? "bg-white/35" : "bg-black/30"}`}/>{pick(eyebrow)}</span><h2 className={`${font} mt-4 max-w-[880px] text-[34px] font-black leading-[1.25] sm:text-[46px] lg:text-[58px] ${locale === "en" ? "tracking-[-.02em]" : "tracking-normal"} ${light ? "text-white" : "text-[#181512]"}`}>{pick(title)}</h2></motion.div>;
}

function ArrowIcon(){const{locale}=useCopy();return <ArrowForward rtl={locale === "fa"} className="size-4" />}
