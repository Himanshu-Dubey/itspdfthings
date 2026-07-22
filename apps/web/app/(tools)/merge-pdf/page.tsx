import type { Metadata } from "next";
import { Combine } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("merge-pdf", seo);
}

export default async function MergePdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["merge-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={Combine}
        title="Merge PDF"
        description="Combine multiple PDF files into a single document. Select all files at once."
        iconBg="bg-red-50"
        iconText="text-red-600"
        glow="from-red-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "merge",
            label: "Merge PDFs",
            accept: ".pdf,application/pdf",
            multiple: true,
            maxFiles: 20,
          }}
        />

        <ToolInfoCard title="How to merge PDFs">
          <ol>
            <li>Click the upload area or drag your PDF files in.</li>
            <li>Select as many files as you need (up to 20).</li>
            <li>Click <strong>Merge PDFs</strong> and download the combined file.</li>
          </ol>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("merge-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="merge-pdf" />
      </div>
    </div>
  );
}
