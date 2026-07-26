// Central content + config for the site.

export type NavItem = {
  /** key into STR.nav for the label (bilingual) */
  key: "home" | "about" | "products" | "contact";
  href: string;
  /** when true this item opens the products mega-dropdown instead of navigating */
  dropdown?: boolean;
};

// Order is right-to-left in the RTL navbar. Home is the rightmost link.
export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "products", href: "/#categories" },
  { key: "contact", href: "/contact" },
];

export type ProductCategory = {
  label: string;
  labelEn: string;
  slug: string;
  /** category identity colour — drives the radial button disc + accents */
  color: string;
  /** optional pre-composited "compressed products" cutout for the button;
   *  falls back to the CATEGORY_SCENES product images when absent */
  buttonImage?: string;
  image?: string;
};

// Right-to-left visual order matches the Figma dropdown.
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { label: "سُس‌ها", labelEn: "Sauces", slug: "sauces", color: "#e42e1d" },
  { label: "کنسرو", labelEn: "Canned", slug: "canned", color: "#e07d1c" },
  { label: "مربا", labelEn: "Jams", slug: "jam", color: "#8e2a6b" },
  { label: "ترشی", labelEn: "Pickles", slug: "pickles", color: "#6f8f1e" },
  { label: "خیارشور", labelEn: "Gherkins", slug: "gherkin", color: "#2f8f57" },
  { label: "آب لیمو", labelEn: "Lime juice", slug: "lime-juice", color: "#d0aa16" },
];

export const BRAND = {
  name: "بهروز",
  tagline: "صنایع غذایی",
  logo: "/media/site/logo.png",
};

// Home showcase-rail categories (visuals come from CATEGORY_SCENES per slug).
export type ShowcaseCategory = {
  fa: string;
  en: string;
  slug: string;
};

// Visual left→right order; SHOWCASE_DEFAULT picks the centered one.
export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  { fa: "آبلیمو‌ها", en: "Lime juices", slug: "lime-juice" },
  { fa: "ترشی‌ها", en: "Pickles", slug: "pickles" },
  { fa: "خیارشور‌ها", en: "Pickled cucumbers", slug: "gherkin" },
  { fa: "کنسرو‌ها", en: "Canned", slug: "canned" },
  { fa: "سس‌ها", en: "Sauces", slug: "sauces" },
  { fa: "مربا‌ها", en: "Jams", slug: "jam" },
];

// Sauces (index 4) shows on load; every category now has real product art.
export const SHOWCASE_DEFAULT = 4;

// Per-category product-page scene: a background + up to 3 overlapping product
// PNGs. Positions are % of a 1512-wide (desktop) / viewport-wide (mobile) stage;
// `bleed` pushes the bottle below the fold (% of its own height); rotation in deg.
export type ScenePos = {
  left: number;
  width: number;
  bleed: number;
  rotate: number;
  z: number;
};
export type SceneProduct = { src: string; d: ScenePos; m: ScenePos };
export type CategoryScene = { bg: string; products: SceneProduct[] };

export const DEFAULT_SCENE_BG = "/media/sauces/splash-bg.webp";

export const CATEGORY_SCENES: Record<string, CategoryScene> = {
  sauces: {
    bg: "/media/sauces/splash-bg.webp",
    products: [
      {
        src: "/media/sauces/standard-mayo.webp",
        d: { left: 33.8, width: 25.6, bleed: 16, rotate: 1.93, z: 10 },
        m: { left: 16, width: 72, bleed: 16, rotate: 1.93, z: 10 },
      },
      {
        src: "/media/sauces/ketchup-scene.webp",
        d: { left: 51.3, width: 20.5, bleed: 14, rotate: 2.94, z: 30 },
        m: { left: 55, width: 62, bleed: 12, rotate: 2.94, z: 30 },
      },
      {
        src: "/media/sauces/french.webp",
        d: { left: 67.5, width: 20.9, bleed: 15, rotate: 15, z: 20 },
        m: { left: 88, width: 64, bleed: 16, rotate: 15, z: 20 },
      },
    ],
  },
  pickles: {
    bg: "/media/pickles/splash-bg.webp",
    products: [
      {
        src: "/media/pickles/bandari.webp",
        d: { left: 33.1, width: 23.4, bleed: 4, rotate: 0, z: 10 },
        m: { left: 18, width: 66, bleed: 6, rotate: 0, z: 10 },
      },
      {
        src: "/media/pickles/generic-placeholder.webp",
        d: { left: 49.9, width: 24.5, bleed: 6, rotate: 0, z: 30 },
        m: { left: 52, width: 66, bleed: 8, rotate: 0, z: 30 },
      },
      {
        src: "/media/pickles/jalapeno.webp",
        d: { left: 66.4, width: 24.1, bleed: 4, rotate: 22, z: 20 },
        m: { left: 86, width: 66, bleed: 6, rotate: 22, z: 20 },
      },
    ],
  },
  jam: {
    bg: "/media/jam/splash-bg.webp",
    products: [
      // left→right: strawberry, carrot, raspberry
      {
        src: "/media/jam/strawberry-jam.webp",
        d: { left: 33.5, width: 20, bleed: 6, rotate: -4, z: 10 },
        m: { left: 20, width: 60, bleed: 8, rotate: -4, z: 10 },
      },
      {
        src: "/media/jam/carrot-jam.webp",
        d: { left: 50, width: 20.5, bleed: 8, rotate: 0, z: 30 },
        m: { left: 52, width: 60, bleed: 10, rotate: 0, z: 30 },
      },
      {
        src: "/media/jam/raspberry-jam.webp",
        d: { left: 66.5, width: 20, bleed: 6, rotate: 4, z: 20 },
        m: { left: 84, width: 60, bleed: 8, rotate: 4, z: 20 },
      },
    ],
  },
  canned: {
    bg: "/media/canned/splash-bg.webp",
    products: [
      {
        src: "/media/canned/beans-chili.webp",
        d: { left: 33, width: 21, bleed: 5, rotate: -3, z: 10 },
        m: { left: 18, width: 62, bleed: 6, rotate: -3, z: 10 },
      },
      {
        src: "/media/canned/corns.webp",
        d: { left: 50, width: 21, bleed: 8, rotate: 0, z: 30 },
        m: { left: 52, width: 62, bleed: 10, rotate: 0, z: 30 },
      },
      {
        src: "/media/canned/lasagna-sauce.webp",
        d: { left: 67, width: 21, bleed: 5, rotate: 3, z: 20 },
        m: { left: 86, width: 62, bleed: 6, rotate: 3, z: 20 },
      },
    ],
  },
  gherkin: {
    bg: "/media/gherkin/splash-bg.webp",
    products: [
      {
        src: "/media/gherkin/grade-1.webp",
        d: { left: 33, width: 24, bleed: 4, rotate: -3, z: 10 },
        m: { left: 18, width: 66, bleed: 5, rotate: -3, z: 10 },
      },
      {
        src: "/media/gherkin/selected.webp",
        d: { left: 50, width: 25, bleed: 6, rotate: 0, z: 30 },
        m: { left: 52, width: 68, bleed: 8, rotate: 0, z: 30 },
      },
      {
        src: "/media/gherkin/special.webp",
        d: { left: 67, width: 24, bleed: 4, rotate: 3, z: 20 },
        m: { left: 86, width: 66, bleed: 5, rotate: 3, z: 20 },
      },
    ],
  },
  "lime-juice": {
    bg: "/media/lime-juice/splash-bg.webp",
    products: [
      {
        src: "/media/lime-juice/lime-large.webp",
        d: { left: 40, width: 16, bleed: 3, rotate: -3, z: 10 },
        m: { left: 32, width: 48, bleed: 4, rotate: -3, z: 10 },
      },
      {
        src: "/media/lime-juice/lime-small.webp",
        d: { left: 58, width: 13, bleed: 0, rotate: 3, z: 30 },
        m: { left: 68, width: 38, bleed: 0, rotate: 3, z: 30 },
      },
    ],
  },
};

// Footer contact strings now live in lib/i18n.ts (STR.footer + CONTACT_INFO).

// Replace `#` with the real profile URLs.
export const SOCIALS = [
  { name: "instagram", href: "#" },
  { name: "linkedin", href: "#" },
  { name: "aparat", href: "#" },
] as const;

// Home about-section media (all copy lives in lib/i18n.ts → STR.about).
export const ABOUT_MEDIA = {
  image: "/media/site/about-factory.webp",
  imageMobile: "/media/site/about-factory-mobile.webp",
};
