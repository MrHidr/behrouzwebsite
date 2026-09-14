"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ManagedImage as Image,
  ManagedPageProvider,
  ManagedSection,
  useManagedPageContent,
} from "@/components/cms/ManagedPageContent";
import { ArrowForward, ArrowUpForward } from "@/components/ui/icons";
import { ProtectedContactValue } from "@/components/contact/ProtectedContactValue";
import type { ManagedPage } from "@/lib/cms-content";
import {
  CONTACT_LOCATIONS,
  getEmbeddedMapUrl,
  getNavigationLinks,
  type ContactLocation,
} from "@/lib/contact-locations";
import { CONTACT_INFO, DEPARTMENT_EMAILS } from "@/lib/i18n";
import { localizeDigits, toLatinDigits } from "@/lib/locale-digits";

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const phoneHref = (value: string) =>
  toLatinDigits(value).split(/\s*(?:الی|to)\s*/i)[0].replace(/[^0-9+]/g, "");

const PRIMARY_CONTACT_ROUTES = [
  { n: "01", title: { fa: "صدای مشتری", en: "Customer voice" }, desc: { fa: "پیگیری محصول، شکایت یا پیشنهاد", en: "Product support, complaints and feedback" }, email: "Voc@Behrouznik.com", color: "#f3383a" },
  { n: "02", title: { fa: "فروش شهرستان‌ها", en: "Regional sales" }, desc: { fa: "خرید عمده و شبکه فروش", en: "Wholesale and regional sales" }, email: "Planning@Behrouznik.com", color: "#e8a438" },
  { n: "03", title: { fa: "تحقیق و توسعه", en: "Research & development" }, desc: { fa: "پیشنهاد پژوهشی و همکاری علمی", en: "Research and scientific collaboration" }, email: "RD@Behrouznik.com", color: "#6ba678" },
  { n: "04", title: { fa: "ارتباط عمومی", en: "General enquiries" }, desc: { fa: "رسانه و امور سازمانی", en: "Media and corporate matters" }, email: "Info@Behrouznik.com", color: "#5e8db8" },
];

export function ContactView({ page }: { page?: ManagedPage }) {
  return (
    <ManagedPageProvider page={page}>
      <ContactViewBody />
    </ManagedPageProvider>
  );
}

function ContactViewBody() {
  const { locale, page, pick, value, list, isSectionVisible } = useManagedPageContent();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const digits = (value: string | number) => localizeDigits(value, locale);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<ContactLocation["id"]>("head-office");
  const [directionsOpen, setDirectionsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const locations = useMemo(
    () => list(
      "locations.locations",
      CONTACT_LOCATIONS.map((location) => ({
        ...location,
        postal: value(location.postal),
        phones: location.phones.map(value),
        fax: location.fax ? value(location.fax) : undefined,
      })),
      (item, index): ContactLocation => ({
        id: item.id,
        index: String(index + 1).padStart(2, "0"),
        title: item.title,
        kind: item.subtitle || item.title,
        city: item.eyebrow || item.title,
        address: item.text || item.title,
        postal: item.value || "",
        phones: item.details,
        fax: item.secondaryValue,
        coordinates: item.latitude !== undefined && item.longitude !== undefined
          ? [item.latitude, item.longitude]
          : undefined,
      }),
    ),
    [list, value],
  );

  const contactRoutes = list(
    "channels.primary",
    PRIMARY_CONTACT_ROUTES.map((route) => ({ ...route, email: value(route.email) })),
    (item, index) => ({
      n: String(index + 1).padStart(2, "0"),
      title: item.title,
      desc: item.text || item.title,
      email: item.value || "",
      color: item.color || "#f3383a",
    }),
  );
  const departments = list(
    "channels.departments",
    DEPARTMENT_EMAILS.map((department) => ({ ...department, email: value(department.email) })),
    (item) => ({ fa: item.title.fa, en: item.title.en, email: item.value || "" }),
  );

  const filteredLocations = useMemo(() => {
    const normalized = toLatinDigits(query).trim().toLocaleLowerCase(en ? "en" : "fa");
    if (!normalized) return locations;
    return locations.filter((location) =>
      [location.title[locale], location.kind[locale], location.city[locale], location.address[locale], location.postal]
        .map((value) => toLatinDigits(value).toLocaleLowerCase(en ? "en" : "fa"))
        .some((value) => value.includes(normalized)),
    );
  }, [en, locale, locations, query]);

  useEffect(() => {
    if (filteredLocations.length > 0 && !filteredLocations.some((location) => location.id === selectedId)) {
      setSelectedId(filteredLocations[0].id);
    }
  }, [filteredLocations, selectedId]);

  useEffect(() => {
    if (!directionsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setDirectionsOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [directionsOpen]);

  const selected = locations.find((location) => location.id === selectedId) ?? locations[0];
  const mapSrc = getEmbeddedMapUrl(selected, locale);
  const navigationLinks = getNavigationLinks(selected, locale);

  const showOnMap = (id: ContactLocation["id"]) => {
    setSelectedId(id);
    window.setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };

  return (
    <div dir={en ? "ltr" : "rtl"} className="overflow-hidden bg-[#f7f4ed] text-[#181512]">
      <ManagedSection sectionKey="hero"><section className="relative min-h-[100svh] overflow-hidden bg-[#181512] text-white">
        <Image src={page?.image || "/media/site/BehrouzAbout.webp"} alt={page ? pick(page.imageAlt) : pick({ fa: "مجموعه صنایع غذایی بهروز", en: "Behrouz Food Industries complex" })} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,.92)_0%,rgba(10,9,8,.66)_52%,rgba(10,9,8,.25)_100%)] rtl:bg-[linear-gradient(270deg,rgba(10,9,8,.92)_0%,rgba(10,9,8,.66)_52%,rgba(10,9,8,.25)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35" />
        <div className="absolute inset-0 opacity-[.12] [background-image:radial-gradient(circle,#fff_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] items-center px-6 pb-44 pt-32 sm:px-10 lg:px-16">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } } }} className="max-w-[900px]">
            <motion.span variants={reveal} className={`${font} text-[15px] font-extrabold text-white/55`}>{page ? pick(page.eyebrow) : pick({ fa: "ارتباط با بهروز", en: "Contact Behrouz" })}</motion.span>
            <motion.h1 variants={reveal} className={`${font} mt-5 text-[52px] font-black leading-[1.05] tracking-[-.04em] sm:text-[76px] lg:text-[104px]`}>
              {(page ? pick(page.title) : pick({ fa: "موضوع شما،\nمسیر ارتباط روشن.", en: "Your enquiry.\nThe right route." })).split("\n").map((line) => <span key={line} className="block">{line}</span>)}
            </motion.h1>
            <motion.p variants={reveal} className={`${font} mt-7 max-w-[680px] text-[16px] font-medium leading-8 text-white/65 sm:text-[18px] sm:leading-9 lg:text-[20px] lg:leading-10`}>
              {page ? pick(page.lead) : pick({ fa: "برای پیگیری محصول، خرید عمده، همکاری تجاری یا امور پژوهشی، مسیر مرتبط را انتخاب کنید.", en: "Choose the relevant route for product support, wholesale, business partnerships or research." })}
            </motion.p>
          </motion.div>
        </div>
        <nav aria-label={pick({ fa: "بخش‌های صفحه تماس", en: "Contact page sections" })} className="absolute inset-x-4 bottom-4 z-20 rounded-[26px] border border-white/15 bg-black/35 p-2 backdrop-blur-xl sm:inset-x-8 lg:inset-x-auto lg:start-1/2 lg:w-[min(100%-4rem,980px)] lg:-translate-x-1/2 rtl:lg:translate-x-1/2">
          <div className="grid grid-cols-3 gap-1">
            {[{ href: "#locations", fa: "مراکز", en: "Locations" }, { href: "#channels", fa: "واحدها", en: "Departments" }, { href: "#feedback", fa: "صدای مشتری", en: "Customer voice" }].filter((item) => isSectionVisible(item.href.slice(1))).map((item, index) => (
              <a key={item.href} href={item.href} className={`${font} flex min-h-12 items-center justify-between gap-2 rounded-[18px] px-3 text-[13px] font-bold text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:px-5 sm:text-[14px]`}>
                <span><i className={`${font} me-2 not-italic text-white/35`}>{digits(`0${index + 1}`)}</i>{pick({ fa: item.fa, en: item.en })}</span>
                <ArrowForward rtl={!en} className="hidden size-4 sm:block" />
              </a>
            ))}
          </div>
        </nav>
      </section></ManagedSection>

      <ManagedSection sectionKey="locations"><section id="locations" className="scroll-mt-24 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading
            font={font}
            eyebrow={pick({ fa: "آدرس و مسیریابی", en: "Addresses & directions" })}
            title={pick({ fa: "مراکز بهروز", en: "Behrouz locations" })}
            copy={pick({ fa: "نام مرکز، شهر یا آدرس را جست‌وجو کنید.", en: "Search by location, city or address." })}
          />

          <div className="mt-12 grid items-start gap-5 lg:grid-cols-[.82fr_1.18fr] lg:gap-7">
            <div>
              <label className="relative block">
                <span className="sr-only">{pick({ fa: "جست‌وجوی مرکز یا آدرس", en: "Search location or address" })}</span>
                <SearchIcon className="absolute start-5 top-1/2 size-5 -translate-y-1/2 text-black/35" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={pick({ fa: "جست‌وجوی شهر، مرکز یا آدرس…", en: "Search city, location or address…" })} className={`${font} min-h-14 w-full rounded-full border border-black/10 bg-white px-14 text-[15px] font-medium outline-none transition focus:border-[#f3383a]/60 focus:ring-4 focus:ring-[#f3383a]/10`} />
                <span className={`${font} absolute end-5 top-1/2 -translate-y-1/2 text-[12px] font-bold text-black/35`}>{digits(filteredLocations.length)}</span>
              </label>

              <div className="mt-4 grid gap-3">
                {filteredLocations.map((location) => {
                  const active = selected.id === location.id;
                  return (
                    <article key={location.id} className={`rounded-[26px] border p-5 transition-all sm:p-6 ${active ? "border-[#181512] bg-[#181512] text-white shadow-[0_18px_60px_rgba(24,21,18,.18)]" : "border-black/10 bg-white hover:border-black/25"}`}>
                      <button type="button" onClick={() => setSelectedId(location.id)} aria-pressed={active} className="w-full text-start">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className={`${font} text-[13px] font-extrabold ${active ? "text-[#e8a438]" : "text-black/40"}`}>{digits(location.index)} · {pick(location.city)}</span>
                            <h3 className={`${font} mt-2 text-[22px] font-black sm:text-[24px]`}>{pick(location.title)}</h3>
                            <p className={`${font} mt-1 text-[14px] font-bold opacity-55`}>{pick(location.kind)}</p>
                          </div>
                          <span className={`grid size-11 shrink-0 place-items-center rounded-full ${active ? "bg-[#f3383a] text-white" : "bg-[#f7f4ed] text-[#181512]"}`}><PinIcon /></span>
                        </div>
                        <p className={`${font} mt-5 text-[14px] font-medium leading-8 opacity-65 sm:text-[15px] lg:text-[17px] lg:leading-9`}>{pick(location.address)}</p>
                      </button>
                      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-current/10 pt-4">
                        <button type="button" onClick={() => showOnMap(location.id)} className={`${font} inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13px] font-black ${active ? "bg-white text-[#181512]" : "bg-[#181512] text-white"}`}>
                          {pick({ fa: "نمایش روی نقشه", en: "Show on map" })}<ArrowForward rtl={!en} className="size-3.5" />
                        </button>
                        <button type="button" onClick={() => window.location.assign(`tel:${phoneHref(location.phones[0])}`)} className={`${font} inline-flex min-h-10 items-center gap-2 rounded-full border border-current/15 px-4 text-[13px] font-bold`}><PhoneIcon />{pick({ fa: "تماس", en: "Call" })}</button>
                      </div>
                    </article>
                  );
                })}
                {filteredLocations.length === 0 && <div className={`${font} rounded-[24px] border border-dashed border-black/15 bg-white p-8 text-center text-[15px] font-bold text-black/45`}>{pick({ fa: "نتیجه‌ای برای این جست‌وجو پیدا نشد.", en: "No location matches this search." })}</div>}
              </div>
            </div>

            <div ref={mapRef} className="overflow-hidden rounded-[30px] bg-[#181512] lg:sticky lg:top-24">
              <div className="relative min-h-[360px] bg-[#ded8cc] sm:min-h-[540px]">
                <iframe key={selected.id} src={mapSrc} title={`${pick(selected.title)} — ${pick({ fa: "نقشه", en: "map" })}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 size-full border-0 grayscale-[.25] contrast-[1.05]" />
              </div>
              <div className="grid gap-5 p-5 text-white sm:grid-cols-[1fr_auto] sm:items-end sm:p-7">
                <div>
                  <span className={`${font} text-[13px] font-bold text-white/45`}>{pick(selected.city)}</span>
                  <h3 className={`${font} mt-2 text-[24px] font-black`}>{pick(selected.title)}</h3>
                  <p className={`${font} mt-3 max-w-[620px] text-[14px] leading-7 text-white/60 lg:text-[16px] lg:leading-8`}>{pick(selected.address)}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    <span className={`${font} text-[13px] text-white/55`}>{pick({ fa: "کد پستی", en: "Postal" })}: <b className={font} dir="ltr">{digits(selected.postal)}</b></span>
                    {selected.phones.map((phone) => <ProtectedContactValue key={phone} value={phoneHref(phone)} displayValue={digits(phone)} kind="phone" label={pick({ fa: "تماس با این مرکز", en: "Call this location" })} color="#ffffff" fontSize={13} className={`${font} max-w-full overflow-hidden text-start font-bold text-white`} />)}
                    {selected.fax && <span className={`${font} flex items-center gap-1 text-[13px] text-white/55`}>{pick({ fa: "دورنگار", en: "Fax" })}: <ProtectedContactValue value={toLatinDigits(selected.fax)} displayValue={digits(selected.fax)} kind="copy" label={pick({ fa: "کپی شماره دورنگار", en: "Copy fax number" })} color="rgba(255,255,255,.7)" fontSize={13} className="max-w-full overflow-hidden" /></span>}
                  </div>
                </div>
                <button type="button" onClick={() => { setCopied(false); setDirectionsOpen(true); }} className={`${font} inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#f3383a] px-5 text-[14px] font-black text-white`}>
                  {pick({ fa: "مسیریابی", en: "Directions" })}<ArrowUpForward rtl={!en} className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section></ManagedSection>

      <ManagedSection sectionKey="channels"><section id="channels" className="scroll-mt-24 bg-[#181512] px-6 py-20 text-white lg:px-10 lg:py-28">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeading dark font={font} eyebrow={pick({ fa: "واحدهای پاسخ‌گو", en: "Contact departments" })} title={pick({ fa: "برای هر موضوع، یک مسیر مستقیم.", en: "A direct route for every enquiry." })} />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contactRoutes.map((route) => (
              <article key={route.n} className="group flex min-h-[245px] flex-col justify-between rounded-[28px] border border-white/10 p-6 transition hover:-translate-y-1 hover:border-white/25">
                <div className="flex items-center justify-between"><span className={`${font} text-[13px] font-black text-white/35`}>{digits(route.n)}</span><span className="size-3 rounded-full" style={{ backgroundColor: route.color }} /></div>
                <div><h3 className={`${font} text-[22px] font-black`}>{pick(route.title)}</h3><p className={`${font} mt-3 text-[14px] leading-7 text-white/55 lg:text-[16px] lg:leading-8`}>{pick(route.desc)}</p><ProtectedContactValue value={route.email} kind="email" label={pick({ fa: `ارسال ایمیل به ${route.title.fa}`, en: `Email ${route.title.en}` })} color="rgba(255,255,255,.45)" fontSize={14} className="mt-5 max-w-full overflow-hidden text-start" /></div>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((department) => (
              <article key={`${department.en}-${department.email}`} className="flex min-h-[92px] items-center gap-4 rounded-[22px] bg-white/[.055] p-4 transition-colors hover:bg-white/[.1]">
                <span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-white/10 text-[#e8a438]"><MailIcon /></span>
                <span className="min-w-0"><strong className={`${font} block text-[14px] font-black`}>{pick({ fa: department.fa, en: department.en })}</strong><ProtectedContactValue value={department.email} kind="email" label={pick({ fa: `ارسال ایمیل به ${department.fa}`, en: `Email ${department.en}` })} color="rgba(255,255,255,.4)" fontSize={11} className="mt-1 max-w-full overflow-hidden text-start" /></span>
              </article>
            ))}
          </div>
        </div>
      </section></ManagedSection>

      <ManagedSection sectionKey="feedback"><section id="feedback" className="scroll-mt-24 bg-[#e8a438] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_.82fr] lg:items-end">
          <div>
            <span className={`${font} text-[15px] font-extrabold text-[#181512]/55`}>{pick({ fa: "صدای مشتری", en: "Customer voice" })}</span>
            <h2 className={`${font} mt-4 max-w-[760px] text-[40px] font-black leading-[1.2] sm:text-[56px] lg:text-[68px]`}>{pick({ fa: "صدای شما، مستقیم به تیم پاسخ‌گو.", en: "Your message, directly to the response team." })}</h2>
            <p className={`${font} mt-6 max-w-[700px] text-[16px] font-medium leading-8 text-[#181512]/65 lg:text-[18px] lg:leading-9`}>{pick({ fa: "برای پیگیری محصول، ثبت انتقاد یا ارسال پیشنهاد، تماس بگیرید یا پیام و مستندات خود را ایمیل کنید.", en: "Call or email your message and documents for product support, complaints or suggestions." })}</p>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-[24px] bg-[#181512] p-5 text-white sm:p-6"><span><small className={`${font} block text-[13px] font-bold text-white/45`}>{pick({ fa: "تماس با صدای مشتری", en: "Call customer voice" })}</small><ProtectedContactValue value={toLatinDigits(value(CONTACT_INFO.customerVoice))} displayValue={digits(value(CONTACT_INFO.customerVoice))} kind="phone" label={pick({ fa: "تماس با صدای مشتری", en: "Call customer voice" })} color="#ffffff" fontSize={28} className="mt-2 max-w-full overflow-hidden text-start" /></span><span className="grid size-12 place-items-center rounded-full bg-[#f3383a]"><PhoneIcon /></span></div>
            <div className="flex items-center justify-between rounded-[24px] border border-[#181512]/15 bg-white/35 p-5 sm:p-6"><span><small className={`${font} block text-[13px] font-bold text-[#181512]/50`}>{pick({ fa: "ارسال پیام یا مستندات", en: "Send a message or documents" })}</small><ProtectedContactValue value={value("Voc@Behrouznik.com")} kind="email" label={pick({ fa: "ارسال ایمیل به صدای مشتری", en: "Email customer voice" })} color="#181512" fontSize={16} className="mt-2 max-w-full overflow-hidden text-start" /></span><span className="grid size-12 place-items-center rounded-full bg-white/60"><MailIcon /></span></div>
            <button type="button" onClick={() => window.location.assign(`tel:${phoneHref(value(CONTACT_INFO.headOffice.phones[0]))}`)} className="flex items-center justify-between rounded-[24px] border border-[#181512]/15 bg-white/35 p-5 text-start sm:p-6"><span><small className={`${font} block text-[13px] font-bold text-[#181512]/50`}>{pick({ fa: "فروش تلفنی و سفارش · داخلی ۲۷۶", en: "Phone sales & orders · ext. 276" })}</small><strong className={`${font} mt-2 block text-[16px] font-black`}>{pick({ fa: "تماس با دفتر مرکزی", en: "Call the head office" })}</strong></span><span className="grid size-12 place-items-center rounded-full bg-white/60"><ArrowForward rtl={!en} className="size-5" /></span></button>
          </div>
        </div>
      </section></ManagedSection>

      <AnimatePresence>
        {directionsOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label={pick({ fa: "بستن پنجره مسیریابی", en: "Close directions dialog" })} onClick={() => setDirectionsOpen(false)} className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
            <motion.div role="dialog" aria-modal="true" aria-labelledby="directions-title" initial={{ y: 36, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 28, opacity: 0, scale: 0.98 }} transition={{ duration: 0.25, ease }} className="relative w-full max-w-[560px] rounded-t-[32px] bg-[#f7f4ed] p-5 shadow-2xl sm:rounded-[32px] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`${font} text-[13px] font-extrabold text-black/40`}>{pick({ fa: "نقشه موردنظر را انتخاب کنید", en: "Choose your preferred map" })}</span>
                  <h2 id="directions-title" className={`${font} mt-2 text-[26px] font-black sm:text-[30px]`}>{pick(selected.title)}</h2>
                </div>
                <button type="button" onClick={() => setDirectionsOpen(false)} className="grid size-11 shrink-0 place-items-center rounded-full border border-black/10 bg-white" aria-label={pick({ fa: "بستن", en: "Close" })}><CloseIcon /></button>
              </div>
              <p className={`${font} mt-4 text-[14px] font-medium leading-7 text-black/55`}>{pick(selected.address)}</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {navigationLinks.map((item) => (
                  <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className="group flex min-h-[72px] items-center gap-3 rounded-[20px] border border-black/10 bg-white px-4 transition hover:-translate-y-0.5 hover:border-black/25">
                    <span className={`${font} grid size-10 shrink-0 place-items-center rounded-[14px] text-[16px] font-black text-white`} style={{ backgroundColor: item.color }}>{item.shortLabel}</span>
                    <span className={`${item.id === "google" ? "font-montserrat" : font} text-start text-[13px] font-black`}>{item.label}</span>
                  </a>
                ))}
              </div>
              <button type="button" onClick={async () => {
                const value = selected.coordinates?.join(", ") ?? pick(selected.address);
                await navigator.clipboard?.writeText(value);
                setCopied(true);
              }} className={`${font} mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-black/10 text-[13px] font-black text-black/60`}>
                <CopyIcon />{copied ? pick({ fa: "کپی شد", en: "Copied" }) : pick({ fa: "کپی موقعیت", en: "Copy location" })}
              </button>
              <p className={`${font} mt-4 text-center text-[12px] font-medium leading-6 text-black/40`}>{pick({ fa: "پس از بازشدن نقشه، مسیر را از موقعیت فعلی خود شروع کنید.", en: "After the map opens, start the route from your current location." })}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeading({ font, eyebrow, title, copy, dark = false }: { font: string; eyebrow: string; title: string; copy?: string; dark?: boolean }) {
  return <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}><span className={`${font} inline-flex items-center gap-3 text-[15px] font-extrabold ${dark ? "text-white/50" : "text-black/45"}`}><i className={`h-px w-8 ${dark ? "bg-white/30" : "bg-black/25"}`} />{eyebrow}</span><h2 className={`${font} mt-4 max-w-[900px] text-[36px] font-black leading-[1.25] sm:text-[48px] lg:text-[60px] ${dark ? "text-white" : "text-[#181512]"}`}>{title}</h2>{copy && <p className={`${font} mt-5 max-w-[760px] text-[15px] font-medium leading-8 lg:text-[18px] lg:leading-9 ${dark ? "text-white/55" : "text-black/55"}`}>{copy}</p>}</motion.div>;
}

function BaseIcon({ children, className }: { children: React.ReactNode; className?: string }) { return <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className ?? "size-5"}>{children}</svg>; }
function PinIcon() { return <BaseIcon><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7"/></BaseIcon>; }
function PhoneIcon() { return <BaseIcon><path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5V17a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></BaseIcon>; }
function MailIcon() { return <BaseIcon><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></BaseIcon>; }
function SearchIcon({ className }: { className?: string }) { return <BaseIcon className={className}><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></BaseIcon>; }
function CloseIcon() { return <BaseIcon><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></BaseIcon>; }
function CopyIcon() { return <BaseIcon><rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6"/></BaseIcon>; }
