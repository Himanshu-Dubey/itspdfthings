"use client";

import { useAuth } from "@/lib/auth-context";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { plans as plansApi, geo, billing } from "@/lib/api";
import { Check, Crown, Zap, CreditCard, Download, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Plan } from "@/types/api";

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

function fmtDate(ts: number | string | null) {
  if (!ts) return "—";
  const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

interface SubscriptionDetail {
  provider: string | null;
  subscription: any;
  invoices: any[];
}

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [isIndia, setIsIndia] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [subDetail, setSubDetail] = useState<SubscriptionDetail | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

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

  useEffect(() => {
    if (user?.plan === "premium") {
      billing.subscriptionDetail()
        .then(setSubDetail)
        .catch(() => {})
        .finally(() => setLoadingSub(false));
    } else {
      setLoadingSub(false);
    }
  }, [user]);

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

      {/* Subscription details (premium users only) */}
      {isPremium && subDetail?.subscription && (
        <div className="rounded-2xl border border-border-soft bg-surface p-6 space-y-4">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <CreditCard size={14} className="text-ink-2" /> Subscription Details
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-ink-2">Provider</p>
              <p className="font-medium text-ink capitalize">{subDetail.provider}</p>
            </div>
            <div>
              <p className="text-xs text-ink-2">Status</p>
              <p className="font-medium text-ink capitalize">{subDetail.subscription.status}</p>
            </div>
            <div>
              <p className="text-xs text-ink-2">Subscription ID</p>
              <p className="font-mono text-xs text-ink truncate">{subDetail.subscription.id}</p>
            </div>
            {subDetail.subscription.plan_id && (
              <div>
                <p className="text-xs text-ink-2">Plan ID</p>
                <p className="font-mono text-xs text-ink truncate">{subDetail.subscription.plan_id}</p>
              </div>
            )}
            {subDetail.subscription.current_end && (
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-ink-2" />
                <div>
                  <p className="text-xs text-ink-2">Next billing</p>
                  <p className="font-medium text-ink">{fmtDate(subDetail.subscription.current_end)}</p>
                </div>
              </div>
            )}
            {subDetail.subscription.current_period_end && (
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className="text-ink-2" />
                <div>
                  <p className="text-xs text-ink-2">Renews on</p>
                  <p className="font-medium text-ink">{fmtDate(subDetail.subscription.current_period_end)}</p>
                </div>
              </div>
            )}
          </div>
          {subDetail.subscription.cancel_at_period_end && (
            <p className="text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-lg">
              Your subscription will cancel at the end of the current billing period.
            </p>
          )}
        </div>
      )}

      {/* Invoices */}
      {isPremium && subDetail?.invoices && subDetail.invoices.length > 0 && (
        <div className="rounded-2xl border border-border-soft bg-surface p-6 space-y-3">
          <h2 className="text-sm font-bold text-ink">Invoice History</h2>
          <div className="divide-y divide-border-soft">
            {subDetail.invoices.map((inv: any) => (
              <div key={inv.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-mono text-xs text-ink">{inv.invoice_id ?? inv.id}</p>
                  <p className="text-xs text-ink-2">
                    {inv.currency} {(inv.amount / 100).toFixed(2)} — {fmtDate(inv.paid_at ?? inv.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${inv.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {inv.status}
                  </span>
                  {inv.pdf_url && (
                    <a
                      href={inv.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      <Download size={11} /> PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
