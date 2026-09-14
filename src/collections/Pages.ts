import type { CollectionConfig, Condition, Field } from "payload";
import {
  canEditContent,
  isAuthenticated,
  publishedOrAuthenticated,
} from "../cms/access";
import { drafts, localizedTextarea, localizedTitle, mediaPair } from "../cms/fields";
import { guardCollectionPublish } from "../cms/hooks";
import { logCollectionChange } from "../cms/activity-log";
import { preserveManagedPageStructure } from "../cms/page-structure";

const rowLabel = "./components/admin/ContentRowLabel#ContentRowLabel";

const visibleForLists = (...listKeys: string[]): Condition => (data, _siblingData, { path }) => {
  const listSegment = path.findIndex((segment) => segment === "lists");
  if (listSegment < 2) return false;
  const sectionIndex = Number(path[listSegment - 1]);
  const listIndex = Number(path[listSegment + 1]);
  const sections = Array.isArray(data?.sections) ? data.sections : [];
  const lists = Array.isArray(sections[sectionIndex]?.lists)
    ? sections[sectionIndex].lists
    : [];
  return listKeys.includes(String(lists[listIndex]?.listKey || ""));
};

function fixedCopyArray(name = "copyBlocks", label = "متن‌های ثابت این سکشن", hidden = false): Field {
  return {
    name,
    label,
    type: "array",
    admin: {
      className: "managed-fixed-rows",
      hidden,
      condition: hidden ? undefined : (_data, siblingData) => Array.isArray(siblingData?.[name]) && siblingData[name].length > 0,
      initCollapsed: true,
      isSortable: false,
      description: "این موارد متعلق به طراحی سکشن هستند؛ متنشان قابل ویرایش است اما ساختارشان حذف یا اضافه نمی‌شود.",
      components: { RowLabel: rowLabel },
    },
    fields: [
      { name: "sourceKey", type: "text", required: true, admin: { hidden: true } },
      { name: "adminLabel", type: "text", required: true, admin: { hidden: true } },
      localizedTextarea("text", "متن", true),
    ],
  };
}

function fixedImageArray(name = "imageOverrides", label = "تصاویر این سکشن", hidden = false): Field {
  return {
    name,
    label,
    type: "array",
    admin: {
      className: "managed-fixed-rows",
      hidden,
      condition: hidden ? undefined : (_data, siblingData) => Array.isArray(siblingData?.[name]) && siblingData[name].length > 0,
      initCollapsed: true,
      isSortable: false,
      description: "تصویر فعلی را می‌بینید و می‌توانید فایل جایگزین انتخاب کنید.",
      components: { RowLabel: rowLabel },
    },
    fields: [
      { name: "adminLabel", type: "text", required: true, admin: { hidden: true } },
      { name: "replacement", label: "تصویر جایگزین", type: "upload", relationTo: "media", displayPreview: true },
      {
        name: "sourcePath",
        label: "تصویر فعلی",
        type: "text",
        required: true,
        admin: {
          readOnly: true,
          components: { afterInput: ["./components/admin/CurrentMediaPreview#CurrentMediaPreview"] },
        },
      },
    ],
  };
}

function fixedValueArray(name = "valueOverrides", label = "مقادیر ثابت این سکشن", hidden = false): Field {
  return {
    name,
    label,
    type: "array",
    admin: {
      className: "managed-fixed-rows",
      hidden,
      condition: hidden ? undefined : (_data, siblingData) => Array.isArray(siblingData?.[name]) && siblingData[name].length > 0,
      initCollapsed: true,
      isSortable: false,
      description: "شماره تلفن، ایمیل، کد پستی و داده‌های ثابت این سکشن.",
      components: { RowLabel: rowLabel },
    },
    fields: [
      { name: "sourceKey", type: "text", required: true, admin: { hidden: true } },
      { name: "adminLabel", type: "text", required: true, admin: { hidden: true } },
      { name: "value", label: "مقدار", type: "text", required: true, maxLength: 500 },
    ],
  };
}

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "صفحه", plural: "صفحه‌ها" },
  admin: {
    group: "محتوا",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
  },
  access: {
    create: () => false,
    read: publishedOrAuthenticated,
    readVersions: isAuthenticated,
    update: canEditContent,
    delete: () => false,
  },
  hooks: {
    beforeChange: [guardCollectionPublish, preserveManagedPageStructure],
    afterChange: [logCollectionChange],
  },
  versions: drafts,
  fields: [
    {
      name: "slug",
      label: "صفحه",
      type: "select",
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: "صفحه‌ها از قبل ساخته شده‌اند و قابل افزودن یا حذف نیستند.",
      },
      options: [
        { label: "خانه", value: "home" },
        { label: "درباره بهروز", value: "about" },
        { label: "نوآوری و کیفیت", value: "innovation" },
        { label: "تولید", value: "production" },
        { label: "توزیع", value: "distribution" },
        { label: "تماس", value: "contact" },
        { label: "همکاری با ما", value: "careers" },
      ],
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "بخش اصلی",
          fields: [
            localizedTitle(),
            localizedTitle("eyebrow", "بالاعنوان"),
            localizedTextarea("lead", "متن معرفی", true),
            ...mediaPair("heroImage", "legacyHeroImage", "تصویر اصلی"),
            localizedTitle("imageAlt", "متن جایگزین تصویر"),
            {
              type: "row",
              fields: [
                { name: "mark", label: "نشان کوتاه", type: "text", maxLength: 12 },
                {
                  name: "accent",
                  label: "رنگ صفحه",
                  type: "text",
                  maxLength: 7,
                  defaultValue: "#e42e1d",
                  validate: (value: unknown) =>
                    value === null || value === undefined || value === "" ||
                    (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value))
                      ? true
                      : "رنگ باید مانند #e42e1d باشد.",
                },
              ],
            },
          ],
        },
        {
          label: "سکشن‌های صفحه",
          fields: [
            {
              name: "sections",
              label: "سکشن‌ها",
              type: "array",
              admin: {
                className: "managed-sections",
                initCollapsed: true,
                isSortable: false,
                description: "هر ردیف دقیقاً یک سکشن سایت است. برای حذف امن، نمایش سکشن را خاموش کنید؛ ساختار سکشن‌ها قابل افزودن یا حذف نیست.",
                components: { RowLabel: rowLabel },
              },
              fields: [
                { name: "sectionKey", type: "text", required: true, admin: { hidden: true } },
                { name: "locked", type: "checkbox", defaultValue: false, admin: { hidden: true } },
                { name: "adminLabel", type: "text", required: true, admin: { hidden: true } },
                {
                  name: "enabled",
                  label: "نمایش این سکشن در سایت",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    condition: (_data, siblingData) => !siblingData?.locked,
                    description: "با خاموش‌کردن این گزینه، سکشن و فضای آن کاملاً از صفحه حذف می‌شود؛ اطلاعاتش در CMS باقی می‌ماند.",
                  },
                },
                fixedCopyArray(),
                fixedImageArray(),
                fixedValueArray(),
                {
                  name: "lists",
                  label: "لیست‌های قابل مدیریت",
                  type: "array",
                  admin: {
                    className: "managed-list-groups",
                    initCollapsed: false,
                    isSortable: false,
                    condition: (_data, siblingData) => Array.isArray(siblingData?.lists) && siblingData.lists.length > 0,
                    description: "خود نوع لیست بخشی از طراحی است؛ آیتم‌های داخل آن را می‌توانید اضافه، حذف و مرتب کنید.",
                    components: { RowLabel: rowLabel },
                  },
                  fields: [
                    { name: "listKey", type: "text", required: true, admin: { hidden: true } },
                    { name: "adminLabel", type: "text", required: true, admin: { hidden: true } },
                    {
                      name: "items",
                      label: "آیتم‌ها",
                      type: "array",
                      minRows: 1,
                      maxRows: 50,
                      admin: {
                        initCollapsed: true,
                        description: "افزودن، حذف و جابه‌جایی در این قسمت مجاز است. فقط فیلدهایی نمایش داده می‌شوند که همین بخش از سایت واقعاً مصرف می‌کند.",
                        components: { RowLabel: rowLabel },
                      },
                      fields: [
                        { name: "itemKey", type: "text", admin: { hidden: true } },
                        { name: "adminLabel", type: "text", maxLength: 160, admin: { hidden: true } },
                        { name: "enabled", label: "نمایش آیتم", type: "checkbox", defaultValue: true },
                        { name: "title", label: "عنوان", type: "text", localized: true, required: true, maxLength: 220 },
                        { name: "eyebrow", label: "شهر", type: "text", localized: true, maxLength: 220, admin: { condition: visibleForLists("locations") } },
                        { name: "subtitle", label: "نوع مرکز", type: "text", localized: true, maxLength: 300, admin: { condition: visibleForLists("locations") } },
                        { name: "text", label: "توضیح یا نشانی", type: "textarea", localized: true, maxLength: 5000, admin: { condition: visibleForLists("locations", "primary") } },
                        { name: "value", label: "ایمیل یا کد پستی", type: "text", maxLength: 500 },
                        { name: "secondaryValue", label: "دورنگار", type: "text", maxLength: 500, admin: { condition: visibleForLists("locations") } },
                        {
                          name: "details",
                          label: "شماره‌های تماس",
                          type: "array",
                          maxRows: 12,
                          admin: { condition: visibleForLists("locations") },
                          fields: [{ name: "value", label: "شماره", type: "text", required: true, maxLength: 500 }],
                        },
                        {
                          type: "row",
                          admin: { condition: visibleForLists("locations") },
                          fields: [
                            { name: "latitude", label: "عرض جغرافیایی", type: "number", min: -90, max: 90 },
                            { name: "longitude", label: "طول جغرافیایی", type: "number", min: -180, max: 180 },
                          ],
                        },
                        {
                          name: "color",
                          label: "رنگ کارت",
                          type: "text",
                          maxLength: 7,
                          admin: { condition: visibleForLists("primary") },
                          validate: (value: unknown) =>
                            value === null || value === undefined || value === "" ||
                            (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value))
                              ? true
                              : "رنگ باید مانند #e42e1d باشد.",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "سئو",
          fields: [
            {
              name: "seo",
              label: "اطلاعات موتورهای جست‌وجو",
              type: "group",
              fields: [
                localizedTitle("metaTitle", "عنوان مرورگر"),
                localizedTextarea("metaDescription", "توضیح موتور جست‌وجو", true),
              ],
            },
          ],
        },
      ],
    },
    fixedCopyArray("copyBlocks", "ساختار قدیمی متن‌ها", true),
    fixedImageArray("imageOverrides", "ساختار قدیمی تصاویر", true),
    fixedValueArray("valueOverrides", "ساختار قدیمی مقادیر", true),
  ],
};
