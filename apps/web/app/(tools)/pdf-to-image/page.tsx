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
  return buildPageMetadata("pdf-to-image", seo, {
    title: "Convert PDF to JPG/PNG Online Free | PDFThings",
    description: "Convert PDF pages to JPG or PNG images online for free. Export individual pages or the whole document. No sign-up required.",
  });
}

export default async function PdfToImagePage() {
  const seo = await getSeoData();
  const pageData = seo.pages["pdf-to-image"];

  return (
    <div>
      <ToolPageHeader
        icon={FileImage}
        title="PDF → Image"
        description="Export any PDF page as a JPG or PNG image — for slides, social media, or sharing."
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

        <ToolInfoCard title="How to convert PDF to images">
          <p className="mb-3">Export any PDF page as a JPG or PNG image — useful for pulling a single page into a slide deck, sharing a document preview on social media, or extracting a diagram or photo that was embedded in a PDF. Upload your file, choose which pages to convert, and download individual image files.</p>
          <p className="mb-3">This is the tool to use when you need a visual, not a document — for example, dropping a contract page into an email as an image, or grabbing a chart from a report to reuse elsewhere. Each exported image reflects exactly what&apos;s on the PDF page at a resolution suitable for screen or print use.</p>
          <p className="mb-3">All files are encrypted in transit and deleted automatically within 12 hours. No account needed, and no limit on how many pages you can export.</p>
          <p>Need to go the other direction instead? Use <a href="/image-to-pdf" className="text-brand hover:underline">Image → PDF</a> to combine photos or scans into a single PDF file.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("pdf-to-image")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="pdf-to-image" />
      </div>
    </div>
  );
}
