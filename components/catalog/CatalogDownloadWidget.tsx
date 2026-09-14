"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Bi } from "@/lib/i18n";
import { categoryCatalogDownload } from "@/lib/catalog-downloads";
import { useCMSContent } from "@/components/cms/CMSContentProvider";

type DownloadState = "checking" | "ready" | "missing";

export function CatalogDownloadWidget({
  category,
  mode = "floating",
}: {
  category?: { slug: string; title: Bi };
  mode?: "floating" | "inline";
}) {
  const { locale } = useLocale();
  const { catalog } = useCMSContent();
  const reduceMotion = useReducedMotion();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(mode === "inline");
  const [states, setStates] = useState<Record<string, DownloadState>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => [
    {
      key: "full",
      title: catalog.label[locale],
      meta: locale === "en" ? "All Behrouz categories · PDF" : "همه دسته‌های بهروز · PDF",
      href: catalog.href,
    },
    ...(category ? [{
      key: category.slug,
      title: locale === "en" ? `${category.title.en} catalog` : `کاتالوگ ${category.title.fa}`,
      meta: locale === "en" ? "This category only · PDF" : "فقط همین دسته · PDF",
      href: categoryCatalogDownload(category.slug),
    }] : []),
  ], [catalog.href, catalog.label, category, locale]);

  useEffect(() => {
    let cancelled = false;
    options.forEach(async (option) => {
      setStates((current) => ({ ...current, [option.key]: "checking" }));
      try {
        const response = await fetch(option.href, { method: "HEAD", cache: "no-store" });
        if (!cancelled) setStates((current) => ({ ...current, [option.key]: response.ok ? "ready" : "missing" }));
      } catch {
        if (!cancelled) setStates((current) => ({ ...current, [option.key]: "missing" }));
      }
    });
    return () => { cancelled = true; };
  }, [options]);

  useEffect(() => {
    if (mode !== "floating") return;
    const update = () => setMinimized(window.scrollY > 240 || window.innerWidth < 640);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [mode]);

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", closeOnOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const download = (href: string) => {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const onTrigger = () => {
    const fullState = states.full ?? "checking";
    if (!category && fullState === "ready") {
      download(catalog.href);
      return;
    }
    setOpen((value) => !value);
  };

  return (
    <div
      ref={rootRef}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={mode === "floating"
        ? "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-[45] sm:end-6"
        : "absolute bottom-16 end-4 z-50 sm:bottom-6 sm:end-6"}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={locale === "en" ? "Catalog downloads" : "دانلود کاتالوگ‌ها"}
            initial={{ opacity: 0, y: 10, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: .98 }}
            transition={{ duration: reduceMotion ? 0 : .22 }}
            className="absolute bottom-full end-0 mb-3 w-[min(330px,calc(100vw-2rem))] overflow-hidden rounded-[24px] border border-black/10 bg-white p-2 text-[#071b3b] shadow-[0_24px_70px_rgba(0,0,0,.24)]"
          >
            <div className="px-3 pb-2 pt-2">
              <span className={`${font} text-[10px] font-black text-[#071b3b]/38`}>{locale === "en" ? "DOWNLOAD CENTER" : "مرکز دانلود"}</span>
              <h3 className={`${font} mt-1 text-[19px] font-black`}>{locale === "en" ? "Product catalogs" : "کاتالوگ محصولات"}</h3>
            </div>
            <div className="grid gap-1.5">
              {options.map((option) => {
                const state = states[option.key] ?? "checking";
                const ready = state === "ready";
                return (
                  <button
                    key={option.key}
                    type="button"
                    disabled={!ready}
                    onClick={() => ready && download(option.href)}
                    className="group flex min-h-[66px] items-center gap-3 rounded-[18px] bg-[#071b3b]/[.045] px-3 py-2.5 text-start transition-colors enabled:hover:bg-[#efaa32]/20 disabled:cursor-not-allowed"
                  >
                    <span className={`grid size-10 shrink-0 place-items-center rounded-[13px] ${ready ? "bg-[#efaa32] text-[#071b3b]" : "bg-[#071b3b]/[.06] text-[#071b3b]/25"}`}><DownloadIcon /></span>
                    <span className="min-w-0 flex-1">
                      <strong className={`${font} block text-[13px] font-black`}>{option.title}</strong>
                      <small className={`${font} mt-1 block text-[10px] font-medium text-[#071b3b]/42`}>
                        {state === "checking"
                          ? (locale === "en" ? "Checking file…" : "در حال بررسی فایل…")
                          : ready
                            ? option.meta
                            : (locale === "en" ? "PDF awaiting upload" : "فایل PDF در انتظار بارگذاری")}
                      </small>
                    </span>
                    <span className={`${font} text-[10px] font-black text-[#071b3b]/25`}>PDF</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onTrigger}
        aria-expanded={open}
        aria-haspopup="dialog"
        layout
        transition={{ duration: reduceMotion ? 0 : .25 }}
        className="flex items-center gap-2.5 rounded-[20px] border border-black/10 bg-white p-2 pe-3 text-[#071b3b] shadow-[0_16px_45px_rgba(0,0,0,.2)] transition-transform hover:-translate-y-0.5"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-[#efaa32]"><DownloadIcon /></span>
        <span className="text-start">
          <strong className={`${font} block whitespace-nowrap text-[12px] font-black sm:text-[13px]`}>{locale === "en" ? "Download product catalog" : "دانلود کاتالوگ محصولات"}</strong>
          {!minimized && <small className={`${font} mt-0.5 hidden text-[10px] font-medium text-[#071b3b]/42 sm:block`}>{category ? (locale === "en" ? "Complete or category PDF" : "نسخه کامل یا همین دسته") : (locale === "en" ? "Complete Behrouz catalog" : "کاتالوگ کامل بهروز")}</small>}
        </span>
        {category && <motion.span animate={{ rotate: open ? 180 : 0 }} className="ms-1 text-[#071b3b]/35"><ChevronIcon /></motion.span>}
      </motion.button>
    </div>
  );
}

function DownloadIcon() {
  return <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 18.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ChevronIcon() {
  return <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
