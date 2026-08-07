import { mergePdfTool } from "./tools/mergePdf";
import { splitPdfTool } from "./tools/splitPdf";
import { compressPdfTool } from "./tools/compressPdf";
import { organizePdfTool } from "./tools/organizePdf";
import { imageToPdfTool } from "./tools/imageToPdf";
import { pdfToImageTool } from "./tools/pdfToImage";
import { watermarkPdfTool } from "./tools/watermarkPdf";
import { pageNumbersTool } from "./tools/pageNumbers";
import { protectPdfTool } from "./tools/protectPdf";
import type { ProgrammaticTool, ProgrammaticVariant } from "./types";

export type { ProgrammaticTool, ProgrammaticVariant };

export const PROGRAMMATIC_TOOLS: ProgrammaticTool[] = [
  mergePdfTool,
  splitPdfTool,
  compressPdfTool,
  organizePdfTool,
  imageToPdfTool,
  pdfToImageTool,
  watermarkPdfTool,
  pageNumbersTool,
  protectPdfTool,
];

export function getTool(slug: string): ProgrammaticTool | undefined {
  return PROGRAMMATIC_TOOLS.find((t) => t.slug === slug);
}

export function getToolVariantSlugs(slug: string): string[] {
  const tool = getTool(slug);
  return tool ? tool.variants.map((v) => v.slug) : [];
}

export function getVariant(
  toolSlug: string,
  variantSlug: string,
): { tool: ProgrammaticTool; variant: ProgrammaticVariant } | null {
  const tool = getTool(toolSlug);
  if (!tool) return null;
  const variant = tool.variants.find((v) => v.slug === variantSlug);
  if (!variant) return null;
  return { tool, variant };
}

export function getAllProgrammaticRoutes(): { tool: string; variant: string }[] {
  return PROGRAMMATIC_TOOLS.flatMap((tool) =>
    tool.variants.map((v) => ({ tool: tool.slug, variant: v.slug })),
  );
}
