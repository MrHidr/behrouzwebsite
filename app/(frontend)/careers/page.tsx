import { Navbar } from "@/components/navbar/Navbar";
import { CareersPage } from "@/components/careers/CareersPage";
import { CompactFooter } from "@/components/footer/CompactFooter";
import { managedPageMetadata } from "@/lib/cms-metadata";
import { getManagedPage } from "@/lib/cms";
import { getCareerFormConfig } from "@/lib/careers";
import { createCareerFormToken } from "@/lib/career-form-token";

export const dynamic = "force-dynamic";

export const generateMetadata = () =>
  managedPageMetadata("careers", {
    title: "همکاری با ما | صنایع غذایی بهروز",
    description: "فرصت همکاری با صنایع غذایی بهروز و ارسال امن رزومه برای تیم منابع انسانی.",
  });

export default async function CareersRoute() {
  const formToken = createCareerFormToken();
  const [page, formConfig] = await Promise.all([
    getManagedPage("careers"),
    getCareerFormConfig(),
  ]);

  return (
    <main className="relative">
      <Navbar />
      <CareersPage page={page} formConfig={formConfig} formToken={formToken} />
      <CompactFooter />
    </main>
  );
}
