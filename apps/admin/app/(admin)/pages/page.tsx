"use client";

import { useState, useEffect, useTransition } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import type { PageEntry } from "@/types/api";
import { RichEditor } from "@/components/RichEditor";

const emptyPage: Partial<PageEntry> = {
  title: "",
  slug: "",
  content: "",
  meta_title: "",
  meta_description: "",
  is_published: false,
  show_in_header: false,
  show_in_footer: false,
  menu_order: 0,
};

export default function PagesPage() {
  const [pages, setPages] = useState<PageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<PageEntry | null>(null);
  const [form, setForm] = useState<Partial<PageEntry>>(emptyPage);
  const [isPending, startTransition] = useTransition();
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    adminApi
      .getPages()
      .then((d) => setPages(d.pages))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () =>
    adminApi.getPages().then((d) => setPages(d.pages));

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyPage });
    setSaveMsg("");
  };

  const openEdit = (p: PageEntry) => {
    setEditing(p);
    setForm({ ...p });
    setSaveMsg("");
  };

  const save = () => {
    setSaveMsg("");
    startTransition(async () => {
      try {
        if (editing) {
          await adminApi.updatePage(editing.id, form);
          setSaveMsg("Page updated.");
        } else {
          const { page } = await adminApi.createPage(form);
          setPages((prev) => [...prev, page]);
          setEditing(page);
          setSaveMsg("Page created.");
        }
        await refresh();
      } catch (e: any) {
        setSaveMsg("");
        setError(e.message);
      }
    });
  };

  const remove = (id: number) => {
    if (!confirm("Delete this page?")) return;
    startTransition(async () => {
      try {
        await adminApi.deletePage(id);
        setPages((prev) => prev.filter((p) => p.id !== id));
        if (editing?.id === id) {
          setEditing(null);
          setForm({ ...emptyPage });
        }
      } catch (e: any) {
        setError(e.message);
      }
    });
  };

  const set = (key: string, val: any) => setForm((prev) => ({ ...prev, [key]: val }));

  const autoSlug = (title: string) => {
    set("title", title);
    if (!editing) set("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ink-2 text-sm">Loading pages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages"
        description="Manage static pages for your site — Privacy Policy, Terms of Service, About Us, and more."
        actions={
          <button
            onClick={openNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-br from-red-500 to-brand-dark text-white text-xs font-bold shadow-brand hover:shadow-lg transition-all cursor-pointer"
          >
            + New Page
          </button>
        }
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page list */}
        <div className="lg:col-span-1 space-y-2">
          {pages.length === 0 && (
            <p className="text-ink-2 text-sm">No pages yet. Create one to get started.</p>
          )}
          {pages.map((p) => (
            <button
              key={p.id}
              onClick={() => openEdit(p)}
              className={[
                "w-full text-left px-4 py-3 rounded-xl border transition-all",
                editing?.id === p.id
                  ? "border-brand bg-red-50 shadow-brand"
                  : "border-border-soft bg-surface hover:border-border-muted",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink truncate">{p.title}</span>
                <div className="flex gap-1.5 shrink-0 ml-2">
                  {p.is_published && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      LIVE
                    </span>
                  )}
                  {p.show_in_header && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      HEADER
                    </span>
                  )}
                  {p.show_in_footer && (
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      FOOTER
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-ink-2">/{p.slug}</span>
            </button>
          ))}
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-ink">
                  {editing ? `Editing: ${editing.title}` : "New Page"}
                </h3>
                {editing && (
                  <button
                    onClick={save}
                    disabled={isPending || !form.title}
                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-red-500 to-brand-dark text-white text-xs font-bold shadow-brand hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>

              {/* Title + Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">Title</label>
                  <input
                    value={form.title ?? ""}
                    onChange={(e) => autoSlug(e.target.value)}
                    className="w-full rounded-xl border border-border-soft bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                    placeholder="About Us"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">Slug</label>
                  <div className="flex items-center gap-0">
                    <span className="text-xs text-ink-2 bg-slate-50 border border-r-0 border-border-soft rounded-l-xl px-2.5 py-2">/</span>
                    <input
                      value={form.slug ?? ""}
                      onChange={(e) => set("slug", e.target.value)}
                      className="w-full rounded-r-xl border border-border-soft bg-white px-3 py-2 text-sm text-ink font-mono focus:outline-none focus:ring-2 focus:ring-brand/40"
                      placeholder="about"
                    />
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Meta Title</label>
                <input
                  value={form.meta_title ?? ""}
                  onChange={(e) => set("meta_title", e.target.value)}
                  className="w-full rounded-xl border border-border-soft bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                  placeholder="SEO page title"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Meta Description</label>
                <textarea
                  value={form.meta_description ?? ""}
                  onChange={(e) => set("meta_description", e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-border-soft bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                  placeholder="SEO description (max 160 chars)"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Content</label>
                <RichEditor
                  value={form.content ?? ""}
                  onChange={(html) => set("content", html)}
                  placeholder="Start writing page content…"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6">
                <Toggle label="Published" checked={form.is_published ?? false} onChange={(v) => set("is_published", v)} />
                <Toggle label="Show in Header" checked={form.show_in_header ?? false} onChange={(v) => set("show_in_header", v)} />
                <Toggle label="Show in Footer" checked={form.show_in_footer ?? false} onChange={(v) => set("show_in_footer", v)} />
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">Menu Order</label>
                  <input
                    type="number"
                    value={form.menu_order ?? 0}
                    onChange={(e) => set("menu_order", parseInt(e.target.value) || 0)}
                    className="w-20 rounded-xl border border-border-soft bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={save}
                  disabled={isPending || !form.title}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-red-500 to-brand-dark text-white text-sm font-bold shadow-brand hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Saving..." : editing ? "Update Page" : "Create Page"}
                </button>
                {saveMsg && <span className="text-sm text-emerald-600 font-medium">{saveMsg}</span>}
                {editing && (
                  <button
                    onClick={() => remove(editing.id)}
                    disabled={isPending}
                    className="ml-auto px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={[
          "relative w-9 h-5 rounded-full transition-colors",
          checked ? "bg-brand" : "bg-slate-200",
        ].join(" ")}
      >
        <div
          className={[
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4" : "",
          ].join(" ")}
        />
      </div>
      <span className="text-xs font-semibold text-ink-2">{label}</span>
    </label>
  );
}
