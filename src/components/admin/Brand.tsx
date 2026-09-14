import Image from "next/image";

const logoPath = "/media/site/logo.png";

export function BrandLogo() {
  return (
    <div className="behrouz-admin-brand behrouz-admin-brand--full">
      <Image
        alt="بهروز"
        className="behrouz-admin-brand__image"
        height={72}
        priority
        src={logoPath}
        width={72}
      />
      <span className="behrouz-admin-brand__copy">
        <strong>بهروز</strong>
        <small>مدیریت محتوا</small>
      </span>
    </div>
  );
}

export function BrandIcon() {
  return (
    <span className="behrouz-admin-brand behrouz-admin-brand--icon">
      <Image alt="بهروز" height={42} priority src={logoPath} width={42} />
    </span>
  );
}
