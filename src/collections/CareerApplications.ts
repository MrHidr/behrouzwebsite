import type { CollectionAfterDeleteHook, CollectionConfig } from "payload";
import { canManageCareerApplications } from "../cms/access";
import { logCollectionChange, logCollectionDelete } from "../cms/activity-log";

const deleteAttachedFiles: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const attachments = Array.isArray(doc.attachments) ? doc.attachments : [];
  for (const attachment of attachments) {
    const id = typeof attachment === "object" && attachment !== null && "id" in attachment
      ? attachment.id
      : attachment;
    if (typeof id !== "number" && typeof id !== "string") continue;
    try {
      await req.payload.delete({
        collection: "resume-files",
        id,
        overrideAccess: true,
        req,
      });
    } catch (error) {
      req.payload.logger.error({ error, id }, "Could not delete an attached resume file");
    }
  }
  return doc;
};

export const CareerApplications: CollectionConfig = {
  slug: "career-applications",
  labels: { singular: "درخواست همکاری", plural: "درخواست‌های همکاری" },
  admin: {
    group: "همکاری با ما",
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "phone", "status", "createdAt"],
    description: "رزومه‌ها اطلاعات شخصی و محرمانه‌اند؛ فقط افراد مسئول منابع انسانی باید به این بخش دسترسی داشته باشند.",
  },
  access: {
    create: () => false,
    read: canManageCareerApplications,
    update: canManageCareerApplications,
    delete: canManageCareerApplications,
  },
  hooks: {
    afterChange: [logCollectionChange],
    afterDelete: [deleteAttachedFiles, logCollectionDelete],
  },
  fields: [
    {
      name: "fullName",
      label: "نام و نام خانوادگی",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "phone",
      label: "شماره تماس",
      type: "text",
      required: true,
      maxLength: 32,
    },
    {
      name: "attachments",
      label: "فایل‌های رزومه",
      type: "relationship",
      relationTo: "resume-files",
      hasMany: true,
      required: true,
      minRows: 1,
      maxRows: 5,
      admin: {
        allowCreate: false,
        allowEdit: false,
        description: "فایل‌ها خصوصی‌اند و حذف این درخواست، فایل‌های مرتبط را نیز حذف می‌کند.",
      },
    },
    {
      name: "status",
      label: "وضعیت بررسی",
      type: "select",
      required: true,
      defaultValue: "new",
      index: true,
      options: [
        { label: "جدید", value: "new" },
        { label: "در حال بررسی", value: "reviewing" },
        { label: "تماس گرفته شد", value: "contacted" },
        { label: "بسته‌شده", value: "closed" },
      ],
    },
    {
      name: "locale",
      label: "زبان فرم",
      type: "select",
      required: true,
      defaultValue: "fa",
      options: [
        { label: "فارسی", value: "fa" },
        { label: "English", value: "en" },
      ],
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "internalNotes",
      label: "یادداشت داخلی",
      type: "textarea",
      maxLength: 5000,
    },
  ],
};
