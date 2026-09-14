import {
  ValidationError,
  type CollectionBeforeValidateHook,
} from "payload";

function relationID(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    return typeof id === "number" ? id : undefined;
  }
  return undefined;
}

export const validateProductCategory: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const categoryID = relationID(data?.category ?? originalDoc?.category);
  const subcategoryID = relationID(data?.subcategory ?? originalDoc?.subcategory);
  if (!categoryID || !subcategoryID) return data;

  const subcategory = await req.payload.findByID({
    collection: "product-subcategories",
    id: subcategoryID,
    depth: 0,
    overrideAccess: true,
  });
  if (relationID(subcategory.category) !== categoryID) {
    throw new ValidationError({
      collection: "products",
      req,
      errors: [{
        path: "subcategory",
        message: "زیردسته انتخاب‌شده متعلق به دسته محصول انتخاب‌شده نیست.",
      }],
    });
  }
  return data;
};

export const validateUniqueSubcategoryKey: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const key = data?.key ?? originalDoc?.key;
  const categoryID = relationID(data?.category ?? originalDoc?.category);
  if (typeof key !== "string" || !categoryID) return data;

  const matches = await req.payload.find({
    collection: "product-subcategories",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        { key: { equals: key } },
        { category: { equals: categoryID } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
  });
  if (matches.totalDocs > 0) {
    throw new ValidationError({
      collection: "product-subcategories",
      req,
      errors: [{
        path: "key",
        message: "این شناسه داخلی در دسته انتخاب‌شده قبلاً استفاده شده است.",
      }],
    });
  }
  return data;
};
