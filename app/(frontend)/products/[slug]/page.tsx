import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { CategoryDetailPage } from "@/components/product/CategoryDetailPage";
import { getCatalogCategory } from "@/lib/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCatalogCategory(slug);
  if (!data) return {};
  return {
    title: `${data.title.fa} | محصولات بهروز`,
    description: data.subs[0]?.sectionTitle.fa || `محصولات ${data.title.fa} بهروز`,
    openGraph: {
      title: `${data.title.fa} | محصولات بهروز`,
      description: data.subs[0]?.sectionTitle.fa || `محصولات ${data.title.fa} بهروز`,
      images: data.bg ? [{ url: data.bg }] : undefined,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCatalogCategory(slug);
  if (!data) notFound();

  return (
    <main className="relative">
      <Navbar />
      <CategoryDetailPage data={data} />
      <Footer />
    </main>
  );
}
