"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import type { Comment } from "@/types/api";
import { MessageCircle, Check, X, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function BlogCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (statusFilter !== "all") params.status = statusFilter;
      const data = await adminApi.getComments(params);
      setComments(data.comments.data);
      setLastPage(data.comments.last_page);
      setTotal(data.comments.total);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const approve = async (id: number) => {
    try {
      await adminApi.approveComment(id);
      fetchComments();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const reject = async (id: number) => {
    try {
      await adminApi.rejectComment(id);
      fetchComments();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await adminApi.deleteComment(id);
      fetchComments();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <PageHeader title="Comments" description={`${total} comments`} />

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="flex gap-2">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40">
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-2 text-sm">Loading…</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-ink-2 text-sm">No comments found.</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Author</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Comment</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-ink-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id} className="border-b border-border-soft last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-ink text-sm">{comment.name}</span>
                        <p className="text-xs text-ink-2">{comment.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-ink truncate max-w-[300px]">{comment.content}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        comment.is_approved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {comment.is_approved ? "APPROVED" : "PENDING"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-2 text-xs">{formatDate(comment.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!comment.is_approved ? (
                          <button onClick={() => approve(comment.id)}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-ink-2 hover:text-emerald-600 cursor-pointer" title="Approve">
                            <Check size={14} />
                          </button>
                        ) : (
                          <button onClick={() => reject(comment.id)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-ink-2 hover:text-amber-600 cursor-pointer" title="Reject">
                            <X size={14} />
                          </button>
                        )}
                        <button onClick={() => remove(comment.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-ink-2 hover:text-red-600 cursor-pointer" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-between">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-sm cursor-pointer">
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-xs text-ink-2">Page {page} of {lastPage}</span>
          <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-sm cursor-pointer">
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
