export type Locale = "fa" | "en";

/** A bilingual string pair — the single unit of translation across the site.
 *  Pick a side with `useLocale().t(pair)`. */
export type Bi = { fa: string; en: string };

export const DEFAULT_LOCALE: Locale = "fa";
export const dir = (l: Locale): "rtl" | "ltr" => (l === "fa" ? "rtl" : "ltr");

// Bilingual string table. `fa` is the source of truth; `en` mirrors it.
export const STR = {
  nav: {
    home: { fa: "صفحه اصلی", en: "Home" },
    company: { fa: "شرکت بهروز", en: "Company" },
    about: { fa: "درباره بهروز", en: "About" },
    innovation: { fa: "نوآوری و کیفیت", en: "Innovation & quality" },
    operations: { fa: "تولید", en: "Production" },
    distribution: { fa: "پخش بهروز", en: "Behrouz Distribution" },
    products: { fa: "محصولات", en: "Products" },
    contact: { fa: "تماس با ما", en: "Contact" },
    careers: { fa: "همکاری با ما", en: "Careers" },
    tagline: { fa: "صنایع غذایی", en: "Food Industries" },
    brand: { fa: "بهروز", en: "Behrouz" },
    productsMenuTitle: { fa: "دسته‌بندی محصولات", en: "Product categories" },
    productsMenuHint: {
      fa: "یک دسته را انتخاب کنید تا محصولاتش را ببینید",
      en: "Choose a category to see its products",
    },
  },
  hero: {
    eyebrow: { fa: "داستان بهروز را بخوانید", en: "Discover the Behrouz story" },
    title: { fa: "از گذشته تا امروز، با بهروز", en: "From the past to today, with Behrouz" },
    script: { fa: "دوست من سلام", en: "Hello my friend" },
  },
  footer: {
    heading: { fa: "راه‌های ارتباط با بهروز", en: "Ways to reach Behrouz" },
    centralPhone: { fa: "تلفن دفتر مرکزی", en: "Head office phone" },
    factoryPhone: { fa: "تلفن کارخانه", en: "Factory phone" },
    fax: { fa: "دورنگار", en: "Fax" },
    email: { fa: "پست الکترونیک", en: "Email" },
    copyright: {
      fa: "تمام حقوق این وب‌سایت برای صنایع غذایی بهروز محفوظ است.",
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
      fa: "برای دیدن محصولات این دسته، تصویر را انتخاب کنید",
      en: "Select the image to see this category's products",
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
      fa: "بهروز از سال ۱۳۵۶ با یک مسیر روشن پیش آمده است: شناخت ذائقه مردم، توسعه محصول با دانش فنی و کنترل مداوم کیفیت. نتیجه، سبدی از سس‌ها، کنسروها، مرباها و چاشنی‌هایی است که نسل‌های مختلف با آن آشنا هستند.",
      en: "Since 1977, Behrouz has followed a clear path: understanding local tastes, developing products through technical expertise and maintaining consistent quality control. The result is a portfolio of sauces, canned foods, jams and condiments familiar to generations of consumers.",
    },
    story: {
      fa: "صنایع غذایی بهروز نیک در سال ۱۳۵۶ با تمرکز بر نیاز مصرف‌کننده، دانش تخصصی و بهبود مستمر فناوری تولید شکل گرفت. بهروز در دهه‌های بعد سبد خود را از کچاپ و مایونز به کنسرو، مربا، ترشی، خیارشور و آبلیمو گسترش داد و هم‌زمان کنترل کیفیت را در تمام مسیر تولید توسعه داد. حضور مستمر در بازار ایران و بازارهای صادراتی، نتیجه همین مسیر بلندمدت است.",
      en: "Behrouz Nik Food Industries was established in 1977 with a focus on consumer needs, technical expertise and continuous improvement in production technology. In the decades that followed, Behrouz expanded from ketchup and mayonnaise into canned foods, jams, pickles, gherkins and lime juice, while strengthening quality control throughout production. Its continuing presence in Iran and export markets reflects that long-term approach.",
    },
    portfolioTitle: { fa: "محصولات ما", en: "Our portfolio" },
    portfolioSub: {
      fa: "سس، کنسرو، مربا، ترشی، خیارشور و آبلیمو",
      en: "Sauces, canned foods, jams, pickles, gherkins and lime juice",
    },
    qualityTitle: { fa: "از مزرعه تا قفسه", en: "From Farm to Shelf" },
    quality: {
      fa: "در رویکرد «از مزرعه تا قفسه»، کیفیت از انتخاب و ارزیابی مواد اولیه آغاز می‌شود و در تولید، بسته‌بندی، انبارش و توزیع ادامه پیدا می‌کند. بهروز با ترکیب دانش کشاورزی، آزمون‌های آزمایشگاهی و فناوری تولید، هر مرحله را ثبت و کنترل می‌کند تا محصول با مشخصات تأییدشده به بازار برسد.",
      en: "In the farm-to-shelf approach, quality begins with ingredient selection and assessment, then continues through production, packaging, storage and distribution. Behrouz combines agricultural knowledge, laboratory testing and production technology to record and control each stage until the approved product reaches the market.",
    },
    standardsTitle: { fa: "استانداردهای ما", en: "Our standards" },
    standardsSub: {
      fa: "فرایندهای تولید و کنترل کیفیت بهروز بر پایه استانداردهای معتبر مدیریت می‌شوند.",
      en: "Behrouz production and quality-control processes are managed against recognised standards.",
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
      fa: "نظر، انتقاد یا پیشنهاد خود را مستقیم با ما در میان بگذارید",
      en: "Share your comments, concerns or suggestions directly with us",
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
  customerVoice: "۰۲۱-۴۴۵۳۶۰۹۳",
  standards: ["ISO 22000", "ISO 9001", "HACCP"],
};
