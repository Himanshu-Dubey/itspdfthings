import type { Metadata } from "next";
import { Minimize2 } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";

export const metadata: Metadata = {
  title: "Compress PDF — Reduce File Size Online Free",
  description: "Reduce your PDF file size without losing quality. Choose your compression level.",
};

export default function CompressPdfPage() {
  return (
    <div>
      <ToolPageHeader
        icon={Minimize2}
        title="Compress PDF"
        description="Reduce your PDF file size. Choose how aggressively to compress."
        iconBg="bg-amber-50"
        iconText="text-amber-600"
        glow="from-amber-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "compress",
            label: "Compress PDF",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "quality",
                label: "Compression level",
                type: "select",
                defaultValue: "medium",
                options: [
                  { value: "low",    label: "Low quality (smallest file)" },
                  { value: "medium", label: "Medium quality (recommended)" },
                  { value: "high",   label: "High quality (minimal compression)" },
                ],
              },
            ],
          }}
        />

        <ToolInfoCard title="Compression levels explained">
          <ul>
            <li><strong>Low</strong> — 72 dpi, smallest possible file. Good for email attachments.</li>
            <li><strong>Medium</strong> — 150 dpi, balanced. Good for most uses (recommended).</li>
            <li><strong>High</strong> — 300 dpi, near-print quality with modest size reduction.</li>
          </ul>
        </ToolInfoCard>
      </div>
    </div>
  );
}
