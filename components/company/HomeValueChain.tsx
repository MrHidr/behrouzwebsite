"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ManagedImage as Image,
  ManagedPageProvider,
  ManagedSection,
  useManagedPageContent,
} from "@/components/cms/ManagedPageContent";
import { ArrowUpForward } from "@/components/ui/icons";
import type { ManagedPage } from "@/lib/cms-content";
import { localizeDigits } from "@/lib/locale-digits";

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: .7, ease } },
};

export function HomeValueChain({ page }: { page?: ManagedPage }) {
  return (
    <ManagedPageProvider page={page}>
      <HomeValueChainBody />
    </ManagedPageProvider>
  );
}

function HomeValueChainBody() {
  const { locale, pickPair } = useManagedPageContent();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";
  const pick = pickPair;

  return (
    <ManagedSection sectionKey="routes"><section dir={en ? "ltr" : "rtl"} className="overflow-hidden bg-[#f6f3ec] px-5 py-20 text-[#122443] sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .4 }} className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <span className={`${font} inline-flex items-center gap-3 text-[13px] font-extrabold text-[#122443]/45 ${en ? "uppercase tracking-[.12em]" : ""}`}><i className="h-px w-8 bg-[#efaa32]" />{pick("مسیرهای اصلی", "Main routes")}</span>
            <h2 className={`${font} mt-4 max-w-[880px] text-[38px] font-black leading-[1.2] sm:text-[52px] lg:text-[64px] ${en ? "tracking-[-.03em]" : ""}`}>{pick("بهروز، پخش، محصولات و ارتباط؛ چهار مسیر روشن.", "Behrouz, distribution, products and contact—four clear routes.")}</h2>
          </div>
          <p className={`${font} max-w-[500px] text-[14px] font-medium leading-8 text-[#122443]/55 sm:text-[15px] lg:text-[17px] lg:leading-9`}>{pick("تاریخ، نوآوری و تولید را در «درباره بهروز» بخوانید. شبکه پخش، محصولات و راه‌های ارتباط نیز هرکدام مسیر مستقل خود را دارند.", "Find history, innovation and production under About Behrouz. Distribution, products and contact each have their own dedicated route.")}</p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} className="lg:col-span-7">
            <Link href="/about" className="group relative flex min-h-[430px] overflow-hidden rounded-[32px] bg-[#071b3b] text-white sm:min-h-[540px]">
              <Image src="/media/site/routes/about-behrouz.webp" alt={pick("متخصصان کنترل کیفیت در کارخانه بهروز", "Quality specialists at the Behrouz factory")} fill sizes="(min-width:1024px) 58vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071b3b] via-[#071b3b]/22 to-transparent" />
              <div className="relative mt-auto flex w-full items-end justify-between gap-6 p-6 sm:p-9">
                <div><span className={`${font} text-[11px] font-black text-[#efaa32]`}>{pick("از سال ۱۳۵۶", "SINCE 1977")}</span><h3 className={`${font} mt-3 max-w-[500px] text-[31px] font-black leading-tight sm:text-[42px]`}>{pick("بهروز را بهتر بشناسید.", "Get to know Behrouz.")}</h3><p className={`${font} mt-4 max-w-[540px] text-[13px] font-medium leading-7 text-white/62 sm:text-[14px] lg:text-[17px] lg:leading-8`}>{pick("تاریخ و ارزش‌های بهروز، نقاط عطف، نوآوری، کنترل کیفیت و مسیر تولید.", "Behrouz history and values, milestones, innovation, quality control and production.")}</p></div>
                <RoundArrow rtl={!en} light />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} className="lg:col-span-5">
            <Link href="/distribution" className="group relative grid min-h-[430px] overflow-hidden rounded-[32px] bg-[#071b3b] p-7 text-white sm:min-h-[540px] sm:grid-cols-[1fr_auto] sm:items-end sm:p-9">
              <Image src="/media/site/routes/distribution-tehran.webp" alt={pick("ناوگان پخش بهروز در تهران", "Behrouz distribution fleet in Tehran")} fill sizes="(min-width:1024px) 42vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071b3b] via-[#071b3b]/52 to-black/5" />
              <div className="relative z-10"><span className={`${font} text-[11px] font-black text-[#efaa32]`}>{pick("بازوی تخصصی بازار", "MARKET SPECIALIST")}</span><h3 className={`${font} mt-4 text-[34px] font-black leading-tight sm:text-[44px]`}>{pick("شرکت پخش بهروز", "Behrouz Distribution")}</h3><p className={`${font} mt-4 max-w-[570px] text-[14px] font-medium leading-8 text-white/65 lg:text-[17px] lg:leading-9`}>{pick("فروش مویرگی، لجستیک و داده بازار؛ برای توسعه برندهای FMCG در سراسر ایران.", "Field sales, logistics and market data for FMCG brand development across Iran.")}</p></div>
              <div className="relative z-10 mt-9 flex items-end justify-between gap-5 sm:mt-0 sm:flex-col sm:items-end"><div className="text-start sm:text-end"><strong className={`${font} block text-[54px] font-black leading-none`}>{localizeDigits("38", locale)}</strong><span className={`${font} mt-2 block text-[11px] font-black text-white/50`}>{pick("مرکز عملیاتی", "operating centres")}</span></div><RoundArrow rtl={!en} light /></div>
            </Link>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} className="lg:col-span-7">
            <Link href="/products/sauces" className="group relative grid min-h-[320px] overflow-hidden rounded-[32px] bg-[#f3383a] p-7 text-white sm:grid-cols-[.82fr_1.18fr] sm:items-center sm:p-9">
              <div className="relative z-10"><span className={`${font} text-[11px] font-black text-white/50`}>{pick("شش دسته محصول", "SIX PRODUCT CATEGORIES")}</span><h3 className={`${font} mt-4 text-[34px] font-black leading-tight sm:text-[44px]`}>{pick("محصولات بهروز", "Behrouz products")}</h3><p className={`${font} mt-4 max-w-[510px] text-[14px] font-medium leading-8 text-white/65 lg:text-[17px] lg:leading-9`}>{pick("سس، کنسرو، مربا، ترشی، خیارشور و آبلیمو؛ دسته موردنظرتان را انتخاب کنید.", "Sauces, canned foods, jams, pickles, gherkins and lime juice—choose a category to begin.")}</p><span className={`${font} mt-7 inline-flex items-center gap-3 text-[13px] font-black lg:text-[15px]`}>{pick("مشاهده محصولات", "Explore products")}<RoundArrow rtl={!en} light /></span></div>
              <div className="relative mt-7 min-h-[230px] sm:mt-0 sm:min-h-[280px]">
                <div className="absolute -bottom-20 start-[4%] h-[360px] w-[56%] rotate-[-5deg] transition-transform duration-700 group-hover:-translate-y-2"><Image src="/media/sauces/standard-mayo.webp" alt="" fill sizes="280px" className="object-contain" /></div>
                <div className="absolute -bottom-16 end-[1%] h-[340px] w-[55%] rotate-[5deg] transition-transform duration-700 group-hover:-translate-y-3"><Image src="/media/sauces/ketchup-scene.webp" alt="" fill sizes="280px" className="object-contain" /></div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} className="lg:col-span-5">
            <Link href="/contact" className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[32px] bg-[#071b3b] p-7 text-white transition-transform hover:-translate-y-1 sm:p-9">
              <Image src="/media/site/routes/contact-tehran.webp" alt={pick("کارشناس ارتباط با مشتریان بهروز در تهران", "Behrouz customer-care specialist in Tehran")} fill sizes="(min-width:1024px) 42vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071b3b] via-[#071b3b]/55 to-black/10" />
              <div className="relative z-10 flex items-start justify-between"><span className={`${font} text-[11px] font-black text-[#efaa32]`}>{pick("ارتباط مستقیم", "DIRECT CONTACT")}</span><RoundArrow rtl={!en} light /></div>
              <div className="relative z-10"><h3 className={`${font} text-[30px] font-black leading-tight sm:text-[36px]`}>{pick("موضوع شما، مستقیم به واحد مرتبط.", "Your enquiry, directly to the right team.")}</h3><p className={`${font} mt-4 text-[13px] font-medium leading-7 text-white/65 lg:text-[16px] lg:leading-8`}>{pick("صدای مشتری، فروش، همکاری تجاری و اطلاعات تماس مراکز.", "Customer voice, sales, business partnerships and location details.")}</p></div>
            </Link>
          </motion.div>
        </div>

      </div>
    </section></ManagedSection>
  );
}

function RoundArrow({ rtl, light = false }: { rtl: boolean; light?: boolean }) {
  return <span className={`grid size-11 shrink-0 place-items-center rounded-full transition-transform group-hover:-translate-y-1 ${light ? "bg-white text-[#071b3b]" : "bg-[#071b3b] text-white"}`}><ArrowUpForward rtl={rtl} className="size-4" /></span>;
}
