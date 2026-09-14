import type { Access, FieldAccess } from "payload";

export const cmsRoles = [
  "super-admin",
  "publisher",
  "editor",
  "media-manager",
] as const;

export type CMSRole = (typeof cmsRoles)[number];

export const cmsPermissions = [
  "manageAdmins",
  "manageProducts",
  "manageSiteContent",
  "manageSiteSettings",
  "manageMedia",
  "manageCareerApplications",
  "publishContent",
  "viewActivityLog",
] as const;

export type CMSPermission = (typeof cmsPermissions)[number];

type UserLike = {
  id?: number | string;
  email?: string;
  role?: unknown;
  permissions?: Record<string, unknown> | null;
};

const rolePermissions: Record<CMSRole, readonly CMSPermission[]> = {
  "super-admin": cmsPermissions,
  publisher: [
    "manageProducts",
    "manageSiteContent",
    "manageSiteSettings",
    "manageMedia",
    "manageCareerApplications",
    "publishContent",
    "viewActivityLog",
  ],
  editor: ["manageProducts", "manageSiteContent", "manageMedia"],
  "media-manager": ["manageMedia"],
};

export function getRole(user: unknown): CMSRole | undefined {
  if (!user || typeof user !== "object") return undefined;
  const role = (user as UserLike).role;
  return typeof role === "string" && cmsRoles.includes(role as CMSRole)
    ? (role as CMSRole)
    : undefined;
}

export const hasRole = (user: unknown, roles: readonly CMSRole[]) => {
  const role = getRole(user);
  return Boolean(role && roles.includes(role));
};

export function hasPermission(user: unknown, permission: CMSPermission): boolean {
  if (!user || typeof user !== "object") return false;
  const typedUser = user as UserLike;
  const role = getRole(user);
  // The bootstrap account is the only super-admin created automatically. Keep
  // it as an unambiguous break-glass owner even if an old/partial migration left
  // one of its checkbox columns empty or false.
  if (role === "super-admin") return true;
  const explicit = typedUser.permissions?.[permission];
  if (typeof explicit === "boolean") return explicit;
  return role ? rolePermissions[role].includes(permission) : false;
}

export const isAuthenticated: Access = ({ req }) => Boolean(req.user);

export const canEditContent: Access = ({ req }) =>
  hasPermission(req.user, "manageSiteContent");

export const canManageProducts: Access = ({ req }) =>
  hasPermission(req.user, "manageProducts");

export const canDeleteProducts: Access = ({ req }) =>
  hasPermission(req.user, "manageProducts") && hasPermission(req.user, "publishContent");

export const canManageSiteSettings: Access = ({ req }) =>
  hasPermission(req.user, "manageSiteSettings");

export const canPublish: Access = ({ req }) =>
  hasPermission(req.user, "publishContent");

export const canManageMedia: Access = ({ req }) =>
  hasPermission(req.user, "manageMedia");

export const canManageCareerApplications: Access = ({ req }) =>
  hasPermission(req.user, "manageCareerApplications");

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};

export const publishedGlobalOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  const draft = (req.query as Record<string, unknown> | undefined)?.draft;
  return draft !== true && draft !== "true";
};

export const superAdminsOnly: Access = ({ req }) =>
  hasPermission(req.user, "manageAdmins");

export const superAdminFieldAccess: FieldAccess = ({ req }) =>
  hasPermission(req.user, "manageAdmins");

export const canViewActivityLog: Access = ({ req }) =>
  hasPermission(req.user, "viewActivityLog") || hasPermission(req.user, "manageAdmins");

export function userID(user: unknown): number | string | undefined {
  if (!user || typeof user !== "object") return undefined;
  return (user as UserLike).id;
}
