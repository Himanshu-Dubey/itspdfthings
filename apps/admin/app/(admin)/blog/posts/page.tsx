"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import { RichEditor } from "@/components/RichEditor";
import type { Post, Category, Tag } from "@/types/api";
import {
  FileText, Plus, Search, Trash2, Eye, ChevronLeft, ChevronRight,
  Upload, X, Save, ArrowLeft, Pencil, Clock,
} from "lucide-react";

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const [form, setForm] = useState<{
    title: string; slug: string; excerpt: string; content: string;
    featured_image: string; meta_title: string; meta_description: string;
    og_title: string; og_description: string; og_image: string;
    category_id: number | null; tags: number[];
    allow_comments: boolean; is_published: boolean; published_at: string;
    author_name: string;
  }>({
    title: "", slug: "", excerpt: "", content: "",
    featured_image: "", meta_title: "", meta_description: "",
    og_title: "", og_description: "", og_image: "",
    category_id: null, tags: [], allow_comments: true,
    is_published: false, published_at: "", author_name: "",
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page };
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      const data = await adminApi.getPosts(params);
      setPosts(data.posts.data);
      setLastPage(data.posts.last_page);
      setTotal(data.posts.total);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openForm = async (post?: Post) => {
    const [cats, tags] = await Promise.all([adminApi.getCategories(), adminApi.getTags()]);
    setCategories(cats.categories);
    setAllTags(tags.tags);
    if (post) {
      setEditing(post);
      setForm({
        title: post.title, slug: post.slug, excerpt: post.excerpt ?? "",
        content: post.content ?? "", featured_image: post.featured_image ?? "",
        meta_title: post.meta_title ?? "", meta_description: post.meta_description ?? "",
        og_title: post.og_title ?? "", og_description: post.og_description ?? "",
        og_image: post.og_image ?? "", category_id: post.category_id,
        tags: post.tags?.map((t) => t.id) ?? [],
        allow_comments: post.allow_comments, is_published: post.is_published,
        published_at: post.published_at ? post.published_at.slice(0, 16) : "",
        author_name: post.author_name ?? "",
      });
    } else {
      setEditing(null);
      setForm({
        title: "", slug: "", excerpt: "", content: "", featured_image: "",
        meta_title: "", meta_description: "", og_title: "", og_description: "",
        og_image: "", category_id: null, tags: [], allow_comments: true,
        is_published: false, published_at: "", author_name: "",
      });
    }
    setCreating(true);
  };

  const save = async () => {
    try {
      const payload: any = { ...form };
      if (editing) {
        await adminApi.updatePost(editing.id, payload);
      } else {
        await adminApi.createPost(payload);
      }
      setCreating(false);
      setEditing(null);
      fetchPosts();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    try {
      await adminApi.deletePost(id);
      fetchPosts();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const uploadImage = async (field: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { url } = await adminApi.uploadPostImage(file);
        setForm((prev) => ({ ...prev, [field]: url }));
      } catch {
        setError("Image upload failed");
      }
    };
    input.click();
  };

  const toggleTag = (id: number) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(id)
        ? prev.tags.filter((t) => t !== id)
        : [...prev.tags, id],
    }));
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (creating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setCreating(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
            <ArrowLeft size={18} className="text-ink-2" />
          </button>
          <PageHeader title={editing ? "Edit Post" : "New Post"} description="" />
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardBody className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 font-mono" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Excerpt</label>
                <textarea rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Content</label>
                <RichEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
              </div>
            </CardBody></Card>
          </div>

          <div className="space-y-6">
            <Card><CardBody className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Publish</h3>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Author Name</label>
                <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  placeholder="Defaults to admin name"
                  className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                <span className="text-sm text-ink">Published</span>
              </label>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Published At</label>
                <input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.allow_comments} onChange={(e) => setForm({ ...form, allow_comments: e.target.checked })}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                <span className="text-sm text-ink">Allow Comments</span>
              </label>
              <button onClick={save} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors cursor-pointer">
                <Save size={15} /> {editing ? "Update Post" : "Create Post"}
              </button>
            </CardBody></Card>

            <Card><CardBody className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Category</h3>
              <select value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value ? Number(e.target.value) : null })}
                className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40">
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </CardBody></Card>

            <Card><CardBody className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Tags</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {allTags.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.tags.includes(t.id)} onChange={() => toggleTag(t.id)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500" />
                    <span className="text-sm text-ink">{t.name}</span>
                  </label>
                ))}
                {allTags.length === 0 && <p className="text-xs text-ink-2">No tags created yet.</p>}
              </div>
            </CardBody></Card>

            <Card><CardBody className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Featured Image</h3>
              {form.featured_image && (
                <div className="relative">
                  <img src={form.featured_image} alt="" className="w-full h-40 object-cover rounded-xl" />
                  <button onClick={() => setForm({ ...form, featured_image: "" })}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer">
                    <X size={14} />
                  </button>
                </div>
              )}
              <button onClick={() => uploadImage("featured_image")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border-soft text-sm text-ink-2 hover:bg-slate-50 transition-colors cursor-pointer">
                <Upload size={14} /> Upload Image
              </button>
            </CardBody></Card>

            <Card><CardBody className="p-5 space-y-4">
              <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">SEO</h3>
              {[
                { label: "Meta Title", key: "meta_title" },
                { label: "Meta Description", key: "meta_description" },
                { label: "OG Title", key: "og_title" },
                { label: "OG Description", key: "og_description" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">{f.label}</label>
                  {f.key.includes("description") ? (
                    <textarea rows={2} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
                  ) : (
                    <input value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">OG Image</label>
                {form.og_image && (
                  <div className="relative mb-2">
                    <img src={form.og_image} alt="" className="w-full h-32 object-cover rounded-xl" />
                    <button onClick={() => setForm({ ...form, og_image: "" })}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                )}
                <button onClick={() => uploadImage("og_image")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border-soft text-sm text-ink-2 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Upload size={14} /> Upload OG Image
                </button>
              </div>
            </CardBody></Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Blog Posts" description={`${total} total posts`} />
        <button onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors cursor-pointer">
          <Plus size={15} /> New Post
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-2" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search posts…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40">
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-ink-2 text-sm">Loading…</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-ink-2 text-sm">No posts found.</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-ink-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border-soft last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-ink-2 shrink-0" />
                        <span className="font-medium text-ink truncate max-w-[300px]">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-2">{post.category?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        post.is_published
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-zinc-50 text-zinc-600 border-zinc-200"
                      }`}>
                        {post.is_published ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-2 text-xs">
                      {post.published_at ? formatDate(post.published_at) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openForm(post)} className="p-1.5 rounded-lg hover:bg-slate-100 text-ink-2 hover:text-ink cursor-pointer" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => remove(post.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-ink-2 hover:text-red-600 cursor-pointer" title="Delete">
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
