"use client";

import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { StatusPage } from "@/components/ui/StatusPage";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <LocaleProvider>
          <StatusPage code="500" onRetry={reset} />
        </LocaleProvider>
      </body>
    </html>
  );
}
