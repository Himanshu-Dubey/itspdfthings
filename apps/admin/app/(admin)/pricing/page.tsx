"use client";

import { useEffect, useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";

const TOOL_LABELS: Record<string, string> = {
  merge: "Merge PDF",
  split: "Split PDF",
  compress: "Compress PDF",
  organize: "Organize PDF",
  "image-to-pdf": "Image → PDF",
  "pdf-to-image": "PDF → Image",
  watermark: "Watermark",
  "page-numbers": "Page numbers",
  protect: "Protect",
  unlock: "Unlock (shares the \"Protect\" toggle above — not independently enforced)",
};

const BYTES_PER_MB = 1024 * 1024;

export default function PricingPage() {
  const [raw, setRaw]             = useState<Record<string, string>>({});
  const [tools, setTools]         = useState<Record<string, boolean>>({});
  const [dirty, setDirty]         = useState<Record<string, boolean>>({});
  const [toolsDirty, setToolsDirty] = useState(false);
  const [saved, setSaved]         = useState(false);
  const [loading, setLoading]     = useState(true);
  const [isPending, start]        = useTransition();

  useEffect(() => {
    adminApi.getSettings().then(({ settings }) => {
      setRaw(Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, v ?? ""])));
      try {
        setTools(JSON.parse(settings.tools_enabled ?? "{}"));
      } catch {
        setTools({});
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, val: string) => {
    setRaw((v) => ({ ...v, [key]: val }));
    setDirty((d) => ({ ...d, [key]: true }));
    setSaved(false);
  };

  const toggleTool = (key: string) => {
    setTools((t) => ({ ...t, [key]: !t[key] }));
    setToolsDirty(true);
    setSaved(false);
  };

  const bytesToMb = (bytes: string) => (bytes ? String(Math.round(Number(bytes) / BYTES_PER_MB)) : "");
  const mbToBytes = (mb: string) => (mb ? String(Math.round(Number(mb) * BYTES_PER_MB)) : "");

  const handleSave = () => {
    const toSave: Record<string, string | null> = {};
    Object.keys(dirty).forEach((k) => { toSave[k] = raw[k] || null; });
    if (toolsDirty) toSave.tools_enabled = JSON.stringify(tools);

    start(async () => {
      await adminApi.updateSettings(toSave);
      setDirty({});
      setToolsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Quotas & Tools" />
        <div className="flex items-center justify-center h-64 text-ink-2 text-sm">Loading…</div>
      </>
    );
  }

  const hasDirty = Object.keys(dirty).length > 0 || toolsDirty;

  return (
    <>
      <PageHeader
        title="Quotas & Tools"
        description="Free-tier limits and tool availability — takes effect immediately"
        actions={
          <>
            {saved && <span className="text-sm text-emerald-600 font-semibold">Saved!</span>}
            <button
              onClick={handleSave}
              disabled={!hasDirty || isPending}
              className="bg-gradient-to-br from-red-500 to-brand-dark hover:brightness-105 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-brand transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </>
        }
      />
      <main className="flex-1 p-6 pt-0 space-y-5 max-w-2xl">
        <div className="bg-surface border border-border-soft rounded-2xl shadow-soft overflow-hidden">
          <div className="px-5 py-3 border-b border-border-soft">
            <h2 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Free-tier quotas</h2>
          </div>
          <div className="divide-y divide-border-soft">
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <label className="text-sm font-semibold text-ink">Anonymous — jobs/tool/day</label>
              <input
                type="number"
                value={raw.quota_anonymous_per_tool_day ?? ""}
                onChange={(e) => handleChange("quota_anonymous_per_tool_day", e.target.value)}
                className="w-24 bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <label className="text-sm font-semibold text-ink">Free registered user — jobs/tool/day</label>
              <input
                type="number"
                value={raw.quota_free_user_per_tool_day ?? ""}
                onChange={(e) => handleChange("quota_free_user_per_tool_day", e.target.value)}
                className="w-24 bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <label className="text-sm font-semibold text-ink">Max file size — free (MB)</label>
              <input
                type="number"
                value={bytesToMb(raw.file_size_limit_free_bytes ?? "")}
                onChange={(e) => handleChange("file_size_limit_free_bytes", mbToBytes(e.target.value))}
                className="w-24 bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <label className="text-sm font-semibold text-ink">Max file size — premium (MB)</label>
              <input
                type="number"
                value={bytesToMb(raw.file_size_limit_premium_bytes ?? "")}
                onChange={(e) => handleChange("file_size_limit_premium_bytes", mbToBytes(e.target.value))}
                className="w-24 bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border-soft rounded-2xl shadow-soft overflow-hidden">
          <div className="px-5 py-3 border-b border-border-soft">
            <h2 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Tools</h2>
          </div>
          <div className="divide-y divide-border-soft">
            {Object.keys(tools).map((key) => (
              <div key={key} className="px-5 py-4 flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-ink">{TOOL_LABELS[key] ?? key}</label>
                <button
                  onClick={() => toggleTool(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    tools[key] ? "bg-brand" : "bg-slate-200"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    tools[key] ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
