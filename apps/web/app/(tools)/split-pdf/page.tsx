import type { Metadata } from "next";
import { Scissors } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";

export const metadata: Metadata = {
  title: "Split PDF — Extract Pages Online Free",
  description: "Split a PDF into individual pages or extract a page range. Free and secure.",
};

export default function SplitPdfPage() {
  return (
    <div>
      <ToolPageHeader
        icon={Scissors}
        title="Split PDF"
        description="Split every page into a separate file, or extract a specific range of pages."
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
          <ol>
            <li>Upload your PDF.</li>
            <li>Optionally enter a page range (e.g. <code>1-5,8</code>) to extract only those pages.</li>
            <li>Click <strong>Split PDF</strong> — you&apos;ll download a ZIP of all pages.</li>
          </ol>
        </ToolInfoCard>
      </div>
    </div>
  );
}
