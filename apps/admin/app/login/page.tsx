"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const { login, admin } = useAdminAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (admin) router.replace("/dashboard");
  }, [admin, router]);

  // React 19 / Next.js 16 form action — reads FormData directly so
  // browser autofill is always captured and no GET query params leak.
  function handleAction(formData: FormData) {
    const email = (formData.get("email") as string) ?? "";
    const password = (formData.get("password") as string) ?? "";

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    startTransition(async () => {
      try {
        setError("");
        await login(email, password);
        router.replace("/dashboard");
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    });
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-ink font-extrabold text-2xl tracking-tight">PDFThings</span>
          <span className="ml-2 text-brand text-xs font-bold bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider">
            Admin
          </span>
          <p className="mt-2 text-ink-2 text-sm">Sign in to access the admin panel</p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-border-soft shadow-soft p-8">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700"
            >
              <span aria-hidden="true">⚠</span>
              {error}
            </div>
          )}

          <form action={handleAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-ink-2 mb-1.5 uppercase tracking-wide"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-slate-50 border border-border-soft rounded-lg px-3 py-2.5 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-ink-2 mb-1.5 uppercase tracking-wide"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-slate-50 border border-border-soft rounded-lg px-3 py-2.5 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-red-500 to-brand-dark hover:brightness-105 active:brightness-95 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-brand transition-all focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-ink-2">
          Admin access only — not your account?{" "}
          <a
            href="http://app.itspdfthings.com"
            className="text-ink-2 hover:text-brand transition-colors underline"
          >
            Go to app
          </a>
        </p>
      </div>
    </div>
  );
}
