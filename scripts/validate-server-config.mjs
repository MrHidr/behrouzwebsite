import fs from "node:fs";
import { isIP } from "node:net";
import path from "node:path";
import process from "node:process";

const envPath = path.resolve(process.cwd(), ".env");

if (!fs.existsSync(envPath)) {
  console.error("Missing .env. Copy .env.example to .env and fill production values.");
  process.exit(1);
}

const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      const key = line.slice(0, separator).trim();
      const rawValue = line.slice(separator + 1).trim();
      const quoted = rawValue.match(/^(["'])(.*)\1$/);
      return [key, quoted ? quoted[2] : rawValue];
    }),
);
const errors = [];
const insecureIPTestMode = env.CMS_SECURE_COOKIES === "false";
const required = [
  "SERVER_URL",
  "CMS_ALLOWED_ORIGINS",
  "PAYLOAD_SECRET",
  "POSTGRES_PASSWORD",
  "DATABASE_URL",
];

for (const key of required) {
  const value = env[key]?.trim();
  if (!value) errors.push(`${key} is required.`);
  if (value?.includes("CHANGE_ME") || value?.includes("example.com")) {
    errors.push(`${key} still contains an example value.`);
  }
}

if ((env.PAYLOAD_SECRET?.length ?? 0) < 32) {
  errors.push("PAYLOAD_SECRET must contain at least 32 characters.");
}

if (env.CAREER_RATE_LIMIT_REQUIRED === "false") {
  errors.push("CAREER_RATE_LIMIT_REQUIRED must not be false in production.");
}
if (env.TRUST_PROXY_HEADERS === "false") {
  errors.push("TRUST_PROXY_HEADERS must not be false behind the required reverse proxy.");
}
for (const key of ["TRUST_PROXY_HEADERS", "TRUST_CLOUDFLARE_IP_HEADER"]) {
  if (env[key] && !["true", "false"].includes(env[key])) {
    errors.push(`${key} must be true or false.`);
  }
}
if (env.REDIS_URL && !/^rediss?:\/\//.test(env.REDIS_URL)) {
  errors.push("REDIS_URL must use redis:// or rediss://.");
}

for (const key of ["SERVER_URL", "CMS_ALLOWED_ORIGINS"]) {
  const values = (env[key] || "").split(",").map((value) => value.trim()).filter(Boolean);
  for (const value of values) {
    try {
      const url = new URL(value);
      const allowedTestURL =
        insecureIPTestMode && url.protocol === "http:" && isIP(url.hostname) > 0;
      if (url.protocol !== "https:" && !allowedTestURL) {
        errors.push(`${key} must use https, except for explicit http://IP test mode.`);
      }
    } catch {
      errors.push(`${key} contains an invalid URL.`);
    }
  }
}

if (errors.length) {
  console.error("Server configuration is not production-ready:\n");
  for (const error of [...new Set(errors)]) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  insecureIPTestMode
    ? "Server configuration passed temporary IP-test checks. HTTPS is still required before production."
    : "Server configuration passed production checks. Secret values were not printed.",
);
