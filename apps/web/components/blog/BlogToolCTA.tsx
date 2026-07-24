import Link from "next/link";
import {
  Combine, Scissors, FileDown, FileUp, Image as ImageIcon,
  Droplets, Hash, Lock, FileText, ArrowRight,
} from "lucide-react";

const TOOLS = [
  { slug: "merge-pdf", label: "Merge PDF", desc: "Combine multiple PDFs into one file", icon: Combine, color: "from-blue-500 to-blue-600" },
  { slug: "split-pdf", label: "Split PDF", desc: "Extract pages from a PDF", icon: Scissors, color: "from-purple-500 to-purple-600" },
  { slug: "compress-pdf", label: "Compress PDF", desc: "Reduce file size without losing quality", icon: FileDown, color: "from-green-500 to-green-600" },
  { slug: "organize-pdf", label: "Organize PDF", desc: "Rotate, reorder, or delete pages", icon: FileText, color: "from-orange-500 to-orange-600" },
  { slug: "image-to-pdf", label: "Image to PDF", desc: "Convert JPG/PNG images to PDF", icon: ImageIcon, color: "from-pink-500 to-pink-600" },
  { slug: "pdf-to-image", label: "PDF to Image", desc: "Export PDF pages as images", icon: FileUp, color: "from-cyan-500 to-cyan-600" },
  { slug: "watermark-pdf", label: "Watermark PDF", desc: "Add text or image watermarks", icon: Droplets, color: "from-teal-500 to-teal-600" },
  { slug: "page-numbers", label: "Page Numbers", desc: "Add page numbers to PDF", icon: Hash, color: "from-indigo-500 to-indigo-600" },
  { slug: "protect-pdf", label: "Protect PDF", desc: "Password-protect your documents", icon: Lock, color: "from-red-500 to-red-600" },
];

interface BlogToolCTAProps {
  currentTool?: string;
}

export function BlogToolCTA({ currentTool }: BlogToolCTAProps) {
  const relevant = TOOLS.filter((t) => t.slug !== currentTool).slice(0, 3);

  return (
    <section className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-border-soft">
      <h3 className="text-lg font-bold text-ink mb-1">Try our PDF tools</h3>
      <p className="text-sm text-ink-2 mb-5">Free, fast, and private — no signup required.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {relevant.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="group flex items-start gap-3 p-4 rounded-xl bg-surface border border-border-soft hover:border-border-muted hover:shadow-md transition-all"
          >
            <div className={`shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-sm`}>
              <tool.icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink group-hover:text-brand transition-colors">{tool.label}</p>
              <p className="text-xs text-ink-2 mt-0.5 line-clamp-1">{tool.desc}</p>
            </div>
            <ArrowRight size={14} className="shrink-0 mt-1 text-ink-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </section>
  );
}
