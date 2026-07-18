import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of PDFThings.",
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Placeholder copy.</strong> This page is not legal advice and has not been reviewed by a
        lawyer. Replace this content before launch.
      </div>

      <h1 className="text-2xl font-bold text-ink mb-6">Terms of Service</h1>

      <p className="text-ink-2">Last updated: [DATE]</p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">Acceptable use</h2>
      <p className="text-ink-2">
        You may not upload files you don&apos;t have the right to process, use the service to violate any
        law, or attempt to circumvent rate limits, quotas, or file size restrictions.
      </p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">Free and paid plans</h2>
      <p className="text-ink-2">
        Free accounts are subject to daily usage quotas and file size limits described on our pricing
        page. Premium subscriptions are billed monthly via Stripe and can be cancelled at any time.
      </p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">No warranty</h2>
      <p className="text-ink-2">
        The service is provided &quot;as is&quot; without warranty of any kind. We are not liable for any
        loss of data — files are deleted automatically 12 hours after upload, so keep your own copies.
      </p>

      <h2 className="text-lg font-semibold text-ink mt-8 mb-2">Contact</h2>
      <p className="text-ink-2">Questions about these terms: [CONTACT EMAIL]</p>
    </div>
  );
}
