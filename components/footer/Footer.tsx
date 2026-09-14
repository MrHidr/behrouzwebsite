"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AparatIcon, FaxIcon, InstagramIcon, LinkedinIcon, MailIcon, PhoneIcon } from "@/components/ui/icons";
import { useCMSContent } from "@/components/cms/CMSContentProvider";
import { ProtectedContactValue } from "@/components/contact/ProtectedContactValue";
import { toLatinDigits } from "@/lib/locale-digits";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const SOCIAL_ICON = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  aparat: AparatIcon,
} as const;

const CONTACT_ICON = {
  phone: PhoneIcon,
  fax: FaxIcon,
  email: MailIcon,
} as const;

export function Footer() {
  const { locale, t } = useLocale();
  const { brand, footer, socials } = useCMSContent();
  const font = locale === "en" ? "font-montserrat" : "font-yekan";

  const items = footer.contacts.map((item) => ({
    label: t(item.label),
    value: item.value,
    type: item.type,
    Icon: CONTACT_ICON[item.type],
  }));

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
          {t(footer.heading)}
        </h2>
        <div className="flex items-center gap-5">
          {socials.map((s) => {
            const Icon = SOCIAL_ICON[s.name as keyof typeof SOCIAL_ICON];
            if (!Icon) return null;
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
            <div
              key={i}
              className="group flex items-center gap-4 rounded-2xl bg-black/[0.08] px-5 py-4 transition-colors duration-300 hover:bg-black/[0.14]"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20 text-white transition-colors duration-300 group-hover:bg-white/30">
                <it.Icon className="size-5" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={`${font} text-[13px] font-bold text-white/60 lg:text-[14px] ${locale === "en" ? "uppercase tracking-wide" : "tracking-normal"}`}>
                  {it.label}
                </span>
                <ProtectedContactValue
                  value={it.type === "phone" ? toLatinDigits(it.value).replace(/[^0-9+]/g, "") : it.value}
                  kind={it.type === "email" ? "email" : it.type === "phone" ? "phone" : "copy"}
                  label={it.type === "email" ? `${it.label}؛ ارسال ایمیل` : it.type === "phone" ? `${it.label}؛ تماس` : `${it.label}؛ کپی`}
                  color="#ffffff"
                  fontSize={15}
                  className="max-w-full overflow-hidden text-start"
                />
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* copyright (dark) */}
      <div className="flex flex-col items-center gap-3 bg-behrouz-ink px-6 py-7">
        <Image src={brand.logo} alt="Behrouz" width={72} height={72} className="size-16 object-contain" />
        <p className={`text-center ${font} text-[13px] text-white/90 lg:text-[14px]`}>
          {t(footer.copyright)}
        </p>
      </div>
    </footer>
  );
}
