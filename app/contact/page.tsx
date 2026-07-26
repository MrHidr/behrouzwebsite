import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ContactView } from "@/components/contact/ContactView";

export const metadata = {
  title: "تماس با ما | Contact Behrouz",
  description:
    "راه‌های ارتباط با صنایع غذایی بهروز نیک — دفتر مرکزی و کارخانه، صدای مشتری و پست الکترونیک واحدها.",
};

export default function ContactPage() {
  return (
    <main className="relative">
      <Navbar />
      <ContactView />
      <Footer />
    </main>
  );
}
