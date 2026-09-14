import path from "path";
import type { CollectionConfig } from "payload";
import { canManageMedia } from "../cms/access";
import { enforceUploadLimit } from "../cms/hooks";
import { logCollectionChange, logCollectionDelete } from "../cms/activity-log";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "فایل رسانه‌ای", plural: "کتابخانه رسانه‌ها" },
  admin: {
    group: "محتوا",
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "filesize", "updatedAt"],
    description: "تصاویر، ویدئوها و PDFهایی که از پنل آپلود می‌کنید اینجا نگهداری می‌شوند. فایل‌های قدیمیِ داخل پروژه تا زمانی که جایگزین نشوند در این فهرست دیده نمی‌شوند.",
  },
  access: {
    create: canManageMedia,
    read: () => true,
    update: canManageMedia,
    delete: canManageMedia,
  },
  hooks: {
    beforeOperation: [enforceUploadLimit],
    afterChange: [logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  fields: [
    {
      name: "alt",
      label: "متن جایگزین",
      type: "text",
      localized: true,
      required: true,
      maxLength: 200,
    },
    {
      name: "caption",
      label: "توضیح",
      type: "textarea",
      localized: true,
      maxLength: 1000,
    },
    {
      name: "internalNotes",
      label: "یادداشت داخلی",
      type: "textarea",
      maxLength: 1000,
      access: { read: ({ req }) => Boolean(req.user) },
      admin: { position: "sidebar" },
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), "public/media/cms"),
    crop: false,
    focalPoint: false,
    pasteURL: false,
    displayPreview: true,
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "video/mp4",
      "application/pdf",
    ],
  },
};
