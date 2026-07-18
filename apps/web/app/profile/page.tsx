"use client";

import { useAuth } from "@/lib/auth-context";
import { auth, billing, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  User,
  Lock,
  CreditCard,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Crown,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

type Section = "profile" | "security" | "billing";
type Feedback = { type: "success" | "error"; message: string };

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "profile",  label: "Profile",  icon: User,       desc: "Name and account info" },
  { id: "security", label: "Security", icon: Lock,       desc: "Change your password" },
  { id: "billing",  label: "Billing",  icon: CreditCard, desc: "Plan and subscription" },
];

export default function ProfilePage() {
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<Section>("profile");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-sm text-ink-2">Loading…</div>
    );
  }

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex gap-7 items-start">
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="w-64 shrink-0 sticky top-24">
          <div className="rounded-2xl border border-border-soft bg-white shadow-soft overflow-hidden">
            {/* User card */}
            <div className="px-5 pt-6 pb-5 border-b border-border-soft">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand to-orange-400 flex items-center justify-center text-white text-xl font-bold shadow-[0_4px_16px_rgba(220,38,38,0.35)]">
                  {initials || "U"}
                </div>
                <div className="min-w-0 w-full">
                  <p className="font-semibold text-ink truncate">{user.name}</p>
                  <p className="text-xs text-ink-2 truncate mt-0.5">{user.email}</p>
                  <span
                    className={[
                      "inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide",
                      user.plan === "premium"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-ink-2",
                    ].join(" ")}
                  >
                    {user.plan === "premium" ? <Crown size={10} /> : null}
                    {user.plan}
                  </span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="p-2">
              {NAV_ITEMS.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={[
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group cursor-pointer",
                      active
                        ? "bg-gradient-to-br from-red-500 to-brand-dark text-white shadow-[0_2px_8px_rgba(220,38,38,0.3)]"
                        : "text-ink-2 hover:bg-slate-50 hover:text-ink",
                    ].join(" ")}
                  >
                    <item.icon
                      size={16}
                      className={[
                        "shrink-0 transition-colors",
                        active ? "text-white" : "text-ink-2 group-hover:text-ink",
                      ].join(" ")}
                    />
                    <div className="min-w-0 flex-1">
                      <p className={["text-sm font-medium leading-none", active ? "text-white" : ""].join(" ")}>
                        {item.label}
                      </p>
                      <p
                        className={[
                          "text-[11px] mt-0.5 leading-none",
                          active ? "text-white/70" : "text-ink-2",
                        ].join(" ")}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <ChevronRight
                      size={13}
                      className={["shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", active ? "!opacity-60" : ""].join(" ")}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Log out */}
            <div className="p-2 pt-0">
              <div className="h-px bg-border-soft mx-1 mb-2" />
              <button
                onClick={async () => { await logout(); router.push("/"); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-2 hover:bg-red-50 hover:text-brand-dark transition-colors cursor-pointer group"
              >
                <LogOut size={16} className="shrink-0" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {section === "profile"  && <ProfileSection user={user} refreshUser={refreshUser} />}
          {section === "security" && <SecuritySection />}
          {section === "billing"  && <BillingSection plan={user.plan} />}
        </div>
      </div>
    </div>
  );
}

/* ── Profile section ───────────────────────────────────────────────────────── */

function ProfileSection({
  user,
  refreshUser,
}: {
  user: { name: string; email: string; plan: string; email_verified_at: string | null; created_at: string };
  refreshUser: () => Promise<void>;
}) {
  const [name, setName] = useState(user.name);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isPending, start] = useTransition();

  const handleSave = () => {
    setFeedback(null);
    const trimmed = name.trim();
    if (!trimmed) { setFeedback({ type: "error", message: "Name cannot be empty." }); return; }
    if (trimmed === user.name) { setFeedback({ type: "success", message: "No changes to save." }); return; }
    start(async () => {
      try {
        await auth.updateProfile({ name: trimmed });
        await refreshUser();
        setFeedback({ type: "success", message: "Name updated successfully." });
      } catch (err) {
        setFeedback({ type: "error", message: err instanceof ApiError ? err.message : "Failed to update name." });
      }
    });
  };

  return (
    <SectionCard title="Profile" icon={User}>
      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <InfoField label="Email address" value={user.email} />
        <InfoField label="Member since" value={new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long" })} />
        <InfoField label="Email verified" value={user.email_verified_at ? "Verified" : "Not verified"} />
        <InfoField label="Plan" value={user.plan === "premium" ? "Premium" : "Free"} />
      </div>

      <div className="h-px bg-border-soft mb-6" />

      {/* Name edit */}
      <div className="space-y-4 max-w-sm">
        <div>
          <label htmlFor="display-name" className="block text-sm font-medium text-ink mb-1.5">
            Display name
          </label>
          <input
            id="display-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full border border-border-soft rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
          <FeedbackMsg feedback={feedback} />
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </SectionCard>
  );
}

/* ── Security section ──────────────────────────────────────────────────────── */

function SecuritySection() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [feedback, setFeedback]   = useState<Feedback | null>(null);
  const [isPending, start]        = useTransition();

  const handleSave = () => {
    setFeedback(null);
    if (!currentPw || !newPw || !confirmPw) {
      setFeedback({ type: "error", message: "All fields are required." });
      return;
    }
    if (newPw !== confirmPw) {
      setFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPw.length < 8) {
      setFeedback({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    start(async () => {
      try {
        await auth.updateProfile({ current_password: currentPw, password: newPw, password_confirmation: confirmPw });
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
        setFeedback({ type: "success", message: "Password changed successfully." });
      } catch (err) {
        let msg = "Failed to change password.";
        if (err instanceof ApiError) {
          const data = err.data as { errors?: Record<string, string[]>; message?: string } | undefined;
          msg = (data?.errors ? Object.values(data.errors).flat()[0] : undefined) ?? data?.message ?? msg;
        }
        setFeedback({ type: "error", message: msg });
      }
    });
  };

  return (
    <SectionCard title="Security" icon={ShieldCheck}>
      <div className="max-w-sm space-y-4">
        <PasswordField id="current-pw" label="Current password" value={currentPw} onChange={setCurrentPw} autoComplete="current-password" />
        <PasswordField id="new-pw"     label="New password"     value={newPw}     onChange={setNewPw}     autoComplete="new-password" />
        <PasswordField id="confirm-pw" label="Confirm new password" value={confirmPw} onChange={setConfirmPw} autoComplete="new-password" />

        <FeedbackMsg feedback={feedback} />

        <button
          onClick={handleSave}
          disabled={isPending}
          className="w-full py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
        >
          {isPending ? "Changing…" : "Change password"}
        </button>
      </div>
    </SectionCard>
  );
}

/* ── Billing section ───────────────────────────────────────────────────────── */

function BillingSection({ plan }: { plan: string }) {
  const [isPending, start] = useTransition();
  const [error, setError]  = useState("");

  const handleAction = () => {
    setError("");
    start(async () => {
      try {
        if (plan === "premium") {
          const { portal_url } = await billing.portal();
          window.location.href = portal_url;
        } else {
          const { checkout_url } = await billing.checkout();
          window.location.href = checkout_url;
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Something went wrong.");
      }
    });
  };

  const isPremium = plan === "premium";

  return (
    <SectionCard title="Billing" icon={CreditCard}>
      {/* Current plan */}
      <div className="rounded-xl border border-border-soft bg-slate-50/60 p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ink">Current plan</p>
          <span
            className={[
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
              isPremium ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-ink-2",
            ].join(" ")}
          >
            {isPremium && <Crown size={10} />}
            {plan}
          </span>
        </div>
        <ul className="space-y-1.5 text-sm text-ink-2">
          {isPremium ? (
            <>
              <Feature>Unlimited file size</Feature>
              <Feature>Priority processing</Feature>
              <Feature>Batch operations</Feature>
              <Feature>Full job history</Feature>
            </>
          ) : (
            <>
              <Feature>Up to 10 MB per file</Feature>
              <Feature>Standard processing speed</Feature>
              <Feature>30-day job history</Feature>
            </>
          )}
        </ul>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-brand-dark mb-4">
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAction}
          disabled={isPending}
          className={[
            "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer",
            isPremium
              ? "bg-slate-100 text-ink hover:bg-slate-200"
              : "bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 shadow-[0_2px_10px_rgba(245,158,11,0.35)]",
          ].join(" ")}
        >
          {isPending ? "Loading…" : isPremium ? "Manage subscription" : "Upgrade to Premium — $9.99/mo"}
        </button>
        <Link
          href="/billing"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-ink-2 hover:text-ink transition-colors"
        >
          View billing page <ChevronRight size={13} />
        </Link>
      </div>
    </SectionCard>
  );
}

/* ── Shared primitives ─────────────────────────────────────────────────────── */

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-white shadow-soft overflow-hidden">
      <div className="px-6 py-4 border-b border-border-soft flex items-center gap-2.5">
        <Icon size={16} className="text-ink-2" />
        <h2 className="font-semibold text-ink">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-2 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <input
        id={id} type="password" value={value} autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border-soft rounded-xl px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
      />
    </div>
  );
}

function FeedbackMsg({ feedback }: { feedback: Feedback | null }) {
  if (!feedback) return null;
  return (
    <p className={["flex items-center gap-1.5 text-xs", feedback.type === "success" ? "text-emerald-600" : "text-brand-dark"].join(" ")}>
      {feedback.type === "success" ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
      {feedback.message}
    </p>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
      {children}
    </li>
  );
}
