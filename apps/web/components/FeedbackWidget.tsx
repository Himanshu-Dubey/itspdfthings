"use client";

import { useState, useMemo } from "react";
import { MessageSquare, X, Send, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.itspdfthings.com";

async function fetchCsrf() {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, { credentials: "include" });
}

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

const TYPE_OPTIONS = [
  { value: "general", label: "General" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "suggestion", label: "Suggestion" },
  { value: "other", label: "Other" },
];

export function FeedbackWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const pageLoadTime = useMemo(() => Math.floor(Date.now() / 1000), []);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [type, setType] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter your feedback.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      await fetchCsrf();

      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": getCsrfToken(),
        },
        body: JSON.stringify({ name, email, type, subject, message, hp: "", ts: pageLoadTime }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Failed to submit feedback.");
      }

      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setMessage("");
    setSubject("");
    setError("");
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-brand-dark text-white shadow-[0_4px_16px_rgba(220,38,38,0.35)] hover:brightness-110 transition-all flex items-center justify-center cursor-pointer"
        title="Send Feedback"
      >
        <MessageSquare size={20} />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[80vh] bg-surface rounded-2xl shadow-2xl border border-border-soft overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between bg-gradient-to-r from-red-500 to-brand-dark">
            <h3 className="text-sm font-bold text-white">Send us feedback</h3>
            <button onClick={reset} className="text-white/80 hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
                <p className="text-sm font-semibold text-ink">Thank you for your feedback!</p>
                <p className="text-xs text-ink-2">We&apos;ll review it and get back to you if needed.</p>
                <button
                  onClick={reset}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-ink hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-page border border-border-soft rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-page border border-border-soft rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-page border border-border-soft rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Subject (optional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-page border border-border-soft rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30"
                />

                <textarea
                  placeholder="Your feedback..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-page border border-border-soft rounded-xl px-3 py-2 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
                />

                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {!submitted && (
            <div className="px-5 py-3 border-t border-border-soft">
              <button
                onClick={handleSubmit}
                disabled={submitting || !message.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-red-500 to-brand-dark text-white hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
              >
                {submitting ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Send size={14} />
                )}
                {submitting ? "Sending..." : "Send Feedback"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
