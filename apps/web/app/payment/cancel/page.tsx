import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = {
  title: "Payment Cancelled — PDFThings",
  description: "Your payment was cancelled.",
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-4 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-[0_8px_32px_rgba(251,191,36,0.35)] mb-8">
        <XCircle size={40} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold text-ink mb-3 tracking-tight">Payment cancelled</h1>
      <p className="text-ink-2 max-w-sm text-balance mb-8">
        No worries — you haven&apos;t been charged. Your account remains on the Free plan.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/pricing"
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-brand-dark text-white hover:brightness-105 transition-all shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
        >
          View Pricing
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-surface border border-border-soft text-ink hover:bg-page transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
