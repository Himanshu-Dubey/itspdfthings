"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import type { ManagedUser, PdfJobRow, UserDetailResponse } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState, EmptyState } from "@/components/ui/EmptyState";
import {
  ArrowLeft,
  User,
  ShieldOff,
  ShieldCheck,
  Trash2,
  Crown,
  Zap,
} from "lucide-react";
import Link from "next/link";

const TOOL_LABELS: Record<string, string> = {
  merge: "Merge PDF",
  split: "Split PDF",
  compress: "Compress PDF",
  organize: "Organize PDF",
  "image-to-pdf": "Image → PDF",
  "pdf-to-image": "PDF → Image",
  watermark: "Watermark",
  "page-numbers": "Page Numbers",
  protect: "Protect / Unlock",
};

const STATUS_VARIANT: Record<string, "success" | "danger" | "warning" | "info" | "neutral"> = {
  completed: "success",
  failed: "danger",
  processing: "info",
  pending: "warning",
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<UserDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPending, start] = useTransition();

  const [banModal, setBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    adminApi
      .getUserDetail(Number(id))
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const user: ManagedUser | undefined = data?.user;

  const reload = () => {
    setLoading(true);
    adminApi
      .getUserDetail(Number(id))
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  const handlePlanToggle = () => {
    if (!user) return;
    const newPlan = user.plan === "free" ? "premium" : "free";
    start(async () => {
      await adminApi.updateUser(user.id, { plan: newPlan });
      reload();
    });
  };

  const handleUnban = () => {
    if (!user) return;
    start(async () => {
      await adminApi.updateUser(user.id, { is_banned: false, banned_reason: undefined });
      reload();
    });
  };

  const handleBan = () => {
    if (!user) return;
    start(async () => {
      await adminApi.updateUser(user.id, { is_banned: true, banned_reason: banReason || undefined });
      setBanModal(false);
      setBanReason("");
      reload();
    });
  };

  const handleDelete = () => {
    if (!user) return;
    start(async () => {
      await adminApi.deleteUser(user.id);
      router.push("/users");
    });
  };

  if (loading) return <LoadingState />;
  if (error || !user) return <EmptyState>{error || "User not found."}</EmptyState>;

  const jobCounts = data?.job_counts ?? {};
  const recentJobs: PdfJobRow[] = data?.recent_jobs ?? [];

  return (
    <>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={
          <Link
            href="/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-2 hover:text-brand transition-colors"
          >
            <ArrowLeft size={13} /> Back to Users
          </Link>
        }
      />

      <main className="flex-1 px-6 pb-6 space-y-5">
        {/* Profile card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                <User size={14} className="text-ink-2" /> Profile
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <Row label="Email" value={user.email} />
              <Row label="Joined" value={new Date(user.created_at).toLocaleDateString()} />
              <Row
                label="Last active"
                value={user.last_active_at ? new Date(user.last_active_at).toLocaleDateString() : "Never"}
              />
              <Row label="Country" value={user.country ?? "—"} />
              <Row
                label="Email verified"
                value={user.email_verified_at ? "Yes" : "No"}
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-ink-2">Status</span>
                <Badge variant={user.is_banned ? "danger" : "success"}>
                  {user.is_banned ? "Banned" : "Active"}
                </Badge>
              </div>
              {user.is_banned && user.banned_reason && (
                <p className="text-xs text-ink-2 italic">Reason: {user.banned_reason}</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal flex items-center gap-2">
                <Crown size={14} className="text-ink-2" /> Plan &amp; Jobs
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-2">Plan</span>
                <Badge variant={user.plan === "premium" ? "warning" : "neutral"}>
                  {user.plan}
                </Badge>
              </div>
              {Object.entries(jobCounts).map(([status, n]) => (
                <Row key={status} label={`${status} jobs`} value={String(n)} />
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal">Actions</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap gap-3">
            <button
              onClick={handlePlanToggle}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {user.plan === "free" ? <Crown size={13} /> : <Zap size={13} />}
              {user.plan === "free" ? "Set Premium" : "Downgrade to Free"}
            </button>

            {user.is_banned ? (
              <button
                onClick={handleUnban}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck size={13} /> Unban User
              </button>
            ) : (
              <button
                onClick={() => setBanModal(true)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <ShieldOff size={13} /> Ban User
              </button>
            )}

            <button
              onClick={() => setDeleteModal(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer ml-auto"
            >
              <Trash2 size={13} /> Delete Account (GDPR)
            </button>
          </CardBody>
        </Card>

        {/* Recent jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="normal-case text-sm font-semibold text-ink tracking-normal">
              Recent Jobs (last 20)
            </CardTitle>
          </CardHeader>
          {recentJobs.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-2">No jobs yet.</p>
            </CardBody>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-soft text-left">
                    <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Tool</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Time</th>
                    <th className="px-5 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-ink font-medium">
                        {TOOL_LABELS[job.tool_type] ?? job.tool_type}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={STATUS_VARIANT[job.status] ?? "default"}>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-ink-2 tabular-nums">
                        {job.processing_time_ms != null ? `${job.processing_time_ms} ms` : "—"}
                      </td>
                      <td className="px-5 py-3 text-ink-2">
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* Ban modal */}
      {banModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">Ban {user.name}?</h2>
            <p className="text-sm text-gray-500">This prevents the user from logging in.</p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Reason for ban (optional)"
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setBanModal(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleBan}
                disabled={isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Banning…" : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">Delete {user.name}?</h2>
            <p className="text-sm text-gray-500">
              This permanently deletes the account and all associated data (GDPR). This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteModal(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Deleting…" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-2">{label}</span>
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}
