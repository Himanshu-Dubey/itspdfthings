import type { Metadata } from "next";
import { Scissors } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("split-pdf", seo, {
    title: "Split PDF Online Free — Extract Pages | PDFThings",
    description: "Split a PDF into separate files or extract specific pages online for free. No sign-up, no software install. Files deleted after 12 hours.",
  });
}

export default async function SplitPdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["split-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={Scissors}
        title="Split PDF"
        description="Break a large PDF into smaller files, or pull out just the pages you need, in seconds."
        iconBg="bg-orange-50"
        iconText="text-orange-600"
        glow="from-orange-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "split",
            label: "Split PDF",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "pages",
                label: "Page range (optional)",
                type: "text",
                placeholder: "e.g. 1-3,5,8-10  —  leave blank to split all pages",
              },
            ],
          }}
        />

        <ToolInfoCard title="How to split a PDF">
          <p className="mb-3">Break a large PDF into smaller files, or pull out just the pages you need, in seconds. Choose to split by page range for extracting a specific section, or split every page into its own file.</p>
          <p className="mb-3">This is the right tool when you only need part of a document — a single chapter from a report, one form from a scanned batch, or a smaller file that fits under an email attachment limit. Upload your PDF, choose your split method, select your pages, and download the results.</p>
          <p className="mb-3">All uploads are encrypted in transit and automatically deleted within 12 hours. No sign-up needed, and no limit on how many PDFs you can split.</p>
          <p>Looking to combine files instead? Try <a href="/merge-pdf" className="text-brand hover:underline">Merge PDF</a> to bring separate documents back into one file, or <a href="/organize-pdf" className="text-brand hover:underline">Organize PDF</a> to reorder pages without creating new files.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("split-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="split-pdf" />
      </div>
    </div>
  );
}
