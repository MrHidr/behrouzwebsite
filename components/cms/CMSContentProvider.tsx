"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { STATIC_CMS_CONTENT } from "@/lib/cms-content";
import type { CMSContent } from "@/lib/cms-content";

const CMSContentContext = createContext<CMSContent>(STATIC_CMS_CONTENT);

export function CMSContentProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: CMSContent;
}) {
  return <CMSContentContext.Provider value={value}>{children}</CMSContentContext.Provider>;
}

export function useCMSContent() {
  return useContext(CMSContentContext);
}
