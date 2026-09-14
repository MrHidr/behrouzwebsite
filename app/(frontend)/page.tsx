import { Navbar } from "@/components/navbar/Navbar";
import { HeroStage } from "@/components/hero/HeroStage";
import { AboutSection } from "@/components/about/AboutSection";
import { CategorySection } from "@/components/showcase/CategorySection";
import { Footer } from "@/components/footer/Footer";
import { HomeValueChain } from "@/components/company/HomeValueChain";
import { getManagedPage } from "@/lib/cms";

export default async function HomePage() {
  const page = await getManagedPage("home");
  return (
    <main className="relative">
      <Navbar />

      {/* The products showcase is the first opaque section to slide over the
          pinned hero, so the hero's scroll cue lands directly on products. */}
      <HeroStage>
        <CategorySection />
      </HeroStage>

      <AboutSection />

      <HomeValueChain page={page} />

      <Footer />
    </main>
  );
}
