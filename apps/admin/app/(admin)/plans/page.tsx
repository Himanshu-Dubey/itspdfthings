"use client";

import { useEffect, useState, useTransition } from "react";
import { adminApi } from "@/lib/api";
import type { Plan, PlanInterval, PlanPayload } from "@/types/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Check, Pencil, Plus, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";

const INTERVAL_LABELS: Record<PlanInterval, string> = {
  month: "Monthly",
  year:  "Yearly",
};

const emptyForm = (): PlanPayload & { featuresRaw: string } => ({
  name:              "",
  description:       "",
  price:             9.99,
  price_inr:         799,
  interval:          "month",
  stripe_price_id:   "",
  razorpay_price_id: "",
  features:          [],
  is_active:         true,
  sort_order:        0,
  featuresRaw:       "",
});

export default function PlansPage() {
  const [plans, setPlans]         = useState<Plan[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Plan | null>(null);
  const [form, setForm]           = useState(emptyForm());
  const [isPending, start]        = useTransition();
  const [deleteId, setDeleteId]   = useState<number | null>(null);
  const [saved, setSaved]         = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.getPlans()
      .then(({ plans: p }) => setPlans(p))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setForm({
      name:              plan.name,
      description:       plan.description ?? "",
      price:             parseFloat(plan.price),
      price_inr:         plan.price_inr ? parseFloat(plan.price_inr) : 0,
      interval:          plan.interval,
      stripe_price_id:   plan.stripe_price_id ?? "",
      razorpay_price_id: plan.razorpay_price_id ?? "",
      features:          plan.features ?? [],
      is_active:         plan.is_active,
      sort_order:        plan.sort_order,
      featuresRaw:       (plan.features ?? []).join("\n"),
    });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = () => {
    const payload: PlanPayload = {
      name:              form.name,
      description:       form.description || null,
      price:             form.price,
      price_inr:         form.price_inr || null,
      interval:          form.interval,
      stripe_price_id:   form.stripe_price_id || null,
      razorpay_price_id: form.razorpay_price_id || null,
      features:          form.featuresRaw.split("\n").map((s) => s.trim()).filter(Boolean),
      is_active:         form.is_active,
      sort_order:        form.sort_order,
    };

    start(async () => {
      try {
        if (editing) {
          const { plan } = await adminApi.updatePlan(editing.id, payload);
          setPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));
        } else {
          const { plan } = await adminApi.createPlan(payload);
          setPlans((prev) => [...prev, plan]);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        closeModal();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed.");
      }
    });
  };

  const handleDelete = (id: number) => {
    start(async () => {
      try {
        await adminApi.deletePlan(id);
        setPlans((prev) => prev.filter((p) => p.id !== id));
        setDeleteId(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Delete failed.");
        setDeleteId(null);
      }
    });
  };

  const toggleActive = (plan: Plan) => {
    start(async () => {
      try {
        const { plan: updated } = await adminApi.updatePlan(plan.id, { is_active: !plan.is_active });
        setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Update failed.");
      }
    });
  };

  return (
    <>
      <PageHeader
        title="Plans"
        description="Create and manage subscription plans. Users can purchase any active plan."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-red-500 to-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-brand hover:brightness-105 transition-all cursor-pointer"
          >
            <Plus size={15} /> New plan
          </button>
        }
      />

      <main className="flex-1 px-6 pb-6">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-center justify-between">
            {error}
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 cursor-pointer"><X size={14} /></button>
          </div>
        )}

        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex items-center gap-2">
            <Check size={14} /> Plan saved successfully.
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft bg-white p-12 text-center">
            <p className="text-ink-2 text-sm mb-4">No plans yet. Create your first plan to let users upgrade.</p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-red-500 to-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-brand cursor-pointer"
            >
              <Plus size={15} /> Create first plan
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={openEdit}
                onDelete={(id) => setDeleteId(id)}
                onToggle={toggleActive}
                isPending={isPending}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
              <h2 className="font-bold text-ink">{editing ? "Edit plan" : "New plan"}</h2>
              <button onClick={closeModal} className="text-ink-2 hover:text-ink cursor-pointer transition-colors"><X size={18} /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Name */}
              <Field label="Plan name" required>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Pro Monthly"
                  className="input"
                />
              </Field>

              {/* Description */}
              <Field label="Description">
                <input
                  value={form.description ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown to users"
                  className="input"
                />
              </Field>

              {/* Price + Interval */}
              <div className="grid grid-cols-3 gap-3">
                <Field label="Price (USD)" required>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center justify-center w-8 text-ink-2 text-sm font-medium pointer-events-none">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: parseFloat(e.target.value) || 0 }))}
                      className="input !pl-10"
                    />
                  </div>
                </Field>
                <Field label="Price (INR)" hint="For Indian users">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center justify-center w-8 text-ink-2 text-sm font-medium pointer-events-none">₹</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.price_inr ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, price_inr: parseFloat(e.target.value) || 0 }))}
                      className="input !pl-10"
                      placeholder="e.g. 799"
                    />
                  </div>
                </Field>
                <Field label="Interval" required>
                  <select
                    value={form.interval}
                    onChange={(e) => setForm((f) => ({ ...f, interval: e.target.value as PlanInterval }))}
                    className="input"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </Field>
              </div>

              {/* Price IDs */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stripe Price ID" hint="For non-Indian users">
                  <input
                    value={form.stripe_price_id ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, stripe_price_id: e.target.value }))}
                    placeholder="price_xxxxxxxxxxxxxxxxxx"
                    className="input font-mono text-sm"
                  />
                </Field>
                <Field label="Razorpay Price ID" hint="For Indian users">
                  <input
                    value={form.razorpay_price_id ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, razorpay_price_id: e.target.value }))}
                    placeholder="plan_xxxxxxxxxxxxxxxxxx"
                    className="input font-mono text-sm"
                  />
                </Field>
              </div>

              {/* Features */}
              <Field label="Features" hint="One feature per line">
                <textarea
                  rows={5}
                  value={form.featuresRaw}
                  onChange={(e) => setForm((f) => ({ ...f, featuresRaw: e.target.value }))}
                  placeholder={"Unlimited tasks, every tool\nFiles up to 500 MB\nPriority processing"}
                  className="input resize-none text-sm"
                />
              </Field>

              {/* Sort order + Active */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sort order">
                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                    className="input"
                  />
                </Field>
                <Field label="Active">
                  <label className="flex items-center gap-2 h-10 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        form.is_active ? "bg-brand" : "bg-slate-200"
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        form.is_active ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                    <span className="text-sm text-ink-2">{form.is_active ? "Visible to users" : "Hidden"}</span>
                  </label>
                </Field>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border-soft flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-ink-2 hover:text-ink hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || !form.name.trim()}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-red-500 to-brand-dark text-white shadow-brand hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isPending ? "Saving…" : editing ? "Save changes" : "Create plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="font-bold text-ink mb-2">Delete plan?</h2>
            <p className="text-sm text-ink-2 mb-6">This will remove the plan from the listing. Existing Stripe subscriptions are not affected.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-ink-2 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isPending}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PlanCard({
  plan,
  onEdit,
  onDelete,
  onToggle,
  isPending,
}: {
  plan: Plan;
  onEdit: (p: Plan) => void;
  onDelete: (id: number) => void;
  onToggle: (p: Plan) => void;
  isPending: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-white shadow-soft p-5 flex flex-col gap-3 transition-opacity ${
      plan.is_active ? "border-border-soft" : "border-dashed border-slate-200 opacity-60"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-ink truncate">{plan.name}</h3>
          {plan.description && (
            <p className="text-xs text-ink-2 mt-0.5 line-clamp-2">{plan.description}</p>
          )}
        </div>
        <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          plan.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-ink-2"
        }`}>
          {plan.is_active ? "Active" : "Hidden"}
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-ink">${parseFloat(plan.price).toFixed(2)}</span>
        {plan.price_inr && (
          <span className="text-sm text-ink-2">/ ₹{parseFloat(plan.price_inr).toLocaleString("en-IN")}</span>
        )}
        <span className="text-sm text-ink-2">/ {INTERVAL_LABELS[plan.interval].toLowerCase().replace("ly", "")}</span>
      </div>

      {/* Price IDs */}
      <div className="space-y-1">
        {plan.stripe_price_id ? (
          <p className="text-xs font-mono text-ink-2 bg-slate-50 rounded-lg px-2 py-1 truncate">
            Stripe: {plan.stripe_price_id}
          </p>
        ) : (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
            No Stripe price ID
          </p>
        )}
        {plan.razorpay_price_id ? (
          <p className="text-xs font-mono text-ink-2 bg-slate-50 rounded-lg px-2 py-1 truncate">
            Razorpay: {plan.razorpay_price_id}
          </p>
        ) : (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
            No Razorpay price ID
          </p>
        )}
      </div>

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <ul className="space-y-1">
          {plan.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-xs text-ink-2">
              <Check size={12} className="text-emerald-500 shrink-0" />
              {f}
            </li>
          ))}
          {plan.features.length > 4 && (
            <li className="text-xs text-ink-2 pl-4">+{plan.features.length - 4} more</li>
          )}
        </ul>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border-soft">
        <button
          onClick={() => onToggle(plan)}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink transition-colors cursor-pointer disabled:opacity-40"
          title={plan.is_active ? "Hide plan" : "Show plan"}
        >
          {plan.is_active ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          {plan.is_active ? "Hide" : "Show"}
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onEdit(plan)}
          className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-brand transition-colors cursor-pointer"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(plan.id)}
          className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-ink mb-1">
        {label}{required && <span className="text-brand ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-ink-2 mb-1">{hint}</p>}
      {children}
    </div>
  );
}
