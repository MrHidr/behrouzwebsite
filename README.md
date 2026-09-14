# Behrouz Website + Payload CMS

وب‌سایت، پنل فارسی، API و مدل محتوا در یک پروژهٔ Next.js/Payload قرار دارند. پنل در `/admin`، API در `/api` و health check در `/healthz` است.

- مسیر پیشنهادی و قابل‌حمل سازمانی: Linux + Docker Compose + PostgreSQL + volume/S3
- مسیر edge: Cloudflare Workers + D1 + R2
- schema و UI در هر دو خروجی یکسان است؛ فقط adapter دیتابیس و فایل تغییر می‌کند.
- محتوای اولیه شامل ۷ صفحهٔ مدیریت‌شده (از جمله «همکاری با ما»)، ۶ دسته و ۶۰ محصول است.

## مستندات تحویل

- [فهرست کامل اسناد](./docs/README.md)
- [معماری و سرویس‌ها](./docs/SYSTEM_OVERVIEW.md)
- [صفحات، امکانات و مدل دسترسی](./docs/FUNCTIONAL_CATALOG.md)
- [تحویل به IT و انتخاب بستر](./docs/IT_HANDOVER.md)
- [عملیات، backup و rollback](./docs/OPERATIONS_RUNBOOK.md)
- [امنیت](./docs/SECURITY_BASELINE.md)
- [چک‌لیست انتشار](./docs/RELEASE_CHECKLIST.md)
- [وضعیت سرور تست](./docs/TEST_SERVER_HANDOVER.md)
- [فهرست بستهٔ تحویل](./docs/DELIVERY_MANIFEST.md)
- [جزئیات CMS و Cloudflare](./CMS_DEPLOYMENT.md)
- [اجرای Linux با Docker](./SERVER_DEPLOYMENT.md)

نسخه‌های Payload عمداً یکسان و pin شده‌اند. `npm ci` همچنین patch سازگاری موقت Payload/OpenNext را از پوشهٔ `patches/` اعمال می‌کند؛ جزئیات و روش حذف امن آن در راهنمای استقرار آمده است.

```bash
npm ci
npm run verify:release
```

این فرمان هر دو خروجی Linux و Cloudflare را build می‌کند و هیچ deploy خارجی انجام نمی‌دهد. تنظیمات واقعی محیط در Git نگهداری نمی‌شوند؛ `.env.example` یا `wrangler.jsonc` را برای مقصد تکمیل کنید.
