import type { Bi, Locale } from "./i18n";

export function stableContentKey(prefix: "copy" | "value", ...parts: string[]) {
  const input = parts.join("\u241f");
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

export function managedCopyKey(value: Bi) {
  return stableContentKey("copy", value.fa, value.en);
}

export function managedValueKey(value: string) {
  return stableContentKey("value", value);
}

export function resolveManagedCopy(
  overrides: Record<string, Bi> | undefined,
  value: Bi,
  locale: Locale,
) {
  return overrides?.[managedCopyKey(value)]?.[locale] || value[locale];
}

export function resolveManagedValue(
  overrides: Record<string, string> | undefined,
  value: string,
) {
  return overrides?.[managedValueKey(value)] || value;
}
