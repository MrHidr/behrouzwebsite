import { readFile } from "node:fs/promises";

const config = await readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8");

if (config.includes("REPLACE_WITH_")) {
  console.error("wrangler.jsonc still contains REPLACE_WITH_* placeholders.");
  console.error("Create D1/R2 resources and set the production domain before deployment.");
  process.exit(1);
}

console.log("Cloudflare deployment configuration has no placeholders.");
