"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCMSContent } from "@/components/cms/CMSContentProvider";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CategoryCircle } from "./CategoryCircle";

const panel = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.04, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

export function ProductsDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const { locale, t } = useLocale();
  const { productCategories } = useCMSContent();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";
  return (
    <motion.div
      variants={panel}
      initial="hidden"
      animate="show"
      exit="exit"
      className="w-[min(680px,calc(100vw-32px))] rounded-[32px] bg-white p-6 shadow-pill sm:p-8"
      role="menu"
      aria-label={locale === "fa" ? "دسته‌بندی محصولات" : "Product categories"}
    >
      <div className="flex w-full items-start justify-between gap-4">
        <p className={`shrink-0 ${font} text-[16px] font-extrabold text-behrouz-ink`}>
          {t(STR.nav.productsMenuTitle)}
        </p>
        <p className={`${font} text-[12px] font-medium text-behrouz-ink/50`}>
          {t(STR.nav.productsMenuHint)}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-6 sm:gap-8">
        {productCategories.map((cat) => (
          <motion.div key={cat.slug} variants={item} role="menuitem">
            <Link
              href={`/products/${cat.slug}`}
              onClick={onNavigate}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-behrouz-accent/50"
              style={{ ["--cat" as string]: cat.color }}
            >
              <span className="w-[72px] sm:w-[80px]">
                <CategoryCircle slug={cat.slug} color={cat.color} buttonImage={cat.buttonImage} />
              </span>
              <span className={`${font} text-[14px] font-extrabold text-behrouz-ink transition-colors duration-300 group-hover:[color:var(--cat)]`}>
                {locale === "en" ? cat.labelEn : cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
