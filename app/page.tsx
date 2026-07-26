import { Navbar } from "@/components/navbar/Navbar";
import { HeroStage } from "@/components/hero/HeroStage";
import { AboutSection } from "@/components/about/AboutSection";
import { CategorySection } from "@/components/showcase/CategorySection";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />

      {/* Hero scroll composition (sticky video + parallax copy) lives in
          HeroStage; the About section is passed in so it slides over the
          pinned, dimming video. */}
      <HeroStage>
        <AboutSection />
      </HeroStage>

      {/* Product categories showcase */}
      <CategorySection />

      <Footer />
    </main>
  );
}
