"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PRODUCT_CATEGORIES } from "@/lib/site";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CategoryCircle } from "@/components/navbar/CategoryCircle";

const ease = [0.22, 1, 0.36, 1] as const;

/** End-of-category-page navigation: the same circular category badges as the
 *  navbar dropdown, letting visitors jump straight to another category
 *  instead of scrolling back up. Deliberately NOT full-viewport-height (this
 *  is a footer-adjacent wayfinding strip, not a hero) — just comfortable
 *  padding around a compact row. */
export function CategoryNavRow({ currentSlug }: { currentSlug: string }) {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";

  return (
    <section className="w-full bg-white px-6 py-16 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto max-w-[1100px] text-center"
      >
        <h2 className={`${font} text-[20px] font-extrabold text-behrouz-ink lg:text-[26px]`}>
          {t(STR.common.exploreOtherCategories)}
        </h2>

        <div className="mt-10 grid grid-cols-3 gap-x-4 gap-y-10 sm:grid-cols-6 sm:gap-8">
          {PRODUCT_CATEGORIES.map((cat) => {
            const active = cat.slug === currentSlug;
            return (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-behrouz-accent/50"
                style={{ ["--cat" as string]: cat.color }}
              >
                <span
                  className="w-[76px] rounded-full transition-shadow duration-300 sm:w-[92px]"
                  style={{ boxShadow: active ? `0 0 0 3px #fff, 0 0 0 5px ${cat.color}` : "none" }}
                >
                  <CategoryCircle slug={cat.slug} color={cat.color} buttonImage={cat.buttonImage} />
                </span>
                <span
                  className={`${font} text-[14px] font-extrabold transition-colors duration-300 group-hover:[color:var(--cat)] ${
                    active ? "text-behrouz-ink" : "text-behrouz-ink/60"
                  }`}
                  style={active ? { color: cat.color } : undefined}
                >
                  {en ? cat.labelEn : cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
