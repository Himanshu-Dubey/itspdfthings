import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Payment Successful — PDFThings",
  description: "Your payment has been processed successfully.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-page px-4 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_8px_32px_rgba(16,185,129,0.35)] mb-8">
        <CheckCircle2 size={40} className="text-white" />
      </div>
      <h1 className="text-3xl font-bold text-ink mb-3 tracking-tight">Payment successful!</h1>
      <p className="text-ink-2 max-w-sm text-balance mb-8">
        Your Premium subscription is now active. You have full access to all tools with higher limits.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-red-500 to-brand-dark text-white hover:brightness-105 transition-all shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/billing"
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-surface border border-border-soft text-ink hover:bg-page transition-colors"
        >
          View Billing
        </Link>
      </div>
      <p className="mt-8 text-xs text-ink-2/60">
        A confirmation email has been sent to your registered email address.
      </p>
    </div>
  );
}
