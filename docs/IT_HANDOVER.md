# راهنمای تحویل به تیم IT

## تصمیم استقرار

برای «قابل نصب روی هر سرور» مسیر Linux/Docker مبنای تحویل است. Cloudflare یک خروجی رسمی دوم است، نه وابستگی پروژه.

| معیار | Linux + Docker | Cloudflare |
|---|---|---|
| قابلیت انتقال | بسیار بالا؛ هر میزبان Docker | وابسته به حساب Cloudflare |
| دیتابیس | PostgreSQL استاندارد | D1 با محدودیت‌ها و tooling خاص Cloudflare |
| رسانه | volume یا هر S3-compatible | R2 |
| عملیات | نیازمند نگهداری OS/DB/proxy | زیرساخت کمتر، تنظیم binding و platform بیشتر |
| مقیاس جهانی | وابسته به CDN شرکت | edge پیش‌فرض |
| پیشنهاد | مبنای تحویل به IT سازمان | مناسب در صورت مالکیت و تجربهٔ Cloudflare |

## دسترسی‌ها و تصمیم‌های موردنیاز از شرکت

برای آماده‌سازی repository محلی دسترسی دیگری لازم نیست. برای انتشار واقعی، مالک سازمان باید این موارد را فراهم یا خودش اجرا کند:

- آدرس repository سازمانی و سیاست branch/approval
- دامنهٔ production و در صورت وجود staging
- مسیر استقرار منتخب: Linux یا Cloudflare
- برای Linux: دسترسی CI/SSH، reverse proxy، محل backup و مقصد S3 در صورت استفاده
- برای Cloudflare: account، Workers، D1، R2، DNS و secretهای محیط
- فرستندهٔ تأییدشدهٔ ایمیل برای بازیابی رمز، در صورت فعال‌سازی
- مقصد خصوصی رزومه، retention مصوب منابع انسانی و مسئول دسترسی به درخواست‌ها
- سیاست دسترسی پنل: VPN، allowlist، SSO/Access یا ترکیبی از آن‌ها
- مالک پاسخ‌گویی رخداد، RPO/RTO و زمان maintenance

هیچ credential شخصی نباید داخل repository یا ticket عمومی قرار گیرد. secretها در secret manager بستر مقصد ثبت می‌شوند.

## مدل Git پیشنهادی

می‌توان نسخهٔ فعلی را ابتدا در repository خصوصی حساب شخصی نگه داشت، به شرط آن‌که 2FA فعال باشد، collaboratorها حداقلی باشند و هیچ `.env`، key، dump یا رزومه commit نشود. برای تحویل رسمی، repository به GitHub Organization شرکت transfer شود تا مالکیت و دسترسی پس از پایان همکاری وابسته به حساب شخصی نماند.

- `main` همیشه قابل انتشار و protected باشد.
- هر تغییر روی branch کوتاه‌عمر و از طریق pull request انجام شود.
- CI و حداقل یک approval برای merge الزامی شود.
- migrationهای D1 و PostgreSQL همراه همان PR بررسی شوند.
- release production با tag نسخه‌دار مانند `v1.0.0` علامت‌گذاری شود.
- دسترسی مستقیم push به `main` و force-push بسته باشد.

workflow موجود در `.github/workflows/ci.yml` typecheck، lint، build سرور، build Cloudflare، audit سطح high و build image را اجرا می‌کند. قبل از merge باید سبز باشد.

Dependabot نیز ماهانه برای npm، imageهای Docker و GitHub Actions پیشنهاد ارتقا می‌سازد. پکیج‌های Payload گروهی ارتقا داده می‌شوند تا adapterها هم‌نسخه بمانند؛ این PRها باید در staging تست شوند و خودکار merge نشوند.

## استقرار Linux، مسیر پیشنهادی

1. سرور به‌روز با Docker Engine/Compose v2، حداقل 2 vCPU و 4GB RAM آماده شود.
2. repository clone و `.env.example` به `.env` کپی شود.
3. دامنه‌ها، `PAYLOAD_SECRET`، رمز PostgreSQL و مقصد رسانه تکمیل شوند.
4. `npm run server:validate` یا نسخهٔ Docker-only نوشته‌شده در راهنمای سرور اجرا شود؛ هیچ مقدار secret چاپ نمی‌شود.
5. imageها build و Compose اجرا شود؛ migration پیش از app کامل می‌شود.
6. `/healthz` ابتدا داخلی و سپس از دامنهٔ HTTPS بررسی شود.
7. seed فقط بار اول اجرا و سپس اولین مدیر از `/admin` ساخته شود.
8. backup دیتابیس و رسانه همان روز گرفته و restore آن در staging امتحان شود.
9. سلامت Redis، token یک‌بارمصرف، rate limit فرم همکاری و دسترسی خصوصی فایل رزومه تست شود؛ CAPTCHA خارجی فقط در صورت سیاست شرکت یا ریسک بالاتر افزوده شود.

فرمان‌ها و نمونهٔ proxy در [`SERVER_DEPLOYMENT.md`](../SERVER_DEPLOYMENT.md) آمده است.

## استقرار Cloudflare

1. یک D1 database و R2 bucket ترجیحاً جدا برای staging و production ساخته شود؛ رزومه‌ها با policy خصوصی و دسترسی حداقلی نگهداری شوند.
2. placeholderهای دامنه و `database_id` در تنظیمات محیط مقصد جایگزین شوند.
3. `PAYLOAD_SECRET` و کلید Resend، در صورت نیاز، به‌عنوان secret ثبت شوند؛ نه `vars` متنی.
4. typeهای binding تولید و config validate شود.
5. migrationها اجرا، Worker deploy، سپس seed فقط بار اول اجرا شود.
6. health، login، upload/download رسانه و یک گردش draft/publish smoke-test شود.
7. Turnstile فرم همکاری، rate limit و عدم دسترسی عمومی رزومه end-to-end تست شود.

جزئیات فرمان‌ها در [`CMS_DEPLOYMENT.md`](../CMS_DEPLOYMENT.md) است. staging و production باید database، bucket و secret جدا داشته باشند.

## تعریف تحویل قابل قبول

تحویل زمانی کامل است که:

- repository به مالکیت سازمان منتقل و branch protection فعال شده باشد؛
- CI روی commit تحویلی موفق باشد؛
- دامنه و TLS معتبر باشند؛
- health monitor و هشدار فعال باشند؛
- ورود مدیر، ویرایش draft، انتشار و آپلود فایل تست شده باشند؛
- backup و restore دیتابیس، رسانه و رزومهٔ خصوصی عملاً آزمایش شده باشند؛
- حساب‌های اولیه نام‌دار باشند و حساب مشترک استفاده نشود؛
- مسئول عملیات، امنیت و محتوا مشخص باشند؛
- چک‌لیست [`RELEASE_CHECKLIST.md`](./RELEASE_CHECKLIST.md) امضا شود.

## مرز مسئولیت پیشنهادی

| حوزه | توسعه | IT/زیرساخت | کسب‌وکار |
|---|---:|---:|---:|
| کد، schema، migration و رفع باگ | مالک | مشاور | مطلع |
| OS، شبکه، TLS، secret و backup | مشاور | مالک | مطلع |
| کاربران پنل و مجوزها | پشتیبان | ناظر امنیتی | مالک مدیر اصلی |
| متن، محصول و رسانه | پشتیبان | مطلع | مالک |
| deploy و rollback | آماده‌سازی release | مالک اجرا | تأیید زمان/محتوا |

## مواردی که عمداً خودکار نشده‌اند

- ایجاد repository یا push به GitHub/GitLab
- deploy به حساب Cloudflare یا سرور شرکت
- ساخت DNS، TLS، SSO/VPN و حساب ایمیل
- انتخاب RPO/RTO و سیاست نگهداری backup

این‌ها به هویت و سیاست شرکت وابسته‌اند و پس از دریافت ورودی‌های بالا انجام می‌شوند.
