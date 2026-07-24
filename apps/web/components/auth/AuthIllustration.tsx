import Link from "next/link";
import { FileText, Image as ImageIcon, Lock, Combine, ChevronDown } from "lucide-react";

/** Decorative "floating file cards" illustration — abstract, not tied to a specific tool. */
export function AuthIllustration() {
  return (
    <div className="hidden lg:flex flex-1 bg-[#eef0f5] items-center justify-center relative overflow-hidden px-12">
      <div className="relative max-w-sm w-full">
        {/* Floating cards */}
        <div className="relative h-64 mb-10">
          <div className="drift absolute left-4 top-2 h-40 w-28 rounded-xl bg-surface border border-border-soft shadow-soft p-3" style={{ animationDelay: "0s" }}>
            <div className="h-2 w-8 rounded-full bg-red-100 mb-2" />
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-slate-100" />
              <div className="h-1.5 rounded-full bg-slate-100" />
              <div className="h-1.5 w-2/3 rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="drift absolute left-24 top-16 h-44 w-32 rounded-xl bg-surface border border-border-soft shadow-xl p-3.5 z-10" style={{ animationDelay: "0.8s" }}>
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-light mb-2.5">
              <FileText size={18} className="text-brand" />
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-slate-100" />
              <div className="h-1.5 rounded-full bg-slate-100" />
              <div className="h-1.5 w-1/2 rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="drift absolute right-8 top-0 h-24 w-24 rounded-xl bg-surface border border-border-soft shadow-soft flex items-center justify-center" style={{ animationDelay: "1.4s" }}>
            <ImageIcon size={22} className="text-blue-500" />
          </div>

          <div className="drift absolute right-0 bottom-4 h-16 w-16 rounded-xl bg-emerald-50 border border-emerald-100 shadow-soft flex items-center justify-center" style={{ animationDelay: "0.4s" }}>
            <Combine size={18} className="text-emerald-600" />
          </div>

          <div className="drift absolute left-8 bottom-0 h-14 w-14 rounded-xl bg-indigo-50 border border-indigo-100 shadow-soft flex items-center justify-center" style={{ animationDelay: "1.1s" }}>
            <Lock size={16} className="text-indigo-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-ink mb-3 text-balance">PDF tools for productive people</h2>
        <p className="text-ink-2 text-balance mb-5">
          PDFThings helps you merge, compress, convert, and protect PDF files quickly and easily —
          right in your browser, no install required.
        </p>
        <Link href="/" className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-brand transition-colors">
          See all tools
          <ChevronDown size={15} />
        </Link>
      </div>
    </div>
  );
}
