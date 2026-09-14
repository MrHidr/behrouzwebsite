import type { CollectionConfig } from "payload";
import { canViewActivityLog, superAdminsOnly } from "../cms/access";

export const ActivityLogs: CollectionConfig = {
  slug: "activity-logs",
  labels: { singular: "گزارش فعالیت", plural: "گزارش فعالیت‌ها" },
  admin: {
    group: "مدیریت",
    useAsTitle: "documentTitle",
    defaultColumns: ["createdAt", "actorEmail", "action", "entityLabel", "documentTitle"],
    description: "برای امنیت، فقط نام فیلدهای تغییرکرده ثبت می‌شود و مقدار فیلدها، رمزها و secretها ذخیره نمی‌شوند.",
  },
  access: {
    create: () => false,
    read: canViewActivityLog,
    update: () => false,
    delete: superAdminsOnly,
  },
  fields: [
    {
      name: "actor",
      label: "کاربر",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar", allowCreate: false, allowEdit: false },
    },
    {
      name: "actorEmail",
      label: "ایمیل کاربر در زمان تغییر",
      type: "text",
      required: true,
      index: true,
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "action",
      label: "عملیات",
      type: "select",
      required: true,
      index: true,
      options: [
        { label: "ایجاد", value: "create" },
        { label: "ویرایش", value: "update" },
        { label: "حذف", value: "delete" },
        { label: "تغییر تنظیمات", value: "update-global" },
      ],
      admin: { readOnly: true },
    },
    {
      name: "entityLabel",
      label: "بخش",
      type: "text",
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: "entitySlug",
      label: "شناسه فنی بخش",
      type: "text",
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: "documentID",
      label: "شناسه رکورد",
      type: "text",
      admin: { readOnly: true },
    },
    {
      name: "documentTitle",
      label: "عنوان رکورد",
      type: "text",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "changedFields",
      label: "فیلدهای تغییرکرده",
      type: "array",
      maxRows: 100,
      admin: { readOnly: true },
      fields: [{ name: "field", label: "فیلد", type: "text", required: true }],
    },
    {
      name: "locale",
      label: "زبان محتوا",
      type: "text",
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
