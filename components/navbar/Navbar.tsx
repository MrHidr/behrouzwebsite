"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/site";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LangSwitch, type LangSwitchVariant } from "@/components/i18n/LangSwitch";
import { ArrowDown, ArrowForward, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { CategoryCircle } from "./CategoryCircle";
import { ProductsDropdown } from "./ProductsDropdown";
import { localizeDigits } from "@/lib/locale-digits";
import { useCMSContent } from "@/components/cms/CMSContentProvider";

// Change this to "inline" to show all four languages directly in the desktop navbar.
const DESKTOP_LANGUAGE_MODE: LangSwitchVariant = "menu";

export function Navbar() {
  const pathname = usePathname();
  const { locale, t } = useLocale();
  const { brand } = useCMSContent();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  const [companyOpen, setCompanyOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const companyHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productsHoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAll = useCallback(() => {
    setCompanyOpen(false);
    setProductsOpen(false);
    setMobileOpen(false);
  }, []);

  // Close on route change.
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeAll]);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Hover-intent for desktop (fine pointers only).
  const openCompanyOnHover = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      if (companyHoverTimer.current) clearTimeout(companyHoverTimer.current);
      if (productsHoverTimer.current) clearTimeout(productsHoverTimer.current);
      setProductsOpen(false);
      setCompanyOpen(true);
    }
  };
  const closeCompanyOnHover = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      companyHoverTimer.current = setTimeout(() => setCompanyOpen(false), 140);
    }
  };
  const openProductsOnHover = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      if (productsHoverTimer.current) clearTimeout(productsHoverTimer.current);
      if (companyHoverTimer.current) clearTimeout(companyHoverTimer.current);
      setCompanyOpen(false);
      setProductsOpen(true);
    }
  };
  const closeProductsOnHover = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      productsHoverTimer.current = setTimeout(() => setProductsOpen(false), 140);
    }
  };
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 py-2 sm:px-4 sm:py-3"
      // viewport-fit=cover: keep the pill clear of the notch in landscape
      style={{
        paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
        paddingRight: "max(0.75rem, env(safe-area-inset-right))",
      }}
    >
      {/* Dark blur backdrop behind the company dropdown */}
      <AnimatePresence>
        {(companyOpen || productsOpen) && (
          <motion.div
            key="backdrop"
            className="pointer-events-auto fixed inset-0 -z-10 bg-black/50 backdrop-blur-[16px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={closeAll}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div
        ref={navRef}
        className="pointer-events-auto relative z-50 flex w-full flex-col items-center gap-2 min-[960px]:w-auto"
        onMouseLeave={() => {
          closeCompanyOnHover();
          closeProductsOnHover();
        }}
      >
        {/* ---------- The pill ---------- */}
        <nav className="flex w-full items-center justify-between gap-2 rounded-[32px] bg-white px-2 py-1.5 shadow-pill sm:gap-2.5 min-[960px]:w-auto min-[960px]:justify-start">
          {/* Brand (rightmost in RTL) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-[32px] p-1 transition-transform duration-300 ease-smooth hover:scale-[1.02]"
            aria-label={`${brand.tagline[locale]} ${brand.name[locale]}`}
          >
            <Image src={brand.logo} alt="" width={48} height={48} priority className="size-11 sm:size-12" />
            <span className={`flex flex-col justify-center px-1 leading-none ${locale === "en" ? "items-start text-left" : "items-start text-right"}`}>
              <span className={`${font} text-[12px] font-medium leading-4 text-black/50`}>
                {brand.tagline[locale]}
              </span>
              <span className={`${font} text-[20px] font-extrabold leading-6 text-black`}>
                {brand.name[locale]}
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 min-[960px]:flex lg:gap-1">
            <li>
              <Link href="/" className={`block rounded-[32px] px-3 py-3 lg:px-4 ${font} text-[14px] transition-colors ${pathname === "/" ? "font-extrabold text-behrouz-accent" : "font-medium text-behrouz-ink hover:bg-black/[0.04]"}`}>
                {t(STR.nav.home)}
              </Link>
            </li>
            <li onMouseEnter={openCompanyOnHover}>
              <button
                type="button"
                onClick={() => setCompanyOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={companyOpen}
                className={`flex items-center gap-1 rounded-[32px] px-3 py-3 text-[14px] transition-colors lg:px-4 ${companyOpen || isActive("/about") || isActive("/innovation") || isActive("/production") ? "bg-behrouz-accent/10 font-extrabold text-behrouz-accent" : "font-medium text-behrouz-ink hover:bg-black/[0.04]"}`}
              >
                <span className={font}>{t(STR.nav.about)}</span>
                <ArrowDown className={`transition-transform duration-300 ${companyOpen ? "rotate-180" : ""}`} />
              </button>
            </li>
            <li>
              <Link href="/distribution" className={`block rounded-[32px] px-3 py-3 lg:px-4 ${font} text-[14px] transition-colors ${isActive("/distribution") ? "font-extrabold text-behrouz-accent" : "font-medium text-behrouz-ink hover:bg-black/[0.04]"}`}>
                {t(STR.nav.distribution)}
              </Link>
            </li>
            <li onMouseEnter={openProductsOnHover}>
              <Link
                href="/products/sauces"
                aria-haspopup="menu"
                aria-expanded={productsOpen}
                className={`flex items-center gap-1 rounded-[32px] px-3 py-3 text-[14px] transition-colors lg:px-4 ${productsOpen || isActive("/products") ? "bg-behrouz-accent/10 font-extrabold text-behrouz-accent" : "font-medium text-behrouz-ink hover:bg-black/[0.04]"}`}
              >
                <span className={font}>{t(STR.nav.products)}</span>
                <ArrowDown className={`transition-transform duration-300 ${productsOpen ? "rotate-180" : ""}`} />
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`block rounded-[32px] px-3 py-3 lg:px-4 ${font} text-[14px] transition-colors ${isActive("/contact") ? "font-extrabold text-behrouz-accent" : "font-medium text-behrouz-ink hover:bg-black/[0.04]"}`}>
                {t(STR.nav.contact)}
              </Link>
            </li>
            <li>
              <Link href="/careers" className={`block rounded-[32px] px-3 py-3 lg:px-4 ${font} text-[14px] transition-colors ${isActive("/careers") ? "font-extrabold text-behrouz-accent" : "font-medium text-behrouz-ink hover:bg-black/[0.04]"}`}>
                {t(STR.nav.careers)}
              </Link>
            </li>
          </ul>

          <LangSwitch variant={DESKTOP_LANGUAGE_MODE} className="mx-2 hidden min-[960px]:flex" />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-[32px] bg-black/[0.06] text-behrouz-ink transition-colors hover:bg-black/[0.1] min-[960px]:hidden"
            aria-label={mobileOpen ? (locale === "en" ? "Close menu" : "بستن منو") : (locale === "en" ? "Open menu" : "باز کردن منو")}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>

        {/* ---------- Desktop dropdown ---------- */}
        <div className="absolute left-1/2 top-full hidden w-max -translate-x-1/2 pt-1 min-[960px]:block">
          <AnimatePresence mode="wait">
            {companyOpen && (
              <div key="company" onMouseEnter={openCompanyOnHover} onMouseLeave={closeCompanyOnHover}>
                <CompanyDropdown pathname={pathname} onNavigate={() => setCompanyOpen(false)} />
              </div>
            )}
            {productsOpen && (
              <div key="products" onMouseEnter={openProductsOnHover} onMouseLeave={closeProductsOnHover}>
                <ProductsDropdown onNavigate={() => setProductsOpen(false)} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- Mobile menu ---------- */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu key="mobile" onClose={() => setMobileOpen(false)} isActive={isActive} />
        )}
      </AnimatePresence>
    </header>
  );
}

function CompanyDropdown({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const { locale, t } = useLocale();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  const items = [
    { href: "/about", index: "01", title: STR.nav.about, desc: { fa: "تاریخچه، ارزش‌ها و افتخارات", en: "History, values and achievements" } },
    { href: "/innovation", index: "02", title: STR.nav.innovation, desc: { fa: "تحقیق و توسعه، آزمایشگاه و کیفیت", en: "R&D, laboratories and quality" } },
    { href: "/production", index: "03", title: STR.nav.operations, desc: { fa: "کارخانه، فرایند و رهایش محصول", en: "Factory, process and product release" } },
  ];
  return (
    <motion.div
      role="menu"
      initial={{ opacity: 0, y: -8, scale: .985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: .985 }}
      transition={{ duration: .25, ease: [0.22, 1, 0.36, 1] }}
      className="w-[720px] rounded-[28px] bg-white p-3 shadow-pill"
    >
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} role="menuitem" className={`group flex min-h-[150px] flex-col justify-between rounded-[22px] p-5 transition-colors ${active ? "bg-behrouz-accent text-white" : "bg-black/[.025] text-behrouz-ink hover:bg-black/[.055]"}`}>
              <span className={`${font} text-[10px] font-black opacity-35`}>{localizeDigits(item.index, locale)}</span>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <strong className={`${font} text-[14px] font-extrabold`}>{t(item.title)}</strong>
                  <ArrowForward rtl={locale === "fa"} className="size-4 transition-transform group-hover:-translate-y-0.5" />
                </div>
                <p className={`${font} mt-2 text-[10px] font-medium leading-5 opacity-50`}>{t(item.desc)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function MobileMenu({
  onClose,
  isActive,
}: {
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const { locale, t } = useLocale();
  const { productCategories } = useCMSContent();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  return (
    <>
      <motion.div
        className="pointer-events-auto fixed inset-0 z-40 bg-black/50 backdrop-blur-[16px] min-[960px]:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        className="pointer-events-auto fixed inset-x-0 top-24 z-40 mx-auto max-h-[calc(100dvh-7rem)] w-[calc(100%-2rem)] max-w-[480px] overflow-y-auto rounded-[32px] bg-white p-6 shadow-pill min-[960px]:hidden"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map((it) => (
            <li key={it.href}>
              <Link
                href={it.href}
                onClick={onClose}
                className={`block rounded-2xl px-4 py-3 ${font} text-[16px] transition-colors ${
                  isActive(it.href)
                    ? "bg-behrouz-accent/10 font-extrabold text-behrouz-accent"
                    : "font-medium text-behrouz-ink hover:bg-black/[0.04]"
                }`}
              >
                {t(STR.nav[it.key])}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-[22px] bg-black/[.035] p-3">
          <p className={`${font} px-2 pb-2 text-[11px] font-extrabold text-behrouz-ink/45`}>
            {locale === "en" ? "Inside About Behrouz" : "بخش‌های درباره بهروز"}
          </p>
          <div className="grid grid-cols-3 gap-1">
            {[
              { href: "/about", fa: "داستان بهروز", en: "Our story" },
              { href: "/innovation", fa: "نوآوری و کیفیت", en: "Innovation" },
              { href: "/production", fa: "تولید", en: "Production" },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose} className={`${font} rounded-[15px] px-2 py-3 text-center text-[11px] font-extrabold leading-5 transition-colors ${isActive(item.href) ? "bg-white text-behrouz-accent shadow-sm" : "text-behrouz-ink/60 hover:bg-white"}`}>
                {locale === "en" ? item.en : item.fa}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-black/5 pt-4">
          <p className={`mb-3 ${font} text-[13px] font-extrabold text-behrouz-ink`}>
            {t(STR.nav.productsMenuTitle)}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {productCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                onClick={onClose}
                className="group flex flex-col items-center gap-2"
                style={{ ["--cat" as string]: cat.color }}
              >
                <span className="w-16">
                  <CategoryCircle slug={cat.slug} color={cat.color} buttonImage={cat.buttonImage} />
                </span>
                <span className={`${font} text-[13px] font-extrabold text-behrouz-ink transition-colors duration-300 group-hover:[color:var(--cat)]`}>
                  {locale === "en" ? cat.labelEn : cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* language switch (mobile) */}
        <div className="mt-5 flex w-full justify-center border-t border-black/5 pt-4">
          <LangSwitch variant="inline" large onSelect={onClose} />
        </div>
      </motion.div>
    </>
  );
}
