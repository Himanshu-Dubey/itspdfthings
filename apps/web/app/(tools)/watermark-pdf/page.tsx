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
  return buildPageMetadata("watermark-pdf", seo, {
    title: "Add Watermark to PDF Online Free",
    description: "Add a text or image watermark to your PDF online for free. Mark documents as draft, confidential, or branded in seconds.",
  });
}

export default async function WatermarkPdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["watermark-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={Droplet}
        title="Watermark PDF"
        description="Add a text or image watermark to every page of your PDF in seconds."
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
              {
                name: "layer",
                label: "Placement",
                type: "select",
                defaultValue: "above",
                options: [
                  { value: "above", label: "Above content (on top)" },
                  { value: "below", label: "Below content (behind)" },
                ],
              },
            ],
          }}
        />

        <ToolInfoCard title="How to watermark a PDF">
          <p className="mb-3">Add a text or image watermark to every page of your PDF — useful for marking documents as &quot;Draft,&quot; &quot;Confidential,&quot; or &quot;Sample,&quot; or for adding your logo across a document before sharing it externally. Choose your watermark text or upload an image, adjust the position, opacity, and size, and apply it across the whole document at once.</p>
          <p className="mb-3">This is a common step for freelancers sending sample work, businesses marking internal documents, or anyone who wants to discourage unauthorized reuse of a shared PDF. The watermark is applied to every page consistently, and the rest of the document&apos;s content and formatting stays untouched.</p>
          <p className="mb-3">Files are encrypted in transit and automatically deleted within 12 hours — no account or sign-up required to use the tool.</p>
          <p>Need to protect the file further? Try <a href="/protect-pdf" className="text-brand hover:underline">Protect PDF</a> to add a password on top of your watermark.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("watermark-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="watermark-pdf" />
      </div>
    </div>
  );
}
