import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export default function ProductsPage() {
  return (
    <PagePlaceholder
      title={{ fa: "محصولات بهروز", en: "Behrouz Products" }}
      subtitle={{
        fa: "سس‌ها، کنسرو، ترشی، خیارشور، مربا و آب لیمو.",
        en: "Sauces, canned foods, pickles, pickled cucumbers, jams and lime juice.",
      }}
    />
  );
}
