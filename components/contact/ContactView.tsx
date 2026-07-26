"use client";

import { motion } from "framer-motion";
import { STR, CONTACT_INFO, DEPARTMENT_EMAILS } from "@/lib/i18n";
import { useLocale } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 1, 0.36, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

/* tiny inline icons */
const IconWrap = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden {...p} />
);
const PinIcon = () => (
  <IconWrap>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7" />
  </IconWrap>
);
const PhoneIcon = () => (
  <IconWrap>
    <path d="M5 4h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5V17a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
  </IconWrap>
);
const FaxIcon = () => (
  <IconWrap>
    <path d="M7 9V4h10v5M7 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </IconWrap>
);
const MailIcon = () => (
  <IconWrap>
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="m4 7 8 5 8-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </IconWrap>
);
const HashIcon = () => (
  <IconWrap>
    <path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </IconWrap>
);

export function ContactView() {
  const { locale, t } = useLocale();
  const en = locale === "en";
  const font = en ? "font-montserrat" : "font-yekan";

  return (
    <div className="relative bg-white">
      {/* ============ HERO (minimal) ============ */}
      <section className="relative flex min-h-[56svh] w-full items-center justify-center overflow-hidden bg-behrouz-ink pt-28 pb-16 text-center">
        <div className="absolute inset-0 opacity-[0.15] [background:radial-gradient(circle_at_30%_20%,#e42e1d,transparent_45%),radial-gradient(circle_at_80%_70%,#efab0c,transparent_45%)]" />
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }} className="relative z-10 flex flex-col items-center px-6">
          <motion.span variants={reveal} className={`text-white/80 ${en ? "font-montserrat text-[18px] font-medium italic lg:text-[24px]" : "font-dast text-[22px] lg:text-[28px]"}`}>{t(STR.contact.tagline)}</motion.span>
          <motion.h1 variants={reveal} className={`${font} mt-1 font-extrabold uppercase leading-none text-white ${en ? "text-[40px] lg:text-[72px]" : "text-[48px] lg:text-[88px]"}`}>{t(STR.contact.title)}</motion.h1>
          <motion.span variants={reveal} className={`${font} mt-4 max-w-[520px] text-[15px] font-medium text-white/60 lg:text-[17px]`}>{t(STR.contact.voiceSub)}</motion.span>
        </motion.div>
      </section>

      {/* ============ OFFICES ============ */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1120px] gap-6 px-6 lg:grid-cols-2 lg:gap-8">
          <OfficeCard
            font={font}
            title={t(STR.contact.headOffice)}
            address={t(STR.contact.headOfficeAddress)}
            postal={CONTACT_INFO.headOffice.postal}
            phones={CONTACT_INFO.headOffice.phones}
            fax={CONTACT_INFO.headOffice.fax}
            labels={{ address: t(STR.contact.address), postal: t(STR.contact.postalCode), phone: t(STR.contact.phones), fax: t(STR.contact.fax) }}
            accent="#e42e1d"
          />
          <OfficeCard
            font={font}
            title={t(STR.contact.factory)}
            address={t(STR.contact.factoryAddress)}
            postal={CONTACT_INFO.factory.postal}
            phones={CONTACT_INFO.factory.phones}
            labels={{ address: t(STR.contact.address), postal: t(STR.contact.postalCode), phone: t(STR.contact.phones), fax: t(STR.contact.fax) }}
            accent="#1f3a8f"
          />
        </div>
      </section>

      {/* ============ CUSTOMER VOICE (gold) ============ */}
      <section className="px-6 pb-16 lg:pb-24">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} className="mx-auto flex max-w-[1120px] flex-col items-center gap-4 rounded-[32px] bg-[#efab0c] px-8 py-12 text-center text-white lg:py-14">
          <span className={`${font} text-[28px] font-extrabold uppercase lg:text-[40px]`}>{t(STR.contact.voiceTitle)}</span>
          <a href={`tel:${CONTACT_INFO.customerVoice}`} dir="ltr" className="font-montserrat text-[40px] font-black leading-none lg:text-[56px]">{CONTACT_INFO.customerVoice}</a>
          <span className={`${font} max-w-[460px] text-[15px] font-medium text-white/85`}>{t(STR.contact.voiceSub)}</span>
        </motion.div>
      </section>

      {/* ============ DEPARTMENT EMAILS ============ */}
      <section className="bg-[#fafafa] py-16 lg:py-24">
        <div className="mx-auto max-w-[1120px] px-6">
          <motion.h2 variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} className={`${font} text-center text-[30px] font-extrabold text-behrouz-ink lg:text-[44px]`}>
            {t(STR.contact.emailsTitle)}
          </motion.h2>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENT_EMAILS.map((d, i) => (
              <motion.a
                key={i}
                href={`mailto:${d.email}`}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: (i % 3) * 0.06 }}
                className="group flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 transition-all duration-300 hover:border-behrouz-red/30 hover:shadow-chip"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-behrouz-red/10 text-behrouz-red transition-colors group-hover:bg-behrouz-red group-hover:text-white">
                  <MailIcon />
                </span>
                <span className="flex min-w-0 flex-col text-start">
                  <span className={`${font} text-[13.5px] font-extrabold text-behrouz-ink`}>{locale === "en" ? d.en : d.fa}</span>
                  <span dir="ltr" className="truncate font-montserrat text-[12.5px] text-behrouz-ink/55">{d.email}</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}

function OfficeCard({
  font,
  title,
  address,
  postal,
  phones,
  fax,
  labels,
  accent,
}: {
  font: string;
  title: string;
  address: string;
  postal: string;
  phones: string[];
  fax?: string;
  labels: { address: string; postal: string; phone: string; fax: string };
  accent: string;
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-[32px] border border-black/5 bg-white p-8 shadow-chip"
    >
      <div className="flex items-center gap-3">
        <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <h3 className={`${font} text-[24px] font-extrabold text-behrouz-ink lg:text-[28px]`}>{title}</h3>
      </div>

      <div className="mt-6 space-y-5">
        <Row icon={<PinIcon />} label={labels.address} accent={accent} font={font}>
          <span className={`${font} text-[14px] font-medium leading-7 text-behrouz-ink/75`}>{address}</span>
        </Row>
        <Row icon={<HashIcon />} label={labels.postal} accent={accent} font={font}>
          <span dir="ltr" className="font-montserrat text-[15px] font-bold text-behrouz-ink">{postal}</span>
        </Row>
        <Row icon={<PhoneIcon />} label={labels.phone} accent={accent} font={font}>
          <span className="flex flex-col gap-0.5">
            {phones.map((p) => (
              <span key={p} dir="ltr" className={`${font} text-[15px] font-bold text-behrouz-ink`}>{p}</span>
            ))}
          </span>
        </Row>
        {fax && (
          <Row icon={<FaxIcon />} label={labels.fax} accent={accent} font={font}>
            <span dir="ltr" className={`${font} text-[15px] font-bold text-behrouz-ink`}>{fax}</span>
          </Row>
        )}
      </div>
    </motion.div>
  );
}

function Row({
  icon,
  label,
  accent,
  font,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  font: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: accent }}>
        {icon}
      </span>
      <div className="flex flex-col text-start">
        <span className={`${font} text-[12px] font-extrabold uppercase tracking-wide text-behrouz-ink/40`}>{label}</span>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}
