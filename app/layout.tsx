import type { Metadata, Viewport } from "next";
import { yekanBakh, dastNevis, montserrat } from "./fonts";
import { Loader } from "@/components/ui/Loader";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { IntroProvider } from "@/components/intro/IntroProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "صنایع غذایی بهروز| دوست من سلام",
  description:
    "صنایع غذایی بهروز — تولیدکننده سس، کنسرو، ترشی، خیارشور، مربا و آب لیمو. کیفیت و طعمی که به آن اعتماد دارید.",
  metadataBase: new URL("https://behrouz.example"),
  openGraph: {
    title: "صنایع غذایی بهروز",
    description: "از گذشته تا امروز، با بهروز",
    type: "website",
    locale: "fa_IR",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Behrouz",
  },
};

export const viewport: Viewport = {
  themeColor: "#e42e1d",
  width: "device-width",
  initialScale: 1,
  // Fill the whole screen on notched phones in landscape (no white side
  // bands); content that needs clearance uses env(safe-area-inset-*).
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${yekanBakh.variable} ${dastNevis.variable} ${montserrat.variable}`}
    >
      <body>
        <LocaleProvider>
          <IntroProvider>
            <Loader />
            {children}
          </IntroProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
