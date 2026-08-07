import type { LucideIcon } from "lucide-react";
import type { ToolConfig } from "@/components/tools/PdfToolWidget";

export interface ProgrammaticVariant {
  slug: string;
  label: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  icon: LucideIcon;
  intro: string[];
  benefits: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  keywords: string[];
  related: string[];
}

export interface ProgrammaticTool {
  slug: string;
  label: string;
  canonicalPath: string;
  toolConfig: ToolConfig;
  variants: ProgrammaticVariant[];
}
