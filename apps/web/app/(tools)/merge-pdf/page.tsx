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
  return buildPageMetadata("merge-pdf", seo, {
    title: "Merge PDF Files Online Free — No Sign-Up | PDFThings",
    description: "Combine multiple PDF files into one document in seconds. Free, no sign-up, no watermark. Files auto-deleted after 12 hours.",
  });
}

export default async function MergePdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["merge-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={Combine}
        title="Merge PDF"
        description="Combine multiple PDF files into one document in seconds — no installs, no account, no watermark."
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
          <p className="mb-3">Combine multiple PDF files into a single document in seconds — no installs, no account, and no watermark on your final file. Drag in as many PDFs as you need, arrange them in the order you want, and download one clean, merged document.</p>
          <p className="mb-3">Merging is the fastest way to turn scattered files into one professional document, whether you&apos;re putting together a job application with a resume and cover letter, combining invoices for a client, or assembling a portfolio. Just upload your files, drag to reorder them, and click merge — the whole process usually takes under a minute.</p>
          <p className="mb-3">Every file you upload is encrypted in transit and automatically deleted from our servers within 12 hours, so there&apos;s nothing left behind after you download your merged PDF. No account required, and no limit on how many times you can use the tool.</p>
          <p>Need to go the other direction? Try our <a href="/split-pdf" className="text-brand hover:underline">Split PDF</a> tool to pull pages back out of a document, or <a href="/compress-pdf" className="text-brand hover:underline">Compress PDF</a> if your merged file ends up too large to email.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("merge-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="merge-pdf" />
      </div>
    </div>
  );
}
