import { Navbar } from "@/components/navbar/Navbar";
import { ContactView } from "@/components/contact/ContactView";
import { CompactFooter } from "@/components/footer/CompactFooter";
import { managedPageMetadata } from "@/lib/cms-metadata";
import { getManagedPage } from "@/lib/cms";

export const generateMetadata = () =>
  managedPageMetadata("contact", {
    title: "تماس با ما | Contact Behrouz",
    description:
      "آدرس و مسیریابی مراکز بهروز، صدای مشتری، فروش، همکاری تجاری و راه‌های ارتباط مستقیم با واحدهای شرکت.",
  });

export default async function ContactPage() {
  const page = await getManagedPage("contact");
  return (
    <main className="relative">
      <Navbar />
      <ContactView page={page} />
      <CompactFooter />
    </main>
  );
}
