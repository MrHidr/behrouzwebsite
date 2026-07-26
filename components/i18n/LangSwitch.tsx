"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Segmented FA / EN language switch: both options are always visible and a
 * red pill slides under the active locale. Clicking a side selects that locale
 * directly (a proper switch, not a blind toggle).
 */
export function LangSwitch({
  className = "",
  onSelect,
}: {
  className?: string;
  onSelect?: () => void;
}) {
  const { locale, setLocale } = useLocale();
  const opts = [
    { code: "fa" as const, label: "FA" },
    { code: "en" as const, label: "EN" },
  ];

  return (
    <div
      dir="ltr"
      role="group"
      aria-label="Language"
      className={`relative flex items-center rounded-full bg-black/[0.06] p-1 backdrop-blur-md ${className}`}
    >
      {/* sliding indicator: fa → left slot, en → right slot */}
      <motion.span
        aria-hidden
        className="absolute bottom-1 top-1 left-1 w-11 rounded-full bg-behrouz-red shadow-sm"
        animate={{ x: locale === "en" ? 44 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      />
      {opts.map((o) => {
        const active = locale === o.code;
        return (
          <button
            key={o.code}
            type="button"
            onClick={() => {
              setLocale(o.code);
              onSelect?.();
            }}
            aria-pressed={active}
            className="relative z-10 w-11 py-1.5 text-center font-montserrat text-[13px] font-semibold transition-colors duration-300"
            style={{ color: active ? "#fff" : "rgba(0,0,0,0.5)" }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
