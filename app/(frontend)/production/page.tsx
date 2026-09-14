import { CorporatePage } from "@/components/company/CorporatePages";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { getManagedPage } from "@/lib/cms";
import { managedPageMetadata } from "@/lib/cms-metadata";

export const generateMetadata = () =>
  managedPageMetadata("production", {
    title: "تولید بهروز | صنایع غذایی بهروز",
    description:
      "مسیر تولید در صنایع غذایی بهروز؛ از پذیرش ماده اولیه و کنترل خط تا آزمون، رهایش و تحویل محصول.",
  });

export default async function ProductionPage() {
  const hero = await getManagedPage("production");
  return (
    <main className="relative">
      <Navbar />
      <CorporatePage kind="operations" hero={hero} />
      <Footer />
    </main>
  );
}
