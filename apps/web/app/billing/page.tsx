"use client";

import { useAuth } from "@/lib/auth-context";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Check, Crown, Zap } from "lucide-react";
import Link from "next/link";

const PREMIUM_FEATURES = [
  "Unlimited tasks on every tool",
  "Files up to 500 MB",
  "Priority processing queue",
  "All 9 PDF tools, no daily caps",
];

const FREE_FEATURES = [
  "Up to 10 tasks per tool per day",
  "Files up to 20 MB",
  "All 9 PDF tools",
  "Files auto-deleted after 12 hours",
];

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-sm text-gray-500">Loading…</div>;
  }

  const isPremium = user.plan === "premium";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing &amp; Subscription</h1>
        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
      </div>

      {/* Current plan card */}
      <div className={[
        "rounded-2xl border-2 p-6 space-y-4",
        isPremium ? "border-amber-400 bg-amber-50/40" : "border-gray-200 bg-white",
      ].join(" ")}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {isPremium ? (
              <Crown size={22} className="text-amber-500" />
            ) : (
              <Zap size={22} className="text-gray-400" />
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Current plan</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{user.plan}</p>
            </div>
          </div>

          {isPremium && (
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          )}
        </div>

        <ul className="space-y-2">
          {(isPremium ? PREMIUM_FEATURES : FREE_FEATURES).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
              <Check size={15} className="text-emerald-600 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="pt-2">
          <UpgradeButton className={[
            "w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors",
            isPremium
              ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              : "bg-red-600 text-white hover:bg-red-700",
          ].join(" ")} />
        </div>

        {!isPremium && (
          <p className="text-xs text-gray-400 text-center">
            Cancel anytime. No contracts.{" "}
            <Link href="/pricing" className="text-red-600 hover:underline">See full pricing →</Link>
          </p>
        )}
      </div>

      {/* Premium upgrade card (shown only for free users) */}
      {!isPremium && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Crown size={16} className="text-amber-500" /> Why upgrade?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Premium removes all daily limits so you can process as many files as you need.
            </p>
          </div>
          <ul className="space-y-2">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <Check size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">$9.99</span>
            <span className="text-sm text-gray-500">/month</span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Questions?{" "}
        <a href="mailto:support@itspdfthings.com" className="text-red-600 hover:underline">
          Contact support
        </a>
      </p>
    </div>
  );
}
