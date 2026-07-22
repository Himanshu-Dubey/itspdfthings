import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("image-to-pdf", seo);
}

export default async function ImageToPdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["image-to-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={ImageIcon}
        title="Image → PDF"
        description="Convert one or more images into a single PDF. Select multiple images to combine them."
        iconBg="bg-blue-50"
        iconText="text-blue-600"
        glow="from-blue-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "image-to-pdf",
            label: "Convert to PDF",
            accept: ".jpg,.jpeg,.png,.webp,.gif,.tiff,image/*",
            multiple: true,
            maxFiles: 20,
          }}
        />

        <ToolInfoCard title="Supported formats">
          <p>JPG, JPEG, PNG, WebP, GIF, TIFF — up to 20 images at once.</p>
          <p>When you select multiple images, each image becomes one page in the output PDF.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("image-to-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="image-to-pdf" />
      </div>
    </div>
  );
}
