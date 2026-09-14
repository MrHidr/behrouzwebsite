"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

const languages = [
  { code: "fa", short: "FA", name: "فارسی", enabled: true },
  { code: "en", short: "EN", name: "English", enabled: true },
  { code: "ar", short: "AR", name: "العربية", enabled: false },
  { code: "ru", short: "RU", name: "Русский", enabled: false },
] as const;

export type LangSwitchVariant = "menu" | "inline";

export function LangSwitch({
  className = "",
  onSelect,
  variant = "menu",
  large = false,
}: {
  className?: string;
  onSelect?: () => void;
  variant?: LangSwitchVariant;
  large?: boolean;
}) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== "menu") return;

    const outside = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("keydown", escape);
    };
  }, [variant]);

  const selectLanguage = (language: (typeof languages)[number]) => {
    if (!language.enabled) return;
    setLocale(language.code);
    setOpen(false);
    onSelect?.();
  };

  if (variant === "inline") {
    return (
      <div
        dir="ltr"
        role="group"
        aria-label="Language"
        className={`${large ? "grid w-full grid-cols-4 gap-2" : "flex items-center gap-1"} ${className}`}
      >
        {languages.map((language) => {
          const active = locale === language.code;
          return (
            <button
              key={language.code}
              type="button"
              disabled={!language.enabled}
              aria-pressed={active}
              title={!language.enabled ? (locale === "fa" ? "به‌زودی" : "Coming soon") : language.name}
              onClick={() => selectLanguage(language)}
              className={`flex items-center justify-center transition-colors ${
                large
                  ? "min-h-[62px] flex-col rounded-[16px] border px-1"
                  : "size-9 rounded-[12px]"
              } ${
                active
                  ? "border-behrouz-red bg-behrouz-red text-white"
                  : language.enabled
                    ? "border-black/[.06] bg-black/[.05] text-black/60 hover:bg-black/[.1]"
                    : "cursor-not-allowed border-black/[.04] bg-black/[.025] text-black/25"
              }`}
            >
              <strong className={`font-montserrat font-bold ${large ? "text-[14px]" : "text-[10px]"}`}>
                {language.short}
              </strong>
              {large && <small className="mt-1 max-w-full truncate font-yekan text-[10px] font-medium">{language.name}</small>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={rootRef} dir="ltr" className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Language"
        className="flex h-9 min-w-[52px] items-center justify-center gap-1.5 rounded-[12px] bg-black/[.06] px-2.5 font-montserrat text-[11px] font-bold text-black/60 transition-colors hover:bg-black/[.1]"
      >
        <span>{locale.toUpperCase()}</span>
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={`size-2.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="m2.25 4.25 3.75 3.5 3.75-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute end-0 top-full z-[70] mt-2 w-[176px] rounded-[18px] border border-black/10 bg-white p-2 shadow-[0_18px_55px_rgba(0,0,0,.2)]"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {languages.map((language) => {
                const active = locale === language.code;
                return (
                  <button
                    key={language.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    disabled={!language.enabled}
                    title={!language.enabled ? (locale === "fa" ? "به‌زودی" : "Coming soon") : undefined}
                    onClick={() => selectLanguage(language)}
                    className={`flex min-h-[54px] flex-col items-center justify-center rounded-[13px] transition-colors ${active ? "bg-behrouz-red text-white" : language.enabled ? "bg-black/[.035] text-black/65 hover:bg-black/[.07]" : "cursor-not-allowed bg-black/[.02] text-black/25"}`}
                  >
                    <strong className="font-montserrat text-[11px] font-bold">{language.short}</strong>
                    <small className="mt-1 max-w-full truncate px-1 font-yekan text-[9px] font-medium">{language.name}</small>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 px-1 text-center font-yekan text-[9px] font-medium text-black/35">
              {locale === "fa" ? "عربی و روسی به‌زودی فعال می‌شوند" : "Arabic and Russian are coming soon"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
