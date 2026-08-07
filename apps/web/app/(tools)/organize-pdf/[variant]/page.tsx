import type { Metadata } from "next";
import { getToolVariantSlugs } from "@/lib/programmatic/catalog";
import { generateVariantMetadata, VariantPage } from "@/lib/programmatic/VariantPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getToolVariantSlugs("organize-pdf").map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  return generateVariantMetadata("organize-pdf", variant);
}

export default async function OrganizePdfVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  return <VariantPage toolSlug="organize-pdf" variantSlug={variant} />;
}
