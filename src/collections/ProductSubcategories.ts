import type { CollectionConfig } from "payload";
import {
  canManageProducts,
  canDeleteProducts,
  isAuthenticated,
  publishedOrAuthenticated,
} from "../cms/access";
import { drafts, localizedTitle } from "../cms/fields";
import { guardCollectionPublish } from "../cms/hooks";
import { logCollectionChange, logCollectionDelete } from "../cms/activity-log";
import { validateUniqueSubcategoryKey } from "../cms/product-integrity";

export const ProductSubcategories: CollectionConfig = {
  slug: "product-subcategories",
  labels: { singular: "زیردسته محصول", plural: "زیردسته‌های محصول" },
  admin: {
    group: "محصولات",
    useAsTitle: "label",
    defaultColumns: ["label", "key", "category", "sortOrder", "_status"],
  },
  access: {
    create: canManageProducts,
    read: publishedOrAuthenticated,
    readVersions: isAuthenticated,
    update: canManageProducts,
    delete: canDeleteProducts,
  },
  hooks: {
    beforeValidate: [validateUniqueSubcategoryKey],
    beforeChange: [guardCollectionPublish],
    afterChange: [logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  versions: drafts,
  fields: [
    localizedTitle("label", "عنوان کوتاه"),
    localizedTitle("sectionTitle", "عنوان بخش"),
    {
      name: "key",
      label: "شناسه داخلی",
      type: "text",
      required: true,
      index: true,
      maxLength: 80,
      validate: (value: unknown) =>
        typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : "شناسه باید با حروف کوچک انگلیسی و خط تیره نوشته شود.",
    },
    {
      name: "category",
      label: "دسته والد",
      type: "relationship",
      relationTo: "product-categories",
      required: true,
      index: true,
    },
    {
      name: "color",
      label: "رنگ بخش",
      type: "text",
      required: true,
      defaultValue: "#e42e1d",
      maxLength: 7,
      validate: (value: unknown) =>
        typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)
          ? true
          : "رنگ باید مانند #e42e1d باشد.",
    },
    {
      name: "sortOrder",
      label: "ترتیب نمایش",
      type: "number",
      required: true,
      defaultValue: 0,
      index: true,
    },
  ],
};
