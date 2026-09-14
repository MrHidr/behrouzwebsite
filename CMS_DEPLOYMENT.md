# راهنمای CMS و استقرار

این پروژه Payload CMS را در همان برنامهٔ Next.js اجرا می‌کند. آدرس پنل `/admin`، REST API در `/api` و readiness endpoint در `/healthz` است. GraphQL عمداً غیرفعال شده است.

## مدل محتوا و کاربران پنل

«کاربر» در این CMS یعنی فردی که اجازهٔ ورود به پنل مدیریت دارد؛ سایت حساب مشتری یا بازدیدکننده ندارد. دسترسی هر کاربر با چک‌لیست مستقل تنظیم می‌شود: مدیریت کاربران، محصولات و دسته‌ها، متن و تصویر صفحات، تنظیمات عمومی، رسانه‌ها، انتشار محتوا، مشاهدهٔ گزارش فعالیت‌ها و مدیریت درخواست‌های همکاری. نقش‌های قدیمی فقط برای migration داده‌های قبلی مخفی نگه داشته شده‌اند و مبنای رابط جدید نیستند.

فقط محصول، دسته، زیردسته، کاربر پنل و رسانه به‌عنوان رکورد محتوایی مستقل قابل ایجاد هستند. هفت صفحهٔ اصلی از قبل ساخته شده‌اند و قابل افزودن یا حذف نیستند. درخواست‌های همکاری نیز فقط از فرم عمومی ساخته می‌شوند، نه دستی از پنل. ویرایش هر صفحه در سه تب «بخش اصلی»، «سکشن‌های صفحه» و «سئو» انجام می‌شود. سکشن‌های طراحی‌شده قابل افزودن، حذف یا تغییر نام نیستند؛ سکشن‌های محتوایی را می‌توان با گزینهٔ «نمایش این سکشن» بدون پاک‌شدن اطلاعات از سایت پنهان کرد. بخش اصلی صفحه عمداً همیشه فعال می‌ماند.

متن‌ها، تصاویر و مقادیر ثابت داخل هر سکشن قابل ویرایش ولی ساختارشان حذف‌نشدنی است. فقط لیست‌هایی که تغییر تعدادشان برای کسب‌وکار طبیعی است امکان افزودن، حذف و مرتب‌سازی دارند. در نسخهٔ فعلی، مراکز تماس، کارت‌های مسیر ارتباط و ایمیل واحدها از همین مدل استفاده می‌کنند؛ حداقل یک آیتم برای جلوگیری از صفحهٔ خراب اجباری است. لیست‌های عمومی موجود مانند راه‌های تماس فوتر، شبکه‌های اجتماعی، واریانت‌های محصول و تصاویر صحنهٔ دسته‌ها نیز از قبل افزودنی/حذف‌پذیرند. نسخه‌های قبلی و draftها تا ۳۰ نسخه نگهداری می‌شوند.

رابط پنل با روش رسمی Payload white-label شده است: فونت یکان‌بخ، لوگو و رنگ‌های بهروز، فرم ورود، navigation، کارت‌ها و Dashboard سفارشی دارد. زبان رابط مدیریت عمداً فقط فارسی است تا جهت صفحه همیشه RTL و تجربهٔ تیم محتوا یک‌دست باشد؛ این محدودیت به زبان محتوا ارتباطی ندارد و فیلدهای محتوایی فارسی و انگلیسی همچنان از انتخابگر locale قابل مدیریت‌اند. تم روشن و تاریک هر دو پشتیبانی می‌شوند و هیچ theme package شخص ثالثی به runtime اضافه نشده است.

اولین حسابی که از `/admin` ساخته می‌شود به‌صورت اجباری همهٔ دسترسی‌ها را می‌گیرد. بعد از آن فقط کاربری که «مدیریت کاربران و دسترسی‌ها» دارد می‌تواند کاربر بسازد یا چک‌لیست دسترسی را تغییر دهد. پنل را در اولین استقرار عمومی نکنید: ابتدا `/admin/*` و `/api/users/*` را پشت Cloudflare Access، VPN یا allowlist قرار دهید و بعد حساب اول را بسازید. محافظت از خود `/admin` به‌تنهایی کافی نیست، چون endpoint ساخت اولین کاربر زیر `/api/users` است. این کار پنجرهٔ تصاحب حساب اولیه را می‌بندد.

«کتابخانه رسانه‌ها» محل فایل‌هایی است که از داخل پنل آپلود می‌شوند: تصویر جایگزین صفحات، تصویر و ویدیوی محصول، PDF و فایل‌های جدید. فایل‌های قدیمی که همراه source پروژه تحویل شده‌اند عمداً تا زمان جایگزینی دوباره import نمی‌شوند، بنابراین خالی‌بودن کتابخانه در نصب تازه طبیعی است. بعد از اولین انتخاب «تصویر جایگزین» یا upload محصول، فایل در این کتابخانه و storage انتخاب‌شده (volume/S3 یا R2) دیده می‌شود.

رزومه‌ها عمداً وارد کتابخانهٔ عمومی رسانه نمی‌شوند. آن‌ها در collection و storage خصوصی «فایل‌های رزومه» نگهداری می‌شوند و فقط کاربری که مجوز «مشاهده و مدیریت درخواست‌های همکاری» دارد می‌تواند آن‌ها را ببیند. تعداد فایل، سقف هر فایل، سقف مجموع، فرمت‌های مجاز و مدت نگهداری از «تنظیمات سایت ← همکاری با ما» قابل کنترل است. سقف سخت برنامه ۵ فایل، ۱۰MB برای هر فایل و ۲۰MB در مجموع است و PDF/DOC/DOCX علاوه بر پسوند با signature داخلی بررسی می‌شوند.

فیلدهای آیتم‌های قابل مدیریت بر اساس محل مصرفشان شرطی شده‌اند. مرکز تماس فقط نام، شهر، نوع، نشانی، کدپستی، تلفن، دورنگار و مختصات می‌بیند؛ کارت مسیر ارتباط فقط عنوان، توضیح، ایمیل و رنگ؛ ایمیل واحدها فقط عنوان و ایمیل. ستون‌های قدیمیِ بدون مصرف مثل تصویر آیتم، metric و لینک عمومی از schema و migration حذف شده‌اند. در راه‌های ارتباط فوتر نیز فقط نوع، عنوان و مقدار باقی مانده و فیلد تکراری `href` حذف شده است؛ رفتار تماس/ایمیل را خود سایت از روی نوع می‌سازد.

ایمیل و تلفن سازمانی در UI عمومی داخل text node یا `mailto:`/`tel:` ثابت رندر نمی‌شود؛ مقدار روی canvas رسم و action تماس/ایمیل فقط پس از تعامل کاربر ساخته می‌شود. این روش برداشت سادهٔ DOM را کم می‌کند اما کنترل امنیتی قطعی نیست: bot دارای JavaScript، تحلیل network یا OCR همچنان می‌تواند مقدار عمومی را استخراج کند. برای پنهان‌ماندن واقعی نشانی مقصد، باید ایمیل نمایش داده نشود و فرم server-side با rate limit مستقل و ارسال از backend جایگزین شود؛ CAPTCHA خارجی در صورت نیاز یک لایهٔ تکمیلی است.

## توسعه محلی با Cloudflare D1/R2

```bash
cp .dev.vars.example .dev.vars
npm ci
npm run cf:typegen
NODE_ENV=production PAYLOAD_DB=d1 npm exec payload migrate
NODE_ENV=production PAYLOAD_DB=d1 npm exec payload run scripts/cms-seed.ts
npm run dev:cms:d1
```

سپس `http://localhost:3000/admin` را باز و اولین کاربر را ایجاد کنید. دادهٔ seed شامل ۶۰ محصول موجود، سکشن‌بندی تمام صفحه‌ها و محتواهای فعلی فارسی/انگلیسی است؛ رمز یا کاربر پیش‌فرض ایجاد نمی‌کند. بعد از migration مربوط به مدل صفحه‌ها، اجرای seed الزامی است تا داده‌های قدیمی بدون از‌دست‌رفتن ویرایش‌ها به سکشن‌های جدید منتقل شوند.

## استقرار روی سرور با Docker

راهنمای ساده‌تر و عملیاتی مخصوص تیم Linux شرکت در [SERVER_DEPLOYMENT.md](./SERVER_DEPLOYMENT.md) قرار دارد.

پیش‌نیاز: Docker Engine و Docker Compose v2، یک دامنه با TLS در reverse proxy، و فضای backup خارج از همان سرور.

```bash
cp .env.example .env
# تمام CHANGE_MEها و دامنه را تغییر دهید
docker compose -f compose.production.yml build
docker compose -f compose.production.yml up -d
docker compose -f compose.production.yml run --rm migrate npm run cms:seed
```

سرویس migration قبل از بالا آمدن app اجرا می‌شود و فقط migrationهای commit‌شده را اعمال می‌کند. PostgreSQL و Redis به اینترنت publish نشده‌اند و پورت app به‌طور پیش‌فرض فقط روی `127.0.0.1` میزبان باز می‌شود. app با filesystem فقط‌خواندنی، مسیرهای موقت محدود، کاربر non-root، capabilityهای حذف‌شده، `no-new-privileges` و log rotation اجرا می‌شود.

اگر `S3_BUCKET` خالی باشد، رسانه‌های عمومی در volume به نام `cms_media` و رزومه‌ها در volume جداگانهٔ `career_files` می‌مانند. برای چند replica یا انتقال آسان‌تر سرور، S3-compatible (AWS S3، MinIO و مشابه) را تنظیم کنید. دیتابیس، رسانه و رزومه‌ها باید با snapshot سازگار backup شوند.

برای reverse proxy، فقط پورت app را publish کنید؛ TLS، محدودیت اندازه request، rate limit روی `/api/users/login` و `/api/careers/apply` و allowlist/VPN برای `/admin/*` و `/api/users/*` را در proxy اعمال کنید. مسیر عمومی `/api/media/file/*` را مسدود نکنید، چون فایل‌های رسانه از آن سرو می‌شوند؛ مسیر فایل رزومه را عمومی نکنید. فرم همکاری در Linux علاوه بر Nginx از Redis داخلی و token امضاشدهٔ یک‌بارمصرف استفاده می‌کند.

## استقرار روی Cloudflare

ابتدا به حساب درست وارد شوید و منابع را ایجاد کنید:

```bash
npx wrangler whoami
npx wrangler d1 create behrouz-cms
npx wrangler r2 bucket create behrouz-cms-media
```

`database_id` خروجی D1 و دامنهٔ واقعی را جایگزین مقادیر `REPLACE_WITH_*` در `wrangler.jsonc` کنید. سپس secretها را وارد کنید؛ secret در Git یا `vars` قرار نگیرد:

```bash
npx wrangler secret put PAYLOAD_SECRET
npx wrangler secret put RESEND_API_KEY
npm run cf:typegen
npm run cf:cms:migrate
npm run cms:seed:cloudflare
npm run cf:deploy
```

`PAYLOAD_SECRET` را حداقل با ۳۲ بایت تصادفی بسازید و در password manager شرکت نگه دارید. `RESEND_API_KEY` اختیاری است؛ بدون آن بازیابی رمز عمداً ایمیل یا token را در log چاپ نمی‌کند و غیرفعال می‌ماند.

گزارش فعالیت به‌صورت پیش‌فرض ۱۸۰ روز نگه داشته می‌شود و این عدد از «تنظیمات سایت» بین ۳۰ تا ۷۳۰ روز قابل تغییر است. پاک‌سازی را روزانه از cron سرور یا CI زمان‌بندی‌شده اجرا کنید:

```bash
npm run cms:logs:prune
npm run cms:careers:prune
# یا برای D1 راه‌دور
npm run cf:cms:logs:prune
npm run cf:cms:careers:prune
```

Cloudflare build به دیتابیس production دست نمی‌زند. فقط فرمان‌های `cf:cms:*` و seed با remote binding کار می‌کنند. `cf:deploy` تا زمانی که placeholderها عوض نشده باشند متوقف می‌شود.

Redis داخل Docker و محدودیت Nginx مخصوص خروجی Linux هستند و در Workers اجرا نمی‌شوند. اگر خروجی Cloudflare منتشر شود، باید rate limiting لبهٔ Cloudflare یا یک challenge مانند Turnstile/hCaptcha روی فرم همکاری فعال شود؛ fallback حافظه‌ای هر Worker به‌تنهایی محافظت توزیع‌شدهٔ production محسوب نمی‌شود. در Linux، `TRUST_CLOUDFLARE_IP_HEADER` باید `false` بماند مگر اینکه Nginx واقعاً و مستقیماً پشت Cloudflare باشد و دسترسی مستقیم به origin بسته شده باشد.

برای production از Workers Paid استفاده کنید. خروجی فعلی در dry-run حدود `27.5 MiB` بدون فشرده‌سازی است و زیر [سقف `64 MiB` Workers](https://developers.cloudflare.com/workers/platform/limits/) قرار دارد، اما سقف CPU پلن Free فقط `10 ms` است و برای Next.js + Payload قابل اتکا نیست. D1 در Free نیز [سقف روزانهٔ read/write](https://developers.cloudflare.com/d1/platform/pricing/) دارد و پس از رسیدن به سقف queryها تا reset بعدی fail می‌شوند. مصرف D1، CPU و error rate را در dashboard مانیتور کنید.

### نکتهٔ سازگاری Payload و OpenNext

Payload `3.89.0` با Next 16 در graph تولیدشده برای Cloudflare، ابزار توسعه‌ای `drizzle-kit` را به‌اشتباه وارد runtime می‌کند. اصلاح رسمی هنوز در حال بررسی است؛ patchهای پوشهٔ `patches/` همان بارگذاری lazy را برای D1 و PostgreSQL اعمال می‌کنند و `npm ci` آن‌ها را خودکار نصب می‌کند. در CI گزینهٔ `--ignore-scripts` را استفاده نکنید. پس از انتشار نسخه‌ای از Payload که اصلاح upstream را دارد، همهٔ پکیج‌های Payload را با هم ارتقا دهید، `npm run cf:build` را تست کنید و فقط سپس patchها و `postinstall` را حذف کنید.

## workflow تغییر schema

بعد از تغییر collection/global، هر دو migration مستقل را بسازید:

```bash
npm run cms:migrate:create -- describe_change
NODE_ENV=production PAYLOAD_DB=d1 npm exec payload migrate:create describe_change
npm run cms:generate:types
npm run cms:generate:importmap
npm run cf:typegen
```

فایل‌های migration، `src/payload-types.ts` و import map را commit کنید. migration PostgreSQL و D1 قابل جایگزینی با هم نیستند.

## کنترل‌های امنیتی حاضر

- چک‌لیست دسترسی مستقل برای هر قابلیت و جداسازی edit از publish
- جلوگیری server-side از تغییر مستقیم سند منتشرشده توسط editor و بستن API تاریخچه/draft برای کاربر ناشناس
- session-based auth، cookie امن در production، انقضای ۲ ساعته، قفل ۱۵ دقیقه‌ای بعد از ۵ تلاش ناموفق
- CORS و CSRF فقط برای originهای اعلام‌شده
- GraphQL خاموش، REST depth حداکثر ۳ و محدودیت متن
- سقف فایل ۲۵MB، MIME allowlist، remote URL upload خاموش، SVG خاموش
- رزومهٔ خصوصی با سقف‌های سخت تعداد/حجم، allowlist و بررسی signature، نام تصادفی و access control مستقل
- token امضاشدهٔ یک‌بارمصرف و Redis داخلی برای محدودیت per-IP/global فرم همکاری در خروجی Linux
- headerهای HSTS، nosniff، SAMEORIGIN، Referrer و Permissions Policy
- عدم ثبت reset token در log وقتی ایمیل تنظیم نشده است
- audit trail برای ایجاد، ویرایش و حذف؛ فقط نام فیلدهای تغییرکرده ثبت می‌شود و نه مقدار، رمز، secret یا IP
- health check دیتابیس، migrationهای نسخه‌دار و fallback محتوای فعلی در صورت اختلال CMS

در آخرین بررسی dependencyها پس از ارتقای امنیتی Payload به `3.89.0`، `npm audit` هیچ مورد `high` یا `critical` گزارش نکرد و ۶ مورد `moderate` باقی ماند. این موارد از `drizzle-kit` و نسخهٔ توسعه‌ای esbuild می‌آیند، در runtime عمومی استفاده نمی‌شوند و فعلاً اصلاح upstream ندارند. این وضعیت باید در هر ارتقای Payload دوباره بررسی شود؛ اجرای خودکار `npm audit fix --force` بدون بررسی سازگاری مجاز نیست.

## محدودهٔ فعلی و ادامهٔ توسعهٔ CMS

در نسخهٔ فعلی، این موارد واقعاً از پنل قابل مدیریت‌اند:

- برند، منو، اطلاعات تماس، شبکه‌های اجتماعی، فوتر و فایل‌های کاتالوگ
- Hero و بخش معرفی صفحهٔ خانه و تمام متن/تصویر کارت‌های مسیرهای اصلی
- دسته، زیردسته، محصول، تصاویر/ویدئوها و ترتیب نمایش آن‌ها
- Hero، متن کامل، timeline، آمار، کارت‌ها و تصاویر صفحات درباره، نوآوری، تولید و پخش
- جزئیات مراکز، آدرس‌ها، تلفن‌ها، ایمیل واحدها و متن کامل صفحهٔ تماس
- متن، تصویر و فرم صفحهٔ همکاری؛ تنظیم محدودیت رزومه و گردش وضعیت درخواست‌ها
- SEO عمومی و SEO هر صفحه، draft، تاریخچهٔ نسخه‌ها و انتشار
- کاربران پنل با چک‌لیست دسترسی و گزارش فعالیت قابل فیلتر و پاک‌سازی دوره‌ای

پیشنهاد ترتیب فازهای بعدی:

1. Live Preview امن برای draft و لینک preview زمان‌دار برای بازبین‌ها.
2. گردش تأیید دو مرحله‌ای، کامنت داخلی و وضعیت «در انتظار تأیید».
3. خروجی CSV از audit trail، فیلترهای پیشرفته و هشدار تغییرات حساس.
4. زمان‌بندی انتشار/لغو انتشار و مدیریت redirect، canonical، sitemap و structured data.
5. تکمیل DAM: کنترل اجباری alt، crop/focal point، renditionهای بهینه و بررسی رسانه‌های بدون استفاده.
6. اتصال درخواست همکاری به ایمیل/ATS، اعلان مدیر و export کنترل‌شده با ثبت audit.
7. import/export گروهی CSV/Excel و اتصال یک‌طرفه یا دوطرفه به ERP/PIM شرکت.
8. جست‌وجو و فیلتر محصولات، cache invalidation مبتنی بر webhook و داشبورد سلامت محتوا.
9. SSO سازمانی و MFA در لایهٔ Cloudflare Access/Identity Provider.
10. runbook و تست دوره‌ای backup/restore، مانیتورینگ و alertهای عملیاتی.

## عملیات لازم شرکت

1. TLS و دامنهٔ واقعی را قبل از فعال‌سازی تنظیم کند.
2. پیش از ساخت اولین کاربر و سپس به‌صورت دائمی، برای `/admin/*` و `/api/users/*` در Cloudflare Access یا reverse proxy، SSO/VPN/allowlist قرار دهد.
3. روی login و forgot-password rate limit سراسری تعریف کند؛ قفل داخلی CMS به‌تنهایی جلوی password spraying روی کاربران متعدد را نمی‌گیرد.
4. backup روزانه PostgreSQL/D1 و S3/R2، تست restore دوره‌ای و نگهداری حداقل یک نسخه خارج از حساب اصلی داشته باشد.
5. secret rotation، MFA برای حساب Cloudflare/سرور و دسترسی حداقلی CI را اعمال کند.
6. dependency و image update، vulnerability scan و بازبینی log/alert را در CI زمان‌بندی کند.

## دستورهای بررسی قبل از تحویل

```bash
npm run cms:generate:types
npm run cms:generate:importmap
npm run cf:typegen
npm run verify:release
```
