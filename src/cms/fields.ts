import type { Field } from "payload";

export const localizedTitle = (name = "title", label = "عنوان", required = true): Field => ({
  name,
  label,
  type: "text",
  localized: true,
  required,
  maxLength: 180,
});

export const localizedTextarea = (
  name: string,
  label: string,
  required = false,
): Field => ({
  name,
  label,
  type: "textarea",
  localized: true,
  required,
  maxLength: 5000,
});

export const mediaPair = (
  uploadName: string,
  legacyName: string,
  label: string,
): Field[] => [
  {
    name: uploadName,
    label: `${label} (مدیریت رسانه)`,
    type: "upload",
    relationTo: "media",
    displayPreview: true,
    admin: {
      description: "برای جایگزینی فایل فعلی، یک رسانه از کتابخانه انتخاب یا فایل جدید بارگذاری کنید.",
    },
  },
  {
    name: legacyName,
    label: `${label} (مسیر فایل فعلی)`,
    type: "text",
    admin: {
      readOnly: true,
      description: "مسیر فایل اولیه فقط برای سازگاری نگه داشته شده است؛ جایگزینی را از فیلد مدیریت رسانه انجام دهید.",
      components: {
        afterInput: ["./components/admin/CurrentMediaPreview#CurrentMediaPreview"],
      },
    },
    validate: (value: unknown) =>
      value === null || value === undefined || value === "" ||
      (typeof value === "string" && value.startsWith("/") && !value.includes(".."))
        ? true
        : "مسیر فایل فعلی باید یک مسیر داخلی امن باشد.",
  },
];

export const drafts = {
  drafts: true,
  maxPerDoc: 30,
} as const;
