"use client";

import { useAuth } from "@/lib/auth-context";
import { jobs, billing } from "@/lib/api";
import type { JobHistoryEntry } from "@/types/api";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Crown, X } from "lucide-react";

const TOOL_LABELS: Record<string, string> = {
  merge: "Merge PDF",
  split: "Split PDF",
  compress: "Compress PDF",
  organize: "Organize PDF",
  "image-to-pdf": "Image → PDF",
  "pdf-to-image": "PDF → Image",
  watermark: "Watermark",
  "page-numbers": "Page Numbers",
  protect: "Protect / Unlock",
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-brand-dark",
  processing: "bg-sky-100 text-sky-700",
  pending: "bg-slate-100 text-ink-2",
};

export default function DashboardPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "1";

  const [history, setHistory] = useState<JobHistoryEntry[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  // After a successful Stripe redirect, sync plan from Stripe then refresh UI.
  useEffect(() => {
    if (!upgraded || !user) return;
    billing.sync()
      .then(() => refreshUser())
      .catch(() => refreshUser()); // even on error, re-fetch so UI reflects DB
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgraded]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    jobs
      .history(page)
      .then((res) => {
        setHistory(res.data);
        setLastPage(res.last_page);
        setTotal(res.total);
        setError(null);
      })
      .catch(() => setError("Couldn't load your job history. Please try again."))
      .finally(() => setLoading(false));
  }, [user, page]);

  if (authLoading || !user) {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-ink-2 text-sm">Loading…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          <p className="text-sm text-ink-2 mt-1">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={[
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
              user.plan === "premium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-ink-2",
            ].join(" ")}
          >
            {user.plan} plan
          </span>
          <UpgradeButton className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-soft" />
        </div>
      </div>

      {upgraded && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white px-5 py-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(245,158,11,0.35)]">
          <Crown size={18} className="shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Welcome to Premium!</p>
            <p className="text-sm text-white/80">Your account has been upgraded. Enjoy unlimited file sizes and priority processing.</p>
          </div>
          <button
            onClick={() => router.replace("/dashboard")}
            aria-label="Dismiss"
            className="shrink-0 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-border-soft bg-white shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
          <h2 className="font-semibold text-ink">Job history</h2>
          <span className="text-xs text-ink-2">{total} total</span>
        </div>

        {error && <p className="px-5 py-4 text-sm text-brand-dark">{error}</p>}

        {!error && loading && (
          <p className="px-5 py-8 text-sm text-ink-2 text-center">Loading…</p>
        )}

        {!error && !loading && history.length === 0 && (
          <p className="px-5 py-8 text-sm text-ink-2 text-center">
            No jobs yet — try one of the tools above.
          </p>
        )}

        {!error && !loading && history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-2 uppercase tracking-wide">
                  <th className="px-5 py-2 font-medium">Tool</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 font-medium">Time</th>
                  <th className="px-5 py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((job) => (
                  <tr key={job.id} className="border-t border-border-soft hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 text-ink font-medium">
                      {TOOL_LABELS[job.tool_type] ?? job.tool_type}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={[
                          "inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                          STATUS_STYLES[job.status] ?? "bg-slate-100 text-ink-2",
                        ].join(" ")}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-2 tabular-nums">
                      {job.processing_time_ms != null ? `${job.processing_time_ms} ms` : "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-2">
                      {new Date(job.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <div className="px-5 py-3 border-t border-border-soft flex items-center justify-between text-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 text-ink-2 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-ink-2">
              Page {page} of {lastPage}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page >= lastPage}
              className="inline-flex items-center gap-1 text-ink-2 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
