import { CONTACT_INFO, type Bi, type Locale } from "@/lib/i18n";

export type ContactLocation = {
  /** Unique slug; use a new value for every sales point. */
  id: string;
  index: string;
  title: Bi;
  kind: Bi;
  city: Bi;
  address: Bi;
  postal: string;
  phones: string[];
  fax?: string;
  /**
   * Add the exact pin as [latitude, longitude]. Once present, the embedded map
   * and every navigation service use the same source of truth automatically.
   */
  coordinates?: readonly [latitude: number, longitude: number];
};

export const CONTACT_LOCATIONS: ContactLocation[] = [
  {
    id: "head-office",
    index: "01",
    title: { fa: "دفتر مرکزی", en: "Head office" },
    kind: { fa: "امور اداری و ارتباطات", en: "Corporate contact" },
    city: { fa: "تهران", en: "Tehran" },
    address: {
      fa: "تهران، کیلومتر ۸ بزرگراه لشگری، غرب به شرق، بعد از بلوار دکتر عبیدی، بین رامک خودرو و تهران دیزل",
      en: "Tehran, km 8 of Lashgari Highway, west to east, after Dr. Obeidi Blvd., between Ramak Khodro and Tehran Diesel",
    },
    postal: CONTACT_INFO.headOffice.postal,
    phones: CONTACT_INFO.headOffice.phones,
    fax: CONTACT_INFO.headOffice.fax,
    coordinates: [35.70821, 51.24719],
  },
  {
    id: "factory",
    index: "02",
    title: { fa: "کارخانه بهروز", en: "Behrouz factory" },
    kind: { fa: "تولید و امور فنی", en: "Production & technical" },
    city: { fa: "البرز · ساوجبلاغ", en: "Alborz · Savojbolagh" },
    address: {
      fa: "کیلومتر ۱۵ جاده قدیم کرج–قزوین، شهرک اقدسیه، بعد از پل زیرگذر راه‌آهن، خیابان بهروز، کارخانه صنایع غذایی بهروز",
      en: "Km 15 of the old Karaj–Qazvin road, Aghdasieh, after the railway underpass, Behrouz St., Behrouz Food Industries",
    },
    postal: CONTACT_INFO.factory.postal,
    phones: CONTACT_INFO.factory.phones,
    // Add the verified factory pin here: coordinates: [latitude, longitude],
  },
];

const coordinateText = (location: ContactLocation) => location.coordinates?.join(",");

export function getEmbeddedMapUrl(location: ContactLocation, locale: Locale) {
  const query = coordinateText(location) ?? location.address[locale];
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

export function getNavigationLinks(location: ContactLocation, locale: Locale) {
  const coordinates = coordinateText(location);
  const address = location.address[locale];
  const destination = coordinates ?? address;

  return [
    {
      id: "google",
      label: "Google Maps",
      shortLabel: "G",
      color: "#4285f4",
      href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving&dir_action=navigate`,
    },
    {
      id: "neshan",
      label: locale === "fa" ? "نشان" : "Neshan",
      shortLabel: locale === "fa" ? "ن" : "N",
      color: "#00a77f",
      href: coordinates
        ? `https://neshan.org/maps/@${coordinates},16z,0p`
        : `https://neshan.org/maps/search/${encodeURIComponent(address)}`,
    },
    {
      id: "balad",
      label: locale === "fa" ? "بلد" : "Balad",
      shortLabel: locale === "fa" ? "ب" : "B",
      color: "#6f55cc",
      href: coordinates
        ? `https://balad.ir/location?latitude=${location.coordinates?.[0]}&longitude=${location.coordinates?.[1]}&zoom=16`
        : `https://balad.ir/search?query=${encodeURIComponent(address)}`,
    },
  ] as const;
}
