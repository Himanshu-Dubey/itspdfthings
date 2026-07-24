"use client";

import { useEffect, useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";

interface SettingField {
  key: string;
  label: string;
  description?: string;
  type: "text" | "boolean" | "textarea";
}

// These keys must match exactly what's in the `settings` table / what the API reads
// (see apps/api/app/Http/Controllers/ToolStatusController.php and PdfJobController).
const FIELDS: SettingField[] = [
  { key: "maintenance_mode",  label: "Maintenance mode", type: "boolean", description: "Blocks all tool usage while active. The public frontend shows a maintenance page." },
  { key: "announcement_banner", label: "Announcement text", type: "textarea", description: "Shown as a banner across the public frontend. Leave blank to hide." },
  { key: "announcement_link", label: "Announcement link (optional)", type: "text" },
  { key: "announcement_expires_at", label: "Announcement expires at", type: "text", description: "ISO datetime, e.g. 2026-08-01T00:00:00. Leave blank for no expiry." },
];

export default function SettingsPage() {
  const [values, setValues]   = useState<Record<string, string>>({});
  const [dirty, setDirty]     = useState<Record<string, boolean>>({});
  const [saved, setSaved]     = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, start]    = useTransition();
  const [stripeEnabled, setStripeEnabled] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(true);

  useEffect(() => {
    adminApi.getSettings().then(({ settings }) => {
      setValues(Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, v ?? ""])));
    }).finally(() => setLoading(false));
    adminApi.getBillingToggle().then((res) => {
      setStripeEnabled(res.stripe_enabled);
    }).finally(() => setStripeLoading(false));
  }, []);

  const handleChange = (key: string, val: string) => {
    setValues((v) => ({ ...v, [key]: val }));
    setDirty((d) => ({ ...d, [key]: true }));
    setSaved(false);
  };

  const handleSave = () => {
    const toSave: Record<string, string | null> = {};
    Object.keys(dirty).forEach((k) => { toSave[k] = values[k] || null; });

    start(async () => {
      await adminApi.updateSettings(toSave);
      setDirty({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  if (loading) {
    return (
      <>
        <PageHeader title="Settings" />
        <div className="flex items-center justify-center h-64 text-ink-2 text-sm">Loading…</div>
      </>
    );
  }

  const hasDirty = Object.keys(dirty).length > 0;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Maintenance mode and site-wide announcements"
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
      <p className="text-ink-2 text-sm">
        Quotas, file limits, and tool toggles live under{" "}
        <a href="/pricing" className="text-brand hover:underline font-medium">Quotas &amp; Tools</a>.
      </p>

      {/* Stripe Payment Toggle */}
      <div className="bg-surface border border-border-soft rounded-2xl shadow-soft overflow-hidden">
        <div className="px-5 py-4 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-semibold text-ink mb-0.5">Enable Stripe payments</label>
            <p className="text-xs text-ink-2 mb-2">
              When OFF: Razorpay-only with INR pricing for all users.
              <br />When ON: Geo-based routing — India gets Razorpay (INR), rest gets Stripe (USD).
            </p>
          </div>
          <div className="shrink-0">
            <button
              disabled={stripeLoading}
              onClick={async () => {
                const next = !stripeEnabled;
                setStripeEnabled(next);
                await adminApi.updateBillingToggle(next);
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                stripeEnabled ? "bg-brand" : "bg-slate-200"
              }`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                stripeEnabled ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border-soft rounded-2xl shadow-soft overflow-hidden">
        <div className="divide-y divide-border-soft">
          {FIELDS.map((field) => (
            <div key={field.key} className="px-5 py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-semibold text-ink mb-0.5">{field.label}</label>
                {field.description && <p className="text-xs text-ink-2 mb-2">{field.description}</p>}
              </div>
              <div className="shrink-0">
                {field.type === "boolean" ? (
                  <button
                    onClick={() => handleChange(field.key, values[field.key] === "1" ? "0" : "1")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      values[field.key] === "1" ? "bg-brand" : "bg-slate-200"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                      values[field.key] === "1" ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-64 bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-64 bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      </main>
    </>
  );
}
