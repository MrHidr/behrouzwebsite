"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SOCIALS } from "@/lib/site";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AparatIcon, FaxIcon, InstagramIcon, LinkedinIcon, MailIcon, PhoneIcon } from "@/components/ui/icons";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const SOCIAL_ICON = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  aparat: AparatIcon,
} as const;

export function Footer() {
  const { locale, t } = useLocale();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";

  const items = [
    { label: t(STR.footer.centralPhone), value: "021-44536090", href: "tel:+982144536090", Icon: PhoneIcon },
    { label: t(STR.footer.factoryPhone), value: "026-34373500", href: "tel:+982634373500", Icon: PhoneIcon },
    { label: t(STR.footer.fax), value: "021-44536092", href: "tel:+982144536092", Icon: FaxIcon },
    { label: t(STR.footer.email), value: "Info@behrouznik.com", href: "mailto:Info@behrouznik.com", Icon: MailIcon },
  ];

  return (
    <footer className="w-full">
      {/* CTA (gold) */}
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col items-center gap-4 bg-[#EFAA3A] px-6 py-10 text-center lg:py-12"
      >
        <h2
          className={`${font} font-extrabold leading-tight text-white ${
            locale === "en"
              ? "max-w-[16ch] text-[26px] sm:text-[36px] lg:text-[48px]"
              : "text-[30px] uppercase sm:text-[44px] lg:text-[60px]"
          }`}
        >
          {t(STR.footer.heading)}
        </h2>
        <div className="flex items-center gap-5">
          {SOCIALS.map((s) => {
            const Icon = SOCIAL_ICON[s.name];
            return (
              <a
                key={s.name}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={s.name}
                className="grid size-16 place-items-center rounded-full bg-black/10 text-white transition-colors duration-300 hover:bg-black/20"
              >
                <Icon className="size-7" />
              </a>
            );
          })}
        </div>
      </motion.div>

      {/* details (darker gold) */}
      <div className="bg-[#DB982D] px-6 py-10 lg:px-10">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto grid max-w-[1100px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((it, i) => (
            <a
              key={i}
              href={it.href}
              className="group flex items-center gap-4 rounded-2xl bg-black/[0.08] px-5 py-4 transition-colors duration-300 hover:bg-black/[0.14]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20 text-white transition-colors duration-300 group-hover:bg-white/30">
                <it.Icon className="size-5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={`${font} text-[13px] font-bold uppercase tracking-wide text-white/60 lg:text-[14px]`}>
                  {it.label}
                </span>
                <span dir="ltr" className="break-all font-montserrat text-[13px] font-black text-white lg:text-[15px]">
                  {it.value}
                </span>
              </span>
            </a>
          ))}
        </motion.div>
      </div>

      {/* copyright (dark) */}
      <div className="flex flex-col items-center gap-3 bg-behrouz-ink px-6 py-7">
        <Image src="/media/site/logo-wordmark-white.webp" alt="Behrouz" width={174} height={48} className="h-11 w-auto" />
        <p className={`text-center ${font} text-[13px] text-white/90 lg:text-[14px]`}>
          {t(STR.footer.copyright)}
        </p>
      </div>
    </footer>
  );
}
