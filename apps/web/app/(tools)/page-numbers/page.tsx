import type { Metadata } from "next";
import { Hash } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("page-numbers", seo, {
    title: "Add Page Numbers to PDF Online Free | PDFThings",
    description: "Add sequential page numbers to your PDF online for free. Choose position and starting number. No sign-up required.",
  });
}

export default async function PageNumbersPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["page-numbers"];

  return (
    <div>
      <ToolPageHeader
        icon={Hash}
        title="Add Page Numbers"
        description="Stamp sequential page numbers onto every page of your PDF in a position of your choice."
        iconBg="bg-emerald-50"
        iconText="text-emerald-600"
        glow="from-emerald-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "page-numbers",
            label: "Add Page Numbers",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "position",
                label: "Position",
                type: "select",
                defaultValue: "bottom-center",
                options: [
                  { value: "bottom-center", label: "Bottom center" },
                  { value: "bottom-left", label: "Bottom left" },
                  { value: "bottom-right", label: "Bottom right" },
                ],
              },
              {
                name: "start_at",
                label: "Start numbering at",
                type: "number",
                defaultValue: "1",
                min: 1,
                max: 9999,
              },
            ],
          }}
        />

        <ToolInfoCard title="How to add page numbers">
          <p className="mb-3">Stamp sequential page numbers across your PDF in a position of your choice — bottom center, bottom right, top corners, and more. Set your starting number, choose a format, and apply numbering to the entire document in one step.</p>
          <p className="mb-3">This is especially useful for longer documents like reports, contracts, or manuscripts where page numbers help readers navigate and reference specific sections. It also matters for print submissions and legal documents, where numbered pages are often required. The rest of your document&apos;s layout and content stays exactly as it was — only the numbers are added.</p>
          <p className="mb-3">Your file is encrypted in transit and deleted automatically within 12 hours. Free to use, with no account required.</p>
          <p>Combining several documents first? <a href="/merge-pdf" className="text-brand hover:underline">Merge PDF</a> them into one file, then add continuous page numbers here.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("page-numbers")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="page-numbers" />
      </div>
    </div>
  );
}
