"use client";

import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex justify-center mb-6">
        <Link href="/" aria-label="PDFThings home" className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-soft hover:brightness-105 transition-[filter]">
          <Heart size={20} fill="currentColor" strokeWidth={0} />
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-ink mb-1 text-center">Welcome back</h1>
      <p className="text-sm text-ink-2 text-center mb-8">Log in to access your dashboard</p>

      <SocialAuthButtons />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full border border-border-soft rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full border border-border-soft rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm text-brand-dark bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircle size={14} className="shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-white py-2.5 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-soft"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-center text-ink-2 mt-6">
        No account?{" "}
        <Link href="/register" className="text-brand font-medium hover:underline">
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}
