import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CorporatePage } from "@/components/company/CorporatePages";
import { getManagedPage } from "@/lib/cms";
import { managedPageMetadata } from "@/lib/cms-metadata";

export const generateMetadata = () =>
  managedPageMetadata("innovation", {
    title: "نوآوری و کیفیت | صنایع غذایی بهروز",
    description:
      "فعالیت‌های تحقیق و توسعه بهروز؛ از رصد بازار و همکاری علمی تا فرمولاسیون سلامت‌محور، ارزیابی آزمایشگاهی و بهبود مستمر کیفیت.",
  });

export default async function InnovationPage() {
  const hero = await getManagedPage("innovation");
  return (
    <main className="relative">
      <Navbar />
      <CorporatePage kind="innovation" hero={hero} />
      <Footer />
    </main>
  );
}
