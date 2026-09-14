# نمای کلی سامانه

## خلاصهٔ مدیریتی

وب‌سایت عمومی و پنل مدیریت یک برنامهٔ واحد Next.js 16 + Payload CMS 3 هستند. محتوا از CMS خوانده می‌شود و در صورت اختلال موقت CMS، صفحات عمومی می‌توانند محتوای ثابت همراه release را نمایش دهند. این fallback جای backup یا مانیتورینگ را نمی‌گیرد، اما از سفیدشدن سایت در یک خطای کوتاه جلوگیری می‌کند.

گزینهٔ پیشنهادی برای تحویل قابل نصب روی تقریباً هر سرور شرکت، Linux + Docker Compose + PostgreSQL است. همان schema و رابط مدیریت با adapterهای D1 و R2 روی Cloudflare نیز قابل اجراست.

## معماری منطقی

```text
مرورگر
  ├── / و صفحات عمومی
  ├── /careers           فرم عمومی درخواست همکاری
  ├── /admin              پنل Payload
  └── /api                REST API پنل و محتوا
          │
          ▼
   Next.js + Payload CMS
      ├── Database        PostgreSQL یا D1
      ├── Abuse control   Redis داخلی در Linux / کنترل edge در Cloudflare
      ├── Public media    volume/S3 یا R2
      ├── Private resumes volume خصوصی/S3 یا R2
      └── Email           Resend (اختیاری؛ بازیابی رمز)
```

GraphQL خاموش است. مسیر `/healthz` آمادگی برنامه و اتصال دیتابیس را بررسی می‌کند.

## سرویس‌های runtime

| مسئولیت | Linux پیشنهادی | Cloudflare |
|---|---|---|
| سایت، پنل و API | یک container از Next.js/Payload | یک OpenNext Worker |
| پایگاه داده | PostgreSQL 17 | D1 |
| کنترل abuse فرم | Redis داخلی + Nginx | rate limit لبه + سرویس challenge منتخب |
| رسانه‌های جدید CMS | Docker volume یا S3-compatible | R2 |
| رزومه‌های خصوصی | Docker volume جدا یا S3-compatible | R2 با access کنترل‌شده |
| فایل‌های همراه نسخه | داخل image در `public/media` | static assets Worker |
| TLS و لایهٔ ورودی | Nginx/Caddy/Traefik شرکت | دامنه و edge کلادفلر |
| ایمیل بازیابی رمز | Resend، اختیاری | Resend، اختیاری |
| migration | سرویس یک‌بارهٔ `migrate` | فرمان Payload با binding راه‌دور |

## جریان داده

1. صفحهٔ عمومی محتوای منتشرشده را از Payload می‌خواند.
2. اگر CMS در دسترس نباشد، frontend به محتوای ثابت همان release برمی‌گردد.
3. مدیر در `/admin` محتوا را به‌صورت draft و سپس published ذخیره می‌کند.
4. تصاویر جدید در collection رسانه و storage مقصد ذخیره می‌شوند؛ فایل‌های قدیمی همراه کد تا زمان جایگزینی در کتابخانهٔ CMS نمایش داده نمی‌شوند.
5. تغییرات مدیریتی در activity log ثبت می‌شوند؛ مقدارهای حساس ذخیره نمی‌شوند و فقط نام فیلدهای تغییرکرده نگهداری می‌شود.
6. فرم همکاری پیش از پردازش فایل، token امضاشده و rate limit اتمیک Redis را کنترل می‌کند؛ سپس تعداد، حجم، نوع و امضای فایل بررسی و رزومه در storage خصوصی ذخیره می‌شود.

## ساختار repository

| مسیر | مسئولیت |
|---|---|
| `app/(frontend)` | routeها و layout سایت عمومی |
| `app/(payload)` | پنل و REST API Payload |
| `components` | UI سایت و پنل سفارشی |
| `lib` | کاتالوگ fallback، ترجمه‌ها و دریافت محتوای CMS |
| `src/collections` | کاربران، محصولات، صفحات، رسانه، درخواست‌های همکاری، رزومه و log |
| `src/globals` | تنظیمات سراسری سایت |
| `src/cms` | access control، ساختار صفحه، hook و migrationها |
| `public/media` | فایل‌های ثابت و بهینه‌شدهٔ همراه release |
| `scripts` | seed، smoke test، نگهداری log و پردازش asset |
| `Dockerfile` و `compose.production.yml` | خروجی production سرور Linux |
| `wrangler.jsonc` و `open-next.config.ts` | خروجی Cloudflare |
| `docs` | بستهٔ تحویل و عملیات |

پوشهٔ `New Product assets` ورودی خام طراحی است و در image Docker قرار نمی‌گیرد. فایل‌های نهایی بهینه‌شده در مسیرهای runtime نگهداری می‌شوند.

## وابستگی‌ها و قفل نسخه

- Node.js 24 و npm 11
- Next.js 16.3.4 و React 19.2.6
- Payload و adapterهای آن همگی 3.89.0 و عمداً هم‌نسخه‌اند
- OpenNext Cloudflare 1.20.6 و Wrangler 4.131.1
- PostgreSQL image: 17-alpine
- Redis image: 7.4-alpine، داخلی و بدون persistence چون فقط counter و token موقت نگه می‌دارد

`package-lock.json` باید همراه هر release باشد و نصب production با `npm ci` انجام شود. patchهای موقت سازگاری موجود در `patches/` بخشی از build هستند و هنگام ارتقای Payload/OpenNext باید دوباره ارزیابی شوند.

## قواعدی که نباید شکسته شوند

- هر تغییر schema باید migration متناظر برای PostgreSQL و D1 داشته باشد.
- صفحه یا سکشن جدید به تغییر کد، seed، migration، type generation و تست نیاز دارد؛ از پنل آزادانه ایجاد نمی‌شود.
- secretها و `.env` نباید commit شوند.
- حذف migration اجراشده یا rollback دیتابیس بدون restore آزمایش‌شده ممنوع است.
- فایل‌های رسانه، رزومه‌های خصوصی و دیتابیس باید با یک نقطهٔ زمانی سازگار backup شوند.
