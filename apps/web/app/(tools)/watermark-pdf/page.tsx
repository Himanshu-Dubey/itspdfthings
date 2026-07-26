import type { Metadata } from "next";
import { Droplet } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("watermark-pdf", seo);
}

export default async function WatermarkPdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["watermark-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={Droplet}
        title="Watermark PDF"
        description="Stamp a text watermark across every page of your PDF."
        iconBg="bg-pink-50"
        iconText="text-pink-600"
        glow="from-pink-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "watermark",
            label: "Add Watermark",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "text",
                label: "Watermark text",
                type: "text",
                placeholder: "e.g. DRAFT, CONFIDENTIAL, © 2025 Acme Inc.",
                required: true,
                defaultValue: "DRAFT",
              },
              {
                name: "opacity",
                label: "Opacity",
                type: "select",
                defaultValue: "0.25",
                options: [
                  { value: "0.10", label: "Very faint (10%)" },
                  { value: "0.25", label: "Light (25%) — recommended" },
                  { value: "0.50", label: "Medium (50%)" },
                  { value: "0.75", label: "Dark (75%)" },
                ],
              },
              {
                name: "angle",
                label: "Angle",
                type: "select",
                defaultValue: "45",
                options: [
                  { value: "0",  label: "Horizontal (0°)" },
                  { value: "45", label: "Diagonal (45°) — recommended" },
                  { value: "90", label: "Vertical (90°)" },
                ],
              },
            ],
          }}
        />

        <ToolInfoCard title="About watermarks">
          <p>The watermark is rendered in grey at your chosen opacity and angle, centered on every page.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("watermark-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="watermark-pdf" />
      </div>
    </div>
  );
}
