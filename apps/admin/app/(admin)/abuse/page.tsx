"use client";

import { useEffect, useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import type { AbuseLogEntry, IpBlocklistEntry } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, LoadingState } from "@/components/ui/EmptyState";

type Tab = "log" | "blocklist";

export default function AbusePage() {
  const [tab, setTab] = useState<Tab>("log");
  const [logs, setLogs] = useState<AbuseLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [blocklist, setBlocklist] = useState<IpBlocklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, start] = useTransition();

  const [blockIpValue, setBlockIpValue] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockError, setBlockError] = useState<string | null>(null);

  const loadLogs = (p = 1) => {
    setLoading(true);
    adminApi.getAbuseLogs({ page: p, per_page: 25 })
      .then(({ logs: l, meta }) => { setLogs(l); setTotal(meta.total); })
      .finally(() => setLoading(false));
  };

  const loadBlocklist = () => {
    setLoading(true);
    adminApi.getBlocklist()
      .then(({ blocklist: b }) => setBlocklist(b))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === "log") loadLogs();
    else loadBlocklist();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlockError(null);
    try {
      await adminApi.blockIp({ ip_address: blockIpValue, reason: blockReason });
      setBlockIpValue("");
      setBlockReason("");
      loadBlocklist();
    } catch (err) {
      setBlockError(err instanceof Error ? err.message : "Failed to block IP.");
    }
  };

  const handleBlockFromLog = (ip: string) => {
    setTab("blocklist");
    setBlockIpValue(ip);
    setBlockReason("One-click block from abuse log");
  };

  const handleUnblock = (id: number) => {
    start(async () => {
      await adminApi.unblockIp(id);
      loadBlocklist();
    });
  };

  return (
    <>
      <PageHeader title="Abuse & Moderation" />
      <main className="flex-1 p-6 pt-0 space-y-5">
      <div className="flex gap-1 bg-surface border border-border-soft shadow-soft p-1 rounded-lg w-fit">
        {(["log", "blocklist"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors cursor-pointer ${
              tab === t ? "bg-gradient-to-br from-red-500 to-brand-dark text-white shadow-brand" : "text-ink-2 hover:text-ink"
            }`}
          >
            {t === "log" ? "Abuse Log" : "IP Blocklist"}
          </button>
        ))}
      </div>

      {tab === "log" && (
        <>
          <div className="bg-surface rounded-2xl border border-border-soft shadow-soft overflow-hidden">
            {loading ? (
              <LoadingState />
            ) : logs.length === 0 ? (
              <EmptyState>No abuse events logged.</EmptyState>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-left">
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">IP</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Endpoint</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Action taken</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Triggered at</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-ink">{log.ip_address}</td>
                      <td className="px-4 py-3 text-ink">{log.reason}</td>
                      <td className="px-4 py-3 text-ink-2 text-xs">{log.endpoint ?? "—"}</td>
                      <td className="px-4 py-3 text-ink-2 text-xs">{log.action_taken ?? "—"}</td>
                      <td className="px-4 py-3 text-ink-2 text-xs">{new Date(log.triggered_at).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleBlockFromLog(log.ip_address)}
                          className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer font-semibold"
                        >
                          Block IP
                        </button>
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
                <button disabled={page === 1} onClick={() => { const p = page - 1; setPage(p); loadLogs(p); }}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">Previous</button>
                <button disabled={page >= Math.ceil(total / 25)} onClick={() => { const p = page + 1; setPage(p); loadLogs(p); }}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed">Next</button>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "blocklist" && (
        <>
          <form onSubmit={handleBlock} className="bg-surface rounded-2xl border border-border-soft shadow-soft p-5 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">IP or CIDR</label>
              <input
                value={blockIpValue}
                onChange={(e) => setBlockIpValue(e.target.value)}
                placeholder="203.0.113.4 or 203.0.113.0/24"
                required
                className="bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand w-64"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-ink-2 mb-1">Reason</label>
              <input
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Why is this IP blocked?"
                required
                className="bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand w-full"
              />
            </div>
            <button type="submit" className="text-sm bg-gradient-to-br from-red-500 to-brand-dark hover:brightness-105 text-white px-4 py-2 rounded-lg font-semibold shadow-brand transition-all cursor-pointer">
              Block
            </button>
          </form>
          {blockError && <p className="text-sm text-red-600">{blockError}</p>}

          <div className="bg-surface rounded-2xl border border-border-soft shadow-soft overflow-hidden">
            {loading ? (
              <LoadingState />
            ) : blocklist.length === 0 ? (
              <EmptyState>No blocked IPs.</EmptyState>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-left">
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">IP / CIDR</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Blocked by</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Expires</th>
                    <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {blocklist.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-ink">{entry.ip_address}</td>
                      <td className="px-4 py-3 text-ink">{entry.reason}</td>
                      <td className="px-4 py-3 text-ink-2 text-xs">{entry.blockedBy?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-ink-2 text-xs">
                        {entry.expires_at ? new Date(entry.expires_at).toLocaleString() : "Never"}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleUnblock(entry.id)} disabled={isPending}
                          className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-ink-2 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer font-semibold">
                          Unblock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
      </main>
    </>
  );
}
