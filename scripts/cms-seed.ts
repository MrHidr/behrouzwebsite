import config from "@payload-config";
import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import ts from "typescript";
import { CATALOG } from "../lib/catalog";
import { CONTACT_LOCATIONS } from "../lib/contact-locations";
import { CONTACT_INFO, DEPARTMENT_EMAILS, STR } from "../lib/i18n";
import { managedCopyKey, managedValueKey } from "../lib/managed-content";
import {
  ABOUT_MEDIA,
  BRAND,
  CATEGORY_SCENES,
  PRODUCT_CATEGORIES,
  SOCIALS,
} from "../lib/site";
import { FULL_CATALOG_DOWNLOAD } from "../lib/catalog-downloads";
import { HERO_LINK, HERO_MEDIA } from "../lib/heroConfig";
import { pageSectionDefinitions, type ManagedPageSlug } from "../src/cms/page-sections";

type ID = number;
type Locale = "fa" | "en";

const payload = await getPayload({ config });

const pageSeeds = [
  {
    slug: "home" as const,
    eyebrow: STR.hero.eyebrow,
    title: STR.hero.title,
    lead: STR.about.storyHome,
    mark: "۱۳۵۶",
    image: HERO_MEDIA.poster,
    imageAlt: { fa: "محصولات صنایع غذایی بهروز", en: "Behrouz Food Industries products" },
    accent: "#efaa32",
  },
  {
    slug: "about" as const,
    eyebrow: { fa: "صنایع غذایی بهروز نیک · از ۱۳۵۶", en: "Behrouz Nik Food Industries · Since 1977" },
    title: { fa: "از ۱۳۵۶،\nهمراه طعم‌های آشنا", en: "Since 1977.\nPart of familiar tastes." },
    lead: {
      fa: "بهروز فقط یک سبد محصول نیست؛ پژوهش، تولید، کنترل کیفیت و پخش در کنار هم کار می‌کنند تا طعمی آشنا و کیفیتی قابل اتکا به سفره مردم برسد.",
      en: "Behrouz is more than a product portfolio. Research, production, quality control and distribution work together to bring familiar taste and dependable quality to everyday tables.",
    },
    mark: "۱۳۵۶",
    image: "/media/site/BehrouzAbout.webp",
    imageAlt: { fa: "کارخانه صنایع غذایی بهروز", en: "Behrouz Food Industries factory" },
    accent: "#f3383a",
  },
  {
    slug: "innovation" as const,
    eyebrow: { fa: "تحقیق و توسعه؛ از بازار تا محصول", en: "R&D, from market to product" },
    title: { fa: "نوآوری در خدمت\nکیفیت پایدار", en: "Innovation for\nlasting quality." },
    lead: {
      fa: "واحد تحقیق و توسعه بهروز با رصد بازار، همکاری با تحقیقات بازار و تکیه بر دانش روز، نیاز مصرف‌کننده را به فرمولاسیون‌های سلامت‌محور و بهبودهای قابل سنجش تبدیل می‌کند.",
      en: "Behrouz R&D turns consumer needs into health-focused formulations and measurable improvements through market monitoring and current science.",
    },
    mark: "R&D",
    image: "/media/site/fromFarm.jpg",
    imageAlt: { fa: "مواد اولیه کشاورزی تازه", en: "Fresh agricultural ingredients" },
    accent: "#5f8f62",
  },
  {
    slug: "production" as const,
    eyebrow: { fa: "از ماده اولیه تا رهایش", en: "From raw material to release" },
    title: { fa: "تولید دقیق،\nکیفیت قابل پیگیری", en: "Precise production.\nTraceable quality." },
    lead: {
      fa: "هر محصول در یک مسیر شفاف حرکت می‌کند: پذیرش مواد اولیه، تولید، آزمون و رهایش؛ مسیری که کیفیت را در هر ایستگاه قابل پیگیری می‌کند.",
      en: "Every product follows a visible path: raw-material approval, production, testing and release, with quality traceable at every station.",
    },
    mark: "۲۰K",
    image: "/media/site/behrouzFactory.jpg",
    imageAlt: { fa: "محوطه کارخانه بهروز", en: "Behrouz factory complex" },
    accent: "#e8a438",
  },
  {
    slug: "distribution" as const,
    eyebrow: { fa: "شرکت پخش بهروز", en: "Behrouz Distribution Company" },
    title: { fa: "شریک توسعه برندها در بازار ایران", en: "Your growth partner in Iran's FMCG market" },
    lead: {
      fa: "شبکه‌ای یکپارچه از فروش، توزیع مویرگی، لجستیک و داده؛ برای رساندن برند از برنامه رشد تا حضور مؤثر روی قفسه.",
      en: "An integrated sales, last-mile distribution, logistics and data network—taking brands from a growth plan to meaningful shelf presence.",
    },
    mark: "۳۸",
    image: "/media/site/distribution-fleet.webp",
    imageAlt: { fa: "ناوگان پخش بهروز", en: "Behrouz distribution fleet" },
    accent: "#efaa32",
  },
  {
    slug: "contact" as const,
    eyebrow: { fa: "ارتباط با بهروز", en: "Contact Behrouz" },
    title: { fa: "موضوع شما،\nمسیر ارتباط روشن.", en: "Your enquiry.\nThe right route." },
    lead: {
      fa: "برای پیگیری محصول، خرید عمده، همکاری تجاری یا امور پژوهشی، مسیر مرتبط را انتخاب کنید.",
      en: "Choose the relevant route for product support, wholesale, business partnerships or research.",
    },
    mark: "☎",
    image: "/media/site/BehrouzAbout.webp",
    imageAlt: { fa: "مجموعه صنایع غذایی بهروز", en: "Behrouz Food Industries complex" },
    accent: "#f3383a",
  },
  {
    slug: "careers" as const,
    eyebrow: { fa: "همکاری با بهروز", en: "Careers at Behrouz" },
    title: { fa: "کنار هم،\nچیزهای ماندگار می‌سازیم.", en: "Together,\nwe build what lasts." },
    lead: {
      fa: "اگر دوست دارید در یک مجموعه باسابقه و رو به رشد اثر بگذارید، رزومه‌تان را برای ما بفرستید.",
      en: "If you would like to make an impact in an established, growing company, send us your résumé.",
    },
    mark: "+",
    image: "/media/site/careers-hero.webp",
    imageAlt: { fa: "همکاری تیم‌های تخصصی صنایع غذایی بهروز", en: "Specialist teams collaborating at Behrouz Food Industries" },
    accent: "#e42e1d",
  },
];

type CopySeed = { sourceKey: string; adminLabel: string; sectionKey: string; text: { fa: string; en: string } };
type ImageSeed = { adminLabel: string; sectionKey: string; sourcePath: string };
type ValueSeed = { sourceKey: string; adminLabel: string; sectionKey: string; value: string };

function interfaceCopySeeds() {
  const copies = new Map<string, CopySeed>();
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    if (
      "fa" in value && typeof value.fa === "string" &&
      "en" in value && typeof value.en === "string"
    ) {
      const text = { fa: value.fa, en: value.en };
      const sourceKey = managedCopyKey(text);
      copies.set(sourceKey, {
        sourceKey,
        adminLabel: shortLabel(text.fa),
        sectionKey: "interface",
        text,
      });
      return;
    }
    Object.values(value).forEach(visit);
  };
  visit(STR);
  return [...copies.values()];
}

const siteInterfaceCopy = interfaceCopySeeds();

const contentSourceFiles: Record<(typeof pageSeeds)[number]["slug"], string[]> = {
  home: ["components/company/HomeValueChain.tsx"],
  about: ["components/company/CorporatePages.tsx"],
  innovation: ["components/company/CorporatePages.tsx"],
  production: ["components/company/CorporatePages.tsx"],
  distribution: ["components/distribution/DistributionPage.tsx", "components/distribution/IranAccessMap.tsx"],
  contact: ["components/contact/ContactView.tsx", "lib/contact-locations.ts"],
  careers: ["components/careers/CareersPage.tsx"],
};

function literalText(node: ts.Node | undefined) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : undefined;
}

function propertyName(node: ts.PropertyName) {
  return ts.isIdentifier(node) || ts.isStringLiteral(node) ? node.text : undefined;
}

function shortLabel(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 100);
}

function enclosingName(node: ts.Node, guard: (candidate: ts.Node) => boolean) {
  let current: ts.Node | undefined = node;
  while (current) {
    if (guard(current)) {
      if (ts.isVariableDeclaration(current) && ts.isIdentifier(current.name)) return current.name.text;
      if (ts.isFunctionDeclaration(current) && current.name) return current.name.text;
    }
    current = current.parent;
  }
}

function enclosingSectionID(node: ts.Node) {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isJsxElement(current) && current.openingElement.tagName.getText() === "section") {
      const id = current.openingElement.attributes.properties.find(
        (property): property is ts.JsxAttribute =>
          ts.isJsxAttribute(property) && property.name.getText() === "id",
      );
      if (id?.initializer && ts.isStringLiteral(id.initializer)) return id.initializer.text;
    }
    current = current.parent;
  }
}

function contentSectionKey(relativePath: string, slug: ManagedPageSlug, node: ts.Node) {
  const sectionID = enclosingSectionID(node);
  if (sectionID) return sectionID;

  const variable = enclosingName(node, ts.isVariableDeclaration);
  const fn = enclosingName(node, ts.isFunctionDeclaration);

  if (relativePath.endsWith("HomeValueChain.tsx")) return "routes";
  if (relativePath.endsWith("IranAccessMap.tsx")) return "network";
  if (relativePath.endsWith("contact-locations.ts")) return "locations";
  if (relativePath.endsWith("ContactView.tsx")) return fn === "ContactViewBody" ? "hero" : "channels";

  if (relativePath.endsWith("CorporatePages.tsx")) {
    const byVariable: Record<string, string> = {
      history: "story",
      values: "values",
      stats: "scale",
      researchSteps: "story",
      innovationQualityLoop: "portfolio",
      qualities: "quality",
      stages: fn === "FactoryFlow" ? "factory" : "story",
      labels: "labs",
      pages: "crossJourney",
    };
    if (variable && byVariable[variable]) return byVariable[variable];
    if (fn === "CorporateHero") return "hero";
    if (fn === "CrossJourney") return "crossJourney";
    if (fn === "SensoryRadar") return "labs";
    if (fn === "CorporatePageBody") return "nextStep";
    return slug === "production" ? "story" : slug === "innovation" ? "story" : "story";
  }

  if (relativePath.endsWith("DistributionPage.tsx")) {
    if (variable === "network" || fn === "NetworkFootprint") return "network";
    if (variable === "advantages" || fn === "Capabilities") return "capabilities";
    const byFunction: Record<string, string> = {
      DistributionHero: "hero",
      DistributionPromise: "promise",
      RouteToMarket: "route",
      SalesMethod: "sales",
      Leadership: "leadership",
      PartnershipCta: "partnership",
    };
    return (fn && byFunction[fn]) || "promise";
  }

  return "hero";
}

function extractPageContent(slug: (typeof pageSeeds)[number]["slug"]) {
  const copies = new Map<string, CopySeed>();
  const images = new Map<string, ImageSeed>();

  for (const relativePath of contentSourceFiles[slug]) {
    const absolutePath = path.resolve(process.cwd(), relativePath);
    const source = fs.readFileSync(absolutePath, "utf8");
    const file = ts.createSourceFile(absolutePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const belongsToPage = (node: ts.Node) => {
      if (relativePath !== "components/company/CorporatePages.tsx") return true;
      const line = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
      if ((line >= 71 && line < 182) || line >= 469) return true;
      if (slug === "about") return line >= 182 && line < 303;
      if (slug === "innovation") return line >= 303 && line < 418;
      if (slug === "production") return line >= 418 && line < 469;
      return false;
    };

    const visit = (node: ts.Node) => {
      if (belongsToPage(node) && ts.isObjectLiteralExpression(node)) {
        const values = new Map<string, string>();
        for (const property of node.properties) {
          if (!ts.isPropertyAssignment(property)) continue;
          const name = propertyName(property.name);
          const value = literalText(property.initializer);
          if (name && value !== undefined) values.set(name, value);
        }
        const fa = values.get("fa");
        const en = values.get("en");
        if (fa && en) {
          const sourceKey = managedCopyKey({ fa, en });
          copies.set(sourceKey, { sourceKey, adminLabel: shortLabel(fa), sectionKey: contentSectionKey(relativePath, slug, node), text: { fa, en } });
        }
      }

      if (belongsToPage(node) && ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "pick") {
        const fa = literalText(node.arguments[0]);
        const en = literalText(node.arguments[1]);
        if (fa && en) {
          const sourceKey = managedCopyKey({ fa, en });
          copies.set(sourceKey, { sourceKey, adminLabel: shortLabel(fa), sectionKey: contentSectionKey(relativePath, slug, node), text: { fa, en } });
        }
      }

      if (belongsToPage(node) && ts.isStringLiteral(node) && node.text.startsWith("/media/")) {
        images.set(node.text, {
          adminLabel: `تصویر ${path.basename(node.text)}`,
          sectionKey: contentSectionKey(relativePath, slug, node),
          sourcePath: node.text,
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
  }

  if (slug === "contact") {
    for (const department of DEPARTMENT_EMAILS) {
      const sourceKey = managedCopyKey({ fa: department.fa, en: department.en });
      copies.set(sourceKey, {
        sourceKey,
        adminLabel: department.fa,
        sectionKey: "channels",
        text: { fa: department.fa, en: department.en },
      });
    }
  }

  return { copies: [...copies.values()], images: [...images.values()] };
}

function contactValueSeeds(): ValueSeed[] {
  const values = new Set<string>([
    CONTACT_INFO.customerVoice,
    ...CONTACT_INFO.headOffice.phones,
    CONTACT_INFO.headOffice.fax,
    CONTACT_INFO.headOffice.postal,
    ...CONTACT_INFO.factory.phones,
    CONTACT_INFO.factory.postal,
    ...DEPARTMENT_EMAILS.map((item) => item.email),
    "Voc@Behrouznik.com",
    "Planning@Behrouznik.com",
    "RD@Behrouznik.com",
    "Info@Behrouznik.com",
  ]);
  for (const location of CONTACT_LOCATIONS) {
    values.add(location.postal);
    location.phones.forEach((phone) => values.add(phone));
    if (location.fax) values.add(location.fax);
  }
  return [...values].filter(Boolean).map((value) => ({
    sourceKey: managedValueKey(value),
    adminLabel: value.includes("@") ? `ایمیل ${value}` : `شماره یا کد ${value}`,
    sectionKey: value === CONTACT_INFO.customerVoice || value === "Voc@Behrouznik.com"
      ? "feedback"
      : value.includes("@")
        ? "channels"
        : "locations",
    value,
  }));
}

const PRIMARY_CONTACT_CHANNELS = [
  { key: "customer-voice", title: { fa: "صدای مشتری", en: "Customer voice" }, text: { fa: "پیگیری محصول، شکایت یا پیشنهاد", en: "Product support, complaints and feedback" }, value: "Voc@Behrouznik.com", color: "#f3383a" },
  { key: "regional-sales", title: { fa: "فروش شهرستان‌ها", en: "Regional sales" }, text: { fa: "خرید عمده و شبکه فروش", en: "Wholesale and regional sales" }, value: "Planning@Behrouznik.com", color: "#e8a438" },
  { key: "research", title: { fa: "تحقیق و توسعه", en: "Research & development" }, text: { fa: "پیشنهاد پژوهشی و همکاری علمی", en: "Research and scientific collaboration" }, value: "RD@Behrouznik.com", color: "#6ba678" },
  { key: "general", title: { fa: "ارتباط عمومی", en: "General enquiries" }, text: { fa: "رسانه و امور سازمانی", en: "Media and corporate matters" }, value: "Info@Behrouznik.com", color: "#5e8db8" },
];

const contactListCopyKeys = new Set(
  [
    ...CONTACT_LOCATIONS.flatMap((location) => [location.title, location.city, location.kind, location.address]),
    ...PRIMARY_CONTACT_CHANNELS.flatMap((channel) => [channel.title, channel.text]),
    ...DEPARTMENT_EMAILS.map((department) => ({ fa: department.fa, en: department.en })),
  ].map(managedCopyKey),
);

function defaultListItems(
  slug: ManagedPageSlug,
  sectionKey: string,
  listKey: string,
  locale: Locale,
): Array<Record<string, unknown>> {
  if (slug !== "contact") return [];

  if (sectionKey === "locations" && listKey === "locations") {
    return CONTACT_LOCATIONS.map((location) => ({
      itemKey: location.id,
      adminLabel: location.title.fa,
      enabled: true,
      title: location.title[locale],
      eyebrow: location.city[locale],
      subtitle: location.kind[locale],
      text: location.address[locale],
      value: location.postal,
      secondaryValue: location.fax,
      details: location.phones.map((phone) => ({ value: phone })),
      latitude: location.coordinates?.[0],
      longitude: location.coordinates?.[1],
    }));
  }

  if (sectionKey === "channels" && listKey === "primary") {
    return PRIMARY_CONTACT_CHANNELS.map((item) => ({
      itemKey: item.key,
      adminLabel: item.title.fa,
      enabled: true,
      title: item.title[locale],
      text: item.text[locale],
      value: item.value,
      color: item.color,
    }));
  }

  if (sectionKey === "channels" && listKey === "departments") {
    return DEPARTMENT_EMAILS.map((department, index) => ({
      itemKey: `department-${index + 1}`,
      adminLabel: department.fa,
      enabled: true,
      title: department[locale],
      value: department.email,
    }));
  }

  return [];
}

async function findOne(collection: "product-categories" | "product-subcategories" | "products" | "pages", field: string, value: string) {
  const result = await payload.find({
    collection,
    where: { [field]: { equals: value } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  return result.docs[0];
}

async function seedCategories() {
  const categoryIDs = new Map<string, ID>();
  const subcategoryIDs = new Map<string, ID>();

  for (const [sortOrder, item] of PRODUCT_CATEGORIES.entries()) {
    const catalog = CATALOG[item.slug];
    const scene = CATEGORY_SCENES[item.slug];
    const existing = await findOne("product-categories", "slug", item.slug);
    const faData = {
      title: item.label,
      slug: item.slug,
      color: item.color,
      sortOrder,
      fullWidthEvery: catalog?.fullWidthEvery,
      legacyBackgroundPath: scene?.bg || catalog?.bg,
      heroItems: scene?.products.map((product) => ({
        legacySrc: product.src,
        subcategoryKey: product.subId,
        desktop: product.d,
        mobile: product.m,
      })),
      _status: "published" as const,
    };

    const saved = existing
      ? await payload.update({ collection: "product-categories", id: existing.id, data: faData, locale: "fa", overrideAccess: true })
      : await payload.create({ collection: "product-categories", data: faData, locale: "fa", overrideAccess: true });

    await payload.update({
      collection: "product-categories",
      id: saved.id,
      locale: "en",
      overrideAccess: true,
      data: { title: item.labelEn, _status: "published" },
    });
    categoryIDs.set(item.slug, saved.id);

    for (const [subSortOrder, sub] of (catalog?.subs || []).entries()) {
      const compoundKey = `${item.slug}:${sub.id}`;
      const matches = await payload.find({
        collection: "product-subcategories",
        where: {
          and: [
            { key: { equals: sub.id } },
            { category: { equals: saved.id } },
          ],
        },
        limit: 1,
        depth: 0,
        draft: true,
        overrideAccess: true,
      });
      const faSub = {
        label: sub.label.fa,
        sectionTitle: sub.sectionTitle.fa,
        key: sub.id,
        category: saved.id,
        color: sub.color,
        sortOrder: subSortOrder,
        _status: "published" as const,
      };
      const savedSub = matches.docs[0]
        ? await payload.update({ collection: "product-subcategories", id: matches.docs[0].id, data: faSub, locale: "fa", overrideAccess: true })
        : await payload.create({ collection: "product-subcategories", data: faSub, locale: "fa", overrideAccess: true });
      await payload.update({
        collection: "product-subcategories",
        id: savedSub.id,
        locale: "en",
        overrideAccess: true,
        data: { label: sub.label.en, sectionTitle: sub.sectionTitle.en, _status: "published" },
      });
      subcategoryIDs.set(compoundKey, savedSub.id);
    }
  }

  return { categoryIDs, subcategoryIDs };
}

async function seedProducts(categoryIDs: Map<string, ID>, subcategoryIDs: Map<string, ID>) {
  for (const category of Object.values(CATALOG)) {
    const categoryID = categoryIDs.get(category.slug);
    if (!categoryID) throw new Error(`Missing category ${category.slug}`);

    for (const sub of category.subs) {
      const subcategoryID = subcategoryIDs.get(`${category.slug}:${sub.id}`);
      if (!subcategoryID) throw new Error(`Missing subcategory ${category.slug}:${sub.id}`);

      for (const [sortOrder, product] of sub.products.entries()) {
        const existing = await findOne("products", "stableKey", product.id);
        const faData = {
          stableKey: product.id,
          name: product.name.fa,
          subtitle: product.subtitle.fa,
          ingredients: product.ingredients.fa,
          feature: product.feature?.fa,
          category: categoryID,
          subcategory: subcategoryID,
          legacyImagePath: product.image,
          legacyHoverVideoPath: product.hoverVideo,
          mediaDisplaySize: product.mediaDisplaySize || "normal",
          variants: product.variants.map((variant) => ({
            weight: variant.weight.fa,
            dimensions: variant.size.fa,
            barcode: variant.code,
          })),
          sortOrder,
          _status: "published" as const,
        };
        const saved = existing
          ? await payload.update({ collection: "products", id: existing.id, data: faData, locale: "fa", overrideAccess: true })
          : await payload.create({ collection: "products", data: faData, locale: "fa", overrideAccess: true });

        await payload.update({
          collection: "products",
          id: saved.id,
          locale: "en",
          overrideAccess: true,
          data: {
            name: product.name.en,
            subtitle: product.subtitle.en,
            ingredients: product.ingredients.en,
            feature: product.feature?.en,
            variants: product.variants.map((variant, index) => ({
              id: saved.variants?.[index]?.id,
              weight: variant.weight.en,
              dimensions: variant.size.en,
              barcode: variant.code,
            })),
            _status: "published",
          },
        });
      }
    }
  }
}

async function seedPages(only?: ReadonlySet<ManagedPageSlug>) {
  for (const page of pageSeeds) {
    if (only && !only.has(page.slug)) continue;
    const existing = await findOne("pages", "slug", page.slug);
    const existingEn = existing
      ? await payload.findByID({
          collection: "pages",
          id: existing.id,
          locale: "en",
          depth: 0,
          draft: true,
          overrideAccess: true,
        })
      : undefined;
    const extracted = extractPageContent(page.slug);
    const heroCopyKeys = new Set([
      managedCopyKey(page.eyebrow),
      managedCopyKey(page.title),
      managedCopyKey(page.lead),
      managedCopyKey(page.imageAlt),
    ]);
    const copySeeds = extracted.copies.filter((item) =>
      !heroCopyKeys.has(item.sourceKey) &&
      !(page.slug === "contact" && contactListCopyKeys.has(item.sourceKey)),
    );
    const imageSeeds = extracted.images.filter((item) => item.sourcePath !== page.image);
    const valueSeeds = page.slug === "contact"
      ? contactValueSeeds().filter((item) => item.sectionKey === "feedback")
      : [];

    const copyRows = (
      locale: Locale,
      existingRows: Array<Record<string, unknown>> | null | undefined,
      rowIDs?: Map<string, string>,
      seeds = copySeeds,
    ) => {
      const current = new Map(
        (existingRows || []).map((item) => [String(item.sourceKey), item]),
      );
      return seeds.map((item) => {
        const previous = current.get(item.sourceKey);
        return {
          id: rowIDs?.get(item.sourceKey) || (typeof previous?.id === "string" ? previous.id : undefined),
          sourceKey: item.sourceKey,
          adminLabel: item.adminLabel,
          text: typeof previous?.text === "string" && previous.text
            ? previous.text
            : item.text[locale],
        };
      });
    };
    const imageRows = (
      existingRows: Array<Record<string, unknown>> | null | undefined,
      seeds = imageSeeds,
    ) => {
      const current = new Map(
        (existingRows || []).map((item) => [String(item.sourcePath), item]),
      );
      return seeds.map((item) => {
        const previous = current.get(item.sourcePath);
        const previousReplacement = previous?.replacement;
        const replacement = typeof previousReplacement === "number"
          ? previousReplacement
          : previousReplacement && typeof previousReplacement === "object" &&
              "id" in previousReplacement && typeof previousReplacement.id === "number"
            ? previousReplacement.id
            : undefined;
        return {
          id: typeof previous?.id === "string" ? previous.id : undefined,
          adminLabel: item.adminLabel,
          sourcePath: item.sourcePath,
          replacement,
        };
      });
    };
    const fixedValueRows = (
      existingRows: Array<Record<string, unknown>> | null | undefined,
      seeds = valueSeeds,
    ) => {
      const current = new Map(
        (existingRows || []).map((item) => [String(item.sourceKey), item]),
      );
      return seeds.map((item) => {
        const previous = current.get(item.sourceKey);
        return {
          id: typeof previous?.id === "string" ? previous.id : undefined,
          sourceKey: item.sourceKey,
          adminLabel: item.adminLabel,
          value: typeof previous?.value === "string" && previous.value
            ? previous.value
            : item.value,
        };
      });
    };

    const createData = (
      locale: Locale,
      existingDoc?: Record<string, unknown>,
      copyRowIDs?: Map<string, string>,
      structureDoc?: Record<string, unknown>,
    ) => ({
      slug: page.slug,
      eyebrow: page.eyebrow[locale],
      title: page.title[locale],
      lead: page.lead[locale],
      legacyHeroImage: page.image,
      imageAlt: page.imageAlt[locale],
      mark: page.mark,
      accent: page.accent,
      seo: {
        metaTitle: page.title[locale].replace("\n", " "),
        metaDescription: page.lead[locale],
      },
      sections: pageSectionDefinitions(page.slug).map((definition) => {
        const localizedSections = Array.isArray(existingDoc?.sections)
          ? existingDoc.sections as Array<Record<string, unknown>>
          : [];
        const structureSections = Array.isArray(structureDoc?.sections)
          ? structureDoc.sections as Array<Record<string, unknown>>
          : localizedSections;
        const localizedSection = localizedSections.find((item) => item.sectionKey === definition.key);
        const structureSection = structureSections.find((item) => item.sectionKey === definition.key);
        const localizedCopies = (localizedSection?.copyBlocks || existingDoc?.copyBlocks) as Array<Record<string, unknown>> | undefined;
        const structureCopies = (structureSection?.copyBlocks || structureDoc?.copyBlocks) as Array<Record<string, unknown>> | undefined;
        const sectionCopyIDs = new Map<string, string>(
          (structureCopies || []).flatMap((item) =>
            typeof item.id === "string" ? [[String(item.sourceKey), item.id] as const] : [],
          ),
        );
        const localizedLists = Array.isArray(localizedSection?.lists)
          ? localizedSection.lists as Array<Record<string, unknown>>
          : [];
        const structureLists = Array.isArray(structureSection?.lists)
          ? structureSection.lists as Array<Record<string, unknown>>
          : [];
        const lists = (definition.lists || []).map((listDefinition) => {
          const localizedList = localizedLists.find((item) => item.listKey === listDefinition.key);
          const structureList = structureLists.find((item) => item.listKey === listDefinition.key);
          const structureItems = Array.isArray(structureList?.items)
            ? structureList.items as Array<Record<string, unknown>>
            : [];
          const structureByKey = new Map(
            structureItems.map((item) => [String(item.itemKey || ""), item]),
          );
          const defaultItems = defaultListItems(page.slug, definition.key, listDefinition.key, locale);
          const defaultByKey = new Map(
            defaultItems.map((item) => [String(item.itemKey || ""), item]),
          );
          const localizedItems = localizedList && Array.isArray(localizedList.items)
            ? localizedList.items as Array<Record<string, unknown>>
            : undefined;
          const items = (localizedItems || defaultItems).map((localizedItem) => {
                const defaultItem = defaultByKey.get(String(localizedItem.itemKey || ""));
                // Payload returns missing localized sub-fields as null. Keep an
                // intentional empty string, but repair legacy nulls from the
                // canonical seed so location metadata is not replaced by the
                // item title in the frontend fallback.
                const localizedOrDefault = (current: unknown, fallback: unknown) =>
                  typeof current === "string"
                    ? current
                    : typeof fallback === "string"
                      ? fallback
                      : undefined;
                const item: Record<string, unknown> = { ...defaultItem, ...localizedItem };
                const itemEyebrow = localizedOrDefault(localizedItem.eyebrow, defaultItem?.eyebrow);
                const itemSubtitle = localizedOrDefault(localizedItem.subtitle, defaultItem?.subtitle);
                const itemText = localizedOrDefault(localizedItem.text, defaultItem?.text);
                const itemDetails = Array.isArray(localizedItem.details) && localizedItem.details.length > 0
                  ? localizedItem.details
                  : defaultItem?.details;
                const structureItem = structureByKey.get(String(item.itemKey || ""));
                const structureDetails = Array.isArray(structureItem?.details)
                  ? structureItem.details as Array<Record<string, unknown>>
                  : [];
                return {
                  ...item,
                  id: typeof structureItem?.id === "string" ? structureItem.id : undefined,
                  eyebrow: itemEyebrow,
                  subtitle: itemSubtitle,
                  text: itemText,
                  title: typeof item.title === "string" && item.title
                    ? item.title
                    : typeof defaultItem?.title === "string" && defaultItem.title
                      ? defaultItem.title
                      : String(item.adminLabel || (locale === "fa" ? "آیتم جدید" : "New item")),
                  details: Array.isArray(itemDetails)
                    ? itemDetails.flatMap((detail, index) => {
                        const value = detail && typeof detail === "object" && "value" in detail
                          ? detail.value
                          : undefined;
                        return typeof value === "string" && value
                          ? [{
                              value,
                              id: typeof structureDetails[index]?.id === "string" ? structureDetails[index].id : undefined,
                            }]
                          : [];
                      })
                    : undefined,
                };
              });
          return {
            id: typeof structureList?.id === "string" ? structureList.id : undefined,
            listKey: listDefinition.key,
            adminLabel: listDefinition.label,
            items,
          };
        });
        return {
          id: typeof structureSection?.id === "string" ? structureSection.id : undefined,
          sectionKey: definition.key,
          adminLabel: definition.label,
          locked: definition.locked || false,
          enabled: definition.locked ? true : localizedSection?.enabled !== false,
          copyBlocks: copyRows(
            locale,
            localizedCopies,
            sectionCopyIDs,
            copySeeds.filter((item) => item.sectionKey === definition.key),
          ),
          imageOverrides: imageRows(
            (localizedSection?.imageOverrides || existingDoc?.imageOverrides) as Array<Record<string, unknown>> | undefined,
            imageSeeds.filter((item) => item.sectionKey === definition.key),
          ),
          valueOverrides: fixedValueRows(
            (localizedSection?.valueOverrides || existingDoc?.valueOverrides) as Array<Record<string, unknown>> | undefined,
            valueSeeds.filter((item) => item.sectionKey === definition.key),
          ),
          lists,
        };
      }),
      copyBlocks: copyRows(
        locale,
        existingDoc?.copyBlocks as Array<Record<string, unknown>> | undefined,
        copyRowIDs,
      ),
      imageOverrides: imageRows(
        existingDoc?.imageOverrides as Array<Record<string, unknown>> | undefined,
      ),
      valueOverrides: fixedValueRows(
        existingDoc?.valueOverrides as Array<Record<string, unknown>> | undefined,
      ),
      _status: "published" as const,
    });
    const saved = existing
      ? await payload.update({ collection: "pages", id: existing.id, data: createData("fa", existing as unknown as Record<string, unknown>), locale: "fa", overrideAccess: true, context: { syncManagedPageStructure: true } })
      : await payload.create({ collection: "pages", data: createData("fa"), locale: "fa", overrideAccess: true, context: { syncManagedPageStructure: true } });
    const copyRowIDs = new Map<string, string>(
      (saved.copyBlocks || []).flatMap((item) =>
        item.id ? [[item.sourceKey, item.id] as const] : [],
      ),
    );
    await payload.update({
      collection: "pages",
      id: saved.id,
      data: createData(
        "en",
        existingEn as unknown as Record<string, unknown> | undefined,
        copyRowIDs,
        saved as unknown as Record<string, unknown>,
      ),
      locale: "en",
      overrideAccess: true,
      context: { syncManagedPageStructure: true },
    });
  }
}

async function seedCareerSettings() {
  const existing = await payload.findGlobal({
    slug: "site-settings",
    locale: "fa",
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  if (existing.careers) return;
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "fa",
    overrideAccess: true,
    data: {
      careers: {
        enabled: true,
        maxFiles: 3,
        maxFileSizeMB: 10,
        maxTotalSizeMB: 20,
        allowedFileTypes: ["pdf", "doc", "docx"],
        retentionDays: 365,
      },
    },
  });
}

async function seedSettings(
  locale: Locale,
  rowIDs?: { contacts: string[]; socials: string[]; interfaceCopy: string[] },
) {
  return payload.updateGlobal({
    slug: "site-settings",
    locale,
    overrideAccess: true,
    context: { syncManagedPageStructure: true },
    data: {
      brand: {
        name: locale === "fa" ? BRAND.name : "Behrouz",
        tagline: STR.nav.tagline[locale],
        legacyLogoPath: BRAND.logo,
      },
      homeHero: {
        eyebrow: STR.hero.eyebrow[locale],
        title: STR.hero.title[locale],
        script: STR.hero.script[locale],
        link: HERO_LINK,
        uiAt: HERO_MEDIA.uiAt,
        legacyPosterPath: HERO_MEDIA.poster,
        legacyVideoPath: HERO_MEDIA.introMp4,
      },
      homeAbout: {
        title: STR.about.title[locale],
        body: STR.about.storyHome[locale],
        cta: STR.about.cta[locale],
        link: "/about",
        legacyImagePath: ABOUT_MEDIA.image,
        legacyMobileImagePath: ABOUT_MEDIA.imageMobile,
      },
      footer: {
        heading: STR.footer.heading[locale],
        copyright: STR.footer.copyright[locale],
        contacts: [
          {
            id: rowIDs?.contacts[0],
            type: "phone" as const,
            label: STR.footer.centralPhone[locale],
            value: "021-44536090",
          },
          {
            id: rowIDs?.contacts[1],
            type: "phone" as const,
            label: STR.footer.factoryPhone[locale],
            value: "026-34373500",
          },
          {
            id: rowIDs?.contacts[2],
            type: "fax" as const,
            label: STR.footer.fax[locale],
            value: "021-44536092",
          },
          {
            id: rowIDs?.contacts[3],
            type: "email" as const,
            label: STR.footer.email[locale],
            value: "Info@behrouznik.com",
          },
        ],
      },
      socials: SOCIALS.map((social, index) => ({
        id: rowIDs?.socials[index],
        provider: social.name,
        href: social.href,
      })),
      catalog: {
        legacyFilePath: FULL_CATALOG_DOWNLOAD,
        label: locale === "fa" ? "کاتالوگ کامل محصولات" : "Complete product catalog",
      },
      seo: {
        title: locale === "fa" ? "صنایع غذایی بهروز | دوست من سلام" : "Behrouz Food Industries",
        description:
          locale === "fa"
            ? "صنایع غذایی بهروز؛ تولیدکننده سس، کنسرو، ترشی، خیارشور، مربا و آبلیمو از سال ۱۳۵۶."
            : "Behrouz Food Industries, producing sauces, canned foods, pickles, jams and lime juice since 1977.",
      },
      interfaceCopy: siteInterfaceCopy.map((item, index) => ({
        id: rowIDs?.interfaceCopy[index],
        sourceKey: item.sourceKey,
        adminLabel: item.adminLabel,
        text: item.text[locale],
      })),
      audit: { retentionDays: 180 },
      careers: {
        enabled: true,
        maxFiles: 3,
        maxFileSizeMB: 10,
        maxTotalSizeMB: 20,
        allowedFileTypes: ["pdf", "doc", "docx"],
        retentionDays: 365,
      },
      _status: "published",
    },
  });
}

const seedScope = process.env.CMS_SEED_SCOPE;
if (seedScope === "careers") {
  payload.logger.info("Seeding only the careers page and its form settings...");
  await seedPages(new Set<ManagedPageSlug>(["careers"]));
  await seedCareerSettings();
  payload.logger.info("Careers seed completed without changing other pages or products.");
} else {
  payload.logger.info("Seeding CMS content...");
  const { categoryIDs, subcategoryIDs } = await seedCategories();
  await seedProducts(categoryIDs, subcategoryIDs);
  await seedPages();
  const faSettings = await seedSettings("fa");
  await seedSettings("en", {
    contacts: (faSettings.footer.contacts || []).flatMap((item) => item.id ? [item.id] : []),
    socials: (faSettings.socials || []).flatMap((item) => item.id ? [item.id] : []),
    interfaceCopy: (faSettings.interfaceCopy || []).flatMap((item) => item.id ? [item.id] : []),
  });
  payload.logger.info("CMS seed completed. Create the first super-admin at /admin.");
}
process.exit(0);
