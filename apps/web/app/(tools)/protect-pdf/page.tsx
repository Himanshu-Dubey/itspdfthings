import type { Metadata } from "next";
import { Lock } from "lucide-react";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { ToolPageHeader } from "@/components/tools/ToolPageHeader";
import { ToolInfoCard } from "@/components/tools/ToolInfoCard";
import { getSeoData, buildPageMetadata, buildToolJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("protect-pdf", seo, {
    title: "Password Protect or Unlock PDF Online Free | PDFThings",
    description: "Add or remove a password from your PDF online for free. Encrypt sensitive documents or unlock files you own. No sign-up needed.",
  });
}

export default async function ProtectPdfPage() {
  const seo = await getSeoData();
  const pageData = seo.pages["protect-pdf"];

  return (
    <div>
      <ToolPageHeader
        icon={Lock}
        title="Protect / Unlock PDF"
        description="Add a password to keep sensitive content private, or remove one from a file you own."
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

        <ToolInfoCard title="How to protect or unlock a PDF">
          <p className="mb-3">Add a password to a PDF to keep sensitive content private, or remove a password from a file you own but no longer need locked. Both options take seconds — upload your file, set or enter the password, and download the result.</p>
          <p className="mb-3">Password protection is worth adding to anything containing personal, financial, or confidential information before emailing or sharing it — contracts, invoices, ID scans, and HR documents are common examples. On the flip side, if you have an old password-protected file you created yourself and no longer need locked, unlocking it removes that extra step for future access.</p>
          <p className="mb-3">Files are encrypted in transit during processing and automatically deleted within 12 hours, so your password and document content are never stored longer than necessary. No account required.</p>
          <p>Want to add a visible mark as well as a password? Try <a href="/watermark-pdf" className="text-brand hover:underline">Watermark PDF</a> before locking your file.</p>
        </ToolInfoCard>

        <JsonLd data={buildToolJsonLd("protect-pdf")} />
        <FaqSection faqs={pageData?.faq ?? []} pageSlug="protect-pdf" />
      </div>
    </div>
  );
}
