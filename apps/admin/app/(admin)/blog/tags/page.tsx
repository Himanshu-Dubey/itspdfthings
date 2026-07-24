"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import type { Tag } from "@/types/api";
import { Tags, Plus, Pencil, Trash2, Save, X } from "lucide-react";

export default function BlogTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  const fetchTags = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getTags();
      setTags(data.tags);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm({ name: "", slug: "" });
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setCreating(false);
    setForm({ name: tag.name, slug: tag.slug });
  };

  const save = async () => {
    try {
      if (editingId) {
        await adminApi.updateTag(editingId, form);
      } else {
        await adminApi.createTag(form);
      }
      setCreating(false);
      setEditingId(null);
      setForm({ name: "", slug: "" });
      fetchTags();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this tag?")) return;
    try {
      await adminApi.deleteTag(id);
      fetchTags();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setForm({ name: "", slug: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Tags" description={`${tags.length} tags`} />
        <button onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors cursor-pointer">
          <Plus size={15} /> New Tag
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {(creating || editingId) && (
        <Card>
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">{editingId ? "Edit Tag" : "New Tag"}</h3>
              <button onClick={cancel} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"><X size={14} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40 font-mono" />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={save}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors cursor-pointer">
                <Save size={14} /> {editingId ? "Update" : "Create"}
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-12 text-ink-2 text-sm">Loading…</div>
      ) : tags.length === 0 ? (
        <div className="text-center py-12 text-ink-2 text-sm">No tags yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Card key={tag.id}>
              <CardBody className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <Tags size={14} className="text-ink-2 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-ink block truncate">{tag.name}</span>
                    <span className="text-xs text-ink-2 font-mono">{tag.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-ink-2 mr-2">{tag.posts_count} posts</span>
                  <button onClick={() => startEdit(tag)} className="p-1.5 rounded-lg hover:bg-slate-100 text-ink-2 hover:text-ink cursor-pointer" title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => remove(tag.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-ink-2 hover:text-red-600 cursor-pointer" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
