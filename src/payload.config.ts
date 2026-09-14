import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CloudflareContext } from "@opennextjs/cloudflare";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { r2Storage } from "@payloadcms/storage-r2";
import { resendAdapter } from "@payloadcms/email-resend";
import { fa } from "@payloadcms/translations/languages/fa";
import { buildConfig } from "payload";
import type { EmailAdapter, Plugin } from "payload";
import type { GetPlatformProxyOptions } from "wrangler";

import { Media } from "./collections/Media";
import { ActivityLogs } from "./collections/ActivityLogs";
import { CareerApplications } from "./collections/CareerApplications";
import { Pages } from "./collections/Pages";
import { ProductCategories } from "./collections/ProductCategories";
import { Products } from "./collections/Products";
import { ProductSubcategories } from "./collections/ProductSubcategories";
import { Users } from "./collections/Users";
import { ResumeFiles } from "./collections/ResumeFiles";
import { SiteSettings } from "./globals/SiteSettings";
import { migrations as d1Migrations } from "./migrations/d1";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const dbTarget = process.env.PAYLOAD_DB === "d1" ? "d1" : "postgres";
const isProduction = process.env.NODE_ENV === "production";

const realpath = (value: string) => {
  try {
    return fs.existsSync(value) ? fs.realpathSync(value) : undefined;
  } catch {
    return undefined;
  }
};

const isFrameworkCLI = process.argv.some((value) => {
  const resolved = realpath(value);
  if (!resolved) return false;
  return (
    resolved.endsWith(path.join("payload", "bin.js")) ||
    resolved.endsWith(path.join("next", "dist", "bin", "next"))
  );
});

type D1Binding = Parameters<typeof sqliteD1Adapter>[0]["binding"];
type R2Binding = Parameters<typeof r2Storage>[0]["bucket"];
type CMSCloudflareContext = CloudflareContext & {
  env: CloudflareContext["env"] & {
    D1: D1Binding;
    R2: R2Binding;
    PAYLOAD_SECRET?: string;
    CMS_ENABLED?: string;
    SERVER_URL?: string;
    CMS_ALLOWED_ORIGINS?: string;
    RESEND_API_KEY?: string;
    EMAIL_FROM_ADDRESS?: string;
    EMAIL_FROM_NAME?: string;
  };
};

const getWranglerContext = (): Promise<CMSCloudflareContext> =>
  import(/* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: process.env.CLOUDFLARE_REMOTE_BINDINGS === "true",
      } satisfies GetPlatformProxyOptions) as Promise<CMSCloudflareContext>,
  );

const cloudflare = dbTarget === "d1"
  ? (isFrameworkCLI || !isProduction
      ? await getWranglerContext()
      : (await getCloudflareContext({ async: true }) as CMSCloudflareContext))
  : undefined;

const runtimeValue = (name: string) => {
  const processValue = process.env[name];
  if (processValue) return processValue;
  const bindingValue = cloudflare?.env[name as keyof CMSCloudflareContext["env"]];
  return typeof bindingValue === "string" ? bindingValue : undefined;
};

const developmentSecret = "development-only-payload-secret";
const configuredSecret = runtimeValue("PAYLOAD_SECRET");
const cmsEnabled = runtimeValue("CMS_ENABLED") === "true";
const secret = configuredSecret || developmentSecret;

if (isProduction && cmsEnabled && !configuredSecret) {
  throw new Error("PAYLOAD_SECRET is required in production.");
}

const configuredServerURL = runtimeValue("SERVER_URL");
const hasDeploymentPlaceholder = configuredServerURL?.includes("REPLACE_WITH_") ?? false;
// OpenNext preview reads the production-looking values from wrangler.jsonc. Until
// those placeholders are replaced, treat the Worker as the local preview so
// Payload's CSRF protection accepts writes from localhost:8787.
const serverURL = hasDeploymentPlaceholder
  ? "http://localhost:8787"
  : configuredServerURL || "http://localhost:3000";
const allowedOrigins = Array.from(
  new Set(
    [
      serverURL,
      ...(runtimeValue("CMS_ALLOWED_ORIGINS") || "").split(","),
      ...(hasDeploymentPlaceholder
        ? ["http://localhost:8787", "http://127.0.0.1:8787"]
        : []),
    ]
      .map((origin) => origin.trim())
      .filter((origin) => Boolean(origin) && !origin.includes("REPLACE_WITH_")),
  ),
);

const db = dbTarget === "d1"
  ? sqliteD1Adapter({
      binding: cloudflare!.env.D1,
      migrationDir: path.resolve(dirname, "migrations/d1"),
      prodMigrations: d1Migrations,
      push: false,
    })
  : (await import("@payloadcms/db-postgres")).postgresAdapter({
      migrationDir: path.resolve(dirname, "migrations/postgres"),
      push: false,
      pool: {
        connectionString:
          process.env.DATABASE_URL ||
          "postgres://behrouz:behrouz@127.0.0.1:5432/behrouz_cms",
        max: Number(process.env.DATABASE_POOL_MAX || 10),
      },
    });

const plugins: Plugin[] = [];

const disabledEmailAdapter: EmailAdapter = ({ payload }) => ({
  name: "disabled-secure-email",
  defaultFromAddress: runtimeValue("EMAIL_FROM_ADDRESS") || "cms@localhost.invalid",
  defaultFromName: runtimeValue("EMAIL_FROM_NAME") || "Behrouz CMS",
  sendEmail: async () => {
    payload.logger.warn("Email delivery is disabled. Configure RESEND_API_KEY to enable password recovery.");
    throw new Error("Email delivery is not configured.");
  },
});

const resendAPIKey = runtimeValue("RESEND_API_KEY");
const email = resendAPIKey
  ? resendAdapter({
      apiKey: resendAPIKey,
      defaultFromAddress: runtimeValue("EMAIL_FROM_ADDRESS") || "cms@localhost.invalid",
      defaultFromName: runtimeValue("EMAIL_FROM_NAME") || "Behrouz CMS",
    })
  : disabledEmailAdapter;

if (dbTarget === "d1") {
  plugins.push(
    r2Storage({
      bucket: cloudflare!.env.R2,
      collections: { media: true, "resume-files": true },
    }),
  );
} else if (process.env.S3_BUCKET) {
  const { s3Storage } = await import("@payloadcms/storage-s3");
  const endpoint = process.env.S3_ENDPOINT;
  plugins.push(
    s3Storage({
      bucket: process.env.S3_BUCKET,
      collections: { media: true, "resume-files": true },
      config: {
        region: process.env.S3_REGION || "us-east-1",
        endpoint,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
        credentials:
          process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
            ? {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
              }
            : undefined,
      },
    }),
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    theme: "all",
    components: {
      beforeDashboard: ["./components/admin/DashboardWelcome#DashboardWelcome"],
      graphics: {
        Icon: "./components/admin/Brand#BrandIcon",
        Logo: "./components/admin/Brand#BrandLogo",
      },
    },
    meta: {
      titleSuffix: "— مدیریت وب‌سایت بهروز",
      description: "پنل امن مدیریت محتوای وب‌سایت بهروز",
      icons: [{ rel: "icon", url: "/favicon.ico" }],
    },
  },
  collections: [
    Users,
    ActivityLogs,
    CareerApplications,
    ResumeFiles,
    Media,
    ProductCategories,
    ProductSubcategories,
    Products,
    Pages,
  ],
  globals: [SiteSettings],
  db,
  editor: lexicalEditor(),
  email,
  plugins,
  secret,
  serverURL,
  cors: allowedOrigins,
  csrf: allowedOrigins,
  cookiePrefix: "behrouz-cms",
  defaultDepth: 1,
  maxDepth: 3,
  defaultMaxTextLength: 50_000,
  graphQL: { disable: true },
  telemetry: false,
  debug: !isProduction,
  i18n: {
    fallbackLanguage: "fa",
    supportedLanguages: { fa },
  },
  localization: {
    locales: [
      { label: "فارسی", code: "fa", rtl: true },
      { label: "English", code: "en", rtl: false },
    ],
    defaultLocale: "fa",
    fallback: false,
  },
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
