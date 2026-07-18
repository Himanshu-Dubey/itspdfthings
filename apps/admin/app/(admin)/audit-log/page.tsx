"use client";

import { Fragment, useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { AuditLogEntry } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, LoadingState } from "@/components/ui/EmptyState";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = (p = 1) => {
    setLoading(true);
    adminApi.getAuditLog({ page: p, per_page: 25 })
      .then(({ logs: l, meta }) => { setLogs(l); setTotal(meta.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHeader title="Audit Log" description="Read-only. Every admin action, in order." />
      <main className="flex-1 p-6 pt-0 space-y-5">
      <div className="bg-surface rounded-2xl border border-border-soft shadow-soft overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : logs.length === 0 ? (
          <EmptyState>No admin actions recorded yet.</EmptyState>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left">
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">IP</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {logs.map((log) => (
                <Fragment key={log.id}>
                  <tr
                    onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-ink">{log.admin?.name ?? `#${log.admin_user_id}`}</td>
                    <td className="px-4 py-3 text-ink font-semibold">{log.action}</td>
                    <td className="px-4 py-3 text-ink-2 text-xs">{log.subject_type} #{log.subject_id}</td>
                    <td className="px-4 py-3 text-ink-2 font-mono text-xs">{log.ip_address}</td>
                    <td className="px-4 py-3 text-ink-2 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                  {expanded === log.id && (log.before || log.after) && (
                    <tr className="bg-slate-50/60">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-ink-2 font-semibold mb-1">Before</p>
                            <pre className="text-ink-2 whitespace-pre-wrap break-all">
                              {log.before ? JSON.stringify(log.before, null, 2) : "—"}
                            </pre>
                          </div>
                          <div>
                            <p className="text-ink-2 font-semibold mb-1">After</p>
                            <pre className="text-ink-2 whitespace-pre-wrap break-all">
                              {log.after ? JSON.stringify(log.after, null, 2) : "—"}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 25 && (
        <div className="flex items-center justify-between text-sm text-ink-2">
          <span>Page {page} of {Math.ceil(total / 25)}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); load(p); }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">Previous</button>
            <button disabled={page >= Math.ceil(total / 25)} onClick={() => { const p = page + 1; setPage(p); load(p); }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      )}
      </main>
    </>
  );
}
