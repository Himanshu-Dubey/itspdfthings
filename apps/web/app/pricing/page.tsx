"use client";

import { useEffect, useState } from "react";
import { plans as plansApi, billing, geo, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Plan, PlanInterval } from "@/types/api";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";

const FREE_FEATURES = [
  "Up to 10 tasks per tool, per day",
  "Files up to 20 MB",
  "All 9 core PDF tools",
  "Files auto-deleted after 12 hours",
];

export default function PricingPage() {
  const { user, loading: authLoading } = useAuth();
  const [allPlans, setAllPlans]       = useState<Plan[]>([]);
  const [interval, setInterval]       = useState<PlanInterval>("month");
  const [loading, setLoading]         = useState(true);
  const [busy, setBusy]               = useState<number | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [billingProvider, setBillingProvider] = useState<"stripe" | "razorpay">("stripe");

  useEffect(() => {
    Promise.all([
      plansApi.list().catch(() => ({ plans: [] })),
      geo.detect().catch(() => ({ country: "US", is_india: false, billing_provider: "stripe" as const })),
    ]).then(([plansRes, geoRes]) => {
      setAllPlans(plansRes.plans);
      setBillingProvider(geoRes.billing_provider);
    }).finally(() => setLoading(false));
  }, []);

  const visible = allPlans.filter((p) => p.interval === interval);
  const hasPlans = visible.length > 0;

  const handleBuy = async (plan: Plan) => {
    if (authLoading) return;
    if (!user) { window.location.href = "/register"; return; }
    setBusy(plan.id);
    setError(null);
    try {
      const country = billingProvider === "razorpay" ? "IN" : "US";
      const { checkout_url } = await billing.checkout(plan.id, country);
      window.location.href = checkout_url;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't start checkout.");
      setBusy(null);
    }
  };

  return (
    <div className="aurora">
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3 tracking-tight">Simple pricing</h1>
          <p className="text-ink-2 text-lg mb-6">Start free. Upgrade when you need more.</p>

          {/* Interval toggle — only shown when we have plans */}
          {allPlans.length > 0 && (
            <div className="inline-flex items-center gap-1 bg-slate-100 rounded-full p-1">
              {(["month", "year"] as PlanInterval[]).map((iv) => (
                <button
                  key={iv}
                  onClick={() => setInterval(iv)}
                  className={[
                    "px-5 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer",
                    interval === iv
                      ? "bg-white text-ink shadow-soft"
                      : "text-ink-2 hover:text-ink",
                  ].join(" ")}
                >
                  {iv === "month" ? "Monthly" : "Yearly"}
                  {iv === "year" && (
                    <span className="ml-1.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                      Save more
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-ink-2" />
          </div>
        ) : (
          <div className={[
            "grid gap-6 sm:grid-cols-2",
            hasPlans && visible.length >= 3 ? "lg:grid-cols-3" : "",
          ].join(" ")}>
            {/* Free plan — always shown first */}
            <div className="rounded-2xl border border-border-soft bg-white p-8 shadow-soft">
              <h2 className="text-lg font-semibold text-ink">Free</h2>
              <p className="text-4xl font-bold text-ink mt-2 mb-1">$0</p>
              <p className="text-sm text-ink-2 mb-6">Forever free</p>
              <ul className="space-y-3 text-sm text-ink-2 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex gap-2.5 items-start">
                    <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {user ? (
                <div className="block text-center w-full border border-border-soft text-ink-2 py-2.5 rounded-lg font-semibold text-sm">
                  {user.plan === "free" ? "Current plan" : "Included"}
                </div>
              ) : (
                <Link
                  href="/register"
                  className="block text-center w-full bg-slate-100 text-ink py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors text-sm"
                >
                  Get started free
                </Link>
              )}
            </div>

            {/* Dynamic paid plans */}
            {hasPlans ? (
              visible.map((plan, idx) => (
                <PaidPlanCard
                  key={plan.id}
                  plan={plan}
                  featured={idx === 0}
                  user={user}
                  busy={busy === plan.id}
                  onBuy={() => handleBuy(plan)}
                  billingProvider={billingProvider}
                />
              ))
            ) : (
              /* No plans in DB yet — fall back to hardcoded Premium card */
              <DefaultPremiumCard user={user} billingProvider={billingProvider} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PaidPlanCard({
  plan,
  featured,
  user,
  busy,
  onBuy,
  billingProvider,
}: {
  plan: Plan;
  featured: boolean;
  user: { plan: string } | null;
  busy: boolean;
  onBuy: () => void;
  billingProvider?: "stripe" | "razorpay";
}) {
  const isPremium = user?.plan === "premium";

  return (
    <div className={`rounded-2xl bg-white p-8 relative shadow-soft ${
      featured ? "border-2 border-brand" : "border border-border-soft"
    }`}>
      {featured && (
        <span className="absolute -top-3 right-6 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full shadow-soft">
          Most popular
        </span>
      )}
      <h2 className="text-lg font-semibold text-ink">{plan.name}</h2>
      {plan.description && (
        <p className="text-sm text-ink-2 mt-0.5 mb-1">{plan.description}</p>
      )}
      <p className="text-4xl font-bold text-ink mt-2 mb-1">
        ${parseFloat(plan.price).toFixed(2)}
        <span className="text-base font-normal text-ink-2">
          /{plan.interval === "month" ? "mo" : "yr"}
        </span>
      </p>
      <p className="text-sm text-ink-2 mb-6">
        Billed {plan.interval === "month" ? "monthly" : "yearly"}
      </p>

      {plan.features && plan.features.length > 0 && (
        <ul className="space-y-3 text-sm text-ink-2 mb-8">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2.5 items-start">
              <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      )}

      {isPremium ? (
        <div className="block text-center w-full border border-border-soft text-ink-2 py-2.5 rounded-lg font-semibold text-sm">
          Current plan
        </div>
      ) : (
        <button
          onClick={onBuy}
          disabled={busy}
          className="block w-full bg-brand text-white py-2.5 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-soft text-sm"
        >
          {busy ? "Redirecting…" : billingProvider === "razorpay" ? "Pay with Razorpay" : "Get started"}
        </button>
      )}
    </div>
  );
}

function DefaultPremiumCard({ user, billingProvider }: { user: { plan: string } | null; billingProvider?: "stripe" | "razorpay" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPremium = user?.plan === "premium";

  const handleBuy = async () => {
    setBusy(true);
    setError(null);
    try {
      const country = billingProvider === "razorpay" ? "IN" : "US";
      const { checkout_url } = await billing.checkout(undefined, country);
      window.location.href = checkout_url;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't start checkout.");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-brand bg-white p-8 relative shadow-soft">
      <span className="absolute -top-3 right-6 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full shadow-soft">
        Most popular
      </span>
      <h2 className="text-lg font-semibold text-ink">Premium</h2>
      <p className="text-4xl font-bold text-ink mt-2 mb-6">
        $9.99<span className="text-base font-normal text-ink-2">/mo</span>
      </p>
      <ul className="space-y-3 text-sm text-ink-2 mb-8">
        {["Unlimited tasks, every tool", "Files up to 500 MB", "Priority processing", "Files auto-deleted after 12 hours"].map((f) => (
          <li key={f} className="flex gap-2.5 items-start">
            <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>
      {isPremium ? (
        <div className="block text-center w-full border border-border-soft text-ink-2 py-2.5 rounded-lg font-semibold text-sm">
          Current plan
        </div>
      ) : (
        <div>
          <button
            onClick={handleBuy}
            disabled={busy}
            className="block w-full bg-brand text-white py-2.5 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-soft"
          >
            {busy ? "Redirecting…" : billingProvider === "razorpay" ? "Upgrade with Razorpay" : "Upgrade to Premium"}
          </button>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
