import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-d1-sqlite";

const stableKey = "dijonnaise-squeeze";

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const products = await payload.find({
    collection: "products",
    where: { stableKey: { equals: stableKey } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  const product = products.docs[0];
  if (!product) return;

  const updated = await payload.update({
    collection: "products",
    id: product.id,
    locale: "fa",
    overrideAccess: true,
    data: {
      subtitle: "-",
      ingredients: "-",
      feature: "-",
      variants: [{ weight: "-", dimensions: "-", barcode: "-" }],
      _status: "published",
    },
  });

  await payload.update({
    collection: "products",
    id: product.id,
    locale: "en",
    overrideAccess: true,
    data: {
      subtitle: "-",
      ingredients: "-",
      feature: "-",
      variants: (updated.variants || []).map((variant) => ({
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
  const products = await payload.find({
    collection: "products",
    where: { stableKey: { equals: stableKey } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  const product = products.docs[0];
  if (!product) return;

  await payload.update({
    collection: "products",
    id: product.id,
    locale: "fa",
    overrideAccess: true,
    data: { subtitle: "", ingredients: "", feature: "", variants: [], _status: "published" },
  });
  await payload.update({
    collection: "products",
    id: product.id,
    locale: "en",
    overrideAccess: true,
    data: { subtitle: "", ingredients: "", feature: "", variants: [], _status: "published" },
  });
}
