import type { Metadata } from "next";
import { Combine } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";

export const metadata: Metadata = {
  title: "Merge PDF — Combine PDFs Online Free",
  description: "Merge multiple PDF files into one document. Fast, free, and secure — files deleted after 12 hours.",
};

export default function MergePdfPage() {
  return (
    <div>
      <ToolPageHeader
        icon={Combine}
        title="Merge PDF"
        description="Combine multiple PDF files into a single document. Select all files at once."
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
          <ol>
            <li>Click the upload area or drag your PDF files in.</li>
            <li>Select as many files as you need (up to 20).</li>
            <li>Click <strong>Merge PDFs</strong> and download the combined file.</li>
          </ol>
        </ToolInfoCard>
      </div>
    </div>
  );
}
