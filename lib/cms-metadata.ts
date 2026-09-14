import type { Metadata } from "next";
import { getManagedPage } from "./cms";

type ManagedPageSlug = Parameters<typeof getManagedPage>[0];

export async function managedPageMetadata(
  slug: ManagedPageSlug,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  const page = await getManagedPage(slug);
  const title = page?.seoTitle.fa || fallback.title;
  const description = page?.seoDescription.fa || fallback.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page?.image ? [{ url: page.image, alt: page.imageAlt.fa }] : undefined,
    },
  };
}
