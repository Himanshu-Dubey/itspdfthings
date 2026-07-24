"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import type { Category } from "@/types/api";
import { FolderOpen, Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react";

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", sort_order: 0 });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCategories();
      setCategories(data.categories);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", sort_order: categories.length });
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setCreating(false);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", sort_order: cat.sort_order });
  };

  const save = async () => {
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, form);
      } else {
        await adminApi.createCategory(form);
      }
      setCreating(false);
      setEditingId(null);
      setForm({ name: "", slug: "", description: "", sort_order: 0 });
      fetchCategories();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try {
      await adminApi.deleteCategory(id);
      fetchCategories();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", sort_order: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Categories" description={`${categories.length} categories`} />
        <button onClick={startCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors cursor-pointer">
          <Plus size={15} /> New Category
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {(creating || editingId) && (
        <Card>
          <CardBody className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">{editingId ? "Edit Category" : "New Category"}</h3>
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
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border-soft bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/40" />
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
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-ink-2 text-sm">No categories yet.</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Slug</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Posts</th>
                  <th className="text-left px-4 py-3 font-semibold text-ink-2">Order</th>
                  <th className="text-right px-4 py-3 font-semibold text-ink-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-border-soft last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen size={14} className="text-ink-2 shrink-0" />
                        <span className="font-medium text-ink">{cat.name}</span>
                      </div>
                      {cat.description && <p className="text-xs text-ink-2 mt-1 ml-6 truncate max-w-[300px]">{cat.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-ink-2 font-mono text-xs">{cat.slug}</td>
                    <td className="px-4 py-3 text-ink-2">{cat.posts_count}</td>
                    <td className="px-4 py-3 text-ink-2">{cat.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg hover:bg-slate-100 text-ink-2 hover:text-ink cursor-pointer" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => remove(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-ink-2 hover:text-red-600 cursor-pointer" title="Delete">
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
    </div>
  );
}
