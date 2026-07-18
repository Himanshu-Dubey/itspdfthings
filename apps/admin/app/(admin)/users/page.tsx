"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import type { ManagedUser } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState, LoadingState } from "@/components/ui/EmptyState";

const PLAN_BADGE = {
  free:    "bg-slate-100 text-ink-2",
  premium: "bg-amber-100 text-amber-700",
};

export default function UsersPage() {
  const [users, setUsers]       = useState<ManagedUser[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState("");
  const [planFilter, setPlan]   = useState("");
  const [loading, setLoading]   = useState(true);
  const [isPending, start]      = useTransition();

  const [banModal, setBanModal] = useState<{ user: ManagedUser; open: boolean } | null>(null);
  const [banReason, setBanReason] = useState("");

  const load = (p = page, q = search, plan = planFilter) => {
    setLoading(true);
    const params: Record<string, string | number> = { page: p, per_page: 25 };
    if (q)    params.search = q;
    if (plan) params.plan   = plan;
    adminApi.getUsers(params)
      .then(({ users: u, meta }) => { setUsers(u); setTotal(meta.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1, search, planFilter);
  };

  const handleBanToggle = (user: ManagedUser) => {
    if (user.is_banned) {
      start(async () => {
        await adminApi.updateUser(user.id, { is_banned: false, banned_reason: undefined });
        load();
      });
    } else {
      setBanModal({ user, open: true });
      setBanReason("");
    }
  };

  const confirmBan = () => {
    if (!banModal) return;
    start(async () => {
      await adminApi.updateUser(banModal.user.id, { is_banned: true, banned_reason: banReason });
      setBanModal(null);
      load();
    });
  };

  const handlePlanToggle = (user: ManagedUser) => {
    const newPlan = user.plan === "free" ? "premium" : "free";
    start(async () => {
      await adminApi.updateUser(user.id, { plan: newPlan });
      load();
    });
  };

  return (
    <>
      <PageHeader title="Users" description={`${total.toLocaleString()} total`} />
      <main className="flex-1 p-6 pt-0 space-y-5">
      {/* Filters */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-surface border border-border-soft rounded-lg px-3 py-2 text-sm text-ink placeholder-slate-400 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <select
          value={planFilter}
          onChange={(e) => { setPlan(e.target.value); setPage(1); load(1, search, e.target.value); }}
          className="bg-surface border border-border-soft rounded-lg px-3 py-2 text-sm text-ink-2 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <button
          type="submit"
          className="bg-gradient-to-br from-red-500 to-brand-dark hover:brightness-105 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-brand transition-all cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border-soft shadow-soft overflow-hidden">
        {loading ? (
          <LoadingState />
        ) : users.length === 0 ? (
          <EmptyState>No users found.</EmptyState>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left">
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-ink-2 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/users/${user.id}`} className="font-semibold text-ink hover:text-brand transition-colors">
                      {user.name}
                    </Link>
                    <p className="text-ink-2 text-xs">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handlePlanToggle(user)}
                      disabled={isPending}
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_BADGE[user.plan]} hover:opacity-80 transition-opacity cursor-pointer disabled:opacity-50`}
                      title="Click to toggle plan"
                    >
                      {user.plan}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-ink-2 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {user.is_banned ? (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Banned</span>
                    ) : (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleBanToggle(user)}
                      disabled={isPending}
                      className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
                        user.is_banned
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {user.is_banned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 25 && (
        <div className="flex items-center justify-between text-sm text-ink-2">
          <span>Page {page} of {Math.ceil(total / 25)}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => { const p = page - 1; setPage(p); load(p); }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              disabled={page >= Math.ceil(total / 25)}
              onClick={() => { const p = page + 1; setPage(p); load(p); }}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border-soft shadow-soft hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Ban modal */}
      {banModal?.open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface border border-border-soft shadow-soft rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-ink font-bold text-lg">Ban {banModal.user.name}?</h2>
            <p className="text-ink-2 text-sm">This will prevent the user from logging in or using any tools.</p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Reason for ban (optional)"
              rows={3}
              className="w-full bg-slate-50 border border-border-soft rounded-lg px-3 py-2 text-sm text-ink placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setBanModal(null)}
                className="px-4 py-2 text-sm text-ink-2 hover:text-ink transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmBan}
                disabled={isPending}
                className="px-4 py-2 text-sm bg-gradient-to-br from-red-500 to-brand-dark hover:brightness-105 text-white rounded-lg font-semibold shadow-brand transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending ? "Banning…" : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </>
  );
}
