"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BRAND, NAV_ITEMS, PRODUCT_CATEGORIES } from "@/lib/site";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LangSwitch } from "@/components/i18n/LangSwitch";
import { ArrowDown, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { ProductsDropdown } from "./ProductsDropdown";
import { CategoryCircle } from "./CategoryCircle";

export function Navbar() {
  const pathname = usePathname();
  const { locale, t } = useLocale();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAll = useCallback(() => {
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
  const openOnHover = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      setProductsOpen(true);
    }
  };
  const closeOnHover = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      hoverTimer.current = setTimeout(() => setProductsOpen(false), 140);
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
      {/* Dark blur backdrop behind the products dropdown */}
      <AnimatePresence>
        {productsOpen && (
          <motion.div
            key="backdrop"
            className="pointer-events-auto fixed inset-0 -z-10 bg-black/50 backdrop-blur-[16px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setProductsOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <div
        ref={navRef}
        className="pointer-events-auto relative z-50 flex w-full flex-col items-center gap-2 min-[700px]:w-auto"
        onMouseLeave={closeOnHover}
      >
        {/* ---------- The pill ---------- */}
        <nav className="flex w-full items-center justify-between gap-2 rounded-[32px] bg-white px-2 py-1.5 shadow-pill sm:gap-2.5 min-[700px]:w-auto min-[700px]:justify-start">
          {/* Brand (rightmost in RTL) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-[32px] p-1 transition-transform duration-300 ease-smooth hover:scale-[1.02]"
            aria-label={`${BRAND.tagline} ${BRAND.name}`}
          >
            <Image src={BRAND.logo} alt="" width={48} height={48} priority className="size-11 sm:size-12" />
            <span className={`flex flex-col justify-center px-1 leading-none ${locale === "en" ? "items-start text-left" : "items-start text-right"}`}>
              <span className={`${font} text-[12px] font-medium leading-4 text-black/50`}>
                {t(STR.nav.tagline)}
              </span>
              <span className={`${font} text-[20px] font-extrabold leading-6 text-black`}>
                {t(STR.nav.brand)}
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 min-[700px]:flex lg:gap-1">
            {NAV_ITEMS.map((it) =>
              it.dropdown ? (
                <li key={it.href} onMouseEnter={openOnHover}>
                  <button
                    type="button"
                    onClick={() => setProductsOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={productsOpen}
                    className={`flex items-center gap-1 rounded-[32px] px-3 py-3 text-[14px] lg:px-4 transition-colors duration-300 ease-smooth ${
                      productsOpen
                        ? "bg-behrouz-accent/10 font-extrabold text-behrouz-accent"
                        : "font-medium text-behrouz-ink hover:bg-black/[0.04]"
                    }`}
                  >
                    <span className={font}>{t(STR.nav[it.key])}</span>
                    <ArrowDown
                      className={`transition-transform duration-300 ease-smooth ${productsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </li>
              ) : (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={`block rounded-[32px] px-3 py-3 lg:px-4 ${font} text-[14px] transition-colors duration-300 ease-smooth ${
                      isActive(it.href)
                        ? "font-extrabold text-behrouz-accent"
                        : "font-medium text-behrouz-ink hover:bg-black/[0.04]"
                    }`}
                  >
                    {t(STR.nav[it.key])}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Lang switch — FA / EN segmented, sets locale (and RTL ↔ LTR) */}
          <LangSwitch className="hidden min-[700px]:flex" />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-[32px] bg-black/[0.06] text-behrouz-ink transition-colors hover:bg-black/[0.1] min-[700px]:hidden"
            aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
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
        <div className="absolute left-1/2 top-full hidden w-max -translate-x-1/2 pt-1 min-[700px]:block">
          <AnimatePresence>
            {productsOpen && (
              <div onMouseEnter={openOnHover} onMouseLeave={closeOnHover}>
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

function MobileMenu({
  onClose,
  isActive,
}: {
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const { locale, t } = useLocale();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  return (
    <>
      <motion.div
        className="pointer-events-auto fixed inset-0 z-40 bg-black/50 backdrop-blur-[16px] min-[700px]:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        className="pointer-events-auto fixed inset-x-0 top-24 z-40 mx-auto max-h-[calc(100dvh-7rem)] w-[calc(100%-2rem)] max-w-[480px] overflow-y-auto rounded-[32px] bg-white p-6 shadow-pill min-[700px]:hidden"
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

        <div className="mt-4 border-t border-black/5 pt-4">
          <p className={`mb-3 ${font} text-[13px] font-extrabold text-behrouz-ink`}>
            {t(STR.nav.productsMenuTitle)}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {PRODUCT_CATEGORIES.map((cat) => (
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
        <div className="mt-4 flex justify-center">
          <LangSwitch onSelect={onClose} />
        </div>
      </motion.div>
    </>
  );
}
