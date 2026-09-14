import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

const stableKey = "dijonnaise-squeeze";
const insertionOrder = 6;

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const existing = await payload.find({
    collection: "products",
    where: { stableKey: { equals: stableKey } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  if (existing.docs.length) return;

  const categories = await payload.find({
    collection: "product-categories",
    where: { slug: { equals: "sauces" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const category = categories.docs[0];
  // A fresh database is migrated before its first seed, so there is no
  // catalog data to update yet. The seed will create this product afterward.
  if (!category) return;

  const subcategories = await payload.find({
    collection: "product-subcategories",
    where: { and: [{ key: { equals: "dressings" } }, { category: { equals: category.id } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const subcategory = subcategories.docs[0];
  if (!subcategory) return;

  const following = await payload.find({
    collection: "products",
    where: {
      and: [
        { subcategory: { equals: subcategory.id } },
        { sortOrder: { greater_than_equal: insertionOrder } },
      ],
    },
    sort: "-sortOrder",
    limit: 100,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  for (const product of following.docs) {
    await payload.update({
      collection: "products",
      id: product.id,
      data: { sortOrder: (product.sortOrder || 0) + 1 },
      overrideAccess: true,
    });
  }

  const created = await payload.create({
    collection: "products",
    locale: "fa",
    overrideAccess: true,
    data: {
      stableKey,
      name: "دیجونیز",
      subtitle: "-",
      ingredients: "-",
      feature: "-",
      category: category.id,
      subcategory: subcategory.id,
      legacyImagePath: "/media/sauces/dijonnaise-squeeze-poster.webp",
      legacyHoverVideoPath: "/media/sauces/dijonnaise-squeeze.mp4",
      mediaDisplaySize: "normal",
      variants: [{ weight: "-", dimensions: "-", barcode: "-" }],
      sortOrder: insertionOrder,
      _status: "published",
    },
  });
  await payload.update({
    collection: "products",
    id: created.id,
    locale: "en",
    overrideAccess: true,
    data: {
      name: "Dijonnaise",
      subtitle: "-",
      ingredients: "-",
      feature: "-",
      variants: (created.variants || []).map((variant) => ({
        id: variant.id,
        weight: "-",
        dimensions: "-",
        barcode: "-",
      })),
      _status: "published",
    },
  });
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  const existing = await payload.find({
    collection: "products",
    where: { stableKey: { equals: stableKey } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  const product = existing.docs[0];
  if (!product) return;
  const subcategory = product.subcategory;
  const subcategoryID = typeof subcategory === "object" ? subcategory.id : subcategory;
  await payload.delete({ collection: "products", id: product.id, overrideAccess: true });

  const following = await payload.find({
    collection: "products",
    where: {
      and: [
        { subcategory: { equals: subcategoryID } },
        { sortOrder: { greater_than: insertionOrder } },
      ],
    },
    sort: "sortOrder",
    limit: 100,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  for (const followingProduct of following.docs) {
    await payload.update({
      collection: "products",
      id: followingProduct.id,
      data: { sortOrder: (followingProduct.sortOrder || 0) - 1 },
      overrideAccess: true,
    });
  }
}
