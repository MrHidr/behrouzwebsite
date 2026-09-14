import type { CatalogCategory } from "./catalog";
import { CATALOG } from "./catalog";
import { STR } from "./i18n";
import type { Bi } from "./i18n";
import { HERO_LINK, HERO_MEDIA } from "./heroConfig";
import { FULL_CATALOG_DOWNLOAD } from "./catalog-downloads";
import {
  ABOUT_MEDIA,
  BRAND,
  CATEGORY_SCENES,
  PRODUCT_CATEGORIES,
  SOCIALS,
} from "./site";
import type { CategoryScene, ProductCategory } from "./site";

export type CMSContact = {
  type: "phone" | "fax" | "email";
  label: Bi;
  value: string;
};

export type CMSContent = {
  productCategories: ProductCategory[];
  categoryScenes: Record<string, CategoryScene>;
  brand: { name: Bi; tagline: Bi; logo: string };
  hero: {
    eyebrow: Bi;
    title: Bi;
    script: Bi;
    link: string;
    poster: string;
    video: string;
    uiAt: number;
  };
  homeAbout: {
    title: Bi;
    body: Bi;
    cta: Bi;
    link: string;
    image: string;
    mobileImage: string;
  };
  footer: {
    heading: Bi;
    copyright: Bi;
    contacts: CMSContact[];
  };
  socials: { name: string; href: string }[];
  catalog: { label: Bi; href: string };
  seo: { title: Bi; description: Bi };
  copyOverrides: Record<string, Bi>;
};

export type ManagedPage = {
  eyebrow: Bi;
  title: Bi;
  lead: Bi;
  mark: string;
  image: string;
  heroLegacyImage: string;
  imageAlt: Bi;
  accent: string;
  seoTitle: Bi;
  seoDescription: Bi;
  copyOverrides: Record<string, Bi>;
  imageOverrides: Record<string, string>;
  valueOverrides: Record<string, string>;
  sectionVisibility: Record<string, boolean>;
  sectionLists: Record<string, ManagedListItem[]>;
};

export type ManagedListItem = {
  id: string;
  enabled: boolean;
  adminLabel: string;
  title: Bi;
  eyebrow?: Bi;
  subtitle?: Bi;
  text?: Bi;
  value?: string;
  secondaryValue?: string;
  details: string[];
  latitude?: number;
  longitude?: number;
  color?: string;
};

export const STATIC_CMS_CONTENT: CMSContent = {
  productCategories: PRODUCT_CATEGORIES,
  categoryScenes: CATEGORY_SCENES,
  brand: {
    name: { fa: BRAND.name, en: "Behrouz" },
    tagline: STR.nav.tagline,
    logo: BRAND.logo,
  },
  hero: {
    eyebrow: STR.hero.eyebrow,
    title: STR.hero.title,
    script: STR.hero.script,
    link: HERO_LINK,
    poster: HERO_MEDIA.poster,
    video: HERO_MEDIA.introMp4,
    uiAt: HERO_MEDIA.uiAt,
  },
  homeAbout: {
    title: STR.about.title,
    body: STR.about.storyHome,
    cta: STR.about.cta,
    link: "/about",
    image: ABOUT_MEDIA.image,
    mobileImage: ABOUT_MEDIA.imageMobile,
  },
  footer: {
    heading: STR.footer.heading,
    copyright: STR.footer.copyright,
    contacts: [
      { type: "phone", label: STR.footer.centralPhone, value: "021-44536090" },
      { type: "phone", label: STR.footer.factoryPhone, value: "026-34373500" },
      { type: "fax", label: STR.footer.fax, value: "021-44536092" },
      { type: "email", label: STR.footer.email, value: "Info@behrouznik.com" },
    ],
  },
  socials: SOCIALS.map((item) => ({ name: item.name, href: item.href })),
  catalog: {
    label: { fa: "کاتالوگ کامل محصولات", en: "Complete product catalog" },
    href: FULL_CATALOG_DOWNLOAD,
  },
  seo: {
    title: { fa: "صنایع غذایی بهروز | دوست من سلام", en: "Behrouz Food Industries" },
    description: {
      fa: "صنایع غذایی بهروز؛ تولیدکننده سس، کنسرو، ترشی، خیارشور، مربا و آبلیمو از سال ۱۳۵۶.",
      en: "Behrouz Food Industries, producing sauces, canned foods, pickles, jams and lime juice since 1977.",
    },
  },
  copyOverrides: {},
};

export function staticCatalogCategory(slug: string): CatalogCategory | undefined {
  const catalog = CATALOG[slug];
  if (!catalog) return undefined;
  return { ...catalog, scene: CATEGORY_SCENES[slug] };
}
