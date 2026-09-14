import config from "@payload-config";
import "@payloadcms/next/css";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import localFont from "next/font/local";
import type { ServerFunctionClient } from "payload";
import type { ReactNode } from "react";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

const yekanBakh = localFont({
  display: "swap",
  src: [
    { path: "../fonts/YekanBakh-Light.ttf", weight: "300" },
    { path: "../fonts/YekanBakh-Regular.ttf", weight: "400" },
    { path: "../fonts/YekanBakh-Medium.ttf", weight: "500" },
    { path: "../fonts/YekanBakh-Heavy.ttf", weight: "700 900" },
  ],
  variable: "--font-yekan-bakh",
});

const serverFunction: ServerFunctionClient = async (args) => {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout
      config={config}
      htmlProps={{ className: yekanBakh.variable }}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
