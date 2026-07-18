"use client";

import { useEffect, useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import type { FailedQueueJob, PdfJobRow } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, LoadingState } from "@/components/ui/EmptyState";

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  processing: "bg-sky-100 text-sky-700",
  completed:  "bg-emerald-100 text-emerald-700",
  failed:     "bg-red-100 text-red-700",
};

type Tab = "pdf-jobs" | "failed-queue";

export default function JobsPage() {
  const [tab, setTab]               = useState<Tab>("pdf-jobs");
  const [jobs, setJobs]             = useState<PdfJobRow[]>([]);
  const [failed, setFailed]         = useState<FailedQueueJob[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [statusFilter, setStatus]   = useState("");
  const [loading, setLoading]       = useState(true);
  const [isPending, start]          = useTransition();
  const [cleaning, setCleaning]     = useState(false);

  const loadJobs = (p = 1, status = statusFilter) => {
    setLoading(true);
    const params: Record<string, string | number> = { page: p, per_page: 25 };
    if (status) params.status = status;
    adminApi.getJobs(params)
      .then(({ jobs: j, meta }) => { setJobs(j); setTotal(meta.total); })
      .finally(() => setLoading(false));
  };

  const loadFailed = () => {
    setLoading(true);
    adminApi.getFailedQueue()
      .then(({ failed_jobs }) => setFailed(failed_jobs))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === "pdf-jobs") loadJobs();
    else loadFailed();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCleanup = async () => {
    setCleaning(true);
    try {
      const { deleted } = await adminApi.triggerCleanup();
      alert(`Cleanup complete — ${deleted} job(s) deleted.`);
      loadJobs();
    } finally {
      setCleaning(false);
    }
  };

  const handleRetry = (id: number) => {
    start(async () => {
      await adminApi.retryFailedJob(id);
      loadFailed();
    });
  };

  const handleDeleteFailed = (id: number) => {
    start(async () => {
      await adminApi.deleteFailedJob(id);
      loadFailed();
    });
  };

  return (
    <>
      <PageHeader
        title="Jobs"
        actions={
          <button
            onClick={handleCleanup}
            disabled={cleaning}
            className="text-sm bg-surface hover:bg-slate-50 border border-border-soft shadow-soft text-ink px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {cleaning ? "Cleaning…" : "Run Cleanup"}
          </button>
        }
      />
      <main className="flex-1 p-6 pt-0 space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-surface border border-border-soft shadow-soft p-1 rounded-lg w-fit">
        {(["pdf-jobs", "failed-queue"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPage(1); }}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              tab === t ? "bg-gradient-to-br from-red-500 to-brand-dark text-white shadow-brand" : "text-ink-2 hover:text-ink"
            }`}
          >
            {t === "pdf-jobs" ? "PDF Jobs" : "Failed Queue"}
          </button>
        ))}
      </div>

      {tab === "pdf-jobs" && (
        <>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => { setStatus(e.target.value); setPage(1); loadJobs(1, e.target.value); }}
              className="bg-surface border border-border-soft rounded-lg px-3 py-2 text-sm text-ink-2 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="bg-surface rounded-2xl border border-border-soft shadow-soft overflow-hidden">
            {loading ? (
              <LoadingState />
            ) : jobs.length === 0 ? (
              <EmptyState>No jobs yet.</EmptyState>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-left">
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Tool</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Time (ms)</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-ink-2">{job.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-ink font-medium">{job.tool_type}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status] ?? "bg-slate-100 text-ink-2"}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-2 text-xs">
                        {job.user ? job.user.email : <span className="text-slate-400">anonymous</span>}
                      </td>
                      <td className="px-4 py-3 text-ink-2 text-xs tabular-nums">
                        {job.processing_time_ms ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-ink-2 text-xs">
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {total > 25 && (
            <div className="flex items-center justify-between text-sm text-ink-2">
              <span>Page {page} of {Math.ceil(total / 25)}</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); loadJobs(p); }}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">Previous</button>
                <button disabled={page >= Math.ceil(total / 25)} onClick={() => { const p = page + 1; setPage(p); loadJobs(p); }}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "failed-queue" && (
        <div className="bg-surface rounded-2xl border border-border-soft shadow-soft overflow-hidden">
          {loading ? (
            <LoadingState />
          ) : failed.length === 0 ? (
            <EmptyState>No failed queue jobs.</EmptyState>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft text-left">
                  <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Queue</th>
                  <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Failed at</th>
                  <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Exception</th>
                  <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {failed.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-ink font-mono text-xs">{job.queue}</td>
                    <td className="px-4 py-3 text-ink-2 text-xs">{new Date(job.failed_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-ink-2 text-xs max-w-xs truncate" title={job.exception}>
                      {job.exception.split("\n")[0]}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleRetry(job.id)} disabled={isPending}
                          className="text-xs px-2 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors disabled:opacity-50 cursor-pointer font-semibold">
                          Retry
                        </button>
                        <button onClick={() => handleDeleteFailed(job.id)} disabled={isPending}
                          className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer font-semibold">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      </main>
    </>
  );
}
