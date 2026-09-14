# خط مبنای امنیت

## کنترل‌های داخل برنامه

- اولین حساب bootstrap مدیر اصلی است؛ seed هیچ کاربر یا رمز پیش‌فرض نمی‌سازد.
- مجوزها چک‌باکسی و مستقل‌اند و روی هر collection/global در سمت سرور enforce می‌شوند.
- session احراز هویت ۲ ساعت، سقف تلاش ورود ۵ و lockout برابر ۱۵ دقیقه است.
- cookie در production امن و SameSite=Lax است.
- کاربران عمومی فقط محتوای published را می‌بینند.
- GraphQL خاموش، عمق رابطه حداکثر ۳ و telemetry خاموش است.
- CORS و CSRF از دامنه‌های صریح تنظیم می‌شوند.
- upload حداکثر ۲۵MB و محدود به jpeg/png/webp/avif/mp4/pdf است؛ SVG و paste URL پذیرفته نمی‌شود.
- فرم همکاری Origin، honeypot و زمان تکمیل را کنترل می‌کند؛ رزومه با سقف ۵ فایل/۱۰MB برای هر فایل/۲۰MB مجموع، allowlist و signature validation پذیرفته می‌شود.
- در Linux، token امضاشده و یک‌بارمصرف، Redis داخلی، سقف per-IP و global و محدودیت تکرار شماره تماس قبل از ذخیره‌سازی اعمال می‌شود؛ IP خام ذخیره نمی‌شود.
- رزومه در collection و storage خصوصی با نام تصادفی قرار می‌گیرد و فقط مجوز مستقل منابع انسانی به آن دسترسی می‌دهد.
- audit log عملیات و نام فیلدهای تغییرکرده را ثبت می‌کند، نه مقدارها، رمزها یا secretها.
- container سرور non-root، read-only، بدون capability و با شبکهٔ داخلی DB اجرا می‌شود.
- PostgreSQL به host publish نمی‌شود و app پیش‌فرض فقط روی loopback در دسترس proxy است.
- secretهای واقعی با `.gitignore` و `.dockerignore` از source/image کنار گذاشته می‌شوند.
- پاسخ‌های برنامه security header دارند؛ CSP سخت‌گیرانه هنوز به‌دلیل نیاز به آزمون کامل پنل Payload فعال نشده است.

## کنترل‌های الزامی محیط شرکت

- HTTPS اجباری و HTTP redirect، TLS مدرن و HSTS پس از تأیید دامنه‌ها
- محدودکردن `/admin/*` و endpointهای کاربر با VPN، allowlist یا Zero Trust/SSO
- rate limit برای login، forgot-password و APIهای نوشتن در reverse proxy/WAF
- rate limit اختصاصی Nginx و Redis برای `/api/careers/apply`؛ CAPTCHA خارجی مانند Turnstile/hCaptcha فقط لایهٔ اختیاری تکمیلی است
- secret manager برای `PAYLOAD_SECRET`، DB، S3 و Resend؛ rotation ثبت‌شده
- backup رمزگذاری‌شده، immutable/off-site و restore آزمایش‌شده
- مانیتورینگ uptime، 5xx، login ناموفق، ظرفیت و انقضای TLS
- patch منظم OS/container و اسکن image/dependency در CI
- حساب شخصی برای هر مدیر؛ عدم استفاده از حساب مشترک
- محدودکردن `/admin` و `/api/users` با VPN سازمانی یا IP allowlist؛ نمونهٔ Nginx در `deploy/nginx/behrouz-admin-allowlist.conf.example`
- بازبینی فصلی دسترسی و لغو فوری دسترسی افراد جداشده

## secretها

| مقدار | محل مناسب | نکته |
|---|---|---|
| `PAYLOAD_SECRET` | secret manager/Worker secret | حداقل ۳۲ کاراکتر تصادفی؛ تغییر آن sessionها را باطل می‌کند |
| `POSTGRES_PASSWORD` و `DATABASE_URL` | secret manager سرور | رمز باید در URL به‌درستی encode شود |
| کلیدهای S3 | secret manager | دسترسی فقط bucket موردنیاز، نه کل account |
| `RESEND_API_KEY` | secret manager | فقط دامنه/فرستندهٔ موردنیاز |
| کلید Turnstile | secret manager/Worker secret | فقط برای دامنهٔ production و staging مجاز؛ secret در frontend قرار نگیرد |

خروجی command، screenshot و ticket نباید مقدار این متغیرها را نشان دهد.

## تماس سازمانی در سایت

ایمیل و شمارهٔ تماس از CMS به‌صورت متن وارد می‌شوند، اما frontend آن‌ها را به canvas/interaction تبدیل می‌کند تا برداشت سادهٔ botها و link scraping کاهش یابد. این روش «مخفی‌سازی قطعی» نیست: مرورگر برای نمایش باید داده را دریافت کند و مهاجم مصمم می‌تواند آن را استخراج کند. برای آدرس‌های بسیار حساس، فرم تماس با rate limit و Turnstile و یک alias قابل rotation راهکار قوی‌تری است.

## رزومه و دادهٔ شخصی

- متن درخواست و فایل رزومه نباید به analytics، error tracker، log عمومی یا ایمیل بدون رمزگذاری مناسب منتقل شود.
- retention از CMS قابل انتخاب ولی حداکثر ۷۳۰ روز است؛ مقدار نهایی باید با سیاست منابع انسانی/حقوقی شرکت هماهنگ شود.
- فایل حذف‌شده باید همراه application از storage پاک شود؛ backup طبق retention مستقل شرکت منقضی شود.
- در محیط حساس، فایل پیش از دراختیارگذاشتن برای مدیر با آنتی‌ویروس/سامانهٔ sandbox سازمانی اسکن شود.

## ریسک‌های باقیمانده و پیشنهاد فاز بعد

- MFA بومی/SSO برای مدیران هنوز جزو این release نیست؛ پنل باید پشت کنترل هویت شبکه قرار گیرد.
- CSP report-only و سپس enforce پس از تست پنل، preview، upload و ویدئو اضافه شود.
- اسکن بدافزار فایل‌های uploadشده برای محیط‌های حساس افزوده شود.
- مسیر Linux به CAPTCHA خارجی وابسته نیست. اگر حملهٔ توزیع‌شده یا bot پیشرفته مشاهده شد، hCaptcha/Turnstile یا WAF به‌عنوان لایهٔ افزوده فعال شود.
- audit log داخلی جایگزین SIEM نیست؛ رخدادهای proxy، identity و app به log مرکزی فرستاده شوند.
- بررسی dependency در ۱۴ سپتامبر ۲۰۲۶ پس از ارتقای امنیتی Payload، ۶ هشدار moderate و صفر high/critical نشان داد. موارد باقی‌مانده در زنجیرهٔ ابزار migration (`drizzle-kit`/`esbuild`) هستند، در runtime عمومی استفاده نمی‌شوند و در نسخهٔ فعلی upstream اصلاح در دسترس ندارند؛ در ارتقای بعدی باید دوباره بررسی شوند.

## الزامات قبل از production

- `npm audit --audit-level=high` موفق باشد.
- secret scan و image scan در CI سازمان فعال شود.
- نفوذپذیری login، access control، upload و draft leakage در staging بررسی شود.
- حساب bootstrap پس از ساخت با ایمیل سازمانی، رمز منحصربه‌فرد و مسیر بازیابی معتبر کنترل شود.
- هیچ مقدار `CHANGE_ME` یا `REPLACE_WITH_` در تنظیمات production باقی نماند.
