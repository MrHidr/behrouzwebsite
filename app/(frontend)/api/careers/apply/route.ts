import config from "@payload-config";
import { getPayload } from "payload";
import { toLatinDigits } from "@/lib/locale-digits";
import {
  CAREER_FILE_TYPES,
  megabytesToBytes,
  type CareerFileType,
} from "@/lib/careers-config";
import { getCareerFormConfig } from "@/lib/careers";
import { createCareerFormToken, verifyCareerFormToken } from "@/lib/career-form-token";
import { checkCareerSubmissionRate, consumeCareerFormToken } from "@/lib/career-rate-limit";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

function jsonError(message: string, status: number, headers?: Record<string, string>) {
  return Response.json(
    { ok: false, message },
    { status, headers: { ...NO_STORE_HEADERS, ...headers } },
  );
}

function requestOriginAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const accepted = new Set<string>([new URL(request.url).origin]);
  for (const value of [process.env.SERVER_URL, process.env.CMS_ALLOWED_ORIGINS]) {
    for (const candidate of (value || "").split(",")) {
      try {
        const parsed = new URL(candidate.trim());
        if (!parsed.hostname.includes("REPLACE_WITH_")) accepted.add(parsed.origin);
      } catch {}
    }
  }
  return accepted.has(origin);
}

function fileType(file: File, data: Buffer, allowed: CareerFileType[]) {
  const name = file.name.toLowerCase();
  return allowed.find((type) => {
    const definition = CAREER_FILE_TYPES[type];
    const mimeMatches = definition.mimeTypes.includes(file.type as never) || file.type === "application/octet-stream";
    if (!name.endsWith(definition.extension) || !mimeMatches) return false;
    if (type === "pdf") return data.subarray(0, 1024).includes(Buffer.from("%PDF-"));
    if (type === "doc") {
      return data.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
    }
    return data.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04])) &&
      data.includes(Buffer.from("[Content_Types].xml")) &&
      data.includes(Buffer.from("word/"));
  });
}

export async function POST(request: Request) {
  if (!requestOriginAllowed(request)) return jsonError("درخواست نامعتبر است.", 403);

  let rate;
  try {
    rate = await checkCareerSubmissionRate(request);
  } catch {
    return jsonError("ارسال رزومه موقتاً در دسترس نیست؛ لطفاً کمی بعد تلاش کنید.", 503);
  }
  if (!rate.allowed) {
    return jsonError("تعداد درخواست‌ها بیش از حد مجاز است؛ لطفاً بعداً تلاش کنید.", 429, {
      "Retry-After": String(rate.retryAfterSeconds),
    });
  }

  const formToken = request.headers.get("x-career-form-token");
  if (!verifyCareerFormToken(formToken)) return jsonError("درخواست نامعتبر است؛ صفحه را تازه‌سازی کنید.", 403);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return jsonError("فرمت درخواست معتبر نیست.", 415);
  }

  const limits = await getCareerFormConfig();
  if (!limits.enabled) return jsonError("دریافت رزومه در حال حاضر غیرفعال است.", 503);

  const contentLength = Number(request.headers.get("content-length") || 0);
  const requestCeiling = megabytesToBytes(limits.maxTotalSizeMB) + 1024 * 1024;
  if (contentLength > requestCeiling) return jsonError("حجم مجموع فایل‌ها بیش از حد مجاز است.", 413);

  let body: FormData;
  try {
    body = await request.formData();
  } catch {
    return jsonError("فرم یا فایل‌ها قابل خواندن نیستند.", 400);
  }

  // Honeypot: return a neutral success response without storing bot traffic.
  if (String(body.get("website") || "").trim()) {
    return Response.json({ ok: true }, { headers: NO_STORE_HEADERS });
  }

  const startedAt = Number(body.get("startedAt"));
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 800 || elapsed > 2 * 60 * 60 * 1000) {
    return jsonError("زمان ارسال فرم معتبر نیست؛ صفحه را تازه‌سازی کنید.", 400);
  }

  const fullName = String(body.get("fullName") || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const phone = toLatinDigits(String(body.get("phone") || "")).replace(/[\s()-]/g, "");
  const locale = body.get("locale") === "en" ? "en" : "fa";
  const files = body.getAll("resumes").filter((value): value is File => value instanceof File && value.size > 0);

  if (fullName.length < 3 || fullName.length > 120) {
    return jsonError("نام و نام خانوادگی را کامل وارد کنید.", 400);
  }
  if (!/^\+?[0-9]{8,15}$/.test(phone)) {
    return jsonError("شماره تماس معتبر نیست.", 400);
  }
  if (!files.length || files.length > limits.maxFiles) {
    return jsonError(`حداکثر ${limits.maxFiles} فایل انتخاب کنید.`, 400);
  }

  let totalBytes = 0;
  const checkedFiles: Array<{ file: File; type: CareerFileType; data: Buffer }> = [];
  for (const file of files) {
    const data = Buffer.from(await file.arrayBuffer());
    const type = fileType(file, data, limits.allowedFileTypes);
    if (!type) return jsonError("نوع یکی از فایل‌ها مجاز نیست.", 415);
    if (file.size > megabytesToBytes(limits.maxFileSizeMB)) {
      return jsonError(`حجم هر فایل باید حداکثر ${limits.maxFileSizeMB} مگابایت باشد.`, 413);
    }
    totalBytes += file.size;
    checkedFiles.push({ file, type, data });
  }
  if (totalBytes > megabytesToBytes(limits.maxTotalSizeMB)) {
    return jsonError(`حجم مجموع فایل‌ها باید حداکثر ${limits.maxTotalSizeMB} مگابایت باشد.`, 413);
  }

  let payload: Awaited<ReturnType<typeof getPayload>>;
  try {
    payload = await getPayload({ config });
  } catch {
    return jsonError("ارسال رزومه موقتاً در دسترس نیست؛ لطفاً کمی بعد تلاش کنید.", 503);
  }
  const configuredDuplicateWindow = Number(process.env.CAREER_DUPLICATE_PHONE_HOURS || 24);
  const duplicateWindowHours = Number.isFinite(configuredDuplicateWindow)
    ? Math.min(168, Math.max(1, configuredDuplicateWindow))
    : 24;
  try {
    const recentFromSamePhone = await payload.find({
      collection: "career-applications",
      where: {
        and: [
          { phone: { equals: phone } },
          { createdAt: { greater_than: new Date(Date.now() - duplicateWindowHours * 60 * 60 * 1000).toISOString() } },
        ],
      },
      limit: 2,
      depth: 0,
      overrideAccess: true,
    });
    if (recentFromSamePhone.totalDocs >= 2) {
      return jsonError("برای این شماره اخیراً درخواست ثبت شده است؛ لطفاً بعداً تلاش کنید.", 429, {
        "Retry-After": String(Math.round(duplicateWindowHours * 60 * 60)),
      });
    }
  } catch (error) {
    payload.logger.error({ error }, "Career duplicate-submission check failed");
    return jsonError("ارسال رزومه موقتاً در دسترس نیست؛ لطفاً کمی بعد تلاش کنید.", 503);
  }

  try {
    if (!await consumeCareerFormToken(formToken!)) {
      return jsonError("این فرم قبلاً ارسال شده است؛ صفحه را تازه‌سازی کنید.", 409);
    }
  } catch {
    return jsonError("ارسال رزومه موقتاً در دسترس نیست؛ لطفاً کمی بعد تلاش کنید.", 503);
  }

  const uploadedIDs: number[] = [];
  try {
    for (const { file, type, data } of checkedFiles) {
      const storedName = `${crypto.randomUUID()}${CAREER_FILE_TYPES[type].extension}`;
      const uploaded = await payload.create({
        collection: "resume-files",
        overrideAccess: true,
        data: { originalName: file.name.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 255) || "resume" },
        file: {
          data,
          mimetype: CAREER_FILE_TYPES[type].mimeTypes[0],
          name: storedName,
          size: file.size,
        },
      });
      uploadedIDs.push(uploaded.id);
    }

    await payload.create({
      collection: "career-applications",
      overrideAccess: true,
      data: {
        fullName,
        phone,
        attachments: uploadedIDs,
        status: "new",
        locale,
      },
    });
  } catch (error) {
    for (const id of uploadedIDs) {
      try {
        await payload.delete({ collection: "resume-files", id, overrideAccess: true });
      } catch {}
    }
    payload.logger.error({ error }, "Career application submission failed");
    return Response.json(
      { ok: false, message: "ثبت درخواست انجام نشد؛ لطفاً دوباره تلاش کنید.", formToken: createCareerFormToken() },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }

  return Response.json(
    { ok: true, formToken: createCareerFormToken() },
    { status: 201, headers: NO_STORE_HEADERS },
  );
}
