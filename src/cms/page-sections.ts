export type ManagedPageSlug =
  | "home"
  | "about"
  | "innovation"
  | "production"
  | "distribution"
  | "contact"
  | "careers";

export type PageSectionDefinition = {
  key: string;
  label: string;
  locked?: boolean;
  lists?: { key: string; label: string }[];
};

/**
 * The page shell is fixed by design. Editors can hide ordinary sections, but
 * cannot add, remove or rename the structural rows. Repeatable content lives
 * inside a section and can be managed independently.
 */
export const PAGE_SECTIONS: Record<ManagedPageSlug, PageSectionDefinition[]> = {
  home: [
    { key: "hero", label: "بخش اصلی ویدیویی", locked: true },
    { key: "routes", label: "مسیرهای اصلی" },
  ],
  about: [
    { key: "hero", label: "بخش اصلی صفحه", locked: true },
    { key: "story", label: "تاریخچه و نقاط عطف" },
    { key: "scale", label: "بهروز در یک نگاه" },
    { key: "values", label: "ارزش‌های سازمانی" },
    { key: "awards", label: "افتخارات" },
    { key: "crossJourney", label: "مسیرهای مرتبط" },
    { key: "nextStep", label: "دعوت به مشاهده محصولات" },
  ],
  innovation: [
    { key: "hero", label: "بخش اصلی صفحه", locked: true },
    { key: "story", label: "فعالیت‌های تحقیق و توسعه" },
    { key: "portfolio", label: "چرخه نوآوری و کیفیت" },
    { key: "labs", label: "آزمایشگاه و ارزیابی حسی" },
    { key: "agriculture", label: "تحقیقات کشاورزی" },
    { key: "quality", label: "سیستم کنترل کیفیت" },
    { key: "crossJourney", label: "مسیرهای مرتبط" },
    { key: "nextStep", label: "دعوت به مشاهده محصولات" },
  ],
  production: [
    { key: "hero", label: "بخش اصلی صفحه", locked: true },
    { key: "story", label: "مسیر یک بچ محصول" },
    { key: "factory", label: "کارخانه و زیرساخت" },
    { key: "handoff", label: "رهایش و تحویل محصول" },
    { key: "crossJourney", label: "مسیرهای مرتبط" },
    { key: "nextStep", label: "دعوت به مشاهده محصولات" },
  ],
  distribution: [
    { key: "hero", label: "بخش اصلی صفحه", locked: true },
    { key: "promise", label: "تعهد شرکت پخش" },
    { key: "network", label: "پوشش شبکه" },
    { key: "route", label: "مسیر توزیع تا بازار" },
    { key: "sales", label: "متدولوژی فروش" },
    { key: "capabilities", label: "مزیت‌های رقابتی" },
    { key: "leadership", label: "تیم رهبری" },
    { key: "partnership", label: "دعوت به همکاری تجاری" },
  ],
  contact: [
    { key: "hero", label: "بخش اصلی صفحه", locked: true },
    {
      key: "locations",
      label: "مراکز و نشانی‌ها",
      lists: [{ key: "locations", label: "فهرست مراکز" }],
    },
    {
      key: "channels",
      label: "واحدهای پاسخ‌گو",
      lists: [
        { key: "primary", label: "کارت‌های مسیر ارتباط" },
        { key: "departments", label: "ایمیل واحدها" },
      ],
    },
    { key: "feedback", label: "صدای مشتری" },
  ],
  careers: [
    { key: "hero", label: "بخش اصلی صفحه", locked: true },
    { key: "culture", label: "فرهنگ و زمینه‌های همکاری" },
    { key: "application", label: "فرم ارسال رزومه" },
  ],
};

export function pageSectionDefinitions(slug: string | undefined) {
  return PAGE_SECTIONS[slug as ManagedPageSlug] || [];
}
