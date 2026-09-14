import type { Metadata, Viewport } from "next";
import { yekanBakh, dastNevis, montserrat } from "../fonts";
import { Loader } from "@/components/ui/Loader";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { CMSContentProvider } from "@/components/cms/CMSContentProvider";
import { getCMSContent } from "@/lib/cms";
import "../globals.css";

// Content can be switched on at runtime with CMS_ENABLED=true. Keeping the
// frontend dynamic prevents a Docker image built without production secrets
// from baking the fallback content into every route.
export const dynamic = "force-dynamic";

function siteURL() {
  try {
    return new URL(process.env.SERVER_URL || "https://behrouz.example");
  } catch {
    return new URL("https://behrouz.example");
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCMSContent();
  return {
    title: content.seo.title.fa,
    description: content.seo.description.fa,
    metadataBase: siteURL(),
    openGraph: {
      title: content.seo.title.fa,
      description: content.seo.description.fa,
      type: "website",
      locale: "fa_IR",
    },
    icons: {
      icon: [
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
      title: "Behrouz",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#e42e1d",
  width: "device-width",
  initialScale: 1,
  // Fill the whole screen on notched phones in landscape (no white side
  // bands); content that needs clearance uses env(safe-area-inset-*).
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cmsContent = await getCMSContent();
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${yekanBakh.variable} ${dastNevis.variable} ${montserrat.variable}`}
    >
      <body>
        <CMSContentProvider value={cmsContent}>
          <LocaleProvider>
            <IntroProvider>
              <Loader />
              {children}
            </IntroProvider>
          </LocaleProvider>
        </CMSContentProvider>
      </body>
    </html>
  );
}
