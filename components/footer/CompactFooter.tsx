"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeDigits } from "@/lib/locale-digits";

export function CompactFooter() {
  const { locale } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const year = localizeDigits(new Date().getFullYear(), locale);

  return (
    <footer dir={en ? "ltr" : "rtl"} className="bg-[#111d32] px-6 py-7 text-white sm:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-3" aria-label={en ? "Behrouz home" : "صفحه اصلی بهروز"}>
          <span className="grid size-11 place-items-center rounded-full bg-white p-1.5">
            <Image src="/media/site/behrouz-logo.png" alt="" width={44} height={44} className="size-full object-contain" />
          </span>
          <span>
            <strong className={`${font} block text-[14px] font-black`}>{en ? "Behrouz Food Industries" : "صنایع غذایی بهروز"}</strong>
            <small className={`${font} mt-0.5 block text-[11px] font-bold text-white/45`}>{en ? "Hello my friend" : "دوست من سلام"}</small>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label={en ? "Footer navigation" : "دسترسی پایانی"}>
          <Link href="/" className={`${font} text-[12px] font-bold text-white/55 transition hover:text-white`}>{en ? "Home" : "خانه"}</Link>
          <Link href="/products/sauces" className={`${font} text-[12px] font-bold text-white/55 transition hover:text-white`}>{en ? "Products" : "محصولات"}</Link>
          <Link href="/about" className={`${font} text-[12px] font-bold text-white/55 transition hover:text-white`}>{en ? "About" : "درباره بهروز"}</Link>
        </nav>

        <p className={`${font} text-center text-[11px] font-medium text-white/35 sm:text-end`}>
          © {year} {en ? "Behrouz" : "بهروز"}
        </p>
      </div>
    </footer>
  );
}
