"use client";

import NextImage, { type ImageProps } from "next/image";
import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ManagedPage } from "@/lib/cms-content";
import type { ManagedListItem } from "@/lib/cms-content";
import type { Bi } from "@/lib/i18n";
import {
  resolveManagedCopy,
  resolveManagedValue,
} from "@/lib/managed-content";

const ManagedPageContext = createContext<ManagedPage | undefined>(undefined);

export function ManagedPageProvider({
  page,
  children,
}: {
  page?: ManagedPage;
  children: ReactNode;
}) {
  return <ManagedPageContext.Provider value={page}>{children}</ManagedPageContext.Provider>;
}

export function useManagedPageContent() {
  const page = useContext(ManagedPageContext);
  const { locale } = useLocale();
  const pick = useCallback(
    (value: Bi) => resolveManagedCopy(page?.copyOverrides, value, locale),
    [locale, page?.copyOverrides],
  );
  const pickPair = useCallback(
    (fa: string, en: string) => pick({ fa, en }),
    [pick],
  );
  const value = useCallback(
    (fallback: string) => resolveManagedValue(page?.valueOverrides, fallback),
    [page?.valueOverrides],
  );
  const isSectionVisible = useCallback(
    (sectionKey: string) => page?.sectionVisibility?.[sectionKey] !== false,
    [page?.sectionVisibility],
  );
  const list = useCallback(
    <T,>(listKey: string, fallback: T[], map: (item: ManagedListItem, index: number) => T) => {
      if (!page?.sectionLists || !(listKey in page.sectionLists)) return fallback;
      return page.sectionLists[listKey].map(map);
    },
    [page],
  );

  return { locale, page, pick, pickPair, value, isSectionVisible, list };
}

export function ManagedSection({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: ReactNode;
}) {
  const page = useContext(ManagedPageContext);
  if (page?.sectionVisibility?.[sectionKey] === false) return null;
  return children;
}

export function ManagedImage({ src, ...props }: ImageProps) {
  const page = useContext(ManagedPageContext);
  const managedSource =
    typeof src === "string"
      ? page?.imageOverrides[src] ||
        (src === page?.heroLegacyImage ? page.image : src)
      : src;
  return <NextImage src={managedSource} {...props} />;
}
