import type { Metadata } from "next";
import { getToolVariantSlugs } from "@/lib/programmatic/catalog";
import { generateVariantMetadata, VariantPage } from "@/lib/programmatic/VariantPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getToolVariantSlugs("pdf-to-image").map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  return generateVariantMetadata("pdf-to-image", variant);
}

export default async function PdfToImageVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  return <VariantPage toolSlug="pdf-to-image" variantSlug={variant} />;
}
