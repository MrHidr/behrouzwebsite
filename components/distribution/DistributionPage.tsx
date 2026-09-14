"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  ManagedImage as Image,
  ManagedPageProvider,
  useManagedPageContent,
} from "@/components/cms/ManagedPageContent";
import { ArrowForward, ArrowUpForward } from "@/components/ui/icons";
import { ProtectedContactValue } from "@/components/contact/ProtectedContactValue";
import type { ManagedPage } from "@/lib/cms-content";
import { localizeDigits } from "@/lib/locale-digits";
import { ACCESS_POINTS, AccessKind, IranAccessMap } from "@/components/distribution/IranAccessMap";

type Localized = { fa: string; en: string };

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const network = [
  {
    count: "8",
    label: { fa: "شعبه", en: "Branches" },
    summary: { fa: "مراکز اصلی عملیات، فروش و لجستیک", en: "Primary sales, operations and logistics centres" },
    places: {
      fa: "تهران، البرز، مازندران، مرکزی، اصفهان، فارس، خوزستان و خراسان رضوی",
      en: "Tehran, Alborz, Mazandaran, Markazi, Isfahan, Fars, Khuzestan and Razavi Khorasan",
    },
    color: "#eeaa33",
  },
  {
    count: "9",
    label: { fa: "مرکز هیبرید", en: "Hybrid centres" },
    summary: { fa: "عملیات ترکیبی فروش، توزیع و پشتیبانی منطقه‌ای", en: "Combined sales, distribution and regional support" },
    places: {
      fa: "آذربایجان شرقی، آذربایجان غربی، گیلان، همدان، قم، قزوین، سمنان، خراسان شمالی و خراسان جنوبی",
      en: "East Azerbaijan, West Azerbaijan, Gilan, Hamedan, Qom, Qazvin, Semnan, North Khorasan and South Khorasan",
    },
    color: "#55a978",
  },
  {
    count: "21",
    label: { fa: "نمایندگی", en: "Agencies" },
    summary: { fa: "بازوهای اجرایی در بازارهای دارای ظرفیت رشد", en: "Local execution arms in growth markets" },
    places: {
      fa: "اردبیل، زنجان، کردستان، کرمانشاه، لرستان، ایلام، چهارمحال و بختیاری، کهگیلویه و بویراحمد، بوشهر، یزد، کرمان، هرمزگان، گلستان و سیستان و بلوچستان؛ با بیش از یک نمایندگی در برخی استان‌ها",
      en: "Ardabil, Zanjan, Kurdistan, Kermanshah, Lorestan, Ilam, Chaharmahal and Bakhtiari, Kohgiluyeh and Boyer-Ahmad, Bushehr, Yazd, Kerman, Hormozgan, Golestan and Sistan and Baluchestan; with multiple agencies in selected provinces",
    },
    color: "#f05a47",
  },
] as const;

const advantages = [
  {
    title: { fa: "شناخت بازار خرده‌فروشی", en: "Retail market intelligence" },
    metric: { fa: "۷۶٬۰۰۰ مشتری فعال", en: "76,000 active customers" },
    text: {
      fa: "ارتباط مستقیم و غیرمستقیم با بازار، داده‌ای زنده از رفتار خرید، وضعیت قفسه و فرصت‌های رشد در اختیار برندها می‌گذارد.",
      en: "Direct and indirect market access provides brands with live insight into buying behaviour, shelf conditions and growth opportunities.",
    },
  },
  {
    title: { fa: "نیروی فروش حرفه‌ای", en: "Professional sales force" },
    metric: { fa: "حدود ۸٬۰۰۰ ویزیت روزانه", en: "About 8,000 daily visits" },
    text: {
      fa: "۲۷۰ کارشناس فروش و ۳۲ سرپرست، ویزیت‌های هدفمند را با فرایند استاندارد و ابزار دیجیتال اجرا و پایش می‌کنند.",
      en: "A team of 270 sales specialists and 32 supervisors runs and monitors targeted visits through standardised digital workflows.",
    },
  },
  {
    title: { fa: "زیرساخت توزیع", en: "Distribution infrastructure" },
    metric: { fa: "تحویل حداکثر تا ۴۸ ساعت", en: "Delivery within 48 hours" },
    text: {
      fa: "هفت انبار فعال و ناوگان ۷۳ دستگاهی، تحویل مطمئن سفارش را در شبکه سراسری پشتیبانی می‌کنند.",
      en: "Seven active warehouses and a 73-vehicle fleet support reliable order fulfilment across the national network.",
    },
  },
  {
    title: { fa: "زیرساخت دیجیتال", en: "Digital backbone" },
    metric: { fa: "از سفارش تا تحویل، قابل ردیابی", en: "Traceable from order to delivery" },
    text: {
      fa: "ERP راهکاران، سفارش‌گیری تبلتی، ردیابی GPS، مدیریت مسیر و گزارش برخط فروش، عملیات را شفاف و کنترل‌پذیر می‌کند.",
      en: "Rahkaran ERP, tablet ordering, GPS tracking, route management and live sales reporting make operations transparent and controllable.",
    },
  },
  {
    title: { fa: "توان توسعه بازار", en: "Market development" },
    metric: { fa: "پوشش ۶۵٪ فروش سوپرمارکتی", en: "65% supermarket sales coverage" },
    text: {
      fa: "تیم‌های تخصصی متناسب با هر کانال، امکان توسعه صنایع غذایی، بهداشتی، آرایشی و در آینده کانال داروخانه را فراهم می‌کنند.",
      en: "Channel-specific teams create room to grow food, personal-care and beauty categories, with pharmacy as a future channel.",
    },
  },
  {
    title: { fa: "اعتبار و تجربه", en: "Credibility and experience" },
    metric: { fa: "بیش از چهار دهه تجربه FMCG", en: "Four decades of FMCG experience" },
    text: {
      fa: "روابط پایدار با شبکه فروش و تجربه عرضه محصولات مصرفی، بستری مطمئن برای ورود و رشد سریع برندها ایجاد کرده است.",
      en: "Longstanding trade relationships and consumer-goods experience provide a dependable platform for rapid brand entry and growth.",
    },
  },
  {
    title: { fa: "یکپارچگی لجستیک و فروش", en: "Integrated logistics and sales" },
    metric: { fa: "یک شریک، یک تصویر از بازار", en: "One partner, one market view" },
    text: {
      fa: "اتصال فروش مویرگی، لجستیک و داده، تصویری یکپارچه از بازار می‌سازد و تصمیم‌گیری را برای شرکای تجاری دقیق‌تر می‌کند.",
      en: "Connecting field sales, logistics and data creates one market view and supports more informed decisions for business partners.",
    },
  },
] as const;

function useCopy() {
  const { locale, pick } = useManagedPageContent();
  return {
    locale,
    pick,
    number: (value: string | number) => localizeDigits(value, locale),
    font: locale === "en" ? "font-montserrat" : "font-yekan",
  };
}

export function DistributionPage({ page }: { page?: ManagedPage }) {
  return (
    <ManagedPageProvider page={page}>
      <DistributionPageBody />
    </ManagedPageProvider>
  );
}

function DistributionPageBody() {
  const { locale, isSectionVisible } = useManagedPageContent();
  return (
    <div dir={locale === "fa" ? "rtl" : "ltr"} className="overflow-hidden bg-[#f6f3ec] text-[#122443]">
      {isSectionVisible("hero") && <DistributionHero />}
      {isSectionVisible("promise") && <DistributionPromise />}
      {isSectionVisible("network") && <NetworkFootprint />}
      {isSectionVisible("route") && <RouteToMarket />}
      {isSectionVisible("sales") && <SalesMethod />}
      {isSectionVisible("capabilities") && <Capabilities />}
      {isSectionVisible("leadership") && <Leadership />}
      {isSectionVisible("partnership") && <PartnershipCta />}
    </div>
  );
}

function DistributionHero() {
  const { locale, page, pick, isSectionVisible } = useManagedPageContent();
  const { number, font } = useCopy();
  const reduce = useReducedMotion();
  const stats = [
    { value: { fa: "۳۸", en: "38" }, label: { fa: "مرکز عملیاتی", en: "operating centres" } },
    { value: { fa: "۷۶ هزار", en: "76,000" }, label: { fa: "مشتری فعال", en: "active customers" } },
    { value: { fa: "۲۷۰", en: "270" }, label: { fa: "کارشناس فروش", en: "sales specialists" } },
    { value: { fa: "پوشش کامل", en: "100%" }, label: { fa: "سراسر ایران", en: "Iran coverage" } },
  ];
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#071b3b] text-white">
      <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0 : 1.35, ease }} className="absolute inset-0">
        <Image src={page?.image || "/media/site/distribution-fleet.webp"} alt={page ? pick(page.imageAlt) : pick({ fa: "ناوگان پخش بهروز", en: "Behrouz distribution fleet" })} fill priority sizes="100vw" className="object-cover object-[63%_center]" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,17,43,.96)_0%,rgba(4,17,43,.83)_43%,rgba(4,17,43,.22)_78%)] rtl:bg-[linear-gradient(270deg,rgba(4,17,43,.96)_0%,rgba(4,17,43,.83)_43%,rgba(4,17,43,.22)_78%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071b3b] via-transparent to-black/35" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1480px] items-center px-6 pb-56 pt-32 sm:px-10 sm:pb-48 lg:px-16 lg:pb-44">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.15 } } }} className="max-w-[820px]">
          <motion.span variants={reveal} className={`${font} inline-flex items-center gap-3 text-[13px] font-extrabold text-[#efaa32] ${locale === "en" ? "uppercase tracking-[.14em]" : ""}`}><i className="h-px w-9 bg-[#efaa32]" />{page ? pick(page.eyebrow) : pick({ fa: "شرکت پخش بهروز", en: "Behrouz Distribution Company" })}</motion.span>
          <motion.h1 variants={reveal} className={`${font} mt-6 max-w-[780px] text-[47px] font-black leading-[1.12] sm:text-[66px] lg:text-[82px] ${locale === "en" ? "tracking-[-.04em]" : ""}`}>
            {page ? pick(page.title) : pick({ fa: "شریک توسعه برندها در بازار ایران", en: "Your growth partner in Iran's FMCG market" })}
          </motion.h1>
          <motion.p variants={reveal} className={`${font} mt-7 max-w-[650px] text-[15px] font-medium leading-8 text-white/70 sm:text-[17px] lg:text-[19px] lg:leading-9`}>
              {page ? pick(page.lead) : pick({ fa: "شبکه‌ای یکپارچه از فروش، توزیع مویرگی، لجستیک و داده؛ برای رساندن برند از برنامه رشد تا حضور مؤثر روی قفسه.", en: "An integrated sales, last-mile distribution, logistics and data network—taking brands from a growth plan to meaningful shelf presence." })}
          </motion.p>
          <motion.div variants={reveal} className="mt-9 flex flex-wrap gap-3">
            {isSectionVisible("network") && <a href="#network" className={`${font} inline-flex min-h-12 items-center gap-3 rounded-full bg-[#efaa32] px-6 py-3 text-[14px] font-black text-[#071b3b]`}>{pick({ fa: "مشاهده شبکه", en: "Explore the network" })}<DownIcon /></a>}
            {isSectionVisible("partnership") && <a href="#partnership" className={`${font} inline-flex min-h-12 items-center gap-3 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[14px] font-black text-white backdrop-blur`}>{pick({ fa: "شروع همکاری", en: "Start a partnership" })}<ArrowForward rtl={locale === "fa"} className="size-4" /></a>}
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute inset-x-4 bottom-4 z-20 mx-auto grid max-w-[1160px] grid-cols-2 overflow-hidden rounded-[26px] border border-white/15 bg-[#071b3b]/75 p-2 backdrop-blur-xl sm:inset-x-7 lg:grid-cols-4">
        {stats.map((stat, index) => <div key={stat.value.en} className={`flex min-h-[82px] flex-col justify-center px-4 py-3 ${index % 2 ? "border-s border-white/10" : ""} lg:border-s lg:first:border-s-0`}><strong className={`${font} text-[24px] font-black text-[#efaa32] sm:text-[28px]`}>{pick(stat.value)}</strong><span className={`${font} mt-1 text-[11px] font-bold text-white/55 sm:text-[12px] lg:text-[14px]`}>{pick(stat.label)}</span></div>)}
      </div>
    </section>
  );
}

function DistributionPromise() {
  const { locale, pick, number, font } = useCopy();
  const pillars = [
    { title: { fa: "شبکه سراسری", en: "National network" }, text: { fa: "فروش و توزیع در نقاط کلیدی کشور", en: "Sales and distribution across key markets" } },
    { title: { fa: "سرمایه انسانی", en: "Expert people" }, text: { fa: "تیم فروش آموزش‌دیده و مدیریت باتجربه", en: "A trained sales force and experienced leadership" } },
    { title: { fa: "زیرساخت یکپارچه", en: "Integrated operations" }, text: { fa: "لجستیک، انبارداری، ERP و داده بازار", en: "Logistics, warehousing, ERP and market data" } },
    { title: { fa: "شناخت مصرف‌کننده", en: "Consumer understanding" }, text: { fa: "بینش میدانی از رفتار خرید و ساختار بازار", en: "Field insight into buying behaviour and market structure" } },
  ];
  return (
    <section id="promise" className="scroll-mt-24 px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading eyebrow={{ fa: "فراتر از تحویل کالا", en: "Beyond product delivery" }} title={{ fa: "پخش زمانی ارزش می‌سازد که بازار را توسعه دهد.", en: "Distribution creates value when it develops the market." }} />
        <motion.p variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.45 }} className={`${font} mt-7 max-w-[920px] text-[15px] font-medium leading-9 text-[#122443]/62 sm:text-[16px] lg:text-[18px] lg:leading-10`}>
          {pick({ fa: "این مسیر از سال ۱۳۵۶ و شکل‌گیری صنایع غذایی بهروز آغاز شد؛ یکی از نخستین تولیدکنندگان ایرانی مایونز، کچاپ و کنسرو سبزیجات. شرکت پخش بهروز امروز بازوی تخصصی فروش و توزیع گروه و زیرساختی آماده برای توسعه برندهای FMCG در بازار ایران است.", en: "The story began in 1977 with Behrouz Food Industries, an early Iranian producer of mayonnaise, ketchup and canned vegetables. Today, Behrouz Distribution is the group's specialist sales and distribution arm and an execution-ready platform for FMCG brand development in Iran." })}
        </motion.p>
        <div className="mt-12 grid gap-4 lg:grid-cols-[.78fr_1.22fr]">
          <motion.article variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="flex min-h-[370px] flex-col justify-between rounded-[32px] bg-[#efaa32] p-7 text-[#071b3b] sm:p-9">
            <span className={`${font} text-[11px] font-black opacity-45 ${locale === "en" ? "tracking-[.14em]" : ""}`}>{pick({ fa: "مأموریت · ۰۱", en: "MISSION / 01" })}</span>
            <div><p className={`${font} text-[26px] font-black leading-[1.55] sm:text-[32px]`}>{pick({ fa: "مأموریت ما، رساندن محصولات غذایی باکیفیت و ارزشمند از مسیر شبکه‌ای حرفه‌ای و پاسخ‌گوست.", en: "Our mission is to deliver quality food products through a professional, responsive distribution network." })}</p><p className={`${font} mt-5 text-[14px] font-medium leading-8 opacity-65 lg:text-[17px] lg:leading-9`}>{pick({ fa: "این شبکه باید رشد برند، دسترسی مصرف‌کننده و سهم بازار را با کارکنان توانمند، فرایندهای روشن و زیرساختی مقیاس‌پذیر پیش ببرد.", en: "The network is designed to advance brand growth, consumer access and market share through capable people, clear processes and scalable infrastructure." })}</p></div>
          </motion.article>
          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map((pillar, index) => <motion.article key={pillar.title.en} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="flex min-h-[178px] flex-col justify-between rounded-[28px] border border-[#122443]/10 bg-white p-6"><span className={`${font} text-[38px] font-black text-[#122443]/[.07]`}>{number(`0${index + 1}`)}</span><div><h3 className={`${font} text-[18px] font-black lg:text-[21px]`}>{pick(pillar.title)}</h3><p className={`${font} mt-2 text-[13px] font-medium leading-7 text-[#122443]/55 lg:text-[16px] lg:leading-8`}>{pick(pillar.text)}</p></div></motion.article>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkFootprint() {
  const { locale, pick, number, font } = useCopy();
  const [active, setActive] = useState<AccessKind | null>(null);
  const selected = active === null ? null : network[active];
  const displayedPoints = active === null ? ACCESS_POINTS : ACCESS_POINTS.filter((point) => point.kind === active);
  const filters = [
    { value: null, label: { fa: "همه نقاط", en: "All points" }, count: "38" },
    ...network.map((item, index) => ({ value: index as AccessKind, label: item.label, count: item.count })),
  ];
  return (
    <section id="network" className="scroll-mt-24 bg-[#071b3b] px-6 py-20 text-white lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading light eyebrow={{ fa: "پوشش جغرافیایی", en: "Geographic footprint" }} title={{ fa: "۳۸ نقطه عملیاتی در ۳۱ استان ایران", en: "38 operating points across 31 provinces of Iran" }} />
        <div className="no-scrollbar mt-9 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={pick({ fa: "فیلتر نوع نقطه عملیاتی", en: "Filter operating point type" })}>
          {filters.map((filter) => {
            const isActive = active === filter.value;
            return <button key={filter.label.en} type="button" aria-pressed={isActive} onClick={() => setActive(filter.value)} className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 transition-all sm:px-5 ${isActive ? "border-white bg-white text-[#071b3b] shadow-[0_10px_30px_rgba(0,0,0,.14)]" : "border-white/12 bg-white/[.04] text-white/58 hover:border-white/25 hover:bg-white/[.08] hover:text-white"}`}>
              {filter.value !== null && <i className="size-2 rounded-full" style={{ backgroundColor: network[filter.value].color }} />}
              <span className={`${font} text-[12px] font-black sm:text-[13px]`}>{pick(filter.label)}</span>
              <span className={`${font} text-[10px] font-black opacity-45`}>{number(filter.count)}</span>
            </button>;
          })}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_.75fr] lg:items-stretch">
          <IranAccessMap active={active} />
          <aside className="flex min-h-full flex-col rounded-[28px] border border-white/10 bg-white/[.045] p-5 sm:p-7 lg:rounded-[32px]">
            <AnimatePresence mode="wait">
              <motion.div key={active ?? "all"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .25 }} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                  <div><span className={`${font} text-[11px] font-black text-white/38`}>{selected ? pick({ fa: "نوع نقطه عملیاتی", en: "Operating point type" }) : pick({ fa: "شبکه یکپارچه پخش", en: "Integrated distribution network" })}</span><h3 className={`${font} mt-2 text-[22px] font-black lg:text-[25px]`}>{selected ? pick(selected.label) : pick({ fa: "پوشش سراسری عملیات", en: "Nationwide operations" })}</h3></div>
                  <strong className={`${font} text-[44px] font-black leading-none`} style={{ color: selected?.color ?? "#ffffff" }}>{number(selected?.count ?? "38")}</strong>
                </div>
                <p className={`${font} mt-4 text-[13px] font-medium leading-7 text-white/52 lg:text-[14px] lg:leading-8`}>{selected ? pick(selected.summary) : pick({ fa: "ترکیب شعب، مراکز هیبرید و نمایندگی‌ها، یک شبکه پیوسته برای فروش، توزیع و پشتیبانی بازار می‌سازد.", en: "Branches, hybrid centres and agencies form one connected network for sales, distribution and market support." })}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <h4 className={`${font} text-[12px] font-black text-white/78`}>{pick({ fa: "فهرست استان‌ها", en: "Province directory" })}</h4>
                  <span className={`${font} text-[10px] font-bold text-white/32`}>{number(displayedPoints.length)} {pick({ fa: "استان", en: "provinces" })}</span>
                </div>
                <div className="mt-3 flex flex-wrap content-start gap-2">
                  {displayedPoints.map((point, index) => (
                    <div key={point.name.en} className="inline-flex w-auto items-center gap-2 rounded-[15px] border border-white/[.07] bg-white/[.04] px-2.5 py-2">
                      <b className={`${font} grid size-6 shrink-0 place-items-center rounded-full text-[9px] font-black text-[#071b3b]`} style={{ backgroundColor: network[point.kind].color }}>{number(index + 1)}</b>
                      <span className="flex min-w-0 flex-col pe-1">
                        <span className={`${font} whitespace-nowrap text-[12px] font-black leading-5 text-white/86 lg:text-[13px]`}>{pick(point.name)}</span>
                        <small className={`${font} whitespace-nowrap text-[9px] font-medium leading-4 text-white/35`}>{pick(network[point.kind].label)}</small>
                      </span>
                    </div>
                  ))}
                </div>
                {active === 2 && <p className={`${font} mt-auto pt-4 text-[10px] font-medium leading-5 text-white/35 lg:text-[11px]`}>{pick({ fa: "در بعضی استان‌ها بیش از یک نمایندگی فعال است؛ به همین دلیل تعداد نمایندگی‌ها از تعداد استان‌ها بیشتر است.", en: "Some provinces host more than one active agency, so the agency count is higher than the province count." })}</p>}
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </section>
  );
}

function RouteToMarket() {
  const { locale, pick, number, font } = useCopy();
  const steps = [
    { label: { fa: "تولیدکننده", en: "Producer" }, sub: { fa: "کالای تندمصرف", en: "FMCG supply" } },
    { label: { fa: "پخش بهروز", en: "Behrouz Distribution" }, sub: { fa: "فروش، داده و لجستیک", en: "Sales, data & logistics" } },
    { label: { fa: "شبکه عملیات", en: "Operating network" }, sub: { fa: "شعبه، هیبرید، نمایندگی", en: "Branches, hybrids, agencies" } },
    { label: { fa: "بازار", en: "Market" }, sub: { fa: "سنتی، مدرن و آنلاین", en: "Traditional, modern & online" } },
  ];
  const channels = [
    { value: { fa: "بیش از ۳۶ هزار", en: "36K+" }, fa: "خرده‌فروشی مستقیم", en: "Direct retail" },
    { value: { fa: "بیش از ۴۰ هزار", en: "40K+" }, fa: "خرده‌فروشی غیرمستقیم", en: "Indirect retail" },
    { value: { fa: "بیش از ۱٬۹۰۰", en: "1,900+" }, fa: "عمده‌فروشی", en: "Wholesale" },
    { value: { fa: "بیش از ۱۰ هزار", en: "10K+" }, fa: "مدرن‌ترید و آنلاین", en: "Modern trade & online" },
  ];
  return (
    <section id="route" className="scroll-mt-24 px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading eyebrow={{ fa: "شبکه توزیع", en: "Route to market" }} title={{ fa: "از سفارش تا قفسه؛ هر مرحله روشن و قابل پیگیری.", en: "From order to shelf, every stage clear and traceable." }} />
        <div className="mt-12 grid gap-3 lg:grid-cols-4">
          {steps.map((step, index) => <motion.article key={step.label.en} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className={`relative flex min-h-[175px] flex-col justify-between rounded-[26px] p-6 ${index === 1 ? "bg-[#efaa32] text-[#071b3b]" : "border border-[#122443]/10 bg-white"}`}><span className={`${font} text-[11px] font-black opacity-30`}>{number(`0${index + 1}`)}</span><div><h3 className={`${font} text-[18px] font-black lg:text-[21px]`}>{pick(step.label)}</h3><p className={`${font} mt-2 text-[12px] font-bold opacity-50 lg:text-[15px] lg:leading-7`}>{pick(step.sub)}</p></div>{index < steps.length - 1 && <span className="absolute -bottom-4 start-1/2 z-10 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-[#071b3b] text-white lg:-end-5 lg:bottom-auto lg:start-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"><ArrowForward rtl={locale === "fa"} className="size-3.5 rotate-90 lg:rotate-0" /></span>}</motion.article>)}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {channels.map(channel => <div key={channel.en} className="rounded-[22px] bg-[#e8e2d6] p-5"><strong className={`${font} text-[25px] font-black text-[#071b3b] sm:text-[28px]`}>{pick(channel.value)}</strong><p className={`${font} mt-2 text-[12px] font-black leading-6 text-[#122443]/55 lg:text-[15px] lg:leading-7`}>{pick({ fa: channel.fa, en: channel.en })}</p></div>)}
        </div>
        <div className="mt-4 grid gap-4 rounded-[30px] bg-[#122443] p-6 text-white sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div><h3 className={`${font} text-[20px] font-black lg:text-[23px]`}>{pick({ fa: "زیرساخت آماده اجرا", en: "Execution-ready infrastructure" })}</h3><p className={`${font} mt-2 text-[13px] font-medium leading-7 text-white/55 lg:text-[16px] lg:leading-8`}>{pick({ fa: "۷ انبار فعال، ۳ تریلی، ۵۰ کامیون ایسوزو و ۲۰ نیسان برای تحویل سریع و به‌موقع.", en: "Seven active warehouses, 3 trailers, 50 Isuzu trucks and 20 pickups for fast, dependable delivery." })}</p></div><div className="flex gap-2"><MetricPill value="7" label={{ fa: "انبار", en: "warehouses" }} /><MetricPill value="73" label={{ fa: "خودرو", en: "vehicles" }} /></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { value: "270", label: { fa: "کارشناس فروش", en: "sales specialists" } },
            { value: "32", label: { fa: "سرپرست فروش", en: "sales supervisors" } },
            { value: "9", label: { fa: "رئیس فروش", en: "sales chiefs" } },
            { value: "6", label: { fa: "مدیر فروش", en: "sales managers" } },
          ].map(item => <div key={item.value} className="rounded-[22px] border border-[#122443]/10 bg-white p-5"><strong className={`${font} text-[30px] font-black text-[#efaa32]`}>{number(item.value)}</strong><p className={`${font} mt-2 text-[12px] font-black text-[#122443]/55 lg:text-[15px]`}>{pick(item.label)}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function SalesMethod() {
  const { pick, number, font } = useCopy();
  const steps = [
    { fa: "خروجی", en: "Sell-out" },
    { fa: "چیدمان استاندارد", en: "Planogram" },
    { fa: "سهم قفسه", en: "Shelf share" },
    { fa: "حضور اثربخش", en: "Effective presence" },
    { fa: "قیمت‌گذاری رقابتی", en: "Competitive pricing" },
  ];
  return (
    <section className="bg-[#e8e2d6] px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading eyebrow={{ fa: "متدولوژی فروش", en: "Sales methodology" }} title={{ fa: "رقابت در بازار، روی قفسه دیده می‌شود.", en: "Market competition becomes visible on the shelf." }} />
        <div className="mt-12 grid gap-3 lg:grid-cols-5">
          {steps.map((step, index) => <motion.div key={step.en} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.45 }} className="relative flex min-h-[150px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#071b3b] p-5 text-white lg:min-h-[270px]" style={{ marginTop: `${index * 14}px` }}><div className="absolute inset-x-0 bottom-0 bg-[#efaa32]/10" style={{ height: `${28 + index * 13}%` }} /><span className={`${font} relative text-[11px] font-black text-[#efaa32]`}>{number(`0${index + 1}`)}</span><h3 className={`${font} relative text-[17px] font-black leading-7 lg:text-[21px] lg:leading-8`}>{pick(step)}</h3></motion.div>)}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  const { pick, number, font } = useCopy();
  const [active, setActive] = useState(0);
  return (
    <section id="capabilities" className="px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading eyebrow={{ fa: "مزیت رقابتی", en: "Competitive advantage" }} title={{ fa: "هفت توانمندی، در یک عملیات یکپارچه.", en: "Seven capabilities in one integrated operation." }} />
        <div className="mt-12 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
          <div className="grid gap-2">
            {advantages.map((advantage, index) => <button key={advantage.title.en} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`flex min-h-[68px] items-center justify-between rounded-[20px] px-5 py-3 text-start transition-colors ${active === index ? "bg-[#efaa32] text-[#071b3b]" : "border border-[#122443]/10 bg-white hover:bg-[#122443]/[.04]"}`}><span className={`${font} text-[14px] font-black`}>{pick(advantage.title)}</span><span className={`${font} text-[11px] font-black opacity-30`}>{number(`0${index + 1}`)}</span></button>)}
          </div>
          <AnimatePresence mode="wait">
            <motion.article key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex min-h-[430px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#071b3b] p-7 text-white sm:p-10">
              <div className="flex items-start justify-between"><span className={`${font} text-[12px] font-black text-[#efaa32]`}>{pick({ fa: "توانمندی پخش بهروز", en: "Behrouz capability" })}</span><strong className={`${font} text-[72px] font-black leading-none text-white/[.06] sm:text-[110px]`}>{number(`0${active + 1}`)}</strong></div>
              <div><h3 className={`${font} max-w-[700px] text-[29px] font-black leading-tight sm:text-[40px]`}>{pick(advantages[active].metric)}</h3><p className={`${font} mt-6 max-w-[750px] text-[15px] font-medium leading-8 text-white/62 lg:text-[18px] lg:leading-9`}>{pick(advantages[active].text)}</p></div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Leadership() {
  const { pick, number, font } = useCopy();
  const people = [
    {
      name: { fa: "آقای مرسی", en: "Mr. Morsi" },
      role: { fa: "مدیرعامل صنایع غذایی بهروز", en: "CEO, Behrouz Food Industries" },
      text: { fa: "مدیر ارشد صنعت FMCG با بیش از سه دهه تجربه در ایران و منطقه؛ با سابقه مدیرعاملی، مدیریت ارشد عملیاتی و فروش و عضویت هیئت‌مدیره در بهروز، صافولا ایران، پاکچوب، پاکرخ، Americana Foods و Al Aqili Group. متخصص استراتژی رشد، توسعه فروش و توزیع، تحول سازمانی و رهبری کسب‌وکارهای بزرگ.", en: "An FMCG executive with more than three decades of experience in Iran and the region, including CEO, COO, sales-leadership and board roles at Behrouz, Savola Iran, Pakchoob, Pakrokh, Americana Foods and Al Aqili Group. He specialises in growth strategy, sales and distribution development, organisational transformation and large-business leadership." },
    },
    {
      name: { fa: "عباس جوانپور", en: "Abbas Javanpour" },
      role: { fa: "مدیر ارشد فروش صنایع غذایی بهروز", en: "Chief Sales Officer, Behrouz Food Industries" },
      text: { fa: "مدیر فروش با بیش از دو دهه تجربه در طراحی و اجرای استراتژی‌های فروش، توسعه بازار، مدیریت کانال‌های توزیع و رهبری تیم‌های فروش در شرکت‌های ایرانی و بین‌المللی؛ با نقشی مؤثر در افزایش سهم بازار، بهبود عملکرد فروش و ارتقای بهره‌وری شرکت پخش بهروز.", en: "A sales leader with more than two decades of experience designing and executing sales strategies, developing markets, managing distribution channels and leading teams in Iranian and international companies, with a key role in growing market share, sales performance and productivity at Behrouz Distribution." },
    },
  ];
  return (
    <section className="bg-[#071b3b] px-6 py-20 text-white lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeading light eyebrow={{ fa: "رهبری", en: "Leadership" }} title={{ fa: "تجربه بین‌المللی، شناخت دقیق بازار ایران.", en: "International experience, grounded in Iran's market." }} />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {people.map((person, index) => <motion.article key={person.name.en} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }} className="flex min-h-[300px] flex-col justify-between rounded-[30px] border border-white/10 bg-white/[.04] p-7 sm:p-9"><span className={`${font} text-[54px] font-black text-white/[.05]`}>{number(`0${index + 1}`)}</span><div><h3 className={`${font} text-[24px] font-black`}>{pick(person.name)}</h3><p className={`${font} mt-2 text-[13px] font-black text-[#efaa32] lg:text-[15px]`}>{pick(person.role)}</p><p className={`${font} mt-5 text-[14px] font-medium leading-8 text-white/58 lg:text-[17px] lg:leading-9`}>{pick(person.text)}</p></div></motion.article>)}
        </div>
      </div>
    </section>
  );
}

function PartnershipCta() {
  const { locale, pick, font } = useCopy();
  return (
    <section id="partnership" className="scroll-mt-24 bg-[#efaa32] px-6 py-20 text-[#071b3b] lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><span className={`${font} text-[13px] font-black opacity-50`}>{pick({ fa: "همکاری تجاری", en: "Business partnership" })}</span><h2 className={`${font} mt-4 max-w-[880px] text-[38px] font-black leading-tight sm:text-[54px] lg:text-[64px]`}>{pick({ fa: "برای توسعه برندتان در ایران، گفت‌وگو کنیم.", en: "Let's talk about developing your brand in Iran." })}</h2><p className={`${font} mt-5 max-w-[720px] text-[14px] font-medium leading-8 opacity-60 lg:text-[17px] lg:leading-9`}>{pick({ fa: "درخواست همکاری، توسعه کانال، فروش عمده یا پیشنهاد تجاری شما مستقیم به تیم مرتبط می‌رسد.", en: "Partnership, channel development, wholesale and commercial enquiries go directly to the relevant team." })}</p><div className={`${font} mt-6 flex max-w-[820px] flex-col gap-2 border-t border-[#071b3b]/15 pt-5 text-[12px] font-bold leading-7 opacity-60 sm:flex-row sm:gap-7 lg:text-[15px] lg:leading-8`}><ProtectedContactValue value="+982144536090" displayValue="021-44536090–3" kind="phone" label={pick({ fa: "تماس با دفتر مرکزی", en: "Call the head office" })} color="#071b3b" fontSize={15} className="max-w-full overflow-hidden text-start"/><span>{pick({ fa: "تهران، کیلومتر ۸ بزرگراه لشگری (غرب به شرق)، بعد از بلوار دکتر عبیدی، بین رامک خودرو و تهران دیزل", en: "Tehran, 8th km of Lashgari Highway (west to east), after Dr. Obeidi Blvd., between Ramak Khodro and Tehran Diesel" })}</span></div></div>
        <Link href="/contact" className={`${font} inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#071b3b] px-7 py-4 text-[15px] font-black text-white`}>{pick({ fa: "ارتباط با تیم پخش بهروز", en: "Contact Behrouz Distribution" })}<ArrowUpForward rtl={locale === "fa"} className="size-5" /></Link>
      </div>
    </section>
  );
}

function MetricPill({ value, label }: { value: string; label: Localized }) {
  const { pick, number, font } = useCopy();
  return <span className="flex min-w-[92px] flex-col rounded-[18px] bg-white/10 px-4 py-3"><strong className={`${font} text-[22px] font-black text-[#efaa32]`}>{number(value)}</strong><small className={`${font} text-[10px] font-bold text-white/45`}>{pick(label)}</small></span>;
}

function SectionHeading({ eyebrow, title, light = false }: { eyebrow: Localized; title: Localized; light?: boolean }) {
  const { locale, pick, font } = useCopy();
  return <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}><span className={`${font} inline-flex items-center gap-3 text-[13px] font-extrabold ${locale === "en" ? "uppercase tracking-[.1em]" : ""} ${light ? "text-white/45" : "text-[#122443]/45"}`}><i className={`h-px w-8 ${light ? "bg-[#efaa32]" : "bg-[#efaa32]"}`} />{pick(eyebrow)}</span><h2 className={`${font} mt-4 max-w-[940px] text-[34px] font-black leading-[1.25] sm:text-[48px] lg:text-[60px] ${locale === "en" ? "tracking-[-.025em]" : ""} ${light ? "text-white" : "text-[#122443]"}`}>{pick(title)}</h2></motion.div>;
}

function DownIcon() {
  return <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden><path d="M12 5v14m-6-6 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
