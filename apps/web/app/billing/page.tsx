"use client";

import { useAuth } from "@/lib/auth-context";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { plans as plansApi, geo } from "@/lib/api";
import { Check, Crown, Zap } from "lucide-react";
import Link from "next/link";
import type { Plan, PlanInterval } from "@/types/api";

function parseFeatures(features: string[] | string | null): string[] {
  if (!features) return [];
  if (typeof features === "string") {
    try { return JSON.parse(features); } catch { return []; }
  }
  return features;
}

function formatPrice(plan: Plan, isIndia: boolean): string {
  if (isIndia && plan.price_inr) {
    return `₹${Number(plan.price_inr).toLocaleString("en-IN")}`;
  }
  return `$${Number(plan.price).toFixed(2)}`;
}

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [isIndia, setIsIndia] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    Promise.all([
      plansApi.list().catch(() => ({ plans: [] })),
      geo.detect().catch(() => ({ country: "US", is_india: false, billing_provider: "stripe" as const })),
    ]).then(([plansRes, geoRes]) => {
      setAllPlans(plansRes.plans);
      setIsIndia(geoRes.is_india);
    }).finally(() => setLoadingPlans(false));
  }, []);

  if (loading || !user) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-sm text-ink-2">Loading…</div>;
  }

  const isPremium = user.plan === "premium";

  const premiumPlan = allPlans.find(
    (p) => p.interval === "month" && p.slug !== "free"
  );
  const premiumFeatures = premiumPlan ? parseFeatures(premiumPlan.features) : [];
  const freeFeatures = [
    "Up to 10 tasks per tool, per day",
    "Files up to 20 MB",
    "All 9 core PDF tools",
    "Files auto-deleted after 12 hours",
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink">Billing &amp; Subscription</h1>
        <p className="text-sm text-ink-2 mt-1">{user.email}</p>
      </div>

      {/* Current plan card */}
      <div className={[
        "rounded-2xl border-2 p-6 space-y-4",
        isPremium ? "border-amber-400 bg-amber-50/40" : "border-border-soft bg-surface",
      ].join(" ")}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {isPremium ? (
              <Crown size={22} className="text-amber-500" />
            ) : (
              <Zap size={22} className="text-ink-2" />
            )}
            <div>
              <p className="text-xs text-ink-2 uppercase tracking-wide font-semibold">Current plan</p>
              <p className="text-lg font-bold text-ink capitalize">{user.plan}</p>
            </div>
          </div>

          {isPremium && (
            <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          )}
        </div>

        <ul className="space-y-2">
          {(isPremium ? premiumFeatures : freeFeatures).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-2">
              <Check size={15} className="text-emerald-600 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="pt-2">
          <UpgradeButton className={[
            "w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors",
            isPremium
              ? "bg-surface border border-border-soft text-ink hover:bg-page"
              : "bg-red-600 text-white hover:bg-red-700",
          ].join(" ")} />
        </div>

        {!isPremium && (
          <p className="text-xs text-ink-2 text-center">
            Cancel anytime. No contracts.{" "}
            <Link href="/pricing" className="text-red-600 hover:underline">See full pricing →</Link>
          </p>
        )}
      </div>

      {/* Premium upgrade card (shown only for free users) */}
      {!isPremium && premiumPlan && (
        <div className="rounded-2xl border border-border-soft bg-surface p-6 space-y-4 shadow-sm">
          <div>
            <h2 className="text-base font-semibold text-ink flex items-center gap-2">
              <Crown size={16} className="text-amber-500" /> Why upgrade?
            </h2>
            <p className="text-sm text-ink-2 mt-1">
              {premiumPlan.description || "Premium removes all daily limits so you can process as many files as you need."}
            </p>
          </div>
          <ul className="space-y-2">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-2">
                <Check size={15} className="text-emerald-600 mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-ink">
              {loadingPlans ? "…" : formatPrice(premiumPlan, isIndia)}
            </span>
            <span className="text-sm text-ink-2">/month</span>
          </div>
        </div>
      )}

      <p className="text-xs text-ink-2 text-center">
        Questions?{" "}
        <a href="mailto:support@itspdfthings.com" className="text-red-600 hover:underline">
          Contact support
        </a>
      </p>
    </div>
  );
}
