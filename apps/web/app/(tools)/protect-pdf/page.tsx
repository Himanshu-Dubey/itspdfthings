import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";

export const metadata: Metadata = {
  title: "Protect & Unlock PDF — Password-Protect PDFs Free",
  description: "Add a password to your PDF or remove an existing password. Fast and free.",
};

export default function ProtectPdfPage() {
  return (
    <div>
      <ToolPageHeader
        icon={Lock}
        title="Protect / Unlock PDF"
        description="Password-protect your PDF with 256-bit encryption, or remove an existing password."
        iconBg="bg-indigo-50"
        iconText="text-indigo-600"
        glow="from-indigo-50/60"
      />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget
          config={{
            toolType: "protect",
            label: "Protect PDF",
            accept: ".pdf,application/pdf",
            fields: [
              {
                name: "action",
                label: "Action",
                type: "select",
                defaultValue: "protect",
                options: [
                  { value: "protect", label: "Protect — add password" },
                  { value: "unlock",  label: "Unlock — remove password" },
                ],
              },
              {
                name: "password",
                label: "Password",
                type: "password",
                placeholder: "Enter password",
                required: false,
              },
            ],
          }}
        />

        <ToolInfoCard title="Security note">
          <p>Protection uses 256-bit AES encryption. To unlock a PDF, enter the current password. If the PDF has no password, leave the password field blank.</p>
          <p>Files are deleted from our servers after 12 hours.</p>
        </ToolInfoCard>
      </div>
    </div>
  );
}
