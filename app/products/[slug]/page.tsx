import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";
import { CategoryDetailPage } from "@/components/product/CategoryDetailPage";
import { PRODUCT_CATEGORIES } from "@/lib/site";
import { CATALOG } from "@/lib/catalog";

export function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = PRODUCT_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();

  const data = CATALOG[slug];

  // Categories with real catalog data (sauces, canned, pickles, gherkin,
  // lime-juice) get the full detail template. "jam" has no source data yet,
  // so it stays a placeholder rather than showing fabricated products.
  if (data) {
    return (
      <main className="relative">
        <Navbar />
        <CategoryDetailPage data={data} />
        <Footer />
      </main>
    );
  }

  return (
    <PagePlaceholder
      title={{ fa: cat.label, en: cat.labelEn }}
      subtitle={{
        fa: "محصولات این دسته به‌زودی نمایش داده می‌شوند.",
        en: "Products in this category are coming soon.",
      }}
    />
  );
}
