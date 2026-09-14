import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CorporatePage } from "@/components/company/CorporatePages";
import { getManagedPage } from "@/lib/cms";
import { managedPageMetadata } from "@/lib/cms-metadata";

export const generateMetadata = () =>
  managedPageMetadata("about", {
    title: "درباره بهروز | About Behrouz",
    description:
      "داستان صنایع غذایی بهروز از سال ۱۳۵۶؛ نقاط عطف، مقیاس تولید، ارزش‌های سازمانی و افتخارات.",
  });

export default async function AboutPage() {
  const hero = await getManagedPage("about");
  return (
    <main className="relative">
      <Navbar />
      <CorporatePage kind="about" hero={hero} />
      <Footer />
    </main>
  );
}
