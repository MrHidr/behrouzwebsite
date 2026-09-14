import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const settings = await payload.findGlobal({
  slug: "site-settings",
  depth: 0,
  overrideAccess: true,
});
const configuredDays = Number(settings.careers?.retentionDays || 365);
const retentionDays = Math.min(730, Math.max(30, Math.trunc(configuredDays)));
const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
let removed = 0;

while (true) {
  const expired = await payload.find({
    collection: "career-applications",
    where: { createdAt: { less_than: cutoff } },
    depth: 0,
    limit: 100,
    overrideAccess: true,
  });
  if (!expired.docs.length) break;
  for (const application of expired.docs) {
    await payload.delete({
      collection: "career-applications",
      id: application.id,
      overrideAccess: true,
    });
    removed += 1;
  }
}

payload.logger.info({ removed, retentionDays }, "Career application retention completed");
process.exit(0);
