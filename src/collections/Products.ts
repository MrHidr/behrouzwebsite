import type { CollectionConfig } from "payload";
import {
  canManageProducts,
  canDeleteProducts,
  isAuthenticated,
  publishedOrAuthenticated,
} from "../cms/access";
import { drafts, localizedTextarea, localizedTitle, mediaPair } from "../cms/fields";
import { guardCollectionPublish } from "../cms/hooks";
import { logCollectionChange, logCollectionDelete } from "../cms/activity-log";
import { validateProductCategory } from "../cms/product-integrity";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "محصول", plural: "محصولات" },
  admin: {
    group: "محصولات",
    useAsTitle: "name",
    defaultColumns: ["name", "stableKey", "category", "subcategory", "_status", "updatedAt"],
  },
  access: {
    create: canManageProducts,
    read: publishedOrAuthenticated,
    readVersions: isAuthenticated,
    update: canManageProducts,
    delete: canDeleteProducts,
  },
  hooks: {
    beforeValidate: [validateProductCategory],
    beforeChange: [guardCollectionPublish],
    afterChange: [logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  versions: drafts,
  fields: [
    localizedTitle("name", "نام کوتاه"),
    localizedTitle("subtitle", "نام کامل", false),
    localizedTextarea("ingredients", "ترکیبات"),
    localizedTextarea("feature", "ویژگی برجسته"),
    {
      name: "stableKey",
      label: "شناسه ثابت",
      type: "text",
      required: true,
      unique: true,
      index: true,
      maxLength: 100,
      admin: { description: "شناسه فنی محصول؛ پس از انتشار تغییر ندهید." },
      validate: (value: unknown) =>
        typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : "شناسه باید با حروف کوچک انگلیسی و خط تیره نوشته شود.",
    },
    {
      name: "category",
      label: "دسته",
      type: "relationship",
      relationTo: "product-categories",
      required: true,
      index: true,
    },
    {
      name: "subcategory",
      label: "زیردسته",
      type: "relationship",
      relationTo: "product-subcategories",
      required: true,
      index: true,
    },
    ...mediaPair("image", "legacyImagePath", "تصویر محصول"),
    ...mediaPair("hoverVideo", "legacyHoverVideoPath", "ویدیوی حلقه‌ای"),
    {
      name: "mediaDisplaySize",
      label: "اندازه نمایش تصویر و ویدیو",
      type: "select",
      required: true,
      defaultValue: "normal",
      admin: {
        description: "کوچک ۹۵٪، معمولی ۱۰۰٪ و بزرگ ۱۰۵٪ ارتفاع استاندارد کارت است.",
      },
      options: [
        { label: "کوچک", value: "small" },
        { label: "معمولی", value: "normal" },
        { label: "بزرگ", value: "large" },
      ],
    },
    {
      name: "variants",
      label: "بسته‌بندی‌ها",
      type: "array",
      admin: {
        description: "برای محصول تازه می‌تواند تا زمان دریافت مشخصات خالی بماند.",
      },
      fields: [
        { name: "weight", label: "وزن خالص", type: "text", localized: true, maxLength: 100 },
        { name: "dimensions", label: "ابعاد", type: "text", localized: true, maxLength: 100 },
        { name: "barcode", label: "بارکد", type: "text", maxLength: 32 },
      ],
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
