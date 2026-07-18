import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PDFThings handles your files and data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Placeholder copy.</strong> This page is not legal advice and has not been reviewed by a
        lawyer. Replace this content before launch.
      </div>

      <h1 className="text-2xl font-bold text-ink mb-6">Privacy Policy</h1>

      <p className="text-ink-2">Last updated: [DATE]</p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">What we collect</h2>
      <p className="text-ink-2">
        Files you upload are processed to perform the tool you selected (e.g. merge, compress) and are
        automatically deleted from our servers 12 hours after upload. We also collect basic account
        information (name, email) if you register, and usage data (IP address, tool used, timestamps) for
        rate-limiting and abuse prevention.
      </p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">How we use your files</h2>
      <p className="text-ink-2">
        Your files are used solely to perform the requested transformation. We do not read, analyze, or
        share the contents of your files with third parties.
      </p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">Data retention</h2>
      <p className="text-ink-2">
        Uploaded and processed files are permanently deleted 12 hours after upload. Account data is
        retained until you delete your account.
      </p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">Contact</h2>
      <p className="text-ink-2">Questions about this policy: [CONTACT EMAIL]</p>
    </div>
  );
}
