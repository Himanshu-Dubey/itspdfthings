"use client";

import { useEffect, useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import type { StripeConfigResponse } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/EmptyState";
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Zap,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const KEY_META: Record<string, { label: string; desc: string; placeholder: string; link?: string }> = {
  STRIPE_KEY: {
    label: "Publishable key",
    desc: "Starts with pk_test_ (test) or pk_live_ (production).",
    placeholder: "pk_test_…",
    link: "https://dashboard.stripe.com/apikeys",
  },
  STRIPE_SECRET: {
    label: "Secret key",
    desc: "Starts with sk_test_ (test) or sk_live_ (production). Never expose this publicly.",
    placeholder: "sk_test_…",
    link: "https://dashboard.stripe.com/apikeys",
  },
  STRIPE_WEBHOOK_SECRET: {
    label: "Webhook signing secret",
    desc: "Starts with whsec_. Generated when you add the webhook endpoint in Stripe.",
    placeholder: "whsec_…",
    link: "https://dashboard.stripe.com/webhooks",
  },
  STRIPE_PRICE_PREMIUM_MONTHLY: {
    label: "Premium monthly price ID",
    desc: "Starts with price_. Create a recurring product in Stripe and copy the price ID.",
    placeholder: "price_…",
    link: "https://dashboard.stripe.com/products",
  },
};

const KEY_ORDER = [
  "STRIPE_KEY",
  "STRIPE_SECRET",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PREMIUM_MONTHLY",
];

export default function StripePage() {
  const [data, setData]       = useState<StripeConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Edit state
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saveIsPending, startSave] = useTransition();

  // Test state
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [testIsPending, startTest]  = useTransition();

  // Webhook copy
  const [copied, setCopied] = useState(false);

  const load = () => {
    setLoading(true);
    setError("");
    adminApi
      .getStripeConfig()
      .then((r) => {
        setData(r);
        // Pre-fill form with empty strings (we never prefill secrets)
        setForm(Object.fromEntries(KEY_ORDER.map((k) => [k, ""])));
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = () => {
    // Only send keys that the user actually typed something into
    const payload: Record<string, string> = {};
    KEY_ORDER.forEach((k) => {
      if (form[k]?.trim()) payload[k] = form[k].trim();
    });

    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }

    startSave(async () => {
      try {
        const updated = await adminApi.updateStripeConfig(payload);
        setData(updated);
        setEditing(false);
        setForm(Object.fromEntries(KEY_ORDER.map((k) => [k, ""])));
        setTestResult(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Save failed.");
      }
    });
  };

  const handleTest = () => {
    setTestResult(null);
    startTest(async () => {
      try {
        const res = await adminApi.testStripeConnection();
        setTestResult(res);
      } catch (e: unknown) {
        setTestResult({ ok: false, message: e instanceof Error ? e.message : "Test failed." });
      }
    });
  };

  const handleCopyWebhook = async () => {
    if (!data?.webhook_url) return;
    await navigator.clipboard.writeText(data.webhook_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const configuredCount = data
    ? KEY_ORDER.filter((k) => data.config[k]?.set).length
    : 0;

  const allConfigured = configuredCount === KEY_ORDER.length;

  return (
    <>
      <PageHeader
        title="Stripe Configuration"
        description="API keys, webhook secret, and product price ID for the Premium subscription flow"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-2 hover:text-brand transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setTestResult(null); }}
                className="inline-flex items-center gap-1.5 bg-gradient-to-br from-red-500 to-brand-dark text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-brand hover:brightness-105 transition-all cursor-pointer"
              >
                <Key size={13} /> Edit keys
              </button>
            )}
          </div>
        }
      />

      <main className="flex-1 px-6 pb-6 space-y-5 max-w-3xl">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {loading && !data ? (
          <LoadingState />
        ) : data ? (
          <>
            {/* Status overview */}
            <Card>
              <CardHeader>
                <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                  <Zap size={14} className="text-ink-2" /> Status
                </CardTitle>
                <Badge variant={allConfigured ? "success" : "warning"}>
                  {configuredCount} / {KEY_ORDER.length} configured
                </Badge>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {KEY_ORDER.map((k) => {
                    const meta   = KEY_META[k];
                    const status = data.config[k];
                    return (
                      <div key={k} className="flex items-center gap-3 text-sm">
                        {status?.set ? (
                          <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle size={15} className="text-amber-400 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-ink">{meta?.label}</span>
                          {status?.preview && (
                            <span className="ml-2 font-mono text-xs text-ink-2">{status.preview}</span>
                          )}
                        </div>
                        <Badge variant={status?.set ? "success" : "neutral"} className="shrink-0">
                          {status?.set ? "Set" : "Not set"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            {/* Edit form */}
            {editing && (
              <Card>
                <CardHeader>
                  <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                    <Key size={14} className="text-ink-2" /> Update keys
                  </CardTitle>
                </CardHeader>
                <CardBody className="space-y-5">
                  <p className="text-xs text-ink-2">
                    Leave a field blank to keep the current value unchanged. Values are written to the server&apos;s <code className="font-mono bg-slate-100 px-1 rounded">.env</code> file.
                  </p>

                  {KEY_ORDER.map((k) => {
                    const meta = KEY_META[k];
                    const isSecret = k !== "STRIPE_PRICE_PREMIUM_MONTHLY";
                    const show = visible[k] ?? false;

                    return (
                      <div key={k}>
                        <div className="flex items-center justify-between mb-1">
                          <label htmlFor={k} className="text-sm font-medium text-ink">
                            {meta?.label}
                          </label>
                          {meta?.link && (
                            <a
                              href={meta.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                            >
                              Stripe dashboard <ExternalLink size={11} />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-ink-2 mb-1.5">{meta?.desc}</p>
                        <div className="relative">
                          <input
                            id={k}
                            type={isSecret && !show ? "password" : "text"}
                            value={form[k] ?? ""}
                            onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                            placeholder={data.config[k]?.set ? "(keep current)" : meta?.placeholder}
                            className="w-full border border-border-soft rounded-xl px-3.5 py-2.5 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors pr-10"
                          />
                          {isSecret && (
                            <button
                              type="button"
                              onClick={() => setVisible((v) => ({ ...v, [k]: !show }))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 hover:text-ink transition-colors cursor-pointer"
                              aria-label={show ? "Hide" : "Show"}
                            >
                              {show ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={saveIsPending}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
                    >
                      {saveIsPending ? "Saving…" : "Save keys"}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setForm(Object.fromEntries(KEY_ORDER.map((k) => [k, ""]))); }}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-ink-2 hover:text-ink transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Test connection */}
            <Card>
              <CardHeader>
                <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                  <Zap size={14} className="text-ink-2" /> Test connection
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                <p className="text-sm text-ink-2">
                  Pings Stripe with the configured secret key to verify credentials are valid.
                </p>

                {testResult && (
                  <div
                    className={[
                      "flex items-center gap-2 text-sm px-4 py-3 rounded-xl border",
                      testResult.ok
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-red-50 border-red-100 text-red-700",
                    ].join(" ")}
                  >
                    {testResult.ok ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    {testResult.message}
                  </div>
                )}

                <button
                  onClick={handleTest}
                  disabled={testIsPending || !data.config["STRIPE_SECRET"]?.set}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-ink hover:bg-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {testIsPending ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Zap size={13} />
                  )}
                  {testIsPending ? "Testing…" : "Test connection"}
                </button>
              </CardBody>
            </Card>

            {/* Webhook setup */}
            <Card>
              <CardHeader>
                <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal">
                  Webhook endpoint
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <p className="text-sm text-ink-2">
                  Add this URL in your{" "}
                  <a
                    href="https://dashboard.stripe.com/webhooks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline inline-flex items-center gap-0.5"
                  >
                    Stripe webhook settings <ExternalLink size={12} />
                  </a>{" "}
                  to receive subscription events.
                </p>

                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-xs bg-slate-100 rounded-lg px-3 py-2.5 text-ink truncate">
                    {data.webhook_url}
                  </code>
                  <button
                    onClick={handleCopyWebhook}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-ink transition-colors cursor-pointer shrink-0"
                  >
                    <Copy size={12} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>

                <div className="text-xs text-ink-2 space-y-1 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="font-semibold text-amber-700">Required webhook events:</p>
                  {[
                    "customer.subscription.created",
                    "customer.subscription.updated",
                    "customer.subscription.deleted",
                    "invoice.payment_succeeded",
                    "invoice.payment_failed",
                  ].map((e) => (
                    <p key={e} className="font-mono text-amber-800">{e}</p>
                  ))}
                </div>
              </CardBody>
            </Card>
          </>
        ) : null}
      </main>
    </>
  );
}
