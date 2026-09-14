# وضعیت و تحویل سرور تست

این سند وضعیت قابل تکرار محیط آزمایشی ایجادشده در ۱۴ سپتامبر ۲۰۲۶ را ثبت می‌کند. هیچ رمز، secret یا private key در این سند یا repository قرار ندارد.

## نشانی‌ها و وضعیت فعلی

- سرور: Ubuntu 26.04.1 LTS، معماری x86_64
- نشانی تست: `http://94.184.41.173/`
- پنل: `http://94.184.41.173/admin`
- سلامت: `http://94.184.41.173/healthz`
- منابع واقعی مشاهده‌شده: ۲ vCPU، حدود ۴GB RAM، دیسک ۲۴GB و swap برابر ۲GB
- مسیر برنامه: `/opt/behrouzwebsite`
- کاربر deploy: `deploy`، عضو گروه Docker و بدون نیاز روزمره به root
- سرویس‌ها: Nginx روی پورت ۸۰، app فقط روی `127.0.0.1:3000`، PostgreSQL و Redis فقط در شبکه داخلی Compose

این محیط HTTP و مبتنی بر IP است و فقط برای بازبینی موقت است. رمز سازمانی، دادهٔ واقعی متقاضیان یا محتوای حساس در آن وارد نشود.

## اجزای نصب‌شده

- Docker Engine و Docker Compose v2
- `app` و `postgres` با health check؛ migration پیش از app اجرا می‌شود
- UFW با ورودی‌های ۲۲، ۸۰ و ۴۴۳ و رد سایر ورودی‌ها
- Nginx با سقف ۲۶MB عمومی، سقف ۲۲MB فرم همکاری، نرخ ۵ درخواست ورود در دقیقه و ۳ ارسال رزومه در دقیقه برای هر IP
- Redis داخلی برای token یک‌بارمصرف و سقف ۵ درخواست در ۱۵ دقیقه برای هر IP و ۱۰۰ درخواست در ساعت برای کل فرم
- volume جدا برای PostgreSQL، رسانهٔ CMS و رزومهٔ خصوصی
- swap دو گیگابایتی برای جلوگیری از شکست build روی ماشین کم‌حافظه
- timer روزانهٔ systemd برای پاکسازی activity log و درخواست‌های استخدام منقضی

نسخه‌های قابل کپی Nginx و systemd در پوشهٔ [`deploy`](../deploy) نگهداری می‌شوند. اگر مسیر یا نام کاربر مقصد متفاوت است، قبل از نصب فایل service اصلاح شود.

## کنترل‌های انجام‌شده

- build کامل image سرور و اجرای migration روی دیتابیس تازه
- seed اولیه: ۷ صفحه، ۶ دسته و ۶۰ محصول؛ بدون ساخت کاربر یا رمز پیش‌فرض
- پاسخ موفق `/healthz` از داخل و بیرون سرور
- سلامت containerهای app و PostgreSQL
- بازشدن سایت، صفحات محصول و صفحهٔ ساخت اولین مدیر
- اجرای موفق job پاکسازی log و رزومه
- عدم publish پورت PostgreSQL و اتصال app فقط از طریق Nginx
- writable بودن volume رسانه و رزومه برای کاربر non-root برنامه
- audit وابستگی‌ها: صفر مورد high/critical؛ موارد moderate در خط مبنای امنیت ثبت شده‌اند

## اصلاح‌های حاصل از استقرار واقعی

راهنمای اولیه از قبل معماری Docker، migration، seed، Nginx، backup و کنترل‌های امنیتی را پوشش می‌داد. اولین استقرار واقعی سه تفاوت محیطی را آشکار کرد و اکنون هر سه در کد و اسناد تثبیت شده‌اند:

- image برنامه از Alpine به Debian slim تغییر کرد، چون binary موردنیاز build در این محیط با Alpine سازگار نبود.
- migration افزودن محصول برای دیتابیس کاملاً خالی ایمن شد تا پیش از seed به نبود دسته وابسته نباشد.
- حالت موقت `http://IP` با cookie ناامنِ صریح و محدودشده به IP به validator اضافه شد؛ production همچنان HTTPS و cookie امن می‌خواهد.

همچنین تنظیمات واقعی Nginx، UFW، swap و timer روزانه که هنگام نصب اعمال شدند، در `deploy/` و همین سند ثبت شده‌اند.

## دسترسی و لغو آن

کلید موقت deploy فقط روی دستگاه تحویل‌دهنده و در مسیر ignoreشدهٔ `tmp/behrouz-test-deploy` است. root key موقت حذف شده است. برای لغو دسترسی deploy، مالک سرور باید خط public key مربوط به `behrouz-test-deploy-2026-09-14` را از `/home/deploy/.ssh/authorized_keys` حذف کند. private key نباید برای IT ارسال شود؛ IT باید کلید سازمانی خودش را ثبت کند.

## فرمان‌های بررسی برای IT

```bash
cd /opt/behrouzwebsite
docker compose -f compose.production.yml ps
docker compose -f compose.production.yml logs --tail=200 app
curl --fail http://127.0.0.1:3000/healthz
systemctl status behrouz-cms-maintenance.timer
```

## موارد باقی‌مانده برای production

این سرور برای تست آماده است، اما انتشار production تا انجام موارد زیر کامل نیست:

1. اتصال دامنه، TLS معتبر، redirect کامل HTTP به HTTPS و `CMS_SECURE_COOKIES=true`
2. انتقال repository به مالکیت سازمان و فعال‌سازی CI/branch protection
3. حساب‌های شخصی مدیران، ایمیل بازیابی و کنترل شبکه‌ای `/admin`
4. بازبینی rate limit روی دامنهٔ واقعی و افزودن CAPTCHA/WAF فقط در صورت الزام یا مشاهدهٔ حملهٔ توزیع‌شده
5. backup رمزگذاری‌شدهٔ off-site و آزمایش restore
6. تعیین RPO/RTO، retention رزومه و مسئول عملیات/رخداد
7. اجرای کامل و امضای [`RELEASE_CHECKLIST.md`](./RELEASE_CHECKLIST.md)

برای production از راهنمای [`SERVER_DEPLOYMENT.md`](../SERVER_DEPLOYMENT.md) استفاده شود؛ تنظیم HTTP/IP این محیط به production کپی نشود.
