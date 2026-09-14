import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const [allCategories, publicCategories, allProducts, publicProducts, allPages, publicPages] = await Promise.all([
  payload.count({ collection: "product-categories", overrideAccess: true }),
  payload.count({ collection: "product-categories", overrideAccess: false }),
  payload.count({ collection: "products", overrideAccess: true }),
  payload.count({ collection: "products", overrideAccess: false }),
  payload.count({ collection: "pages", overrideAccess: true }),
  payload.count({ collection: "pages", overrideAccess: false }),
]);

const result = {
  categories: { all: allCategories.totalDocs, public: publicCategories.totalDocs },
  products: { all: allProducts.totalDocs, public: publicProducts.totalDocs },
  pages: { all: allPages.totalDocs, public: publicPages.totalDocs },
};

const pageDocs = await payload.find({
  collection: "pages",
  locale: "fa",
  depth: 1,
  limit: 10,
  overrideAccess: true,
});
const contact = pageDocs.docs.find((page) => page.slug === "contact");
const careers = pageDocs.docs.find((page) => page.slug === "careers");
const contactLists = new Map(
  (contact?.sections || []).flatMap((section) =>
    (section.lists || []).map((list) => [`${section.sectionKey}.${list.listKey}`, list.items?.length || 0] as const),
  ),
);
const structuredPagesReady = pageDocs.docs.every(
  (page) =>
    (page.sections?.length || 0) > 0 &&
    page.sections?.some((section) => section.sectionKey === "hero" && section.locked && section.enabled),
);
const careersReady = ["hero", "culture", "application"].every((sectionKey) =>
  careers?.sections?.some((section) => section.sectionKey === sectionKey),
);

payload.logger.info(result, "CMS smoke check");

if (
  result.categories.all === 0 ||
  result.categories.public !== result.categories.all ||
  result.products.all === 0 ||
  result.products.public !== result.products.all ||
  result.pages.all !== 7 ||
  result.pages.public !== result.pages.all
  || !structuredPagesReady
  || !careersReady
  || (contactLists.get("locations.locations") || 0) < 1
  || (contactLists.get("channels.primary") || 0) < 1
  || (contactLists.get("channels.departments") || 0) < 1
) {
  process.exit(1);
}

process.exit(0);
