"use client";

import { motion } from "framer-motion";
import {
  ManagedImage as Image,
  ManagedPageProvider,
  ManagedSection,
  useManagedPageContent,
} from "@/components/cms/ManagedPageContent";
import { CareerApplicationForm } from "./CareerApplicationForm";
import type { ManagedPage } from "@/lib/cms-content";
import type { CareerFormConfig } from "@/lib/careers-config";

const ease = [0.22, 1, 0.36, 1] as const;

export function CareersPage({
  page,
  formConfig,
  formToken,
}: {
  page?: ManagedPage;
  formConfig: CareerFormConfig;
  formToken: string;
}) {
  return (
    <ManagedPageProvider page={page}>
      <CareersPageBody formConfig={formConfig} formToken={formToken} />
    </ManagedPageProvider>
  );
}

function CareersPageBody({ formConfig, formToken }: { formConfig: CareerFormConfig; formToken: string }) {
  const { locale, page, pick } = useManagedPageContent();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";

  return (
    <div dir={en ? "ltr" : "rtl"} className="overflow-hidden bg-[#f7f4ed] text-[#181512]">
      <ManagedSection sectionKey="hero">
        <section id="hero" className="relative min-h-[68svh] overflow-hidden bg-[#181512] text-white">
          <Image
            src={page?.image || "/media/site/careers-hero.webp"}
            alt={page ? pick(page.imageAlt) : pick({ fa: "همکاری تیم‌های تخصصی صنایع غذایی بهروز", en: "Specialist teams collaborating at Behrouz Food Industries" })}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,16,14,.28),rgba(18,16,14,.9))] ltr:bg-[linear-gradient(90deg,rgba(18,16,14,.9),rgba(18,16,14,.28))]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
          <div className="relative z-10 mx-auto flex min-h-[68svh] max-w-[1440px] items-end px-6 pb-14 pt-32 sm:px-10 sm:pb-20 lg:px-16">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease }}
              className="max-w-[760px]"
            >
              <span className={`${font} text-[14px] font-extrabold text-white/60`}>
                {page ? pick(page.eyebrow) : pick({ fa: "همکاری با بهروز", en: "Careers at Behrouz" })}
              </span>
              <h1 className={`${font} mt-4 text-[44px] font-black leading-[1.08] tracking-[-.035em] sm:text-[64px] lg:text-[78px]`}>
                {(page ? pick(page.title) : pick({ fa: "کنار هم،\nچیزهای ماندگار می‌سازیم.", en: "Together,\nwe build what lasts." })).split("\n").map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </h1>
              <p className={`${font} mt-5 max-w-[650px] text-[15px] font-medium leading-8 text-white/70 sm:text-[18px] sm:leading-9`}>
                {page ? pick(page.lead) : pick({
                  fa: "اگر دوست دارید در یک مجموعه باسابقه و رو به رشد اثر بگذارید، رزومه‌تان را برای ما بفرستید.",
                  en: "If you would like to make an impact in an established, growing company, send us your résumé.",
                })}
              </p>
            </motion.div>
          </div>
        </section>
      </ManagedSection>

      <ManagedSection sectionKey="culture">
        <section id="culture" className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[.65fr_1.35fr] lg:items-start">
            <span className={`${font} text-[13px] font-black text-[#e42e1d]`}>
              {pick({ fa: "فرهنگ همکاری", en: "How we work" })}
            </span>
            <div>
              <h2 className={`${font} max-w-[840px] text-[32px] font-black leading-[1.35] sm:text-[44px]`}>
                {pick({
                  fa: "کنجکاوی، مسئولیت‌پذیری و همکاری؛ برای بهتر ساختن هر روز.",
                  en: "Curiosity, ownership and collaboration—making each day better.",
                })}
              </h2>
              <p className={`${font} mt-6 max-w-[760px] text-[16px] font-medium leading-8 text-black/55 sm:text-[18px] sm:leading-9`}>
                {pick({
                  fa: "زمینه‌های همکاری در بهروز گسترده‌اند؛ از تحقیق و کیفیت تا تولید، فناوری، فروش، زنجیره تأمین و نقش‌های ستادی.",
                  en: "Opportunities at Behrouz span research and quality, production, technology, sales, supply chain and corporate functions.",
                })}
              </p>
            </div>
          </div>
        </section>
      </ManagedSection>

      <ManagedSection sectionKey="application">
        <section id="application" className="border-t border-black/10 bg-white px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <span className={`${font} text-[13px] font-black text-[#e42e1d]`}>
                {pick({ fa: "ارسال رزومه", en: "Send your résumé" })}
              </span>
              <h2 className={`${font} mt-4 text-[34px] font-black leading-[1.25] sm:text-[48px]`}>
                {pick({ fa: "از همین‌جا شروع کنیم.", en: "Let’s start here." })}
              </h2>
              <p className={`${font} mt-5 max-w-[430px] text-[15px] font-medium leading-8 text-black/55`}>
                {pick({
                  fa: "اطلاعات شما فقط برای بررسی فرصت‌های همکاری در اختیار تیم مسئول قرار می‌گیرد.",
                  en: "Your information is available only to the team responsible for reviewing career opportunities.",
                })}
              </p>
            </div>
            <CareerApplicationForm config={formConfig} initialFormToken={formToken} />
          </div>
        </section>
      </ManagedSection>
    </div>
  );
}
