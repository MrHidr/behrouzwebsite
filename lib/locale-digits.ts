import type { Locale } from "@/lib/i18n";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Normalize Persian and Arabic-Indic digits to ASCII for links and searching. */
export function toLatinDigits(value: string | number) {
  return String(value)
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
}

/** Render every numeric run with the active locale's numeral system. */
export function localizeDigits(value: string | number, locale: Locale) {
  const latin = toLatinDigits(value);
  return locale === "fa"
    ? latin.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)])
    : latin;
}
