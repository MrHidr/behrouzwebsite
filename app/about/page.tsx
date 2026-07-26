import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { AboutView } from "@/components/about/AboutView";

export const metadata = {
  title: "درباره بهروز | About Behrouz",
  description:
    "صنایع غذایی بهروز نیک — از سال ۱۹۷۷، تولید محصولات غذایی مورد اعتماد ایرانی با برنامه کیفیت «از مزرعه تا قفسه».",
};

export default function AboutPage() {
  return (
    <main className="relative">
      <Navbar />
      <AboutView />
      <Footer />
    </main>
  );
}
