import type { Metadata } from "next";
import { getToolVariantSlugs } from "@/lib/programmatic/catalog";
import { generateVariantMetadata, VariantPage } from "@/lib/programmatic/VariantPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getToolVariantSlugs("page-numbers").map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  return generateVariantMetadata("page-numbers", variant);
}

export default async function PageNumbersVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  return <VariantPage toolSlug="page-numbers" variantSlug={variant} />;
}
