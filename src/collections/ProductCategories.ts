import type { CollectionConfig } from "payload";
import {
  canManageProducts,
  canDeleteProducts,
  isAuthenticated,
  publishedOrAuthenticated,
} from "../cms/access";
import { drafts, localizedTitle, mediaPair } from "../cms/fields";
import { guardCollectionPublish } from "../cms/hooks";
import { logCollectionChange, logCollectionDelete } from "../cms/activity-log";

const scenePositionFields = [
  { name: "left", label: "موقعیت افقی (%)", type: "number" as const, required: true },
  { name: "width", label: "عرض (%)", type: "number" as const, required: true, min: 1, max: 150 },
  { name: "bleed", label: "بیرون‌زدگی پایین (%)", type: "number" as const, required: true },
  { name: "rotate", label: "چرخش (درجه)", type: "number" as const, required: true },
  { name: "z", label: "ترتیب لایه", type: "number" as const, required: true },
];

export const ProductCategories: CollectionConfig = {
  slug: "product-categories",
  labels: { singular: "دسته محصول", plural: "دسته‌های محصول" },
  admin: {
    group: "محصولات",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "sortOrder", "_status", "updatedAt"],
  },
  access: {
    create: canManageProducts,
    read: publishedOrAuthenticated,
    readVersions: isAuthenticated,
    update: canManageProducts,
    delete: canDeleteProducts,
  },
  hooks: {
    beforeChange: [guardCollectionPublish],
    afterChange: [logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  versions: drafts,
  fields: [
    localizedTitle(),
    {
      name: "slug",
      label: "شناسه URL",
      type: "text",
      required: true,
      unique: true,
      index: true,
      maxLength: 80,
      admin: { description: "فقط حروف انگلیسی کوچک، عدد و خط تیره؛ بعداً تغییر ندهید." },
      validate: (value: unknown) =>
        typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? true
          : "شناسه باید با حروف کوچک انگلیسی و خط تیره نوشته شود.",
    },
    {
      name: "color",
      label: "رنگ اصلی",
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
    {
      name: "fullWidthEvery",
      label: "کارت تمام‌عرض هر چند محصول",
      type: "number",
      min: 2,
      max: 20,
      admin: { description: "خالی بگذارید تا همه کارت‌ها دو ستونه باشند." },
    },
    ...mediaPair("backgroundMedia", "legacyBackgroundPath", "پس‌زمینه قهرمان"),
    {
      name: "heroItems",
      label: "محصولات صحنه قهرمان",
      type: "array",
      maxRows: 5,
      fields: [
        ...mediaPair("media", "legacySrc", "تصویر محصول"),
        {
          name: "subcategoryKey",
          label: "شناسه زیردسته مقصد",
          type: "text",
          maxLength: 80,
        },
        {
          type: "row",
          fields: [
            { name: "desktop", label: "دسکتاپ", type: "group", fields: scenePositionFields },
            { name: "mobile", label: "موبایل", type: "group", fields: scenePositionFields },
          ],
        },
      ],
    },
  ],
};
