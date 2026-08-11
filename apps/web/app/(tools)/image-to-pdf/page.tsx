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
        description="Turn one or more JPG or PNG images into a single, clean PDF file."
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

        <ToolInfoCard title="How to convert images to PDF">
          <p className="mb-3">Turn one or more JPG or PNG images into a single, clean PDF file — useful for submitting scanned documents, combining photos of a whiteboard or notes, or turning receipts into a shareable file. Upload your images, arrange them in order, and download one PDF containing every image as its own page.</p>
          <p className="mb-3">This tool is especially handy for anyone converting phone photos of documents (IDs, receipts, signed forms) into a proper PDF for email or upload, since most portals and application forms expect a PDF rather than a folder of images. No quality is lost in the conversion — your images appear in the PDF exactly as uploaded.</p>
          <p className="mb-3">Files are encrypted in transit and automatically deleted within 12 hours. Free to use, with no sign-up and no watermark added to your file.</p>
          <p>Need to go the other way? Use <a href="/pdf-to-image" className="text-brand hover:underline">PDF → Image</a> to export PDF pages as image files instead.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("image-to-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="image-to-pdf" />
      </div>
    </div>
  );
}
