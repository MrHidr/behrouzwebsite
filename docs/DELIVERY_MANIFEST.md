# فهرست بستهٔ تحویل

کل repository یک محصول واحد است: سایت عمومی، پنل Payload، API، schema، migration، رسانه و ابزارهای استقرار. فایل secret، رمز، private key، dump دیتابیس و رزومهٔ واقعی جزو بستهٔ Git نیستند.

نسخهٔ فشردهٔ تحویل را می‌توان در پوشهٔ محلی `delivery/` ساخت یا نگهداری کرد؛ این پوشه عمداً وارد Git نمی‌شود. همراه فایل فشرده، checksum با پسوند `.sha256` تحویل شود.

## شروع و کنترل کیفیت

| مسیر | کاربرد |
|---|---|
| `README.md` | نقطه شروع و لینک اسناد |
| `package.json` و `package-lock.json` | نسخه‌های دقیق و فرمان‌های build/operation |
| `.env.example` | الگوی تنظیمات Linux بدون secret |
| `.dev.vars.example` | الگوی تنظیمات محلی Cloudflare بدون secret |
| `.github/workflows/ci.yml` | CI برای type، lint، هر دو build، audit و image |
| `.github/dependabot.yml` | پیشنهاد ماهانهٔ ارتقای dependency و image |

## استقرار Linux

| مسیر | کاربرد |
|---|---|
| `Dockerfile` | image چندمرحله‌ای، non-root و production |
| `compose.production.yml` | app، migration، PostgreSQL، Redis، volume و شبکه‌ها |
| `SERVER_DEPLOYMENT.md` | راه‌اندازی Linux، Nginx، update و backup |
| `scripts/validate-server-config.mjs` | کنترل تنظیمات پیش از build بدون چاپ secret |
| `deploy/nginx/` | نمونهٔ proxy، rate limit، HTTP/IP تست و allowlist پنل |
| `deploy/systemd/` | پاکسازی روزانهٔ log و رزومهٔ منقضی |

## استقرار Cloudflare

| مسیر | کاربرد |
|---|---|
| `CMS_DEPLOYMENT.md` | migration، seed، deploy و محدودیت‌های Cloudflare |
| `wrangler.jsonc` | Worker، D1 و R2 با placeholderهای مقصد |
| `open-next.config.ts` | تنظیمات OpenNext |
| `worker-configuration.d.ts` | typeهای binding |
| `scripts/validate-cloudflare-config.mjs` | جلوگیری از deploy با placeholder |

## کد سایت و CMS

| مسیر | کاربرد |
|---|---|
| `app/(frontend)/` | routeهای سایت عمومی و API همکاری |
| `app/(payload)/` | routeهای پنل و API Payload |
| `components/` | UI عمومی، پنل سفارشی، RTL و فرم همکاری |
| `lib/` | کاتالوگ پایه، دریافت محتوای CMS، locale و تنظیمات |
| `src/collections/` | محصولات، دسته‌ها، کاربران، رسانه، درخواست‌ها و log |
| `src/globals/` | اطلاعات و تنظیمات سراسری سایت |
| `src/fields/` و `src/access/` | فیلدهای مشترک و کنترل دسترسی |
| `src/hooks/` | audit و رفتارهای lifecycle |
| `src/migrations/postgres/` | تاریخچهٔ رسمی schema/data برای Linux |
| `src/migrations/d1/` | تاریخچهٔ رسمی schema/data برای Cloudflare |
| `src/payload.config.ts` | اتصال همه اجزای CMS و adapterها |

## محتوا، رسانه و عملیات

| مسیر | کاربرد |
|---|---|
| `public/media/` | تصاویر و ویدئوهای بهینه‌شدهٔ سایت |
| `public/catalogs/` | فایل‌های کاتالوگ عمومی |
| `scripts/cms-seed.ts` | دادهٔ اولیه؛ فقط بار اول یا با scope مشخص |
| `scripts/cms-smoke.ts` | کنترل تعداد و انتشار داده‌های اصلی |
| `scripts/cms-security-smoke.ts` | کنترل token یک‌بارمصرف و اتصال rate limiter |
| `scripts/cms-prune-logs.ts` | حذف log طبق retention |
| `scripts/cms-prune-careers.ts` | حذف درخواست و فایل رزومه طبق retention |
| `scripts/import-new-product-assets.mjs` | ورود کنترل‌شدهٔ رسانهٔ محصول |
| `scripts/optimize-media.mjs` و `scripts/build-product-loops.mjs` | بهینه‌سازی رسانه بدون جایگزینی دستی خام |

## اسناد مدیریتی و عملیاتی

| مسیر | کاربرد |
|---|---|
| `docs/SYSTEM_OVERVIEW.md` | معماری، سرویس‌ها و مرز مسئولیت |
| `docs/FUNCTIONAL_CATALOG.md` | صفحات، امکانات و مدل دسترسی |
| `docs/IT_HANDOVER.md` | ورودی‌های شرکت و روند تحویل |
| `docs/OPERATIONS_RUNBOOK.md` | پایش، backup، restore، update و incident |
| `docs/SECURITY_BASELINE.md` | کنترل‌های موجود، ریسک‌ها و الزامات production |
| `docs/RELEASE_CHECKLIST.md` | معیار پذیرش و امضا |
| `docs/TEST_SERVER_HANDOVER.md` | وضعیت واقعی سرور آزمایشی فعلی |

## چیزهایی که عمداً خارج از Git هستند

- `.env`، `.dev.vars` و secretهای بستر
- private keyهای SSH
- داده و volume دیتابیس
- فایل‌های رزومه در `private/career-files/`
- backupها، logهای runtime و خروجی‌های build
- تنظیمات مالکیت repository، DNS، TLS، SSO و monitoring سازمان

پیش از تحویل production، تیم IT باید `npm ci` و `npm run verify:release` را روی commit/tag تحویلی اجرا و سپس `docs/RELEASE_CHECKLIST.md` را تکمیل کند.
