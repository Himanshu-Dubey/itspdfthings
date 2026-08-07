import type { Metadata } from "next";
import { getToolVariantSlugs } from "@/lib/programmatic/catalog";
import { generateVariantMetadata, VariantPage } from "@/lib/programmatic/VariantPage";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getToolVariantSlugs("protect-pdf").map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const { variant } = await params;
  return generateVariantMetadata("protect-pdf", variant);
}

export default async function ProtectPdfVariantPage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const { variant } = await params;
  return <VariantPage toolSlug="protect-pdf" variantSlug={variant} />;
}
