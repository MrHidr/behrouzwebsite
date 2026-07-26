export type Locale = "fa" | "en";

/** A bilingual string pair — the single unit of translation across the site.
 *  Pick a side with `useLocale().t(pair)`. */
export type Bi = { fa: string; en: string };

export const DEFAULT_LOCALE: Locale = "fa";
export const dir = (l: Locale): "rtl" | "ltr" => (l === "fa" ? "rtl" : "ltr");

// Bilingual string table. `fa` is the source of truth; `en` mirrors it.
export const STR = {
  nav: {
    home: { fa: "صفحه‌ اصلی", en: "Home" },
    about: { fa: "درباره بهروز", en: "About" },
    products: { fa: "محصولات", en: "Products" },
    contact: { fa: "تماس با ما", en: "Contact" },
    tagline: { fa: "صنایع غذایی", en: "Food Industries" },
    brand: { fa: "بهروز", en: "Behrouz" },
    productsMenuTitle: { fa: "دسته بندی محصولات", en: "Product categories" },
    productsMenuHint: {
      fa: "برای مشاهده محصولات هر دسته روی آن کلیک کنید",
      en: "Click a category to see its products",
    },
  },
  hero: {
    eyebrow: { fa: "آشنایی بیشتر با بهروز", en: "Know more about Behrouz" },
    title: { fa: "از گذشته تا امروز، با بهروز", en: "From the past to today, with Behrouz" },
    script: { fa: "دوست من سلام", en: "Hello my friend" },
  },
  footer: {
    heading: { fa: "با بهروز در ارتباط باشید", en: "Stay in touch with Behrouz" },
    centralPhone: { fa: "تلفن دفتر مرکزی", en: "Head office phone" },
    factoryPhone: { fa: "تلفن کارخانه", en: "Factory phone" },
    fax: { fa: "دورنگار", en: "Fax" },
    email: { fa: "پست الکترونیک", en: "Email" },
    copyright: {
      fa: "کلیه حقوق این وب سایت متعلق به صنایع غذایی بهروز می‌باشد.",
      en: "All rights reserved — Behrouz Food Industries.",
    },
  },
  categories: {
    fa: "دسته‌بندی محصولات",
    en: "Product categories",
  },
  // Shared product-page vocabulary — one source for every category screen.
  common: {
    ingredients: { fa: "ترکیبات", en: "Ingredients" },
    code: { fa: "کد کالا", en: "Product code" },
    weight: { fa: "وزن خالص", en: "Net weight" },
    dimensions: { fa: "ابعاد", en: "Dimensions" },
    imageSoon: { fa: "تصویر به‌زودی", en: "Image coming soon" },
    productsSoon: {
      fa: "تصاویر محصولات این دسته به‌زودی",
      en: "Product visuals for this category are coming soon",
    },
    comingSoon: { fa: "به‌زودی", en: "Coming soon" },
    clickImageHint: {
      fa: "برای مشاهده محصولات هر دسته روی تصویر کلیک کنید",
      en: "Click a category image to explore its products",
    },
    sampleImage: { fa: "تصویر نمونه", en: "Sample image" },
    allProducts: { fa: "همه محصولات", en: "All products" },
    exploreOtherCategories: { fa: "سایر دسته‌بندی‌های محصولات", en: "Explore other categories" },
  },
  about: {
    kicker: { fa: "درباره ما", en: "About us" },
    title: { fa: "درباره بهروز", en: "About Behrouz" },
    tagline: { fa: "دوست من سلام", en: "Hello my friend" },
    since: { fa: "از سال ۱۳۵۶", en: "Since 1977" },
    storyTitle: { fa: "داستان ما", en: "Our story" },
    // Condensed 2-sentence summary used on the HOME page about-section (the full
    // `story` below stays on the /about page).
    storyHome: {
      fa: "صنایع غذایی بهروز نیک از سال ۱۳۵۶، با تکیه بر تلاش، دانش تخصصی و فناوری‌های نوین، طعمی پایدار و کیفیتی سلامت‌محور را به سفره‌ی خانواده‌ها آورده است؛ از کچاپ و مایونز تا مربا و آبلیمو، با استانداردهای جهانی.",
      en: "Since 1977, Behrouz Nik Food Industries has brought lasting taste and health-focused quality to families' tables — from ketchup and mayonnaise to jams and lemon juice, all made to international standards.",
    },
    story: {
      fa: "صنایع غذایی بهروز نیک از سال ۱۹۷۷ با چشم‌اندازی روشن پایه‌گذاری شد: پاسداری از رضایت مصرف‌کننده از طریق تلاش، دانش تخصصی و به‌کارگیری مداوم فناوری‌های نوین صنایع غذایی. بهروز در طول دهه‌ها سبد متنوعی شامل کچاپ، سس مایونز، مربا و آبلیمو را با بالاترین استانداردهای کیفیت بین‌المللی تولید کرده و علاوه بر سراسر ایران، در بازارهای منطقه و بخش‌هایی از اروپا توزیع می‌کند. بهروز به‌عنوان یکی از نخستین تولیدکنندگان ایرانی کچاپ و مایونز در منطقه، با ارائه‌ی طعم پایدار، اعتماد و کیفیتِ سلامت‌محور، انتخابی ماندگار برای خانواده‌ها بوده است.",
      en: "Behrouz Nik Food Industries has been crafting trusted Iranian food products since 1977, built on a clear vision: protect consumer satisfaction through hard work, expert know-how, and constant adoption of modern food technologies. Over the decades, Behrouz has expanded a diverse portfolio including ketchup, mayonnaise, jams, and lemon juice, produced to high international quality standards and distributed across Iran as well as regional markets and parts of Europe. As one of the earliest Iranian producers of ketchup and mayonnaise in the region, Behrouz has earned long-term preference by delivering consistent taste, reliability, and health-focused quality.",
    },
    portfolioTitle: { fa: "محصولات ما", en: "Our portfolio" },
    portfolioSub: {
      fa: "کچاپ، سس مایونز، مربا و آبلیمو — با استانداردهای بین‌المللی",
      en: "Ketchup, mayonnaise, jams and lemon juice — to international standards",
    },
    qualityTitle: { fa: "از مزرعه تا قفسه", en: "From Farm to Shelf" },
    quality: {
      fa: "در قلب برند بهروز، برنامه‌ی کیفیت «از مزرعه تا قفسه» قرار دارد: مواد اولیه از مزارع منتخب تأمین می‌شود، در شرایطی بهداشتی و ملایم فرآوری و بسته‌بندی می‌گردد و با کامیون‌های یخچال‌دار برای حفظ تازگی و ایمنی توزیع می‌شود. بهروز با ترکیب دانش ایرانی و بین‌المللی، کشاورزان را در تولید گوجه‌فرنگی، میوه و سبزیجاتِ باکیفیت‌تر یاری می‌کند و همزمان با فناوری‌های نوین تولید و بسته‌بندی بهبود می‌یابد. این کنترلِ سرتاسری، ماندگاریِ بالا را بدون اتکا به مواد نگهدارنده ممکن می‌سازد.",
      en: "At the heart of the brand is Behrouz's \"From Farm to Shelf\" quality program: ingredients are sourced from selected farms, processed and packaged under gentle, hygienic conditions, and distributed in temperature-controlled trucks to protect freshness and safety. Behrouz combines Iranian and international expertise to support farmers in producing higher-quality tomatoes, fruits, and vegetables while improving through modern production and packaging technologies. This end-to-end control enables long shelf life without relying on preservatives.",
    },
    standardsTitle: { fa: "استانداردهای ما", en: "Our standards" },
    standardsSub: {
      fa: "سیستم‌های بهروز با استانداردهای شناخته‌شده‌ی بین‌المللی پشتیبانی می‌شوند.",
      en: "Behrouz's systems are supported by internationally recognized standards.",
    },
    cta: { fa: "درباره بهروز بیشتر بدانید", en: "Learn more about Behrouz" },
  },
  contact: {
    kicker: { fa: "ارتباط با ما", en: "Get in touch" },
    title: { fa: "تماس با ما", en: "Contact us" },
    tagline: { fa: "دوست من سلام", en: "Hello my friend" },
    headOffice: { fa: "دفتر مرکزی", en: "Head office" },
    factory: { fa: "کارخانه", en: "Factory" },
    postalCode: { fa: "کد پستی", en: "Postal code" },
    phones: { fa: "تلفن", en: "Phone" },
    fax: { fa: "دورنگار", en: "Fax" },
    address: { fa: "آدرس", en: "Address" },
    voiceTitle: { fa: "صدای مشتری", en: "Customer voice" },
    voiceSub: {
      fa: "نظرات، انتقادات و پیشنهادات خود را با ما در میان بگذارید",
      en: "Share your comments, feedback and suggestions with us",
    },
    emailsTitle: { fa: "پست الکترونیک واحدها", en: "Department emails" },
    headOfficeAddress: {
      fa: "تهران، کیلومتر ۸ بزرگراه لشگری (غرب به شرق)، بعد از بلوار دکتر عبیدی، بین رامک خودرو و تهران دیزل",
      en: "Tehran, 8th km of Lashgari Highway (west to east), after Dr. Obeidi Blvd., between Ramak Khodro and Tehran Diesel",
    },
    factoryAddress: {
      fa: "تهران، کیلومتر ۱۵ جاده قدیم کرج-قزوین، شهرک اقدسیه، بعد از پل زیرگذر راه‌آهن، خیابان بهروز، کارخانه صنایع غذایی بهروز",
      en: "Tehran, 15th km of old Karaj–Qazvin road, Aghdasieh town, after the railway underpass, Behrouz St., Behrouz Food Industries factory",
    },
  },
} as const;

// department emails (shared, order preserved)
export const DEPARTMENT_EMAILS: { fa: string; en: string; email: string }[] = [
  { fa: "صدای مشتری", en: "Customer voice", email: "Voc@Behrouznik.com" },
  { fa: "امور مربوط به تارنما", en: "Website affairs", email: "Admin@Behrouznik.com" },
  { fa: "ارتباط عمومی با شرکت", en: "General inquiries", email: "Info@Behrouznik.com" },
  { fa: "مدیریت تحقیقات", en: "Research management", email: "RD@Behrouznik.com" },
  { fa: "مدیریت فناوری اطلاعات", en: "IT management", email: "IT@Behrouznik.com" },
  { fa: "مدیریت برنامه‌ریزی", en: "Planning management", email: "Planning@Behrouznik.com" },
  { fa: "واحد فروش شهرستان‌ها", en: "Regional sales", email: "Planning@Behrouznik.com" },
  { fa: "واحد فنی", en: "Technical unit", email: "TU@Behrouznik.com" },
];

export const CONTACT_INFO = {
  headOffice: {
    postal: "1389798711",
    phones: ["۰۲۱-۴۴۵۳۶۰۹۰ الی ۹"],
    fax: "۰۲۱-۴۴۵۳۶۰۹۲",
  },
  factory: {
    postal: "3366139553",
    phones: ["۰۲۶-۳۴۳۷۳۵۰۰ الی ۱۶", "۰۲۶-۳۴۳۷۳۹۰۳ الی ۱۱۰"],
  },
  customerVoice: "۴۴۵۳۶۰۹۳",
  standards: ["ISO 22000", "ISO 9001", "HACCP"],
};
