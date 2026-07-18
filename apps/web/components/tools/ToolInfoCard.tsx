import { Info } from "lucide-react";

export function ToolInfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 rounded-2xl border border-border-soft bg-slate-50/70 p-6">
      <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
        <Info size={15} className="text-ink-2" />
        {title}
      </h2>
      <div className="text-sm text-ink-2 space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-1.5 [&_ul]:space-y-1.5 [&_code]:bg-white [&_code]:border [&_code]:border-border-soft [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-ink [&_strong]:text-ink [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}
