import type { GlobalConfig } from "payload";
import {
  canManageSiteSettings,
  isAuthenticated,
  publishedGlobalOrAuthenticated,
} from "../cms/access";
import { drafts, localizedTextarea, localizedTitle, mediaPair } from "../cms/fields";
import { guardGlobalPublish } from "../cms/hooks";
import { logGlobalChange } from "../cms/activity-log";
import { preserveManagedInterfaceStructure } from "../cms/page-structure";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "تنظیمات سایت",
  admin: { group: "محتوا" },
  access: {
    read: publishedGlobalOrAuthenticated,
    readVersions: isAuthenticated,
    update: canManageSiteSettings,
  },
  hooks: {
    beforeChange: [guardGlobalPublish, preserveManagedInterfaceStructure],
    afterChange: [logGlobalChange],
  },
  versions: drafts,
  fields: [
    {
      name: "brand",
      label: "برند",
      type: "group",
      fields: [
        localizedTitle("name", "نام"),
        localizedTitle("tagline", "زیرعنوان"),
        ...mediaPair("logo", "legacyLogoPath", "لوگو"),
      ],
    },
    {
      name: "homeHero",
      label: "قهرمان صفحه خانه",
      type: "group",
      fields: [
        localizedTitle("eyebrow", "بالاعنوان"),
        localizedTitle("title", "عنوان"),
        localizedTitle("script", "دست‌نوشته"),
        { name: "link", label: "لینک", type: "text", required: true, maxLength: 250 },
        { name: "uiAt", label: "زمان نمایش رابط (ثانیه)", type: "number", min: 0, max: 60, defaultValue: 12.75 },
        ...mediaPair("poster", "legacyPosterPath", "پوستر ویدیو"),
        ...mediaPair("video", "legacyVideoPath", "ویدیوی اصلی"),
      ],
    },
    {
      name: "homeAbout",
      label: "درباره ما در صفحه خانه",
      type: "group",
      fields: [
        localizedTitle("title", "عنوان"),
        localizedTextarea("body", "متن", true),
        localizedTitle("cta", "متن دکمه"),
        { name: "link", label: "لینک دکمه", type: "text", required: true, maxLength: 250 },
        ...mediaPair("image", "legacyImagePath", "تصویر دسکتاپ"),
        ...mediaPair("mobileImage", "legacyMobileImagePath", "تصویر موبایل"),
      ],
    },
    {
      name: "footer",
      label: "پاورقی",
      type: "group",
      fields: [
        localizedTitle("heading", "عنوان"),
        localizedTextarea("copyright", "حق نشر", true),
        {
          name: "contacts",
          label: "راه‌های ارتباط",
          type: "array",
          maxRows: 20,
          fields: [
            {
              name: "type",
              label: "نوع",
              type: "select",
              required: true,
              options: [
                { label: "تلفن", value: "phone" },
                { label: "دورنگار", value: "fax" },
                { label: "رایانامه", value: "email" },
              ],
            },
            localizedTitle("label", "عنوان"),
            { name: "value", label: "مقدار", type: "text", required: true, maxLength: 250 },
          ],
        },
      ],
    },
    {
      name: "socials",
      label: "شبکه‌های اجتماعی",
      type: "array",
      maxRows: 12,
      fields: [
        {
          name: "provider",
          label: "شبکه",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Aparat", value: "aparat" },
            { label: "YouTube", value: "youtube" },
            { label: "X", value: "x" },
          ],
        },
        { name: "href", label: "نشانی", type: "text", required: true, maxLength: 500 },
      ],
    },
    {
      name: "catalog",
      label: "کاتالوگ",
      type: "group",
      fields: [
        ...mediaPair("file", "legacyFilePath", "فایل کاتالوگ"),
        localizedTitle("label", "عنوان دانلود"),
      ],
    },
    {
      name: "seo",
      label: "سئوی پیش‌فرض",
      type: "group",
      fields: [
        localizedTitle("title", "عنوان سایت"),
        localizedTextarea("description", "توضیح سایت", true),
      ],
    },
    {
      name: "interfaceCopy",
      label: "متن‌های عمومی منو و رابط سایت",
      type: "array",
      admin: {
        initCollapsed: true,
        description: "برچسب‌های منو، محصولات و پیام‌های مشترک سایت. فارسی و انگلیسی را از انتخابگر زبان ویرایش کنید.",
        components: {
          RowLabel: "./components/admin/ContentRowLabel#ContentRowLabel",
        },
      },
      fields: [
        { name: "sourceKey", type: "text", required: true, admin: { hidden: true } },
        {
          name: "adminLabel",
          type: "text",
          required: true,
          admin: { hidden: true },
        },
        localizedTextarea("text", "متن", true),
      ],
    },
    {
      name: "audit",
      label: "نگهداری گزارش فعالیت‌ها",
      type: "group",
      admin: {
        description: "گزارش‌ها فقط نام فیلدهای تغییرکرده را نگه می‌دارند؛ نه مقدارها، رمز عبور یا secretها.",
      },
      fields: [
        {
          name: "retentionDays",
          label: "مدت نگهداری (روز)",
          type: "number",
          required: true,
          min: 30,
          max: 730,
          defaultValue: 180,
        },
      ],
    },
    {
      name: "careers",
      label: "فرم همکاری با ما",
      type: "group",
      admin: {
        description: "نوع و سقف فایل‌ها از اینجا مدیریت می‌شود. سقف سخت امنیتی هر فایل ۱۰ و مجموع فایل‌ها ۲۰ مگابایت است.",
      },
      fields: [
        {
          name: "enabled",
          label: "فرم دریافت رزومه فعال باشد",
          type: "checkbox",
          defaultValue: true,
        },
        {
          type: "row",
          fields: [
            {
              name: "maxFiles",
              label: "حداکثر تعداد فایل",
              type: "number",
              required: true,
              min: 1,
              max: 5,
              defaultValue: 3,
            },
            {
              name: "maxFileSizeMB",
              label: "حداکثر حجم هر فایل (MB)",
              type: "number",
              required: true,
              min: 1,
              max: 10,
              defaultValue: 10,
            },
            {
              name: "maxTotalSizeMB",
              label: "حداکثر حجم مجموع (MB)",
              type: "number",
              required: true,
              min: 1,
              max: 20,
              defaultValue: 20,
            },
          ],
        },
        {
          name: "allowedFileTypes",
          label: "فرمت‌های مجاز",
          type: "select",
          hasMany: true,
          required: true,
          defaultValue: ["pdf", "doc", "docx"],
          options: [
            { label: "PDF", value: "pdf" },
            { label: "Word قدیمی (.doc)", value: "doc" },
            { label: "Word (.docx)", value: "docx" },
          ],
        },
        {
          name: "retentionDays",
          label: "مدت نگهداری درخواست‌ها (روز)",
          type: "number",
          required: true,
          min: 30,
          max: 730,
          defaultValue: 365,
          admin: {
            description: "job پاک‌سازی، درخواست‌ها و فایل‌های قدیمی‌تر از این مدت را با هم حذف می‌کند.",
          },
        },
      ],
    },
  ],
};
