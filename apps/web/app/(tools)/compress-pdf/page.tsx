import type { Metadata } from "next";
import { Minimize2 } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("compress-pdf", seo);
}

export default async function CompressPdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["compress-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={Minimize2}
        title="Compress PDF"
        description="Reduce your PDF file size without making text blurry or images unusable."
        iconBg="bg-amber-50"
        iconText="text-amber-600"
        glow="from-amber-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "compress",
            label: "Compress PDF",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "quality",
                label: "Compression level",
                type: "select",
                defaultValue: "medium",
                options: [
                  { value: "low",    label: "Low quality (smallest file)" },
                  { value: "medium", label: "Medium quality (recommended)" },
                  { value: "high",   label: "High quality (minimal compression)" },
                ],
              },
            ],
          }}
        />

        <ToolInfoCard title="Compression levels explained">
          <p className="mb-3">Reduce your PDF&apos;s file size without making the text blurry or the images unusable. Choose from low, medium, or high compression depending on whether the file needs to stay print-quality or just needs to be small enough to email.</p>
          <p className="mb-3">Most PDFs are large because of uncompressed images, not text — so this tool shrinks image data intelligently while keeping every word sharp, since text in a PDF is stored as vector data and isn&apos;t affected by compression. Medium compression works well for most everyday documents like resumes, reports, and invoices; use low compression for anything print-quality or photo-heavy.</p>
          <p className="mb-3">Your file is encrypted during upload and deleted automatically within 12 hours — nothing is stored longer than it needs to be, and no account is required.</p>
          <p>Need to send several files as one? <a href="/merge-pdf" className="text-brand hover:underline">Merge PDF</a> first, then compress the combined file here to keep the final attachment small.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("compress-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="compress-pdf" />
      </div>
    </div>
  );
}
