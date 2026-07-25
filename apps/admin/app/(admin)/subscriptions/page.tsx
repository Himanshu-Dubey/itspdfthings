"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/EmptyState";
import {
  ChevronLeft, ChevronRight, Crown, Users, AlertTriangle, XCircle, Zap,
  ExternalLink, RefreshCw, X, Download,
} from "lucide-react";

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger" | "neutral" | "info"> = {
  active:        "success",
  authenticated: "success",
  charged:       "success",
  trialing:      "info",
  past_due:      "warning",
  canceled:      "danger",
  cancelled:     "danger",
  unpaid:        "danger",
  incomplete:    "warning",
};

function fmt(iso: string | null | number) {
  if (!iso) return "—";
  const d = typeof iso === "number" ? new Date(iso * 1000) : new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function SubscriptionsPage() {
  const [metrics, setMetrics]       = useState<any>(null);
  const [data, setData]             = useState<any>(null);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [metricsLoading, setML]     = useState(true);
  const [error, setError]           = useState("");
  const [detail, setDetail]         = useState<any>(null);
  const [detailLoading, startDetail] = useTransition();

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

  const subs = data?.subscriptions ?? [];
  const meta = data?.meta;

  const viewRazorpayDetail = (subId: string) => {
    startDetail(async () => {
      try {
        const res = await adminApi.getRazorpaySubscriptionDetail(subId);
        setDetail(res);
      } catch (e: any) {
        setError(e.message);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="Subscriptions & Revenue"
        description="Stripe and Razorpay subscriptions, Premium user summary"
      />

      <main className="flex-1 px-6 pb-6 space-y-5">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
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
            <MetricCard icon={AlertTriangle} label="Past due"       value={metrics.past_due ?? 0} color="orange" />
            <MetricCard icon={XCircle}       label="Cancelled"      value={metrics.cancelled}     color="red" />
          </div>
        ) : null}

        {/* Subscription table */}
        <Card>
          <CardHeader>
            <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
              <Zap size={14} className="text-ink-2" /> All subscriptions
            </CardTitle>
            {meta && <span className="text-xs text-ink-2">{meta.total} total</span>}
          </CardHeader>

          {loading ? (
            <CardBody><LoadingState /></CardBody>
          ) : subs.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-2 py-6 text-center">No subscriptions yet.</p>
            </CardBody>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-soft text-left">
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">User</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Provider</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Status</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Subscription ID</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Started</th>
                      <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft">
                    {subs.map((sub: any, i: number) => (
                      <tr key={sub.id ?? `rz-${i}`} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3">
                          <Link href={`/users/${sub.user_id}`} className="font-medium text-ink hover:text-brand transition-colors">
                            {sub.user_name}
                          </Link>
                          <p className="text-xs text-ink-2 mt-0.5">{sub.user_email}</p>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={sub.provider === "stripe" ? "info" : "warning"}>
                            {sub.provider === "stripe" ? "Stripe" : "Razorpay"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={STATUS_VARIANT[sub.status] ?? "neutral"}>
                            {sub.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-ink-2">
                          {sub.provider === "stripe" ? (
                            <a
                              href={`https://dashboard.stripe.com/subscriptions/${sub.provider_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-brand transition-colors inline-flex items-center gap-1"
                            >
                              {sub.provider_id} <ExternalLink size={10} />
                            </a>
                          ) : (
                            <button
                              onClick={() => viewRazorpayDetail(sub.provider_id)}
                              className="hover:text-brand transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              {sub.provider_id} <ExternalLink size={10} />
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-3 text-ink-2">{fmt(sub.created_at)}</td>
                        <td className="px-5 py-3">
                          <Link href={`/users/${sub.user_id}`} className="text-xs text-brand hover:underline">
                            View user
                          </Link>
                        </td>
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

      {/* Razorpay detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetail(null)}>
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">Razorpay Subscription</h3>
              <button onClick={() => setDetail(null)} className="text-ink-2 hover:text-ink cursor-pointer"><X size={16} /></button>
            </div>
            <div className="px-5 py-4 space-y-4">
              {detail.subscription ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-ink-2">ID:</span> <span className="font-mono">{detail.subscription.id}</span></div>
                  <div><span className="text-ink-2">Status:</span> <Badge variant={STATUS_VARIANT[detail.subscription.status] ?? "neutral"}>{detail.subscription.status}</Badge></div>
                  <div><span className="text-ink-2">Plan:</span> <span className="font-mono">{detail.subscription.plan_id}</span></div>
                  <div><span className="text-ink-2">Charged:</span> {detail.subscription.charged_count}/{detail.subscription.total_count}</div>
                  <div><span className="text-ink-2">Current period:</span> {fmt(detail.subscription.current_start)} — {fmt(detail.subscription.current_end)}</div>
                  <div><span className="text-ink-2">Started:</span> {fmt(detail.subscription.start)}</div>
                </div>
              ) : (
                <p className="text-sm text-ink-2">No subscription details available.</p>
              )}

              {detail.invoices?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-ink-2 uppercase mb-2">Invoices</h4>
                  <div className="divide-y divide-border-soft border border-border-soft rounded-xl overflow-hidden">
                    {detail.invoices.map((inv: any) => (
                      <div key={inv.id} className="px-4 py-3 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono text-ink">{inv.invoice_id ?? inv.id}</span>
                          <span className="ml-2 text-ink-2">{inv.currency} {(inv.amount / 100).toFixed(2)}</span>
                          <Badge variant={inv.status === "paid" ? "success" : "warning"} className="ml-2">{inv.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-ink-2">{fmt(inv.paid_at ?? inv.created_at)}</span>
                          {inv.pdf_url && (
                            <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline inline-flex items-center gap-1">
                              <Download size={11} /> PDF
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
