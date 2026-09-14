# راهنمای عملیات

## پایش روزانه

- `/healthz` هر ۶۰ ثانیه از بیرون شبکه بررسی و در دو شکست متوالی هشدار داده شود.
- خطاهای 5xx، login ناموفق، قفل حساب، مصرف دیسک/دیتابیس و تأخیر پاسخ پایش شوند.
- انقضای دامنه و TLS حداقل ۳۰ روز زودتر هشدار داشته باشد.
- فضای PostgreSQL، media و storage خصوصی رزومه قبل از رسیدن به ۸۰٪ هشدار دهد.

## مشاهدهٔ وضعیت Linux

```bash
docker compose -f compose.production.yml ps
docker compose -f compose.production.yml logs --tail=200 app
docker compose -f compose.production.yml exec redis redis-cli ping
curl --fail https://example.com/healthz
```

logهای container چرخش محدود دارند. نگهداری بلندمدت باید به سامانهٔ log شرکت ارسال شود و شامل secret یا محتوای حساس نباشد.

## backup

حداقل روزانه و پیش از هر release از هر سه جزء backup بگیرید:

1. دیتابیس PostgreSQL یا D1
2. media volume، S3 یا R2
3. private career-files volume یا مقصد خصوصی رزومه در S3/R2

نمونهٔ PostgreSQL:

```bash
docker compose -f compose.production.yml exec -T postgres \
  pg_dump -U behrouz -d behrouz_cms -Fc > behrouz-cms.dump
```

backup باید رمزگذاری، خارج از سرور اصلی، دارای retention مصوب و با checksum باشد. دست‌کم فصلی restore کامل در staging انجام و زمان واقعی بازیابی ثبت شود. backup دیتابیس بدون رسانه یا برعکس، سایت را به وضعیت سازگار برنمی‌گرداند.

برای D1 از export رسمی محیط استفاده و برای R2 از replication یا ابزار backup سازمانی استفاده شود. خروجی‌ها در bucket همان production نگهداری نشوند.

## restore Linux

1. deploy و ویرایش CMS متوقف شود.
2. نسخهٔ app متناظر با زمان backup مشخص شود.
3. PostgreSQL جدید/خالی آماده و dump در آن restore شود.
4. media و رزومهٔ خصوصی متناظر restore شوند.
5. migration status و `/healthz` بررسی شوند.
6. چند صفحه، login، تصویر و draft/publish smoke-test شوند.
7. DNS/proxy فقط پس از تأیید به محیط بازیابی‌شده برگردد.

restore را ابتدا روی staging انجام دهید؛ روی production فایل‌های موجود را بدون snapshot جایگزین نکنید.

## انتشار نسخه جدید

1. release checklist و خروجی CI بررسی شود.
2. backup سازگار دیتابیس و رسانه گرفته شود.
3. image جدید ساخته شود؛ migration service پیش از app اجرا می‌شود.
4. health و smoke test انجام شود.
5. release/tag، migrationهای اجراشده و نتیجه تست در change record ثبت شوند.

```bash
git pull --ff-only
docker compose -f compose.production.yml build
docker compose -f compose.production.yml up -d
curl --fail https://example.com/healthz
```

## rollback

- اگر فقط کد مشکل دارد و migration ناسازگار اعمال نشده است، image/tag قبلی را اجرا کنید.
- اگر migration داده را تغییر داده است، rollback صرفاً با کد قبلی امن نیست؛ maintenance فعال و snapshot سازگار دیتابیس + رسانه restore شود.
- migration down را بدون runbook مخصوص همان migration اجرا نکنید.
- محتوای اشتباه را ترجیحاً با version history یا draft اصلاح کنید، نه rollback کل سامانه.

## نگهداری CMS

- گزارش‌های فعالیت طبق مدت تنظیم‌شده توسط job روزانه prune شوند:

```bash
docker compose -f compose.production.yml run --rm migrate npm run cms:logs:prune
docker compose -f compose.production.yml run --rm migrate npm run cms:careers:prune
```

- کاربران خروج‌کرده از سازمان همان روز غیرفعال/حذف شوند.
- مجوزها فصلی بازبینی شوند و کمترین دسترسی لازم اعمال شود.
- dependencyها ماهانه بررسی ولی ارتقا ابتدا در staging تست شود.
- فایل‌های orphan رسانه طبق فرایند تأیید محتوا پاک شوند؛ حذف مستقیم storage انجام نشود.
- رزومه‌ها دادهٔ شخصی‌اند؛ download آن‌ها ثبت/محدود شود و job حذف پس از مدت تنظیم‌شده هر روز اجرا شود.

نمونهٔ unit و timer آماده در `deploy/systemd/` قرار دارد. پس از تطبیق `User` و `WorkingDirectory` با سرور مقصد:

```bash
sudo cp deploy/systemd/behrouz-cms-maintenance.* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now behrouz-cms-maintenance.timer
sudo systemctl start behrouz-cms-maintenance.service
sudo systemctl list-timers behrouz-cms-maintenance.timer
```

اجرای دستی service بار اول برای اطمینان از دسترسی Docker و صحت تنظیمات الزامی است.

## ماتریس رخداد

| نشانه | بررسی اولیه | اقدام امن |
|---|---|---|
| `/healthz` ناموفق | app و DB logs، ظرفیت دیسک، اتصال DB | ترافیک مدیریت را متوقف؛ restart کنترل‌شده؛ در صورت نیاز rollback |
| سایت باز، پنل خراب | `/admin`، session/cookie، CORS/CSRF، proxy | دامنه و forwarded headers را بررسی؛ secret را خودسرانه عوض نکنید |
| upload ناموفق | سقف ۲۵MB، MIME، فضای storage، permission | ظرفیت/binding را اصلاح؛ فایل ممنوع را مجاز نکنید |
| فرم همکاری ناموفق | فعال‌بودن فرم، `redis-cli ping`، Origin/token، rate limit، سقف/نوع فایل و storage خصوصی | Redis را بازیابی کنید؛ محدودیت امنیتی را برای عبور یک فایل ضعیف نکنید |
| تصویر گم‌شده | رکورد media و object/volume | media backup را با همان snapshot DB مقایسه کنید |
| ورودهای مشکوک | proxy/Access و Payload logs | حساب را قفل، sessionها را با فرایند مصوب باطل و رخداد امنیتی ثبت کنید |
| ایمیل بازیابی نمی‌رسد | Resend، دامنه فرستنده و env | تنظیم email را اصلاح؛ reset token را در log چاپ نکنید |

## مقادیر عملیاتی که IT باید تصویب کند

- RPO: `TBD`
- RTO: `TBD`
- مدت نگهداری backup: `TBD`
- پنجرهٔ maintenance: `TBD`
- کانال و مسئول incident: `TBD`
- محل status page و مانیتورینگ: `TBD`
