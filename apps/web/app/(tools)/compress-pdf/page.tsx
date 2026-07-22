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
        description="Reduce your PDF file size. Choose how aggressively to compress."
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
          <ul>
            <li><strong>Low</strong> — 72 dpi, smallest possible file. Good for email attachments.</li>
            <li><strong>Medium</strong> — 150 dpi, balanced. Good for most uses (recommended).</li>
            <li><strong>High</strong> — 300 dpi, near-print quality with modest size reduction.</li>
          </ul>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("compress-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="compress-pdf" />
      </div>
    </div>
  );
}
