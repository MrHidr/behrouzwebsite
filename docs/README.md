# بسته تحویل فنی وب‌سایت بهروز

این پوشه مرجع مشترک تیم کسب‌وکار، توسعه، زیرساخت و امنیت است. ترتیب پیشنهادی مطالعه:

1. [نمای کلی سامانه](./SYSTEM_OVERVIEW.md) — معماری، سرویس‌ها، داده و مرزبندی مسئولیت‌ها
2. [فهرست امکانات و صفحات](./FUNCTIONAL_CATALOG.md) — routeها، بخش‌های قابل مدیریت و دسترسی‌ها
3. [راهنمای تحویل به IT](./IT_HANDOVER.md) — انتخاب بستر، ورودی‌های لازم و روند استقرار
4. [راهنمای عملیات](./OPERATIONS_RUNBOOK.md) — backup، restore، update، rollback و رخدادها
5. [خط مبنای امنیت](./SECURITY_BASELINE.md) — کنترل‌های موجود و کنترل‌های لازم در محیط شرکت
6. [چک‌لیست انتشار](./RELEASE_CHECKLIST.md) — معیار پذیرش پیش از production
7. [وضعیت سرور تست](./TEST_SERVER_HANDOVER.md) — آنچه واقعاً روی سرور آزمایشی اجرا و بررسی شده است
8. [فهرست بستهٔ تحویل](./DELIVERY_MANIFEST.md) — مسیر و نقش فایل‌های مهم repository

راهنماهای اجرایی جزئی‌تر در ریشهٔ پروژه قرار دارند:

- [`CMS_DEPLOYMENT.md`](../CMS_DEPLOYMENT.md): مدل محتوا، پنل و استقرار Cloudflare
- [`SERVER_DEPLOYMENT.md`](../SERVER_DEPLOYMENT.md): اجرای Linux با Docker Compose

## وضعیت تحویل

- یک repository شامل سایت، پنل، API، schema و migrationها
- دو خروجی قابل build: Linux container و Cloudflare Worker
- ۷ صفحهٔ محتوایی، ۶ صفحهٔ دسته‌بندی محصول و ۶۰ محصول اولیه
- هیچ کاربر یا رمز پیش‌فرضی داخل seed وجود ندارد
- CI برای بررسی type، lint، هر دو build و image سرور آماده است
- مقادیر دامنه، secret، شناسهٔ D1 و مقصد Git عمداً باید توسط مالک محیط تکمیل شوند
