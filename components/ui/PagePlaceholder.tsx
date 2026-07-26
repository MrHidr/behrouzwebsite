"use client";

import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import type { Bi } from "@/lib/i18n";
import { STR } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function PagePlaceholder({
  title,
  subtitle,
}: {
  title: Bi;
  subtitle?: Bi;
}) {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
        <p className={en ? "font-montserrat text-xl font-medium italic text-behrouz-accent" : "font-dast text-2xl text-behrouz-accent"}>
          {t(STR.hero.script)}
        </p>
        <h1 className={`mt-3 ${font} font-extrabold text-behrouz-ink ${en ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"}`}>
          {t(title)}
        </h1>
        {subtitle && (
          <p className={`mt-4 max-w-xl ${font} text-base font-medium leading-8 text-behrouz-ink/60`}>
            {t(subtitle)}
          </p>
        )}
        <span className={`mt-8 rounded-full bg-behrouz-accent/10 px-4 py-2 ${font} text-sm font-extrabold text-behrouz-accent`}>
          {t(STR.common.comingSoon)}
        </span>
      </section>
      <Footer />
    </main>
  );
}
