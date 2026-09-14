import Link from "next/link";

export function DashboardWelcome() {
  return (
    <section className="behrouz-admin-welcome">
      <div className="behrouz-admin-welcome__content">
        <span className="behrouz-admin-welcome__eyebrow">پنل مدیریت وب‌سایت بهروز</span>
        <h1>محتوا را با خیال راحت مدیریت کنید.</h1>
        <p>
          تغییرات را ابتدا به‌صورت پیش‌نویس ذخیره کنید و پس از بازبینی منتشر کنید؛
          فقط نسخه‌های منتشرشده در وب‌سایت نمایش داده می‌شوند.
        </p>
      </div>
      <div className="behrouz-admin-welcome__actions">
        <Link className="behrouz-admin-welcome__primary" href="/admin/collections/products">
          مدیریت محصولات
        </Link>
        <a className="behrouz-admin-welcome__secondary" href="/" rel="noreferrer" target="_blank">
          مشاهده وب‌سایت
        </a>
      </div>
    </section>
  );
}
