"use client";

import { useAuth } from "@/lib/auth-context";
import { billing, geo, ApiError } from "@/lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";

export function UpgradeButton({ className }: { className?: string }) {
  const { user, loading: authLoading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingProvider, setBillingProvider] = useState<"stripe" | "razorpay">("stripe");

  const baseClass =
    className ??
    "inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  // Detect user's country on mount
  useEffect(() => {
    geo.detect().then((res) => {
      setBillingProvider(res.billing_provider);
    }).catch(() => {
      // Default to Stripe on error
    });
  }, []);

  if (authLoading) {
    return <button disabled className={baseClass}>Loading…</button>;
  }

  if (!user) {
    return (
      <Link href="/register" className={baseClass}>
        Sign up to upgrade
      </Link>
    );
  }

  if (user.plan === "premium") {
    return (
      <div>
        <button
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const { portal_url } = await billing.portal();
              window.location.href = portal_url;
            } catch (err) {
              setError(err instanceof ApiError ? err.message : "Couldn't open billing portal.");
              setBusy(false);
            }
          }}
          disabled={busy}
          className={baseClass}
        >
          {busy ? "Opening…" : "Manage billing"}
        </button>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            const { checkout_url } = await billing.checkout(undefined, billingProvider === "razorpay" ? "IN" : "US");
            window.location.href = checkout_url;
          } catch (err) {
            setError(err instanceof ApiError ? err.message : "Couldn't start checkout.");
            setBusy(false);
          }
        }}
        disabled={busy}
        className={baseClass}
      >
        {busy ? "Redirecting…" : "Upgrade to Premium"}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
