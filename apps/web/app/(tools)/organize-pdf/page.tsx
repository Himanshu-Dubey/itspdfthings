import type { Metadata } from "next";
import { ListOrdered } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";

export const metadata: Metadata = {
  title: "Organize PDF — Rotate & Reorder Pages Online",
  description: "Delete, reorder, or rotate pages in your PDF. Free and secure.",
};

export default function OrganizePdfPage() {
  return (
    <div>
      <ToolPageHeader
        icon={ListOrdered}
        title="Organize PDF"
        description="Select specific pages to keep and optionally rotate them."
        iconBg="bg-violet-50"
        iconText="text-violet-600"
        glow="from-violet-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "organize",
            label: "Organize PDF",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "pages",
                label: "Pages to keep",
                type: "text",
                placeholder: "e.g. 1,3,5-8  —  leave blank to keep all",
              },
              {
                name: "rotation",
                label: "Rotation (optional)",
                type: "select",
                defaultValue: "",
                options: [
                  { value: "",       label: "No rotation" },
                  { value: "90:1-z", label: "Rotate all 90° clockwise" },
                  { value: "180:1-z",label: "Rotate all 180°" },
                  { value: "270:1-z",label: "Rotate all 90° counter-clockwise" },
                ],
              },
            ],
          }}
        />

        <ToolInfoCard title="Page range syntax">
          <ul>
            <li><code>1,3,5</code> — pages 1, 3, and 5 only</li>
            <li><code>2-5</code> — pages 2 through 5</li>
            <li><code>1-3,7-9</code> — pages 1–3 and 7–9</li>
            <li>Leave blank to keep all pages</li>
          </ul>
        </ToolInfoCard>
      </div>
    </div>
  );
}
