import type { Metadata } from "next";
import { Hash } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Free Online",
  description: "Stamp sequential page numbers onto every page of your PDF. Choose position and starting number.",
};

export default function PageNumbersPage() {
  return (
    <div>
      <ToolPageHeader
        icon={Hash}
        title="Add Page Numbers"
        description="Stamp sequential page numbers onto every page of your PDF."
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

        <ToolInfoCard title="About page numbers">
          <p>Numbers are stamped in black at the position you choose, starting from the number you set.</p>
        </ToolInfoCard>
      </div>
    </div>
  );
}
