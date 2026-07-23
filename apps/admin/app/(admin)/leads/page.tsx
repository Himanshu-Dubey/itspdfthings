"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import type { LeadEntry } from "@/types/api";
import {
  Mail,
  User,
  Clock,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  MessageSquare,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  read: "bg-zinc-50 text-zinc-600 border-zinc-200",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-slate-50 text-slate-500 border-slate-200",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<LeadEntry | null>(null);
  const [stats, setStats] = useState({ total: 0, new: 0, read: 0, replied: 0 });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      const data = await adminApi.getLeads(params);
      setLeads(data.leads);
      setTotal(data.total);
      setLastPage(data.lastPage);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminApi.getLeadStats();
      setStats(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateStatus = async (id: number, status: string) => {
    try {
      await adminApi.updateLead(id, { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : null));
      fetchStats();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await adminApi.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
      fetchStats();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const openDetail = (lead: LeadEntry) => {
    setSelected(lead);
    if (lead.status === "new") updateStatus(lead.id, "read");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Manage contact form submissions and inquiries."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-ink" },
          { label: "New", value: stats.new, color: "text-blue-600" },
          { label: "Read", value: stats.read, color: "text-zinc-500" },
          { label: "Replied", value: stats.replied, color: "text-emerald-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-ink-2 mt-1">{s.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead list */}
        <div className="lg:col-span-1 space-y-3">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search leads…"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* List */}
          {loading ? (
            <div className="text-center py-8 text-ink-2 text-sm">Loading…</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-ink-2 text-sm">No leads found.</div>
          ) : (
            <div className="space-y-2">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => openDetail(lead)}
                  className={[
                    "w-full text-left px-4 py-3 rounded-xl border transition-all",
                    selected?.id === lead.id
                      ? "border-brand bg-red-50 shadow-brand"
                      : "border-border-soft bg-white hover:border-border-muted",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-ink truncate">{lead.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${STATUS_COLORS[lead.status] ?? STATUS_COLORS.new}`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-ink-2 truncate">{lead.email}</p>
                  <p className="text-xs text-ink-2 mt-1 truncate">{lead.subject ?? "No subject"}</p>
                  <p className="text-[11px] text-ink-2/60 mt-1">{formatDate(lead.created_at)}</p>
                </button>
              ))}

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs text-ink-2">
                    Page {page} of {lastPage}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                    disabled={page === lastPage}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="p-6">
              {selected ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-ink">{selected.name}</h3>
                      <p className="text-sm text-ink-2 flex items-center gap-1.5 mt-0.5">
                        <Mail size={13} /> {selected.email}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selected.status}
                        onChange={(e) => updateStatus(selected.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-border-soft bg-white text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => remove(selected.id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-ink-2">Subject:</span>{" "}
                      <span className="font-medium text-ink">{selected.subject ?? "—"}</span>
                    </div>
                    <div>
                      <span className="text-ink-2">Source:</span>{" "}
                      <span className="font-medium text-ink">{selected.source}</span>
                    </div>
                    <div>
                      <span className="text-ink-2">Date:</span>{" "}
                      <span className="font-medium text-ink">{formatDate(selected.created_at)}</span>
                    </div>
                    <div>
                      <span className="text-ink-2">IP:</span>{" "}
                      <span className="font-medium text-ink font-mono text-xs">{selected.ip_address ?? "—"}</span>
                    </div>
                  </div>

                  <div className="border-t border-border-soft pt-4">
                    <h4 className="text-xs font-semibold text-ink-2 mb-2 flex items-center gap-1.5">
                      <MessageSquare size={12} /> Message
                    </h4>
                    <div className="bg-slate-50 rounded-xl p-4 text-sm text-ink leading-relaxed whitespace-pre-wrap">
                      {selected.message}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? "Your inquiry"}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
                    >
                      <ArrowUpRight size={14} />
                      Reply via Email
                    </a>
                    {selected.status !== "replied" && (
                      <button
                        onClick={() => updateStatus(selected.id, "replied")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        Mark as Replied
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-ink-2">
                  <Eye size={32} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Select a lead to view details</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
