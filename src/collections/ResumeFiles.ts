import path from "node:path";
import type { CollectionConfig } from "payload";
import { canManageCareerApplications } from "../cms/access";

export const ResumeFiles: CollectionConfig = {
  slug: "resume-files",
  labels: { singular: "فایل رزومه", plural: "فایل‌های رزومه" },
  admin: {
    group: "همکاری با ما",
    useAsTitle: "originalName",
    defaultColumns: ["originalName", "mimeType", "filesize", "createdAt"],
    description: "این فایل‌ها خصوصی‌اند و فقط از درخواست همکاری مرتبط مدیریت می‌شوند.",
    enableRichTextLink: false,
    enableRichTextRelationship: false,
  },
  access: {
    create: () => false,
    read: canManageCareerApplications,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: "originalName",
      label: "نام اصلی فایل",
      type: "text",
      required: true,
      maxLength: 255,
      admin: { readOnly: true },
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), "private/career-files"),
    crop: false,
    focalPoint: false,
    pasteURL: false,
    displayPreview: false,
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
};
