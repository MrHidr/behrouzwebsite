# استقرار روی سرور لینوکسی شرکت

## تصویر کلی

سایت و پنل دو برنامهٔ جدا نیستند. یک برنامهٔ Next.js + Payload اجرا می‌شود و مسیرها را این‌طور ارائه می‌کند:

- `https://example.com/` — سایت عمومی
- `https://example.com/admin` — پنل مدیریت
- `https://example.com/api` — API داخلی سایت و پنل
- `https://example.com/healthz` — بررسی سلامت برنامه و دیتابیس

برای نسخهٔ سروری، پنج جزء داریم:

1. **Reverse proxy** شرکت (Nginx، Caddy یا Traefik) که دامنه و HTTPS را مدیریت می‌کند.
2. **App** که سایت، پنل و API را روی پورت داخلی `3000` اجرا می‌کند.
3. **PostgreSQL** برای محتوا، کاربران، sessionها، نسخه‌ها و logها.
4. **Storage** برای تصویر/ویدئوی عمومی و رزومه‌های خصوصی؛ در حالت ساده دو Docker volume جدا و در حالت حرفه‌ای S3-compatible.
5. **Redis داخلی** برای rate limit اتمیک و token یک‌بارمصرف فرم همکاری؛ هیچ پورتی روی اینترنت ندارد و دادهٔ اصلی در آن ذخیره نمی‌شود.

فایل‌های `Dockerfile` و `compose.production.yml` این ساختار را آماده کرده‌اند. PostgreSQL به اینترنت باز نمی‌شود و برنامه نیز پیش‌فرض فقط روی `127.0.0.1:3000` سرور قابل دسترسی است.

## پیش‌نیازهای شرکت

- یک سرور Linux به‌روز با Docker Engine و Docker Compose v2
- دامنه‌ای که DNS آن به سرور اشاره کند
- HTTPS معتبر در reverse proxy
- حداقل 2 vCPU، چهار گیگابایت RAM و فضای کافی برای رسانه و backup
- یک محل backup خارج از همان سرور

## راه‌اندازی اولیه

```bash
git clone REPLACE_WITH_REPOSITORY_URL behrouzwebsite
cd behrouzwebsite
cp .env.example .env
```

سپس `.env` را ویرایش کنید:

- `SERVER_URL` و `CMS_ALLOWED_ORIGINS`: دامنهٔ نهایی با `https://`
- `CMS_SECURE_COOKIES`: در production دامنه‌دار `true`؛ فقط برای تست موقت روی `http://IP` مقدار `false`
- `PAYLOAD_SECRET`: حداقل ۳۲ بایت تصادفی
- `POSTGRES_PASSWORD`: رمز تصادفی قوی
- `DATABASE_URL`: همان رمز با URL encoding در صورت داشتن کاراکتر ویژه
- تنظیمات ایمیل و S3 در صورت نیاز

قبل از ساخت، تنظیمات production را بدون نمایش مقدار secret بررسی کنید. اگر Node 24 روی host نصب نیست، همان validator را با Docker اجرا کنید:

```bash
npm run server:validate
# یا فقط با Docker
docker run --rm -v "$PWD:/work" -w /work node:24-alpine node scripts/validate-server-config.mjs
```

نمونهٔ ساخت secret:

```bash
openssl rand -base64 48
```

ساخت و اجرای سرویس‌ها:

```bash
docker compose -f compose.production.yml build
docker compose -f compose.production.yml up -d
docker compose -f compose.production.yml ps
curl --fail http://127.0.0.1:3000/healthz
```

بار اول، محتوای اولیه را فقط یک مرتبه وارد کنید:

```bash
docker compose -f compose.production.yml run --rm migrate npm run cms:seed
```

بعد از آن `/admin` را از یک شبکهٔ امن باز کنید و اولین مدیر را بسازید. seed کاربر یا رمز پیش‌فرض ایجاد نمی‌کند.

## حالت موقت تست با IP

اگر هنوز دامنه در اختیار نیست، فقط برای بازبینی موقت می‌توان `SERVER_URL` و `CMS_ALLOWED_ORIGINS` را روی `http://SERVER_IP` و `CMS_SECURE_COOKIES=false` گذاشت. در این حالت credential واقعی سازمانی یا دادهٔ حساس وارد نشود. نمونهٔ Nginx آماده در `deploy/nginx/behrouz-ip-test.conf.example` است.

برای production باید دامنه و HTTPS فعال، مقدار cookie دوباره `true` و HTTP به HTTPS redirect شود. validator اجازهٔ cookie ناامن را فقط برای `http://IP` می‌دهد تا این حالت تصادفاً روی دامنهٔ واقعی فعال نماند.

روی سرور کم‌حافظه، پیش از build حداقل ۲GB swap در نظر بگیرید. UFW باید فقط پورت‌های SSH موردنیاز، ۸۰ و ۴۴۳ را بپذیرد؛ پورت‌های ۳۰۰۰ و ۵۴۳۲ نباید عمومی شوند. Docker می‌تواند قواعد firewall خودش را ایجاد کند، بنابراین public نبودن port mapping را نیز با `docker compose ps` و یک بررسی شبکهٔ خارجی تأیید کنید.

## Reverse proxy

همهٔ مسیرها باید به همان app روی `127.0.0.1:3000` فرستاده شوند؛ برای پنل سرویس جدا لازم نیست. نمونهٔ حداقلی Nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    # رسانهٔ CMS تا ۲۵MB است؛ overhead فرم هم در نظر گرفته شده است.
    client_max_body_size 26m;

    location = /api/careers/apply {
        # سقف مجموع رزومه‌ها ۲۰MB است.
        client_max_body_size 22m;
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

گواهی TLS و تنظیمات سازمانی Nginx باید توسط تیم سرور اضافه شود. روی `/admin/*` و `/api/users/*` حتماً SSO، VPN یا allowlist بگذارید. روی login و forgot-password نیز rate limit لایهٔ proxy لازم است. برای فرم همکاری، Nginx حداکثر ۳ درخواست در دقیقه برای هر IP را می‌پذیرد و داخل برنامه نیز Redis محدودیت ۵ درخواست در ۱۵ دقیقه برای هر IP و ۱۰۰ درخواست در ساعت برای کل فرم را اعمال می‌کند. token امضاشدهٔ فرم یک‌بارمصرف است و یک شماره تماس حداکثر دو درخواست در ۲۴ ساعت دارد. مقادیر داخلی از `.env` قابل تنظیم‌اند؛ ضعیف‌کردن آن‌ها بدون آزمون staging توصیه نمی‌شود.

این مسیر به Cloudflare یا CAPTCHA شخص ثالث وابسته نیست. Turnstile/hCaptcha می‌تواند بعداً به‌عنوان لایهٔ اضافه فعال شود، اما جایگزین Redis، محدودیت Nginx، اعتبارسنجی فایل و private storage نیست.

فایل‌های آمادهٔ rate limit، proxy header و server block تست در `deploy/nginx/` هستند. در production، `X-Forwarded-Proto` باید از scheme واقعی proxy بیاید و server block تست با پیکربندی TLS سازمان جایگزین شود.

اگر شرکت IP ثابت یا VPN دارد، فایل `deploy/nginx/behrouz-admin-allowlist.conf.example` را با subnet واقعی تکمیل و داخل locationهای `/admin` و `/api/users` include کند. این کار را روی IP تست فعلی بدون داشتن مسیر جایگزین فعال نکنید، چون ممکن است دسترسی مدیر کاملاً قطع شود. endpointهای bootstrap، reset و login نیز نمونهٔ rate limit جدا دارند.

## کارهای روزمره

مشاهدهٔ وضعیت و log:

```bash
docker compose -f compose.production.yml ps
docker compose -f compose.production.yml logs -f --tail=200 app
docker compose -f compose.production.yml exec redis redis-cli ping
```

به‌روزرسانی نسخه:

```bash
git pull --ff-only
docker compose -f compose.production.yml build
docker compose -f compose.production.yml up -d
curl --fail https://example.com/healthz
```

در هر اجرا، سرویس `migrate` قبل از app فقط migrationهای جدید commit‌شده را اعمال می‌کند.

## Backup و بازیابی

حداقل هر شب از PostgreSQL و رسانه‌ها backup بگیرید. نمونهٔ dump دیتابیس:

```bash
docker compose -f compose.production.yml exec -T postgres \
  pg_dump -U behrouz -d behrouz_cms -Fc > behrouz-cms.dump
```

اگر S3 تنظیم نشده، volume رسانهٔ `cms_media` و volume خصوصی رزومهٔ `career_files` نیز باید backup شوند. dump و فایل‌ها را رمزگذاری و خارج از سرور اصلی نگه دارید. رزومه‌ها دادهٔ شخصی‌اند؛ دسترسی backup آن‌ها باید محدود و مدت نگهداری‌شان مطابق سیاست منابع انسانی باشد. بازیابی باید دوره‌ای روی محیط آزمایشی تست شود؛ وجود فایل backup بدون تست restore کافی نیست.

## چه چیزی را شرکت باید نگهداری کند؟

- سیستم‌عامل، Docker، reverse proxy و TLS
- backup و تست restore
- secretها و دسترسی SSH/CI
- PostgreSQL و فضای رسانه
- Redis داخلی فرم همکاری و هشدار خطای اتصال آن
- مانیتورینگ `/healthz`، مصرف دیسک، خطاها و انقضای گواهی
- اجرای روزانهٔ `npm run cms:logs:prune` از cron یا job مدیریتی
- اجرای روزانهٔ `npm run cms:careers:prune` برای حذف درخواست‌ها و رزومه‌های منقضی‌شده

برای سرورهای systemd، نمونهٔ service و timer روزانه در `deploy/systemd/` است. مسیر پروژه و نام کاربر داخل service باید با محیط مقصد تطبیق داده شود.

کد سایت، پنل، schema دیتابیس و migrationها همگی داخل همین repository تحویل داده می‌شوند؛ بنابراین شرکت برای build مجدد به سرویس SaaS خاصی وابسته نیست.
