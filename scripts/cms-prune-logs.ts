import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });
const settings = await payload.findGlobal({
  slug: "site-settings",
  depth: 0,
  overrideAccess: true,
});
const configuredDays = Number(
  process.env.ACTIVITY_LOG_RETENTION_DAYS || settings.audit?.retentionDays || 180,
);
const retentionDays = Math.min(730, Math.max(30, Math.round(configuredDays)));
const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();

const result = await payload.delete({
  collection: "activity-logs",
  where: { createdAt: { less_than: cutoff } },
  overrideAccess: true,
  context: { skipActivityLog: true },
});

payload.logger.info(
  `Activity-log retention complete: removed ${result.docs.length} entries older than ${retentionDays} days.`,
);
process.exit(0);
