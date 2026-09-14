import "server-only";

import config from "@payload-config";
import { connection } from "next/server";
import { cache } from "react";
import { getPayload } from "payload";
import type {
  Media,
  Product,
  ProductSubcategory,
  SiteSetting,
} from "@/src/payload-types";
import type { CatalogCategory, CatalogProduct, CatalogSub } from "./catalog";
import type { Bi } from "./i18n";
import type { CategoryScene, ProductCategory } from "./site";
import { STATIC_CMS_CONTENT, staticCatalogCategory } from "./cms-content";
import type { CMSContent, CMSContact } from "./cms-content";
import type { ManagedPage } from "./cms-content";

const enabled = process.env.CMS_ENABLED === "true";

function relationID(value: number | { id: number }): number {
  return typeof value === "number" ? value : value.id;
}

function mediaURL(value: number | Media | null | undefined, legacy?: string | null) {
  if (value && typeof value === "object" && value.url) return value.url;
  return legacy || undefined;
}

function byID<T extends { id: number }>(docs: T[]) {
  return new Map(docs.map((doc) => [doc.id, doc]));
}

async function cmsPayload() {
  await connection();
  return getPayload({ config });
}

async function loadCategories(): Promise<{
  categories: ProductCategory[];
  scenes: Record<string, CategoryScene>;
}> {
  const payload = await cmsPayload();
  const [faResult, enResult] = await Promise.all([
    payload.find({ collection: "product-categories", locale: "fa", sort: "sortOrder", limit: 100, depth: 1, overrideAccess: false }),
    payload.find({ collection: "product-categories", locale: "en", sort: "sortOrder", limit: 100, depth: 1, overrideAccess: false }),
  ]);
  const enDocs = byID(enResult.docs);
  const scenes: Record<string, CategoryScene> = {};
  const categories = faResult.docs.map((category) => {
    const enCategory = enDocs.get(category.id);
    const bg = mediaURL(category.backgroundMedia, category.legacyBackgroundPath) || "";
    scenes[category.slug] = {
      bg,
      products: (category.heroItems || []).flatMap((item) => {
        const src = mediaURL(item.media, item.legacySrc);
        return src
          ? [{ src, subId: item.subcategoryKey || undefined, d: item.desktop, m: item.mobile }]
          : [];
      }),
    };
    return {
      label: category.title,
      labelEn: enCategory?.title || category.title,
      slug: category.slug,
      color: category.color,
      image: bg,
    };
  });
  return { categories, scenes };
}

function localizedPair(fa: string | null | undefined, en: string | null | undefined, fallback: Bi): Bi {
  return { fa: fa || fallback.fa, en: en || fallback.en };
}

function settingsFromDocs(fa: SiteSetting, en: SiteSetting, categoryData: Awaited<ReturnType<typeof loadCategories>>): CMSContent {
  const fallback = STATIC_CMS_CONTENT;
  const faContacts = fa.footer.contacts || [];
  const contacts: CMSContact[] = faContacts.map((item, index) => ({
    type: item.type,
    label: {
      fa: item.label,
      en: en.footer.contacts?.[index]?.label || item.label,
    },
    value: item.value,
  }));
  const enInterfaceCopy = new Map(
    (en.interfaceCopy || []).map((item) => [item.sourceKey, item]),
  );

  return {
    productCategories: categoryData.categories.length ? categoryData.categories : fallback.productCategories,
    categoryScenes: Object.keys(categoryData.scenes).length ? categoryData.scenes : fallback.categoryScenes,
    brand: {
      name: localizedPair(fa.brand.name, en.brand.name, fallback.brand.name),
      tagline: localizedPair(fa.brand.tagline, en.brand.tagline, fallback.brand.tagline),
      logo: mediaURL(fa.brand.logo, fa.brand.legacyLogoPath) || fallback.brand.logo,
    },
    hero: {
      eyebrow: localizedPair(fa.homeHero.eyebrow, en.homeHero.eyebrow, fallback.hero.eyebrow),
      title: localizedPair(fa.homeHero.title, en.homeHero.title, fallback.hero.title),
      script: localizedPair(fa.homeHero.script, en.homeHero.script, fallback.hero.script),
      link: fa.homeHero.link || fallback.hero.link,
      poster: mediaURL(fa.homeHero.poster, fa.homeHero.legacyPosterPath) || fallback.hero.poster,
      video: mediaURL(fa.homeHero.video, fa.homeHero.legacyVideoPath) || fallback.hero.video,
      uiAt: fa.homeHero.uiAt ?? fallback.hero.uiAt,
    },
    homeAbout: {
      title: localizedPair(fa.homeAbout.title, en.homeAbout.title, fallback.homeAbout.title),
      body: localizedPair(fa.homeAbout.body, en.homeAbout.body, fallback.homeAbout.body),
      cta: localizedPair(fa.homeAbout.cta, en.homeAbout.cta, fallback.homeAbout.cta),
      link: fa.homeAbout.link || fallback.homeAbout.link,
      image: mediaURL(fa.homeAbout.image, fa.homeAbout.legacyImagePath) || fallback.homeAbout.image,
      mobileImage: mediaURL(fa.homeAbout.mobileImage, fa.homeAbout.legacyMobileImagePath) || fallback.homeAbout.mobileImage,
    },
    footer: {
      heading: localizedPair(fa.footer.heading, en.footer.heading, fallback.footer.heading),
      copyright: localizedPair(fa.footer.copyright, en.footer.copyright, fallback.footer.copyright),
      contacts: contacts.length ? contacts : fallback.footer.contacts,
    },
    socials: (fa.socials || []).map((item) => ({ name: item.provider, href: item.href })),
    catalog: {
      label: localizedPair(fa.catalog.label, en.catalog.label, fallback.catalog.label),
      href: mediaURL(fa.catalog.file, fa.catalog.legacyFilePath) || fallback.catalog.href,
    },
    seo: {
      title: localizedPair(fa.seo.title, en.seo.title, fallback.seo.title),
      description: localizedPair(fa.seo.description, en.seo.description, fallback.seo.description),
    },
    copyOverrides: Object.fromEntries(
      (fa.interfaceCopy || []).map((item) => [
        item.sourceKey,
        {
          fa: item.text,
          en: enInterfaceCopy.get(item.sourceKey)?.text || item.text,
        },
      ]),
    ),
  };
}

export const getCMSContent = cache(async (): Promise<CMSContent> => {
  if (!enabled) return STATIC_CMS_CONTENT;
  try {
    const payload = await cmsPayload();
    const [categoryData, fa, en] = await Promise.all([
      loadCategories(),
      payload.findGlobal({ slug: "site-settings", locale: "fa", depth: 1, overrideAccess: false }),
      payload.findGlobal({ slug: "site-settings", locale: "en", depth: 1, overrideAccess: false }),
    ]);
    return settingsFromDocs(fa, en, categoryData);
  } catch (error) {
    console.error("[cms] Failed to load shell content; static content is being used.", error);
    return STATIC_CMS_CONTENT;
  }
});

async function fetchCatalogCategory(slug: string): Promise<CatalogCategory | undefined> {
  const payload = await cmsPayload();
  const [faCategories, enCategories] = await Promise.all([
    payload.find({ collection: "product-categories", where: { slug: { equals: slug } }, locale: "fa", limit: 1, depth: 1, overrideAccess: false }),
    payload.find({ collection: "product-categories", where: { slug: { equals: slug } }, locale: "en", limit: 1, depth: 1, overrideAccess: false }),
  ]);
  const category = faCategories.docs[0];
  if (!category) return undefined;
  const enCategory = enCategories.docs[0];

  const [faSubs, enSubs, faProducts, enProducts] = await Promise.all([
    payload.find({ collection: "product-subcategories", where: { category: { equals: category.id } }, locale: "fa", sort: "sortOrder", limit: 100, depth: 1, overrideAccess: false }),
    payload.find({ collection: "product-subcategories", where: { category: { equals: category.id } }, locale: "en", sort: "sortOrder", limit: 100, depth: 1, overrideAccess: false }),
    payload.find({ collection: "products", where: { category: { equals: category.id } }, locale: "fa", sort: "sortOrder", limit: 500, depth: 1, overrideAccess: false }),
    payload.find({ collection: "products", where: { category: { equals: category.id } }, locale: "en", sort: "sortOrder", limit: 500, depth: 1, overrideAccess: false }),
  ]);
  const enSubByID = byID(enSubs.docs);
  const enProductByID = byID(enProducts.docs);

  const subs: CatalogSub[] = faSubs.docs.map((sub: ProductSubcategory) => {
    const enSub = enSubByID.get(sub.id);
    const products: CatalogProduct[] = faProducts.docs
      .filter((product: Product) => relationID(product.subcategory) === sub.id)
      .map((product: Product) => {
        const enProduct = enProductByID.get(product.id);
        return {
          id: product.stableKey,
          name: localizedPair(product.name, enProduct?.name, { fa: product.name, en: product.name }),
          subtitle: localizedPair(product.subtitle || "", enProduct?.subtitle || "", { fa: "", en: "" }),
          ingredients: localizedPair(product.ingredients || "", enProduct?.ingredients || "", { fa: "", en: "" }),
          feature: product.feature || enProduct?.feature
            ? localizedPair(product.feature, enProduct?.feature, { fa: "", en: "" })
            : undefined,
          image: mediaURL(product.image, product.legacyImagePath),
          hoverVideo: mediaURL(product.hoverVideo, product.legacyHoverVideoPath),
          mediaDisplaySize: product.mediaDisplaySize || "normal",
          variants: (product.variants || []).map((variant, index) => ({
            weight: localizedPair(variant.weight || "", enProduct?.variants?.[index]?.weight || "", { fa: "", en: "" }),
            size: localizedPair(variant.dimensions || "", enProduct?.variants?.[index]?.dimensions || "", { fa: "", en: "" }),
            code: variant.barcode || "",
          })),
        };
      });
    return {
      id: sub.key,
      label: localizedPair(sub.label, enSub?.label, { fa: sub.label, en: sub.label }),
      sectionTitle: localizedPair(sub.sectionTitle, enSub?.sectionTitle, { fa: sub.sectionTitle, en: sub.sectionTitle }),
      color: sub.color,
      products,
    };
  });

  const scene: CategoryScene = {
    bg: mediaURL(category.backgroundMedia, category.legacyBackgroundPath) || "",
    products: (category.heroItems || []).flatMap((item) => {
      const src = mediaURL(item.media, item.legacySrc);
      return src ? [{ src, subId: item.subcategoryKey || undefined, d: item.desktop, m: item.mobile }] : [];
    }),
  };

  return {
    slug: category.slug,
    title: localizedPair(category.title, enCategory?.title, { fa: category.title, en: category.title }),
    bg: scene.bg,
    hasScene: scene.products.length > 0,
    fullWidthEvery: category.fullWidthEvery || undefined,
    scene,
    subs,
  };
}

export const getCatalogCategory = cache(async (slug: string) => {
  if (!enabled) return staticCatalogCategory(slug);
  try {
    return (await fetchCatalogCategory(slug)) || staticCatalogCategory(slug);
  } catch (error) {
    console.error(`[cms] Failed to load category ${slug}; static content is being used.`, error);
    return staticCatalogCategory(slug);
  }
});

export const getManagedPage = cache(async (
  slug: "about" | "innovation" | "production" | "distribution" | "contact" | "careers" | "home",
): Promise<ManagedPage | undefined> => {
  if (!enabled) return undefined;
  try {
    const payload = await cmsPayload();
    const [faResult, enResult] = await Promise.all([
      payload.find({ collection: "pages", where: { slug: { equals: slug } }, locale: "fa", limit: 1, depth: 1, overrideAccess: false }),
      payload.find({ collection: "pages", where: { slug: { equals: slug } }, locale: "en", limit: 1, depth: 1, overrideAccess: false }),
    ]);
    const fa = faResult.docs[0];
    const en = enResult.docs[0];
    if (!fa) return undefined;
    const faSections = fa.sections || [];
    const enSectionsByKey = new Map(
      (en?.sections || []).map((section) => [section.sectionKey, section]),
    );
    const faCopies = faSections.length
      ? faSections.flatMap((section) => section.copyBlocks || [])
      : fa.copyBlocks || [];
    const enCopies = en?.sections?.length
      ? en.sections.flatMap((section) => section.copyBlocks || [])
      : en?.copyBlocks || [];
    const faImages = faSections.length
      ? faSections.flatMap((section) => section.imageOverrides || [])
      : fa.imageOverrides || [];
    const faValues = faSections.length
      ? faSections.flatMap((section) => section.valueOverrides || [])
      : fa.valueOverrides || [];
    const enCopyByKey = new Map(enCopies.map((item) => [item.sourceKey, item]));
    const copyOverrides = Object.fromEntries(
      faCopies.map((item) => {
        const enItem = enCopyByKey.get(item.sourceKey);
        return [
          item.sourceKey,
          {
            fa: item.text,
            en: enItem?.text || item.text,
          },
        ];
      }),
    );
    const imageOverrides = Object.fromEntries(
      faImages.map((item) => [
        item.sourcePath,
        mediaURL(item.replacement, item.sourcePath) || item.sourcePath,
      ]),
    );
    const valueOverrides = Object.fromEntries(
      faValues.map((item) => [item.sourceKey, item.value]),
    );
    const sectionVisibility = Object.fromEntries(
      faSections.map((section) => {
        const enSection = enSectionsByKey.get(section.sectionKey);
        return [section.sectionKey, section.locked || (section.enabled !== false && enSection?.enabled !== false)];
      }),
    );
    const sectionLists = Object.fromEntries(
      faSections.flatMap((section) => {
        const enSection = enSectionsByKey.get(section.sectionKey);
        const enListsByKey = new Map(
          (enSection?.lists || []).map((list) => [list.listKey, list]),
        );
        return (section.lists || []).map((list) => {
          const enList = enListsByKey.get(list.listKey);
          const enItemsByKey = new Map(
            (enList?.items || []).map((item) => [item.itemKey || String(item.id), item]),
          );
          const items = (list.items || []).flatMap((item) => {
            if (item.enabled === false) return [];
            const identity = item.itemKey || String(item.id);
            const enItem = enItemsByKey.get(identity);
            const optionalPair = (faValue?: string | null, enValue?: string | null) =>
              faValue ? localizedPair(faValue, enValue, { fa: faValue, en: faValue }) : undefined;
            return [{
              id: identity,
              enabled: true,
              adminLabel: item.adminLabel || item.title,
              title: localizedPair(item.title, enItem?.title, { fa: item.title, en: item.title }),
              eyebrow: optionalPair(item.eyebrow, enItem?.eyebrow),
              subtitle: optionalPair(item.subtitle, enItem?.subtitle),
              text: optionalPair(item.text, enItem?.text),
              value: item.value || undefined,
              secondaryValue: item.secondaryValue || undefined,
              details: (item.details || []).map((detail) => detail.value),
              latitude: item.latitude ?? undefined,
              longitude: item.longitude ?? undefined,
              color: item.color || undefined,
            }];
          });
          return [`${section.sectionKey}.${list.listKey}`, items] as const;
        });
      }),
    );
    return {
      eyebrow: localizedPair(fa.eyebrow, en?.eyebrow, { fa: fa.eyebrow, en: fa.eyebrow }),
      title: localizedPair(fa.title, en?.title, { fa: fa.title, en: fa.title }),
      lead: localizedPair(fa.lead, en?.lead, { fa: fa.lead, en: fa.lead }),
      mark: fa.mark || "",
      image: mediaURL(fa.heroImage, fa.legacyHeroImage) || "",
      heroLegacyImage: fa.legacyHeroImage || "",
      imageAlt: localizedPair(fa.imageAlt, en?.imageAlt, { fa: fa.imageAlt, en: fa.imageAlt }),
      accent: fa.accent || "#e42e1d",
      seoTitle: localizedPair(fa.seo.metaTitle, en?.seo.metaTitle, { fa: fa.seo.metaTitle, en: fa.seo.metaTitle }),
      seoDescription: localizedPair(fa.seo.metaDescription, en?.seo.metaDescription, { fa: fa.seo.metaDescription, en: fa.seo.metaDescription }),
      copyOverrides,
      imageOverrides,
      valueOverrides,
      sectionVisibility,
      sectionLists,
    };
  } catch (error) {
    console.error(`[cms] Failed to load page ${slug}; static content is being used.`, error);
    return undefined;
  }
});
