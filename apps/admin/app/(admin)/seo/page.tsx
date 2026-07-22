"use client";

import { useState, useEffect, useTransition } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { adminApi } from "@/lib/api";
import type { SeoPageData, SeoGlobalData, SeoFaqItem } from "@/types/seo";

const PAGE_LABELS: Record<string, string> = {
  homepage: "Homepage",
  pricing: "Pricing",
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  "merge-pdf": "Merge PDF",
  "split-pdf": "Split PDF",
  "compress-pdf": "Compress PDF",
  "organize-pdf": "Organize PDF",
  "image-to-pdf": "Image to PDF",
  "pdf-to-image": "PDF to Image",
  "watermark-pdf": "Watermark PDF",
  "page-numbers": "Page Numbers",
  "protect-pdf": "Protect PDF",
};

type Tab = "global" | "pages";

export default function SeoPage() {
  const [tab, setTab] = useState<Tab>("pages");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [globalData, setGlobalData] = useState<SeoGlobalData>({
    site_name: "",
    site_description: "",
    default_og_image: "",
    twitter_handle: "",
    facebook_app_id: "",
  });
  const [pages, setPages] = useState<Record<string, SeoPageData | null>>({});
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [editData, setEditData] = useState<SeoPageData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    adminApi
      .getSeo()
      .then((data) => {
        setGlobalData(data.global);
        setPages(data.pages);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const saveGlobal = () => {
    setSaveMsg("");
    startTransition(async () => {
      try {
        await adminApi.updateSeo({
          seo_global: JSON.stringify(globalData),
        });
        setSaveMsg("Global settings saved!");
        setTimeout(() => setSaveMsg(""), 3000);
      } catch (e: any) {
        setError(e.message);
      }
    });
  };

  const savePage = async () => {
    if (!editingPage || !editData) return;
    setSaveMsg("");
    try {
      await adminApi.updateSeo({
        [`seo_${editingPage}`]: JSON.stringify(editData),
      });
      setPages((prev) => ({ ...prev, [editingPage]: editData }));
      setEditingPage(null);
      setEditData(null);
      setSaveMsg("Page SEO saved!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const openEditor = (slug: string) => {
    const existing = pages[slug];
    setEditingPage(slug);
    setEditData(
      existing ?? {
        title: "",
        description: "",
        og_title: "",
        og_description: "",
        og_image: globalData.default_og_image,
        twitter_title: "",
        twitter_description: "",
        keywords: [],
        faq: [],
      }
    );
  };

  const updateFaq = (index: number, field: keyof SeoFaqItem, value: string) => {
    if (!editData) return;
    const faq = [...editData.faq];
    faq[index] = { ...faq[index], [field]: value };
    setEditData({ ...editData, faq });
  };

  const addFaq = () => {
    if (!editData) return;
    setEditData({ ...editData, faq: [...editData.faq, { q: "", a: "" }] });
  };

  const removeFaq = (index: number) => {
    if (!editData) return;
    setEditData({ ...editData, faq: editData.faq.filter((_, i) => i !== index) });
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editData) return;
    try {
      const { url } = await adminApi.uploadOgImage(file);
      setEditData({ ...editData, og_image: url });
    } catch {
      setError("Failed to upload image");
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader title="SEO" description="Manage search engine optimization settings" />
        <main className="flex-1 px-6 pb-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="SEO"
        description="Manage metadata, social sharing, and FAQ content"
        actions={
          saveMsg ? (
            <span className="text-sm text-green-600 font-medium">{saveMsg}</span>
          ) : undefined
        }
      />

      <main className="flex-1 px-6 pb-6 space-y-5">
        {error && (
          <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface border border-border-soft shadow-soft rounded-lg w-fit">
          {(["pages", "global"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setEditingPage(null); setEditData(null); }}
              className={[
                "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
                tab === t
                  ? "bg-gradient-to-br from-red-500 to-brand-dark text-white shadow-brand"
                  : "text-ink-2 hover:text-ink",
              ].join(" ")}
            >
              {t === "global" ? "Global Settings" : "Page SEO"}
            </button>
          ))}
        </div>

        {/* Edit Form */}
        {editingPage && editData && (
          <Card>
            <CardHeader>
              <CardTitle>Edit: {PAGE_LABELS[editingPage] ?? editingPage}</CardTitle>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Basic SEO */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Basic SEO</h3>
                <Field label="Title" value={editData.title} onChange={(v) => setEditData({ ...editData, title: v })} placeholder="Merge PDF — Combine PDFs Online Free" />
                <Field label="Description" value={editData.description} onChange={(v) => setEditData({ ...editData, description: v })} textarea placeholder="Merge multiple PDF files into one document..." />
                <Field label="Keywords (comma-separated)" value={editData.keywords.join(", ")} onChange={(v) => setEditData({ ...editData, keywords: v.split(",").map((s) => s.trim()).filter(Boolean) })} placeholder="merge pdf, combine pdf, pdf merger" />
              </div>

              {/* Open Graph */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Open Graph (Social Sharing)</h3>
                <Field label="OG Title" value={editData.og_title} onChange={(v) => setEditData({ ...editData, og_title: v })} placeholder="Merge PDF Online Free" />
                <Field label="OG Description" value={editData.og_description} onChange={(v) => setEditData({ ...editData, og_description: v })} textarea placeholder="Combine multiple PDF files..." />
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">OG Image</label>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleOgUpload} className="text-sm text-ink-2 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 file:cursor-pointer" />
                    {editData.og_image && (
                      <span className="text-xs text-ink-2 truncate max-w-xs">{editData.og_image}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Twitter Card */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">Twitter Card</h3>
                <Field label="Twitter Title" value={editData.twitter_title} onChange={(v) => setEditData({ ...editData, twitter_title: v })} placeholder="Merge PDF — Free Tool" />
                <Field label="Twitter Description" value={editData.twitter_description} onChange={(v) => setEditData({ ...editData, twitter_description: v })} textarea placeholder="Combine PDFs quickly and easily." />
              </div>

              {/* FAQ */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-ink-2 uppercase tracking-wider">FAQ Content</h3>
                  <button onClick={addFaq} className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer">+ Add Question</button>
                </div>
                {editData.faq.length === 0 && (
                  <p className="text-sm text-ink-2/60">No FAQ items yet. Add questions to show FAQ schema in search results.</p>
                )}
                {editData.faq.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border-soft p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink-2">Q{i + 1}</span>
                      <button onClick={() => removeFaq(i)} className="text-xs text-red-500 hover:text-red-600 cursor-pointer">Remove</button>
                    </div>
                    <Field label="Question" value={item.q} onChange={(v) => updateFaq(i, "q", v)} placeholder="Is it safe to merge PDFs online?" />
                    <Field label="Answer" value={item.a} onChange={(v) => updateFaq(i, "a", v)} textarea placeholder="Yes. Files are encrypted and deleted after 12 hours." />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => { setEditingPage(null); setEditData(null); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-ink-2 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={savePage}
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-red-500 to-brand-dark shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Global Settings Tab */}
        {tab === "global" && !editingPage && (
          <Card>
            <CardHeader>
              <CardTitle>Global SEO Settings</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Field label="Site Name" value={globalData.site_name} onChange={(v) => setGlobalData({ ...globalData, site_name: v })} placeholder="PDFThings" />
              <Field label="Site Description" value={globalData.site_description} onChange={(v) => setGlobalData({ ...globalData, site_description: v })} textarea placeholder="Merge, split, compress, and convert PDFs online." />
              <Field label="Default OG Image Path" value={globalData.default_og_image} onChange={(v) => setGlobalData({ ...globalData, default_og_image: v })} placeholder="/og/default.png" />
              <Field label="Twitter Handle" value={globalData.twitter_handle} onChange={(v) => setGlobalData({ ...globalData, twitter_handle: v })} placeholder="@pdfthings" />
              <Field label="Facebook App ID" value={globalData.facebook_app_id} onChange={(v) => setGlobalData({ ...globalData, facebook_app_id: v })} placeholder="" />
              <div className="pt-2">
                <button
                  onClick={saveGlobal}
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-red-500 to-brand-dark shadow-brand hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? "Saving..." : "Save Global Settings"}
                </button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Pages List Tab */}
        {tab === "pages" && !editingPage && (
          <Card>
            <CardHeader>
              <CardTitle>Page SEO</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-soft">
                      <th className="text-left py-3 px-4 text-xs font-bold text-ink-2 uppercase tracking-wider">Page</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-ink-2 uppercase tracking-wider">Title</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-ink-2 uppercase tracking-wider">Description</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-ink-2 uppercase tracking-wider">FAQs</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-ink-2 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft">
                    {Object.entries(PAGE_LABELS).map(([slug, label]) => {
                      const page = pages[slug];
                      return (
                        <tr key={slug} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-medium text-ink">{label}</td>
                          <td className="py-3 px-4 text-ink-2 truncate max-w-xs">{page?.title || "—"}</td>
                          <td className="py-3 px-4 text-ink-2 truncate max-w-xs">{page?.description || "—"}</td>
                          <td className="py-3 px-4 text-ink-2">{page?.faq?.length ?? 0}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => openEditor(slug)}
                              className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </main>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-2/40 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border-soft bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink-2/40 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
        />
      )}
    </div>
  );
}
