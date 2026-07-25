import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Payment Failed — PDFThings",
  description: "Your payment could not be processed.",
};

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-4 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-red-600 shadow-[0_8px_32px_rgba(239,68,68,0.35)] mb-8">
        <AlertTriangle size={40} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold text-ink mb-3 tracking-tight">Payment failed</h1>
      <p className="text-ink-2 max-w-sm text-balance mb-4">
        Something went wrong while processing your payment. You haven&apos;t been charged.
      </p>
      <p className="text-xs text-ink-2/60 max-w-sm mb-8">
        This could happen due to insufficient funds, a declined card, or a network issue. Please try again or use a different payment method.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/pricing"
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-brand-dark text-white hover:brightness-105 transition-all shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
        >
          Try Again
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-surface border border-border-soft text-ink hover:bg-page transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
