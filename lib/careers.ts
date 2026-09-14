import "server-only";

import config from "@payload-config";
import { getPayload } from "payload";
import {
  CAREER_FILE_TYPES,
  DEFAULT_CAREER_FORM_CONFIG,
  type CareerFileType,
  type CareerFormConfig,
} from "./careers-config";

const boundedInteger = (value: unknown, fallback: number, minimum: number, maximum: number) => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.trunc(numeric)));
};

export async function getCareerFormConfig(): Promise<CareerFormConfig> {
  if (process.env.CMS_ENABLED !== "true") return DEFAULT_CAREER_FORM_CONFIG;

  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({
      slug: "site-settings",
      locale: "fa",
      depth: 0,
      overrideAccess: true,
    });
    const careers = settings.careers;
    const allowedFileTypes = (careers?.allowedFileTypes || []).filter(
      (type): type is CareerFileType => type in CAREER_FILE_TYPES,
    );
    return {
      enabled: careers?.enabled !== false,
      maxFiles: boundedInteger(careers?.maxFiles, 3, 1, 5),
      maxFileSizeMB: boundedInteger(careers?.maxFileSizeMB, 10, 1, 10),
      maxTotalSizeMB: boundedInteger(careers?.maxTotalSizeMB, 20, 1, 20),
      allowedFileTypes: allowedFileTypes.length
        ? allowedFileTypes
        : DEFAULT_CAREER_FORM_CONFIG.allowedFileTypes,
    };
  } catch (error) {
    console.error("[careers] Could not load form limits; safe defaults are being used.", error);
    return DEFAULT_CAREER_FORM_CONFIG;
  }
}
