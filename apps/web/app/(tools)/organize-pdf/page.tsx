import type { Metadata } from "next";
import { ListOrdered } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("organize-pdf", seo, {
    title: "Organize PDF Online Free — Rotate & Reorder Pages",
    description: "Rotate, reorder, or delete PDF pages online for free. No sign-up required. Fix page order or orientation in seconds.",
  });
}

export default async function OrganizePdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["organize-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={ListOrdered}
        title="Organize PDF"
        description="Fix page order, rotate sideways scans, or delete unwanted pages from a PDF."
        iconBg="bg-violet-50"
        iconText="text-violet-600"
        glow="from-violet-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "organize",
            label: "Organize PDF",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "pages",
                label: "Pages to keep",
                type: "text",
                placeholder: "e.g. 1,3,5-8  —  leave blank to keep all",
              },
              {
                name: "rotation",
                label: "Rotation (optional)",
                type: "select",
                defaultValue: "",
                options: [
                  { value: "",       label: "No rotation" },
                  { value: "90:1-z", label: "Rotate all 90° clockwise" },
                  { value: "180:1-z",label: "Rotate all 180°" },
                  { value: "270:1-z",label: "Rotate all 90° counter-clockwise" },
                ],
              },
            ],
          }}
        />

        <ToolInfoCard title="How to organize a PDF">
          <p className="mb-3">Fix page order, rotate sideways scans, or delete unwanted pages from a PDF — all without creating a new file or losing any quality. Drag pages into the order you want, rotate any page that&apos;s upside down or sideways, and remove pages you don&apos;t need.</p>
          <p className="mb-3">This is the tool to reach for when a scanner saves pages out of order, a page comes through rotated, or a document has extra blank pages you want gone before sending it on. Upload your file, make your edits visually, and download — the rest of the document stays exactly as it was.</p>
          <p className="mb-3">Files are encrypted in transit and deleted automatically within 12 hours. No account or sign-up needed.</p>
          <p>If you need to combine several files instead of reordering one, try <a href="/merge-pdf" className="text-brand hover:underline">Merge PDF</a>; if you need to pull specific pages into their own file, use <a href="/split-pdf" className="text-brand hover:underline">Split PDF</a>.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("organize-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="organize-pdf" />
      </div>
    </div>
  );
}
