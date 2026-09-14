import { DistributionPage } from "@/components/distribution/DistributionPage";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar/Navbar";
import { managedPageMetadata } from "@/lib/cms-metadata";
import { getManagedPage } from "@/lib/cms";

export const generateMetadata = () =>
  managedPageMetadata("distribution", {
    title: "شرکت پخش بهروز | Behrouz Distribution Company",
    description:
      "فروش و توزیع مویرگی برای توسعه برندهای FMCG در ایران؛ ۳۸ نقطه عملیاتی، ۷۶ هزار مشتری فعال و لجستیک یکپارچه.",
  });

export default async function DistributionRoute() {
  const page = await getManagedPage("distribution");
  return (
    <main className="relative">
      <Navbar />
      <DistributionPage page={page} />
      <Footer />
    </main>
  );
}
