import type { Metadata } from "next";
import { FileImage } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("pdf-to-image", seo);
}

export default async function PdfToImagePage() {
  const seo = await getSeoData();
  const pageData = seo.pages["pdf-to-image"];

  return (
    <div>
      <ToolPageHeader
        icon={FileImage}
        title="PDF → Image"
        description="Export every page of your PDF as an image. Choose format and resolution."
        iconBg="bg-cyan-50"
        iconText="text-cyan-600"
        glow="from-cyan-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "pdf-to-image",
            label: "Convert to Images",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "format",
                label: "Output format",
                type: "select",
                defaultValue: "jpg",
                options: [
                  { value: "jpg", label: "JPG (smaller file size)" },
                  { value: "png", label: "PNG (lossless, larger files)" },
                ],
              },
              {
                name: "dpi",
                label: "Resolution (DPI)",
                type: "select",
                defaultValue: "150",
                options: [
                  { value: "72",  label: "72 DPI (screen / low quality)" },
                  { value: "150", label: "150 DPI (recommended)" },
                  { value: "300", label: "300 DPI (print quality)" },
                ],
              },
            ],
          }}
        />

        <ToolInfoCard title="Output">
          <p>You&apos;ll receive a ZIP archive containing one image per PDF page (e.g. <code>page-1.jpg</code>, <code>page-2.jpg</code>, …).</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("pdf-to-image")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="pdf-to-image" />
      </div>
    </div>
  );
}
