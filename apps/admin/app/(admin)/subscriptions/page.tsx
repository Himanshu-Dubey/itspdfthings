"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import type { SubscriptionMetrics, SubscriptionRow, SubscriptionsResponse } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/EmptyState";
import { ChevronLeft, ChevronRight, Crown, Users, AlertTriangle, XCircle, Zap } from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "neutral" | "info"> = {
  active:    "success",
  trialing:  "info",
  past_due:  "warning",
  canceled:  "danger",
  unpaid:    "danger",
  incomplete: "warning",
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function SubscriptionsPage() {
  const [metrics, setMetrics]     = useState<SubscriptionMetrics | null>(null);
  const [data, setData]           = useState<SubscriptionsResponse | null>(null);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [metricsLoading, setML]   = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    adminApi.getSubscriptionMetrics()
      .then(setMetrics)
      .catch((e: Error) => setError(e.message))
      .finally(() => setML(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    adminApi.getSubscriptions(page)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  const subs: SubscriptionRow[] = data?.subscriptions ?? [];
  const meta = data?.meta;
  const stripeConfigured = data?.stripe_configured ?? metrics?.stripe_configured ?? false;

  return (
    <>
      <PageHeader
        title="Subscriptions & Revenue"
        description="Active Stripe subscriptions and Premium user summary"
      />

      <main className="flex-1 px-6 pb-6 space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Stripe not configured banner */}
        {!stripeConfigured && !metricsLoading && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>
              Stripe is not fully configured.{" "}
              <Link href="/stripe" className="font-semibold underline hover:no-underline">
                Go to Stripe settings
              </Link>{" "}
              to add your API keys and price ID before subscriptions can be created.
            </p>
          </div>
        )}

        {/* Metric cards */}
        {metricsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={Crown}         label="Active subs"    value={metrics.active}       color="emerald" />
            <MetricCard icon={Users}         label="Premium users"  value={metrics.premium_users} color="amber" />
            <MetricCard icon={AlertTriangle} label="Past due"       value={metrics.past_due}      color="orange" />
            <MetricCard icon={XCircle}       label="Cancelled"      value={metrics.cancelled}     color="red" />
          </div>
        ) : null}

        {/* Subscription table */}
        <Card>
          <CardHeader>
            <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
              <Zap size={14} className="text-ink-2" /> All subscriptions
            </CardTitle>
            {meta && (
              <span className="text-xs text-ink-2">{meta.total} total</span>
            )}
          </CardHeader>

          {loading ? (
            <CardBody><LoadingState /></CardBody>
          ) : subs.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-2 py-6 text-center">
                {stripeConfigured
                  ? "No subscriptions yet. Subscriptions appear here after the first successful payment."
                  : "Connect Stripe to start collecting subscriptions."}
              </p>
            </CardBody>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-soft text-left">
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">User</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Status</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Stripe ID</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Started</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Ends</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft">
                    {subs.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <Link
                            href={`/users/${sub.user_id}`}
                            className="font-medium text-ink hover:text-brand transition-colors"
                          >
                            {sub.user_name}
                          </Link>
                          <p className="text-xs text-ink-2 mt-0.5">{sub.user_email}</p>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={STATUS_VARIANT[sub.stripe_status] ?? "neutral"}>
                            {sub.stripe_status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-ink-2">
                          <a
                            href={`https://dashboard.stripe.com/subscriptions/${sub.stripe_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand transition-colors"
                          >
                            {sub.stripe_id}
                          </a>
                        </td>
                        <td className="px-5 py-3 text-ink-2">{fmt(sub.created_at)}</td>
                        <td className="px-5 py-3 text-ink-2">{fmt(sub.ends_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {meta && meta.last_page > 1 && (
                <div className="px-5 py-3 border-t border-border-soft flex items-center justify-between text-sm">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 text-ink-2 hover:text-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <span className="text-ink-2">Page {page} of {meta.last_page}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                    disabled={page >= meta.last_page}
                    className="inline-flex items-center gap-1 text-ink-2 hover:text-ink disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
    </>
  );
}

function MetricCard({
  icon: Icon, label, value, color,
}: {
  icon: React.ElementType; label: string; value: number;
  color: "emerald" | "amber" | "orange" | "red";
}) {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50 text-amber-600",
    orange:  "bg-orange-50 text-orange-600",
    red:     "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-border-soft bg-white shadow-soft p-5">
      <div className={`h-9 w-9 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon size={16} />
      </div>
      <p className="text-2xl font-bold text-ink tabular-nums">{value}</p>
      <p className="text-xs text-ink-2 mt-0.5">{label}</p>
    </div>
  );
}
