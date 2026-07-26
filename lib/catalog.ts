import { CATEGORY_SCENES } from "./site";
import type { Bi } from "./i18n";

// ---------------------------------------------------------------------------
// Full bilingual product catalog (2026 / ۱۴۰۴ edition). Every human-readable
// field is a `Bi` pair ({ fa, en }) resolved at render time with `t()`, so the
// whole catalog switches language with the site. Drives the generic category
// detail page (components/product/CategoryDetailPage.tsx).
// ---------------------------------------------------------------------------

export type ProductVariant = {
  weight: Bi;
  size: Bi;
  code: string;
};

export type CatalogProduct = {
  id: string;
  /** short display name, e.g. کچاپ تند / Hot Ketchup */
  name: Bi;
  /** full descriptive name, e.g. سس گوجه فرنگی تند / Hot Tomato Ketchup */
  subtitle: Bi;
  ingredients: Bi;
  /** optional callout, e.g. vitamin enrichment */
  feature?: Bi;
  /** representative product image; omitted where no real photo exists yet */
  image?: string;
  /** optional short loop played on hover (CGI splash animation) */
  hoverVideo?: string;
  /** every size/pack — each variant renders as its OWN card on the page */
  variants: ProductVariant[];
};

export type CatalogSub = {
  id: string;
  /** hero nav-button label */
  label: Bi;
  /** divider section heading */
  sectionTitle: Bi;
  /** accent color: button hover bg, underline, chips */
  color: string;
  products: CatalogProduct[];
};

export type CatalogCategory = {
  slug: string;
  title: Bi;
  bg: string;
  /** true when CATEGORY_SCENES[slug] has floating-bottle art for the hero */
  hasScene: boolean;
  /** optional editorial rhythm: every Nth card (1-based) renders alone/full-width
   *  instead of paired up, e.g. 5 -> pairs, pairs, single, pairs, pairs, single... */
  fullWidthEvery?: number;
  subs: CatalogSub[];
};

// ---------- formatting helpers (systemized units + Persian digits) ----------

const faDigits = (s: string) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

/** weight in grams, with an optional pack descriptor: g(240, "شیشه", "jar") */
const g = (n: number, packFa?: string, packEn?: string): Bi => ({
  fa: `${faDigits(String(n))} گرم${packFa ? ` (${packFa})` : ""}`,
  en: `${n} g${packEn ? ` (${packEn})` : ""}`,
});

/** dimensions in cm from an "AxB" or "AxBxC" spec: cm("20x7") */
const cm = (spec: string): Bi => {
  const pretty = spec.replace(/x/g, "×");
  return { fa: `${faDigits(pretty)} سانتی‌متر`, en: `${pretty} cm` };
};

const ALL_PRODUCTS: Bi = { fa: "همه محصولات", en: "All products" };

// ---------------------------------------------------------------------------
// 1. Sauces — ketchups, dips, mayonnaise, salad dressings.
// ---------------------------------------------------------------------------

const KETCHUP_ING: Bi = {
  fa: "رب گوجه فرنگی، شکر، سرکه، گلوکز مایع، ادویه، نمک تصفیه شده، پایدارکننده‌ها.",
  en: "Tomato paste, sugar, vinegar, liquid glucose, spices, refined salt, stabilizers.",
};

const SAUCES: CatalogCategory = {
  slug: "sauces",
  title: { fa: "سس‌ها", en: "Sauces" },
  bg: "/media/sauces/splash-bg.webp",
  hasScene: true,
  subs: [
    {
      id: "ketchup",
      label: { fa: "کچاپ‌ها", en: "Ketchups" },
      sectionTitle: { fa: "کچاپ‌ها", en: "Ketchups" },
      color: "#e42e1d",
      products: [
        {
          id: "tomato-ketchup",
          name: { fa: "کچاپ", en: "Ketchup" },
          subtitle: { fa: "سس گوجه فرنگی", en: "Tomato Ketchup" },
          ingredients: KETCHUP_ING,
          image: "/media/sauces/tomato-ketchup-poster.webp",
          hoverVideo: "/media/sauces/tomato-ketchup.mp4",
          variants: [{ weight: g(395), size: cm("20x7"), code: "6261177002158" }],
        },
        {
          id: "tomato-ketchup-large",
          name: { fa: "کچاپ خانواده", en: "Family Ketchup" },
          subtitle: { fa: "سس گوجه فرنگی", en: "Tomato Ketchup" },
          ingredients: KETCHUP_ING,
          image: "/media/sauces/tomato-ketchup-large-poster.webp",
          hoverVideo: "/media/sauces/tomato-ketchup-large.mp4",
          variants: [{ weight: g(640), size: cm("23x8"), code: "6261177002165" }],
        },
        {
          id: "hot-ketchup",
          name: { fa: "کچاپ تند", en: "Hot Ketchup" },
          subtitle: { fa: "سس گوجه فرنگی تند", en: "Hot Tomato Ketchup" },
          ingredients: KETCHUP_ING,
          image: "/media/sauces/hot-ketchup-poster.webp",
          hoverVideo: "/media/sauces/hot-ketchup.mp4",
          variants: [{ weight: g(395), size: cm("20x7"), code: "6261177002141" }],
        },
        {
          id: "kids-ketchup",
          name: { fa: "نیم‌کچ", en: "Nim-Ketch" },
          subtitle: { fa: "سس گوجه فرنگی کودک", en: "Kids' Tomato Ketchup" },
          feature: {
            fa: "غنی شده با ویتامین‌های A، D3 و زینک",
            en: "Enriched with vitamins A, D3 and zinc",
          },
          ingredients: {
            fa: "رب گوجه فرنگی، فروکتوز، پوره سیب، سرکه، گلوکز مایع، ادویه‌جات.",
            en: "Tomato paste, fructose, apple purée, vinegar, liquid glucose, spices.",
          },
          image: "/media/sauces/kids-ketchup-poster.webp",
          hoverVideo: "/media/sauces/kids-ketchup.mp4",
          variants: [{ weight: g(365), size: cm("18x5"), code: "626117700189" }],
        },
      ],
    },
    {
      id: "dips",
      label: { fa: "دیپ‌ها", en: "Dips" },
      sectionTitle: { fa: "دیپ‌ها", en: "Dips" },
      color: "#8a3b12",
      products: [
        {
          id: "olive-chili",
          name: { fa: "زیتون در چیلی", en: "Olive in Chili" },
          subtitle: { fa: "زیتون در سس چیلی", en: "Olives in Chili Sauce" },
          ingredients: {
            fa: "زیتون، پوره فلفل قرمز، سرکه، نمک تصفیه شده خوراکی، روفن سویا (تراریخته)، شکر، رب گوجه فرنگی، پوره سیر، اسید سیتریک.",
            en: "Olives, red pepper purée, vinegar, refined edible salt, soybean oil, sugar, tomato paste, garlic purée, citric acid.",
          },
          image: "/media/sauces/olive-chili-poster.webp",
          hoverVideo: "/media/sauces/olive-chili.mp4",
          variants: [{ weight: g(550), size: cm("20x7"), code: "6261177000741" }],
        },
        {
          id: "olive-chili-small",
          name: { fa: "زیتون در چیلی", en: "Olive in Chili" },
          subtitle: { fa: "زیتون در سس چیلی (کوچک)", en: "Olives in Chili Sauce (small)" },
          ingredients: {
            fa: "زیتون، پوره فلفل قرمز، سرکه، نمک تصفیه شده خوراکی، روفن سویا (تراریخته)، شکر، رب گوجه فرنگی، پوره سیر، اسید سیتریک.",
            en: "Olives, red pepper purée, vinegar, refined edible salt, soybean oil, sugar, tomato paste, garlic purée, citric acid.",
          },
          image: "/media/sauces/olive-chili-small-poster.webp",
          hoverVideo: "/media/sauces/olive-chili-small.mp4",
          variants: [{ weight: g(220), size: cm("3.3x5"), code: "6261177000741" }],
        },
        {
          id: "chili-sauce",
          name: { fa: "چیلی", en: "Chili" },
          subtitle: { fa: "سس فلفل قرمز", en: "Red Chili Sauce" },
          ingredients: {
            fa: "پوره فلفل قرمز، رب گوجه فرنگی، سرکه، نمک تصفیه شده خوراکی، روغن مایع، ادویه‌جات، آب آشامیدنی.",
            en: "Red pepper purée, tomato paste, vinegar, refined edible salt, liquid oil, spices, drinking water.",
          },
          image: "/media/sauces/chili-sauce-poster.webp",
          hoverVideo: "/media/sauces/chili-sauce.mp4",
          variants: [{ weight: g(220), size: cm("3.3x5"), code: "6261177001939" }],
        },
      ],
    },
    {
      id: "mayo",
      label: { fa: "مایونزها", en: "Mayonnaise" },
      sectionTitle: { fa: "مایونزها", en: "Mayonnaise" },
      color: "#1f3a8f",
      products: [
        {
          id: "mayo-240",
          name: { fa: "مایونز", en: "Mayonnaise" },
          subtitle: { fa: "سس مایونز استاندارد (شیشه)", en: "Classic Mayonnaise (jar)" },
          ingredients: {
            fa: "روغن گیاهی، شکر، سرکه، تخم‌مرغ، خردل، پایدارکننده‌های مجاز.",
            en: "Vegetable oil, sugar, vinegar, eggs, mustard, permitted stabilizers.",
          },
          image: "/media/sauces/mayo-240-poster.webp",
          hoverVideo: "/media/sauces/mayo-240.mp4",
          variants: [{ weight: g(240, "شیشه", "jar"), size: cm("6.5x10.5"), code: "6261177000185" }],
        },
        {
          id: "mayo-330",
          name: { fa: "مایونز فشاری", en: "Squeeze Mayonnaise" },
          subtitle: { fa: "سس مایونز استاندارد (فشاری)", en: "Classic Mayonnaise (squeeze bottle)" },
          ingredients: {
            fa: "روغن گیاهی، شکر، سرکه، تخم‌مرغ، خردل، پایدارکننده‌های مجاز.",
            en: "Vegetable oil, sugar, vinegar, eggs, mustard, permitted stabilizers.",
          },
          image: "/media/sauces/mayo-330-poster.webp",
          hoverVideo: "/media/sauces/mayo-330.mp4",
          variants: [{ weight: g(330, "فشاری", "squeeze"), size: cm("5x8x20"), code: "6261177000192" }],
        },
        {
          id: "mayo-485",
          name: { fa: "مایونز", en: "Mayonnaise" },
          subtitle: { fa: "سس مایونز استاندارد (شیشه)", en: "Classic Mayonnaise (jar)" },
          ingredients: {
            fa: "روغن گیاهی، شکر، سرکه، تخم‌مرغ، خردل، پایدارکننده‌های مجاز.",
            en: "Vegetable oil, sugar, vinegar, eggs, mustard, permitted stabilizers.",
          },
          image: "/media/sauces/mayo-485-poster.webp",
          hoverVideo: "/media/sauces/mayo-485.mp4",
          variants: [{ weight: g(485, "شیشه", "jar"), size: cm("8.5x14.5"), code: "6261177000161" }],
        },
        {
          id: "mayo-900",
          name: { fa: "مایونز خانواده", en: "Family Mayonnaise" },
          subtitle: { fa: "سس مایونز استاندارد (شیشه بزرگ)", en: "Classic Mayonnaise (large jar)" },
          ingredients: {
            fa: "روغن گیاهی، شکر، سرکه، تخم‌مرغ، خردل، پایدارکننده‌های مجاز.",
            en: "Vegetable oil, sugar, vinegar, eggs, mustard, permitted stabilizers.",
          },
          image: "/media/sauces/mayo-900-poster.webp",
          hoverVideo: "/media/sauces/mayo-900.mp4",
          variants: [{ weight: g(900, "شیشه", "jar"), size: cm("14x18"), code: "6261177001984" }],
        },
        {
          id: "mayo-1410",
          name: { fa: "مایونز خانواده بزرگ", en: "Large Family Mayonnaise" },
          subtitle: { fa: "سس مایونز استاندارد (شیشه بزرگ)", en: "Classic Mayonnaise (large jar)" },
          ingredients: {
            fa: "روغن گیاهی، شکر، سرکه، تخم‌مرغ، خردل، پایدارکننده‌های مجاز.",
            en: "Vegetable oil, sugar, vinegar, eggs, mustard, permitted stabilizers.",
          },
          image: "/media/sauces/mayo-1410-poster.webp",
          hoverVideo: "/media/sauces/mayo-1410.mp4",
          variants: [{ weight: g(1410, "شیشه", "jar"), size: cm("11.5x19.5"), code: "6261177001380" }],
        },
        {
          id: "mayo-1800",
          name: { fa: "مایونز گالنی", en: "Gallon Mayonnaise" },
          subtitle: { fa: "سس مایونز استاندارد (گالن پلاستیکی، مصارف تجاری)", en: "Classic Mayonnaise (PET gallon, food-service)" },
          ingredients: {
            fa: "روغن گیاهی، شکر، سرکه، تخم‌مرغ، خردل، پایدارکننده‌های مجاز.",
            en: "Vegetable oil, sugar, vinegar, eggs, mustard, permitted stabilizers.",
          },
          image: "/media/sauces/mayo-1800-poster.webp",
          hoverVideo: "/media/sauces/mayo-1800.mp4",
          variants: [{ weight: g(1800, "گالن پلاستیکی", "PET gallon"), size: cm("9.5x17.5"), code: "6261177000697" }],
        },
      ],
    },
    {
      id: "dressings",
      label: { fa: "سس‌های سالاد", en: "Salad Dressings" },
      sectionTitle: { fa: "سس‌های سالاد و چاشنی‌ها", en: "Salad Dressings & Condiments" },
      color: "#c9782a",
      products: [
        {
          id: "thousand-island",
          name: { fa: "هزار جزیره", en: "Thousand Island" },
          subtitle: { fa: "سس هزار جزیره", en: "Thousand Island Dressing" },
          ingredients: {
            fa: "روغن مایع، سرکه، رب گوجه فرنگی، شکر، خیارشور، نمک تصفیه شده، غلیظ‌کننده، ادویه‌جات، پودر زرده تخم‌مرغ، پودر خردل، سبزیجات معطر، طعم‌دهنده لیمو، اسید سیتریک، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, vinegar, tomato paste, sugar, pickled cucumber, refined salt, thickener, spices, egg-yolk powder, mustard powder, aromatic herbs, lemon flavoring, citric acid, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/thousand-island-poster.webp",
          hoverVideo: "/media/sauces/thousand-island.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "626117710214" }],
        },
        {
          id: "chili-mayo",
          name: { fa: "مایونز چیلی", en: "Chili Mayo" },
          subtitle: {
            fa: "سس مایونز چیلی (تند، چربی کاهش‌یافته)",
            en: "Chili Mayonnaise (hot, reduced fat)",
          },
          ingredients: {
            fa: "روغن مایع، سرکه، پوره فلفل قرمز، شکر، نمک تصفیه شده، پودر زرده تخم‌مرغ، پودر خردل، غلیظ‌کننده، کنسانتره لیمو، اسید سیتریک، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, vinegar, red pepper purée, sugar, refined salt, egg-yolk powder, mustard powder, thickener, lemon concentrate, citric acid, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/chili-mayo-poster.webp",
          hoverVideo: "/media/sauces/chili-mayo.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177001830" }],
        },
        {
          id: "caesar",
          name: { fa: "سزار", en: "Caesar" },
          subtitle: { fa: "سس سزار", en: "Caesar Dressing" },
          ingredients: {
            fa: "روغن مایع، خیار ترش شده، پوره زیتون، شکر، سرکه، غلیظ‌کننده، نمک خوراکی تصفیه شده، امولسیفایر، پودر خردل، پودر سیر، ادویه‌جات، طعم‌دهنده طبیعی مجاز، اسید سیتریک، بتاکاروتن، بنزوات سدیم و سوربات پتاسیم، اسید لاکتیک، آب آشامیدنی.",
            en: "Liquid oil, pickled cucumber, olive purée, sugar, vinegar, thickener, refined edible salt, emulsifier, mustard powder, garlic powder, spices, natural flavoring, citric acid, beta-carotene, sodium benzoate & potassium sorbate, lactic acid, drinking water.",
          },
          image: "/media/sauces/caesar-poster.webp",
          hoverVideo: "/media/sauces/caesar.mp4",
          variants: [{ weight: g(430), size: cm("4x9x21"), code: "6261177002219" }],
        },
        {
          id: "french",
          name: { fa: "فرانسوی", en: "French" },
          subtitle: { fa: "سس فرانسوی", en: "French Dressing" },
          ingredients: {
            fa: "روغن مایع، سرکه، شکر، رب گوجه فرنگی، نمک تصفیه شده، پودر زرده تخم‌مرغ، غلیظ‌کننده، پودر خردل، ادویه‌جات، طعم‌دهنده لیمو، اسید سیتریک، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, vinegar, sugar, tomato paste, refined salt, egg-yolk powder, thickener, mustard powder, spices, lemon flavoring, citric acid, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/french-poster.webp",
          hoverVideo: "/media/sauces/french.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177010177" }],
        },
        {
          id: "tzatziki",
          name: { fa: "سس سالاد خیار و سیر", en: "Tzatziki" },
          subtitle: { fa: "سس سالاد خیار و سیر", en: "Cucumber & Garlic Dressing" },
          ingredients: {
            fa: "روغن مایع، خیارشور، شکر، سرکه، نمک تصفیه شده، غلیظ‌کننده، اسید لاکتیک، سیر، سبزیجات معطر، طعم‌دهنده طبیعی، پودر فلفل سیاه، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, pickled cucumber, sugar, vinegar, refined salt, thickener, lactic acid, garlic, aromatic herbs, natural flavoring, black pepper, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/tzatziki-poster.webp",
          hoverVideo: "/media/sauces/tzatziki.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177000673" }],
        },
        {
          id: "dijonnaise",
          name: { fa: "دیژونیز", en: "Dijonnaise" },
          subtitle: {
            fa: "سس دیژونیز (خردل ملایم، بدون کلسترول)",
            en: "Dijonnaise (mild mustard, cholesterol-free)",
          },
          ingredients: {
            fa: "روغن مایع، شکر، پودر خردل، سرکه، غلیظ‌کننده، نمک تصفیه شده، امولسیفایر، ادویه‌جات، اسید سیتریک، بنزوات سدیم و سوربات پتاسیم، بتاکاروتن، آب آشامیدنی.",
            en: "Liquid oil, sugar, mustard powder, vinegar, thickener, refined salt, emulsifier, spices, citric acid, sodium benzoate & potassium sorbate, beta-carotene, drinking water.",
          },
          image: "/media/sauces/dijonnaise-poster.webp",
          hoverVideo: "/media/sauces/dijonnaise.mp4",
          variants: [{ weight: g(270), size: cm("4x5x21"), code: "6261177000666" }],
        },
        {
          id: "low-fat-mayo",
          name: { fa: "مایونز کم‌چرب", en: "Low-Fat Mayo" },
          subtitle: { fa: "سس مایونز کم چربی", en: "Low-Fat Mayonnaise" },
          ingredients: {
            fa: "روغن مایع، شکر، سرکه، غلیظ‌کننده، نمک تصفیه شده، پودر زرده تخم‌مرغ، کنسانتره لیمو، پودر خردل، اسید سیتریک، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, sugar, vinegar, thickener, refined salt, egg-yolk powder, lemon concentrate, mustard powder, citric acid, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/low-fat-mayo-poster.webp",
          hoverVideo: "/media/sauces/low-fat-mayo.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177091350" }],
        },
        {
          id: "yogonnaise",
          name: { fa: "سس ماست", en: "Yogonnaise" },
          subtitle: { fa: "سس ماست", en: "Yogurt Dressing" },
          ingredients: {
            fa: "ماست پاستوریزه، روغن مایع، شکر، سرکه، غلیظ‌کننده، نمک تصفیه شده، طعم‌دهنده طبیعی، سبزیجات خشک، امولسیفایر، اسید سیتریک، پودر خردل، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Pasteurized yogurt, liquid oil, sugar, vinegar, thickener, refined salt, natural flavoring, dried herbs, emulsifier, citric acid, mustard powder, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/yogonnaise-poster.webp",
          hoverVideo: "/media/sauces/yogonnaise.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177091886" }],
        },
        {
          id: "mayopino",
          name: { fa: "مایوپینو", en: "Mayopino" },
          subtitle: {
            fa: "سس مایوپینو (طعم فلفل هالاپینو)",
            en: "Jalapeño-Flavored Mayonnaise",
          },
          ingredients: {
            fa: "روغن مایع، فلفل هالاپینو، خیارشور، سرکه، شکر، نمک خوراکی تصفیه شده، غلیظ‌کننده، ادویه‌جات، سبزیجات معطر، طعم‌دهنده خوراکی مجاز، اسید لاکتیک، سیر، کلروفیل، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, jalapeño peppers, pickled cucumber, vinegar, sugar, refined edible salt, thickener, spices, aromatic herbs, permitted flavoring, lactic acid, garlic, chlorophyll, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/mayopino-poster.webp",
          hoverVideo: "/media/sauces/mayopino.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177001915" }],
        },
        {
          id: "sandwich",
          name: { fa: "ساندویچ", en: "Sandwich" },
          subtitle: { fa: "سس ساندویچ", en: "Sandwich Dressing" },
          ingredients: {
            fa: "روغن مایع، کلم کالی، هویج، فلفل دلمه‌ای، سرکه، شکر، خیارشور، نمک تصفیه شده، پودر زرده تخم‌مرغ، غلیظ‌کننده، ادویه‌جات، پودر خردل، اسید سیتریک، سبزیجات معطر، طعم‌دهنده لیمو، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, kale, carrot, bell pepper, vinegar, sugar, pickled cucumber, refined salt, egg-yolk powder, thickener, spices, mustard powder, citric acid, aromatic herbs, lemon flavoring, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/sandwich-poster.webp",
          hoverVideo: "/media/sauces/sandwich.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177091374" }],
        },
        {
          id: "vegetable",
          name: { fa: "سبزی معطر", en: "Herb" },
          subtitle: {
            fa: "سس سالاد با سبزی معطر",
            en: "Salad Dressing with Aromatic Herbs",
          },
          ingredients: {
            fa: "روغن مایع، سرکه، شکر، نمک تصفیه شده خوراکی، پودر زرده تخم‌مرغ، سبزیجات معطر، غلیظ‌کننده، اسید سیتریک، پودر خردل، کلروفیل، فلفل قرمز، بنزوات سدیم و سوربات پتاسیم، آب آشامیدنی.",
            en: "Liquid oil, vinegar, sugar, refined edible salt, egg-yolk powder, aromatic herbs, thickener, citric acid, mustard powder, chlorophyll, red pepper, sodium benzoate & potassium sorbate, drinking water.",
          },
          image: "/media/sauces/herb-dressing-poster.webp",
          hoverVideo: "/media/sauces/herb-dressing.mp4",
          variants: [{ weight: g(440), size: cm("4x9x21"), code: "6261177010382" }],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. Canned foods — flat list; crafted with heritage since 1977.
// ---------------------------------------------------------------------------

const CANNED_SIZE = cm("10.2x7.5");

const CANNED: CatalogCategory = {
  slug: "canned",
  title: { fa: "کنسروها", en: "Canned Foods" },
  bg: CATEGORY_SCENES.canned?.bg ?? "/media/canned/splash-bg.webp",
  hasScene: true,
  subs: [
    {
      id: "all",
      label: ALL_PRODUCTS,
      sectionTitle: { fa: "کنسروها", en: "Canned Foods" },
      color: "#a3431f",
      products: [
        {
          id: "mixed-vegetables",
          name: { fa: "مخلوط سبزیجات", en: "Mixed Vegetables" },
          subtitle: { fa: "کنسرو مخلوط سبزیجات", en: "Canned Mixed Vegetables" },
          ingredients: {
            fa: "نخود فرنگی، ذرت، نخود، نمک تصفیه شده.",
            en: "Green peas, corn, chickpeas, refined salt.",
          },
          image: "/media/canned/mixed-vegetables-poster.webp",
          hoverVideo: "/media/canned/mixed-vegetables.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001908" }],
        },
        {
          id: "broad-beans",
          name: { fa: "باقلا پخته", en: "Broad Beans" },
          subtitle: { fa: "کنسرو باقلا پخته", en: "Canned Broad Beans" },
          ingredients: {
            fa: "باقلا پخته شده، شکر، نمک تصفیه شده.",
            en: "Cooked broad beans, sugar, refined salt.",
          },
          image: "/media/canned/broad-beans-poster.webp",
          hoverVideo: "/media/canned/broad-beans.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "626117702066" }],
        },
        {
          id: "lentils",
          name: { fa: "عدسی", en: "Lentils" },
          subtitle: { fa: "کنسرو عدسی", en: "Canned Lentils" },
          ingredients: {
            fa: "عدس پخته شده، نمک تصفیه شده، ادویه‌جات.",
            en: "Cooked lentils, refined salt, spices.",
          },
          image: "/media/canned/lentils-poster.webp",
          hoverVideo: "/media/canned/lentils.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001601" }],
        },
        {
          id: "green-peas",
          name: { fa: "نخود سبز", en: "Green Peas" },
          subtitle: { fa: "کنسرو نخود سبز", en: "Canned Green Peas" },
          ingredients: {
            fa: "نخود سبز، نمک تصفیه شده، آب آشامیدنی.",
            en: "Green peas, refined salt, drinking water.",
          },
          image: "/media/canned/green-peas-poster.webp",
          hoverVideo: "/media/canned/green-peas.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001748" }],
        },
        {
          id: "eggplant",
          name: { fa: "خوراک بادمجان", en: "Eggplant Stew" },
          subtitle: { fa: "کنسرو خوراک بادمجان", en: "Canned Eggplant Stew" },
          ingredients: {
            fa: "بادمجان، کدو سبز، رب گوجه فرنگی، روغن گیاهی، ادویه‌جات، نمک.",
            en: "Eggplant, zucchini, tomato paste, vegetable oil, spices, salt.",
          },
          image: "/media/canned/eggplant-poster.webp",
          hoverVideo: "/media/canned/eggplant.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001779" }],
        },
        {
          id: "beans-tomato",
          name: { fa: "لوبیا چیتی", en: "Pinto Beans" },
          subtitle: {
            fa: "کنسرو لوبیا چیتی در سس گوجه فرنگی",
            en: "Pinto Beans in Tomato Sauce",
          },
          ingredients: {
            fa: "لوبیا چیتی، سس گوجه فرنگی (روغن، شکر، رب گوجه فرنگی، ادویه‌جات، نمک تصفیه شده).",
            en: "Pinto beans, tomato sauce (oil, sugar, tomato paste, spices, refined salt).",
          },
          image: "/media/canned/beans-tomato-poster.webp",
          hoverVideo: "/media/canned/beans-tomato.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001670" }],
        },
        {
          id: "corns",
          name: { fa: "ذرت شیرین", en: "Sweet Corn" },
          subtitle: { fa: "کنسرو ذرت شیرین", en: "Canned Sweet Corn" },
          ingredients: {
            fa: "ذرت، نمک تصفیه شده، آب آشامیدنی.",
            en: "Corn, refined salt, drinking water.",
          },
          image: "/media/canned/corns-poster.webp",
          hoverVideo: "/media/canned/corns.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001688" }],
        },
        {
          id: "beans-chili",
          name: { fa: "لوبیا چیتی تند", en: "Hot Pinto Beans" },
          subtitle: {
            fa: "کنسرو لوبیا چیتی تند (در سس چیلی)",
            en: "Pinto Beans in Chili Sauce",
          },
          ingredients: {
            fa: "لوبیا چیتی در سس گوجه فرنگی تند و چیلی (روغن، شکر، رب گوجه فرنگی، ادویه تند، نمک تصفیه شده).",
            en: "Pinto beans in hot tomato & chili sauce (oil, sugar, tomato paste, hot spices, refined salt).",
          },
          image: "/media/canned/beans-chili-poster.webp",
          hoverVideo: "/media/canned/beans-chili.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001687" }],
        },
        {
          id: "lasagna-sauce",
          name: { fa: "مایه لازانیا", en: "Lasagna Sauce" },
          subtitle: {
            fa: "کنسرو مایه ماکارونی و لازانیا",
            en: "Pasta & Lasagna Sauce",
          },
          ingredients: {
            fa: "رب گوجه فرنگی، قارچ، فلفل دلمه‌ای، روغن گیاهی، ادویه‌جات، نمک.",
            en: "Tomato paste, mushrooms, bell pepper, vegetable oil, spices, salt.",
          },
          image: "/media/canned/lasagna-sauce-poster.webp",
          hoverVideo: "/media/canned/lasagna-sauce.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177002172" }],
        },
        {
          id: "beans-mushroom",
          name: { fa: "لوبیا با قارچ", en: "Beans & Mushroom" },
          subtitle: {
            fa: "کنسرو لوبیا چیتی با قارچ",
            en: "Pinto Beans with Mushrooms",
          },
          ingredients: {
            fa: "لوبیا چیتی، قارچ، سس گوجه فرنگی (روغن، شکر، رب گوجه فرنگی، ادویه‌جات، نمک تصفیه شده).",
            en: "Pinto beans, mushrooms, tomato sauce (oil, sugar, tomato paste, spices, refined salt).",
          },
          image: "/media/canned/beans-mushroom-poster.webp",
          hoverVideo: "/media/canned/beans-mushroom.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001755" }],
        },
        {
          id: "golden-chickpeas",
          name: { fa: "نخود آبگوشتی", en: "Golden Chickpeas" },
          subtitle: { fa: "کنسرو نخود آبگوشتی", en: "Canned Golden Chickpeas" },
          ingredients: {
            fa: "نخود، نمک تصفیه شده، آب آشامیدنی.",
            en: "Chickpeas, refined salt, drinking water.",
          },
          image: "/media/canned/golden-chickpeas-poster.webp",
          hoverVideo: "/media/canned/golden-chickpeas.mp4",
          variants: [{ weight: g(380), size: CANNED_SIZE, code: "6261177001625" }],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 3. Pickles (ترشی)
// ---------------------------------------------------------------------------

const PICKLE_SIZE = cm("9.5x12");

const PICKLES: CatalogCategory = {
  slug: "pickles",
  title: { fa: "ترشی‌ها", en: "Pickles" },
  bg: CATEGORY_SCENES.pickles?.bg ?? "/media/pickles/splash-bg.webp",
  hasScene: true,
  subs: [
    {
      id: "all",
      label: ALL_PRODUCTS,
      sectionTitle: { fa: "ترشی‌ها", en: "Pickles" },
      color: "#394c12",
      products: [
        {
          id: "bandari",
          name: { fa: "بندری", en: "Bandari" },
          subtitle: { fa: "ترشی بندری", en: "Bandari Pickle" },
          ingredients: {
            fa: "بادمجان، پوره فلفل قرمز، سیر، سرکه، نمک، ادویه‌جات.",
            en: "Eggplant, red pepper purée, garlic, vinegar, salt, spices.",
          },
          image: "/media/pickles/bandari-poster.webp",
          hoverVideo: "/media/pickles/bandari.mp4",
          variants: [{ weight: g(550), size: PICKLE_SIZE, code: "6261177000284" }],
        },
        {
          id: "chopped-mix",
          name: { fa: "هفت‌بیجار", en: "Haft-Bijar" },
          subtitle: {
            fa: "ترشی هفت بیجار (مخلوط خردشده)",
            en: "Chopped Mixed Pickle (Haft-Bijar)",
          },
          ingredients: {
            fa: "مخلوط سبزیجات (بادمجان، سیر، خیار و غیره)، سرکه، نمک، ادویه‌جات.",
            en: "Mixed vegetables (eggplant, garlic, cucumber and more), vinegar, salt, spices.",
          },
          image: "/media/pickles/chopped-mix-poster.webp",
          hoverVideo: "/media/pickles/chopped-mix.mp4",
          variants: [{ weight: g(550), size: PICKLE_SIZE, code: "6261177000291" }],
        },
        {
          id: "liteh",
          name: { fa: "لیته", en: "Liteh" },
          subtitle: { fa: "ترشی لیته (مخلوط چرخ‌شده)", en: "Liteh Ground Mixed Pickle" },
          ingredients: {
            fa: "بادمجان، سیر، خیار، هویج، سرکه، نمک، ادویه‌جات.",
            en: "Eggplant, garlic, cucumber, carrot, vinegar, salt, spices.",
          },
          image: "/media/pickles/liteh-poster.webp",
          hoverVideo: "/media/pickles/liteh.mp4",
          variants: [{ weight: g(550), size: PICKLE_SIZE, code: "6261177000260" }],
        },
        {
          id: "jalapeno",
          name: { fa: "هالاپینو", en: "Jalapeño" },
          subtitle: {
            fa: "ترشی فلفل هالاپینو (اسلایش‌شده)",
            en: "Sliced Jalapeño Peppers",
          },
          ingredients: {
            fa: "فلفل هالاپینو، سرکه، ادویه‌جات، نمک.",
            en: "Jalapeño peppers, vinegar, spices, salt.",
          },
          image: "/media/pickles/jalapeno-poster.webp",
          hoverVideo: "/media/pickles/jalapeno.mp4",
          variants: [
            { weight: g(550), size: PICKLE_SIZE, code: "6261177002134" },
            { weight: g(1460), size: PICKLE_SIZE, code: "6261177002134" },
          ],
        },
        {
          id: "jalapeno-small",
          name: { fa: "هالاپینو", en: "Jalapeño" },
          subtitle: {
            fa: "ترشی فلفل هالاپینو (اسلایش‌شده، کوچک)",
            en: "Sliced Jalapeño Peppers (small)",
          },
          ingredients: {
            fa: "فلفل هالاپینو، سرکه، ادویه‌جات، نمک.",
            en: "Jalapeño peppers, vinegar, spices, salt.",
          },
          image: "/media/pickles/jalapeno-small-poster.webp",
          hoverVideo: "/media/pickles/jalapeno-small.mp4",
          variants: [{ weight: g(235), size: cm("7.5x8"), code: "6261177001991" }],
        },
        {
          id: "mix",
          name: { fa: "مخلوط", en: "Mixed" },
          subtitle: { fa: "ترشی مخلوط", en: "Mixed Vegetable Pickle" },
          ingredients: {
            fa: "مخلوط سبزیجات کلم، بادمجان، سیر، خیار و…، سرکه، نمک، ادویه‌جات.",
            en: "Mixed vegetables (cabbage, eggplant, garlic, cucumber and more), vinegar, salt, spices.",
          },
          image: "/media/pickles/mix-poster.webp",
          hoverVideo: "/media/pickles/mix.mp4",
          variants: [{ weight: g(550), size: PICKLE_SIZE, code: "6261177000277" }],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 4. Pickled cucumbers (خیارشور)
// ---------------------------------------------------------------------------

const GHERKIN_SIZE = cm("8.5x15");
const GHERKIN_ING: Bi = {
  fa: "خیار، سرکه، شوید، نمک.",
  en: "Cucumbers, vinegar, dill, salt.",
};

const GHERKIN: CatalogCategory = {
  slug: "gherkin",
  title: { fa: "خیارشورها", en: "Pickled Cucumbers" },
  bg: CATEGORY_SCENES.gherkin?.bg ?? "/media/gherkin/splash-bg.webp",
  hasScene: true,
  subs: [
    {
      id: "all",
      label: ALL_PRODUCTS,
      sectionTitle: { fa: "خیارشورها", en: "Pickled Cucumbers" },
      color: "#2f6b3a",
      products: [
        {
          id: "special",
          name: { fa: "ممتاز", en: "Premium" },
          subtitle: { fa: "کنسرو خیارشور ممتاز", en: "Premium Pickled Cucumbers" },
          ingredients: GHERKIN_ING,
          image: "/media/gherkin/special-poster.webp",
          hoverVideo: "/media/gherkin/special.mp4",
          variants: [{ weight: g(660), size: GHERKIN_SIZE, code: "6261177091329" }],
        },
        {
          id: "super-selected",
          name: { fa: "سوپرویژه", en: "Super Selected" },
          subtitle: {
            fa: "کنسرو خیارشور سوپرویژه",
            en: "Super-Selected Pickled Cucumbers",
          },
          ingredients: {
            fa: "خیار قلمی گلچین‌شده، سرکه، شوید، نمک.",
            en: "Hand-picked baby cucumbers, vinegar, dill, salt.",
          },
          image: "/media/gherkin/super-selected-poster.webp",
          hoverVideo: "/media/gherkin/super-selected.mp4",
          variants: [{ weight: g(660), size: GHERKIN_SIZE, code: "6261177002165" }],
        },
        {
          id: "grade-1",
          name: { fa: "درجه یک", en: "No. 1" },
          subtitle: { fa: "کنسرو خیارشور درجه یک", en: "Grade-One Pickled Cucumbers" },
          ingredients: GHERKIN_ING,
          image: "/media/gherkin/grade-1-poster.webp",
          hoverVideo: "/media/gherkin/grade-1.mp4",
          variants: [{ weight: g(660), size: GHERKIN_SIZE, code: "6261177002141" }],
        },
        {
          id: "selected",
          name: { fa: "ویژه", en: "Selected" },
          subtitle: { fa: "کنسرو خیارشور ویژه", en: "Selected Pickled Cucumbers" },
          ingredients: GHERKIN_ING,
          image: "/media/gherkin/selected-poster.webp",
          hoverVideo: "/media/gherkin/selected.mp4",
          variants: [{ weight: g(660), size: GHERKIN_SIZE, code: "626117700189" }],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 5. Lime juices (آبلیمو)
// ---------------------------------------------------------------------------

const LIME_ING: Bi = {
  fa: "آبلیموی طبیعی حاصل از لیموهای تازه.",
  en: "Natural lime juice pressed from fresh limes.",
};

const LIME_JUICE: CatalogCategory = {
  slug: "lime-juice",
  title: { fa: "آبلیموها", en: "Lime Juices" },
  bg: CATEGORY_SCENES["lime-juice"]?.bg ?? "/media/lime-juice/splash-bg.webp",
  hasScene: true,
  subs: [
    {
      id: "all",
      label: ALL_PRODUCTS,
      sectionTitle: { fa: "آبلیموها", en: "Lime Juices" },
      color: "#7a9a1c",
      products: [
        {
          id: "lime-large",
          name: { fa: "بزرگ", en: "Large" },
          subtitle: { fa: "آبلیمو پاستوریزه بزرگ", en: "Pasteurized Lime Juice — Large" },
          ingredients: LIME_ING,
          image: "/media/lime-juice/lime-large-poster.webp",
          hoverVideo: "/media/lime-juice/lime-large.mp4",
          variants: [
            {
              weight: { fa: "۵۱۰ گرم (۵۱۰ میلی‌لیتر)", en: "510 g (510 ml)" },
              size: cm("26.5x5.7x6"),
              code: "6261177001137",
            },
          ],
        },
        {
          id: "lime-small",
          name: { fa: "کوچک", en: "Small" },
          subtitle: { fa: "آبلیمو پاستوریزه کوچک", en: "Pasteurized Lime Juice — Small" },
          ingredients: LIME_ING,
          image: "/media/lime-juice/lime-small-poster.webp",
          hoverVideo: "/media/lime-juice/lime-small.mp4",
          variants: [
            {
              weight: { fa: "۲۵۰ گرم (۲۵۰ میلی‌لیتر)", en: "250 g (250 ml)" },
              size: cm("4.5x4.5x21"),
              code: "6261177000635",
            },
          ],
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 6. Jams (مربا) — codes/dimensions to be confirmed.
// ---------------------------------------------------------------------------

const JAM_SIZE = cm("7x12");
const HOMEMADE: Bi = { fa: "طعم خانگی", en: "Home-made taste" };

const JAM: CatalogCategory = {
  slug: "jam",
  title: { fa: "مرباها", en: "Jams" },
  bg: "/media/jam/splash-bg.webp",
  hasScene: true,
  // Editorial rhythm: two pairs, then one full-width card, repeating.
  fullWidthEvery: 5,
  subs: [
    {
      id: "all",
      label: ALL_PRODUCTS,
      sectionTitle: { fa: "مرباها", en: "Jams" },
      color: "#c0223a",
      products: [
        {
          id: "strawberry-jam",
          name: { fa: "توت فرنگی", en: "Strawberry" },
          subtitle: { fa: "مربای توت فرنگی", en: "Strawberry Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "توت فرنگی، شکر، پکتین، اسید سیتریک.",
            en: "Strawberries, sugar, pectin, citric acid.",
          },
          image: "/media/jam/strawberry-jam-poster.webp",
          hoverVideo: "/media/jam/strawberry-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "carrot-jam",
          name: { fa: "هویج", en: "Carrot" },
          subtitle: { fa: "مربای هویج", en: "Carrot Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "هویج، شکر، پکتین، اسید سیتریک.",
            en: "Carrots, sugar, pectin, citric acid.",
          },
          image: "/media/jam/carrot-jam-poster.webp",
          hoverVideo: "/media/jam/carrot-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "raspberry-jam",
          name: { fa: "تمشک", en: "Raspberry" },
          subtitle: { fa: "مربای تمشک", en: "Raspberry Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "تمشک، شکر، پکتین، اسید سیتریک.",
            en: "Raspberries, sugar, pectin, citric acid.",
          },
          image: "/media/jam/raspberry-jam-poster.webp",
          hoverVideo: "/media/jam/raspberry-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "sour-cherry-jam",
          name: { fa: "آلبالو", en: "Sour Cherry" },
          subtitle: { fa: "مربای آلبالو", en: "Sour Cherry Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "آلبالو، شکر، پکتین، اسید سیتریک.",
            en: "Sour cherries, sugar, pectin, citric acid.",
          },
          image: "/media/jam/sour-cherry-jam-poster.webp",
          hoverVideo: "/media/jam/sour-cherry-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "citron-jam",
          name: { fa: "بالنگ", en: "Citron" },
          subtitle: { fa: "مربای بالنگ", en: "Citron Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "بالنگ، شکر، پکتین، اسید سیتریک.",
            en: "Citron, sugar, pectin, citric acid.",
          },
          image: "/media/jam/citron-jam-poster.webp",
          hoverVideo: "/media/jam/citron-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "quince-jam",
          name: { fa: "به", en: "Quince" },
          subtitle: { fa: "مربای به", en: "Quince Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "به، شکر، پکتین، اسید سیتریک.",
            en: "Quince, sugar, pectin, citric acid.",
          },
          image: "/media/jam/quince-jam-poster.webp",
          hoverVideo: "/media/jam/quince-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "bitter-orange-jam",
          name: { fa: "بهارنارنج", en: "Bitter Orange Blossom" },
          subtitle: { fa: "مربای بهارنارنج", en: "Bitter Orange Blossom Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "بهارنارنج، شکر، پکتین، اسید سیتریک.",
            en: "Bitter orange blossom, sugar, pectin, citric acid.",
          },
          image: "/media/jam/bitter-orange-jam-poster.webp",
          hoverVideo: "/media/jam/bitter-orange-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "rose-jam",
          name: { fa: "گل محمدی", en: "Rose" },
          subtitle: { fa: "مربای گل محمدی", en: "Rose Petal Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "گلبرگ محمدی، شکر، پکتین، اسید سیتریک.",
            en: "Rose petals, sugar, pectin, citric acid.",
          },
          image: "/media/jam/rose-jam-poster.webp",
          hoverVideo: "/media/jam/rose-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "cherry-jam",
          name: { fa: "گیلاس", en: "Cherry" },
          subtitle: { fa: "مربای گیلاس", en: "Cherry Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "گیلاس، شکر، پکتین، اسید سیتریک.",
            en: "Cherries, sugar, pectin, citric acid.",
          },
          image: "/media/jam/cherry-jam-poster.webp",
          hoverVideo: "/media/jam/cherry-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "fig-jam",
          name: { fa: "انجیر", en: "Fig" },
          subtitle: { fa: "مربای انجیر", en: "Fig Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "انجیر، شکر، پکتین، اسید سیتریک.",
            en: "Figs, sugar, pectin, citric acid.",
          },
          image: "/media/jam/fig-jam-poster.webp",
          hoverVideo: "/media/jam/fig-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "apple-cinnamon-jam",
          name: { fa: "سیب و دارچین", en: "Apple & Cinnamon" },
          subtitle: { fa: "مربای سیب و دارچین", en: "Apple & Cinnamon Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "سیب، دارچین، شکر، پکتین، اسید سیتریک.",
            en: "Apples, cinnamon, sugar, pectin, citric acid.",
          },
          image: "/media/jam/apple-cinnamon-jam-poster.webp",
          hoverVideo: "/media/jam/apple-cinnamon-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
        {
          id: "mulberry-jam",
          name: { fa: "شاتوت", en: "Mulberry" },
          subtitle: { fa: "مربای شاتوت", en: "Mulberry Jam" },
          feature: HOMEMADE,
          ingredients: {
            fa: "شاتوت، شکر، پکتین، اسید سیتریک.",
            en: "Mulberries, sugar, pectin, citric acid.",
          },
          image: "/media/jam/mulberry-jam-poster.webp",
          hoverVideo: "/media/jam/mulberry-jam.mp4",
          variants: [{ weight: g(295), size: JAM_SIZE, code: "—" }],
        },
      ],
    },
  ],
};

export const CATALOG: Record<string, CatalogCategory> = {
  sauces: SAUCES,
  canned: CANNED,
  pickles: PICKLES,
  gherkin: GHERKIN,
  "lime-juice": LIME_JUICE,
  jam: JAM,
};
