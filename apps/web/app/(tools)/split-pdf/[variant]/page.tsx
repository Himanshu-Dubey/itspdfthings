import type { Metadata } from "next";
import { getToolVariantSlugs } from "@/lib/programmatic/catalog";
import { generateVariantMetadata, VariantPage } from "@/lib/programmatic/VariantPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getToolVariantSlugs("split-pdf").map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  return generateVariantMetadata("split-pdf", variant);
}

export default async function SplitPdfVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  return <VariantPage toolSlug="split-pdf" variantSlug={variant} />;
}
