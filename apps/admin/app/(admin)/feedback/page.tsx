"use client";

import { useEffect, useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/EmptyState";
import {
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
} from "lucide-react";
import type { FeedbackEntry } from "@/types/api";

const TYPE_BADGES: Record<string, string> = {
  general: "bg-slate-100 text-slate-700",
  bug: "bg-red-100 text-red-700",
  feature: "bg-blue-100 text-blue-700",
  suggestion: "bg-amber-100 text-amber-700",
  other: "bg-slate-100 text-slate-700",
};

const STATUS_BADGES: Record<string, { variant: string; label: string }> = {
  new: { variant: "warning", label: "New" },
  read: { variant: "info", label: "Read" },
  closed: { variant: "success", label: "Closed" },
};

export default function FeedbackPage() {
  const [items, setItems]             = useState<FeedbackEntry[]>([]);
  const [stats, setStats]             = useState({ total: 0, new: 0, read: 0, closed: 0 });
  const [page, setPage]               = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState<FeedbackEntry | null>(null);
  const [filter, setFilter]           = useState<string>("");
  const [isPending, startTransition]  = useTransition();

  const load = () => {
    setLoading(true);
    const params: Record<string, string | number> = { page, per_page: 15 };
    if (filter) params.status = filter;
    Promise.all([
      adminApi.getFeedback(params),
      adminApi.getFeedbackStats(),
    ]).then(([res, s]) => {
      setItems(res.data ?? []);
      setLastPage(res.last_page ?? 1);
      setStats(s);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [page, filter]);

  const handleStatus = (id: number, status: string) => {
    startTransition(async () => {
      await adminApi.updateFeedback(id, { status });
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
      load();
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this feedback?")) return;
    startTransition(async () => {
      await adminApi.deleteFeedback(id);
      if (selected?.id === id) setSelected(null);
      load();
    });
  };

  return (
    <>
      <PageHeader
        title="Feedback"
        description="User-submitted feedback, bug reports, and feature requests"
        actions={
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => { setFilter(""); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${!filter ? "bg-brand text-white" : "bg-slate-100 text-ink-2 hover:text-ink"}`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => { setFilter("new"); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${filter === "new" ? "bg-amber-500 text-white" : "bg-slate-100 text-ink-2 hover:text-ink"}`}
            >
              New ({stats.new})
            </button>
            <button
              onClick={() => { setFilter("read"); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${filter === "read" ? "bg-blue-500 text-white" : "bg-slate-100 text-ink-2 hover:text-ink"}`}
            >
              Read ({stats.read})
            </button>
            <button
              onClick={() => { setFilter("closed"); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${filter === "closed" ? "bg-emerald-500 text-white" : "bg-slate-100 text-ink-2 hover:text-ink"}`}
            >
              Closed ({stats.closed})
            </button>
          </div>
        }
      />

      <main className="flex-1 px-6 pb-6 space-y-5">
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-ink-2 text-sm">
              No feedback found.
            </CardBody>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-border-soft">
              {items.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${selected?.id === f.id ? "bg-slate-50" : ""}`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    {f.status === "new" && (
                      <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${TYPE_BADGES[f.type] ?? TYPE_BADGES.general}`}>
                      {f.type}
                    </span>
                    <span className="text-sm font-semibold text-ink truncate flex-1">
                      {f.subject || f.message.slice(0, 80)}
                    </span>
                    <Badge variant={STATUS_BADGES[f.status]?.variant as any ?? "neutral"}>
                      {STATUS_BADGES[f.status]?.label ?? f.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-ink-2 line-clamp-1 ml-5">
                    {f.name || f.email || "Anonymous"} — {new Date(f.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-center gap-3 text-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-ink-2 text-xs">Page {page} of {lastPage}</span>
            <button
              onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              disabled={page === lastPage}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div
            className="bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${TYPE_BADGES[selected.type] ?? TYPE_BADGES.general}`}>
                  {selected.type}
                </span>
                <Badge variant={STATUS_BADGES[selected.status]?.variant as any ?? "neutral"}>
                  {STATUS_BADGES[selected.status]?.label ?? selected.status}
                </Badge>
              </div>
              <button onClick={() => setSelected(null)} className="text-ink-2 hover:text-ink cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="text-xs text-ink-2 space-y-1">
                {selected.name && <p><span className="font-semibold text-ink">Name:</span> {selected.name}</p>}
                {selected.email && <p><span className="font-semibold text-ink">Email:</span> {selected.email}</p>}
                {selected.user && <p><span className="font-semibold text-ink">User ID:</span> {selected.user.id} ({selected.user.email})</p>}
                <p><span className="font-semibold text-ink">Date:</span> {new Date(selected.created_at).toLocaleString()}</p>
                {selected.ip_address && <p><span className="font-semibold text-ink">IP:</span> {selected.ip_address}</p>}
              </div>
              {selected.subject && (
                <h3 className="text-sm font-bold text-ink">{selected.subject}</h3>
              )}
              <p className="text-sm text-ink whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="px-5 py-3 border-t border-border-soft flex items-center gap-2">
              {selected.status !== "read" && (
                <button
                  onClick={() => handleStatus(selected.id, "read")}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={12} /> Mark read
                </button>
              )}
              {selected.status !== "closed" && (
                <button
                  onClick={() => handleStatus(selected.id, "closed")}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors cursor-pointer"
                >
                  <Clock size={12} /> Close
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => handleDelete(selected.id)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors cursor-pointer"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
