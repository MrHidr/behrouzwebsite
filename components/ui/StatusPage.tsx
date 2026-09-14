"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function StatusPage({ code, onRetry }: { code: "404" | "500"; onRetry?: () => void }) {
  const { locale } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const missing = code === "404";

  return (
    <main dir={en ? "ltr" : "rtl"} className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#f6f3ec] px-6 py-14 text-[#122443]">
      <div className="pointer-events-none absolute -end-16 -top-20 size-[340px] rounded-full bg-[#efaa32]/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -start-20 size-[420px] rounded-full bg-[#f3383a]/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[920px] text-center">
        <Link href="/" aria-label={en ? "Behrouz home" : "صفحه اصلی بهروز"} className="mx-auto grid size-20 place-items-center rounded-full bg-white p-2 shadow-[0_18px_55px_rgba(18,36,67,.12)]">
          <Image src="/media/site/behrouz-logo.png" alt="" width={72} height={72} className="size-full object-contain" priority />
        </Link>

        <p dir="ltr" className="mt-8 font-montserrat text-[88px] font-black leading-none tracking-[-.08em] text-[#122443]/10 sm:text-[150px]">{code}</p>
        <h1 className={`${font} -mt-4 text-[34px] font-black leading-tight sm:-mt-8 sm:text-[52px]`}>
          {missing
            ? en ? "This route ends here." : "این مسیر به جایی نمی‌رسد."
            : en ? "Something interrupted the route." : "چیزی مسیر را متوقف کرد."
          }
        </h1>
        <p className={`${font} mx-auto mt-5 max-w-[620px] text-[14px] font-medium leading-8 text-[#122443]/55 sm:text-[16px]`}>
          {missing
            ? en ? "The address may have changed. Choose one of the clear routes below." : "ممکن است آدرس تغییر کرده باشد. یکی از مسیرهای روشن زیر را انتخاب کنید."
            : en ? "Try loading the page again, or continue from one of the main sections." : "صفحه را دوباره بارگذاری کنید یا از یکی از بخش‌های اصلی ادامه دهید."
          }
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {onRetry && (
            <button type="button" onClick={onRetry} className={`${font} min-h-12 rounded-full bg-[#f3383a] px-6 text-[14px] font-black text-white transition hover:-translate-y-0.5`}>
              {en ? "Try again" : "تلاش دوباره"}
            </button>
          )}
          <Link href="/" className={`${font} inline-flex min-h-12 items-center rounded-full bg-[#122443] px-6 text-[14px] font-black text-white transition hover:-translate-y-0.5`}>
            {en ? "Home" : "صفحه اصلی"}
          </Link>
          <Link href="/products/sauces" className={`${font} inline-flex min-h-12 items-center rounded-full border border-[#122443]/12 bg-white/70 px-6 text-[14px] font-black transition hover:bg-white`}>
            {en ? "Products" : "محصولات"}
          </Link>
          <Link href="/contact" className={`${font} inline-flex min-h-12 items-center rounded-full border border-[#122443]/12 bg-white/70 px-6 text-[14px] font-black transition hover:bg-white`}>
            {en ? "Contact" : "تماس با ما"}
          </Link>
        </div>
      </div>
    </main>
  );
}
