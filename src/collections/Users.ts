import type { CollectionConfig } from "payload";
import {
  cmsPermissions,
  cmsRoles,
  hasPermission,
  superAdminFieldAccess,
  superAdminsOnly,
  userID,
} from "../cms/access";
import { logCollectionChange, logCollectionDelete } from "../cms/activity-log";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "کاربر پنل", plural: "کاربران پنل" },
  admin: {
    group: "مدیریت",
    useAsTitle: "email",
    defaultColumns: ["email", "name", "updatedAt"],
    description: "این کاربران فقط برای ورود به پنل مدیریت هستند و حساب مشتری یا بازدیدکننده سایت محسوب نمی‌شوند.",
  },
  auth: {
    tokenExpiration: 2 * 60 * 60,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    removeTokenFromResponses: true,
    useSessions: true,
    cookies: {
      sameSite: "Lax",
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.CMS_SECURE_COOKIES !== "false",
    },
  },
  access: {
    admin: async ({ req }) => {
      if (req.user) return true;
      const result = await req.payload.count({ collection: "users", overrideAccess: true });
      return result.totalDocs === 0;
    },
    create: async ({ req }) => {
      if (hasPermission(req.user, "manageAdmins")) return true;
      const result = await req.payload.count({ collection: "users", overrideAccess: true });
      return result.totalDocs === 0;
    },
    read: ({ req }) => {
      if (hasPermission(req.user, "manageAdmins")) return true;
      const id = userID(req.user);
      return id ? { id: { equals: id } } : false;
    },
    update: ({ req }) => {
      if (hasPermission(req.user, "manageAdmins")) return true;
      const id = userID(req.user);
      return id ? { id: { equals: id } } : false;
    },
    delete: ({ req, id }) =>
      hasPermission(req.user, "manageAdmins") &&
      id !== undefined &&
      String(id) !== String(userID(req.user)),
    unlock: superAdminsOnly,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;
        const count = await req.payload.count({ collection: "users", overrideAccess: true });
        if (count.totalDocs === 0) {
          data.role = "super-admin";
          data.permissions = Object.fromEntries(cmsPermissions.map((permission) => [permission, true]));
        }
        return data;
      },
    ],
    afterChange: [logCollectionChange],
    afterDelete: [logCollectionDelete],
  },
  fields: [
    {
      name: "name",
      label: "نام و نام خانوادگی",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "role",
      label: "نقش",
      type: "select",
      required: true,
      defaultValue: ({ user }) => (user ? "editor" : "super-admin"),
      admin: { hidden: true },
      options: [
        { label: "مدیر کل", value: cmsRoles[0] },
        { label: "ناشر", value: cmsRoles[1] },
        { label: "ویرایشگر", value: cmsRoles[2] },
        { label: "مدیر رسانه", value: cmsRoles[3] },
      ],
      access: {
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
    },
    {
      name: "permissions",
      label: "دسترسی‌ها",
      type: "group",
      admin: {
        description: "هر دسترسی مستقل است. فقط کاربری که «مدیریت کاربران» دارد می‌تواند این چک‌لیست را تغییر دهد.",
      },
      access: {
        update: superAdminFieldAccess,
      },
      fields: [
        {
          name: "manageAdmins",
          label: "مدیریت کاربران و دسترسی‌ها",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
        {
          name: "manageProducts",
          label: "افزودن و تغییر محصولات، دسته‌ها و زیردسته‌ها",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
        {
          name: "manageSiteContent",
          label: "تغییر متن و تصاویر صفحات سایت",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
        {
          name: "manageSiteSettings",
          label: "تغییر تنظیمات عمومی، منو، فوتر و سئو",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
        {
          name: "manageMedia",
          label: "بارگذاری، تغییر و حذف رسانه‌ها",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
        {
          name: "manageCareerApplications",
          label: "مشاهده و مدیریت درخواست‌های همکاری",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
        {
          name: "publishContent",
          label: "انتشار و لغو انتشار محتوا",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
        {
          name: "viewActivityLog",
          label: "مشاهده گزارش فعالیت‌ها",
          type: "checkbox",
          defaultValue: ({ user }) => !user,
        },
      ],
    },
  ],
};
