"use client";

import { useState, useCallback } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const DIRECT_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function fetchCsrf(): Promise<void> {
  await fetch(`${DIRECT_API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: string, val: string) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      await fetchCsrf();

      const res = await fetch(`${DIRECT_API_URL}/api/contact`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCsrfToken(),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message ?? "Something went wrong.";
        const errors = data?.errors;
        const firstError = errors ? Object.values(errors).flat().join(". ") : msg;
        throw new Error(firstError);
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Failed to send message. Please try again.");
    }
  }, [form]);

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
        <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-800">Message sent!</h3>
        <p className="text-sm text-emerald-700">
          Thank you for reaching out. We will get back to you shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm text-emerald-600 underline hover:text-emerald-800 cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="w-full rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="w-full rounded-xl border border-border-soft bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors resize-y"
          placeholder="Tell us what you need…"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-brand-dark active:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-soft"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
