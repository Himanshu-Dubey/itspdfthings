import Link from "next/link";
import type { Metadata } from "next";
import {
  Combine,
  Scissors,
  Minimize2,
  ListOrdered,
  ImageIcon,
  FileImage,
  Droplet,
  Hash,
  Lock,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { getSeoData, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData();
  return buildPageMetadata("homepage", seo);
}

const TOOLS = [
  {
    key: "merge",
    href: "/merge-pdf", label: "Merge PDF", desc: "Combine multiple PDFs into one file.", icon: Combine,
    iconBg: "bg-red-50", iconText: "text-red-600", accent: "from-red-500 to-orange-400", hoverBorder: "hover:border-red-300/70", hoverGlow: "group-hover:shadow-red-200/60",
  },
  {
    key: "split",
    href: "/split-pdf", label: "Split PDF", desc: "Extract pages or split into separate files.", icon: Scissors,
    iconBg: "bg-orange-50", iconText: "text-orange-600", accent: "from-orange-500 to-amber-400", hoverBorder: "hover:border-orange-300/70", hoverGlow: "group-hover:shadow-orange-200/60",
  },
  {
    key: "compress",
    href: "/compress-pdf", label: "Compress PDF", desc: "Reduce file size without losing quality.", icon: Minimize2,
    iconBg: "bg-amber-50", iconText: "text-amber-600", accent: "from-amber-500 to-yellow-400", hoverBorder: "hover:border-amber-300/70", hoverGlow: "group-hover:shadow-amber-200/60",
  },
  {
    key: "organize",
    href: "/organize-pdf", label: "Organize PDF", desc: "Rotate, reorder, or delete pages.", icon: ListOrdered,
    iconBg: "bg-violet-50", iconText: "text-violet-600", accent: "from-violet-500 to-purple-400", hoverBorder: "hover:border-violet-300/70", hoverGlow: "group-hover:shadow-violet-200/60",
  },
  {
    key: "image-to-pdf",
    href: "/image-to-pdf", label: "Image → PDF", desc: "Convert JPG/PNG images to PDF.", icon: ImageIcon,
    iconBg: "bg-blue-50", iconText: "text-blue-600", accent: "from-blue-500 to-sky-400", hoverBorder: "hover:border-blue-300/70", hoverGlow: "group-hover:shadow-blue-200/60",
  },
  {
    key: "pdf-to-image",
    href: "/pdf-to-image", label: "PDF → Image", desc: "Export PDF pages as images.", icon: FileImage,
    iconBg: "bg-cyan-50", iconText: "text-cyan-600", accent: "from-cyan-500 to-teal-400", hoverBorder: "hover:border-cyan-300/70", hoverGlow: "group-hover:shadow-cyan-200/60",
  },
  {
    key: "watermark",
    href: "/watermark-pdf", label: "Watermark PDF", desc: "Add text or image watermarks.", icon: Droplet,
    iconBg: "bg-pink-50", iconText: "text-pink-600", accent: "from-pink-500 to-rose-400", hoverBorder: "hover:border-pink-300/70", hoverGlow: "group-hover:shadow-pink-200/60",
  },
  {
    key: "page-numbers",
    href: "/page-numbers", label: "Page Numbers", desc: "Stamp sequential page numbers.", icon: Hash,
    iconBg: "bg-emerald-50", iconText: "text-emerald-600", accent: "from-emerald-500 to-green-400", hoverBorder: "hover:border-emerald-300/70", hoverGlow: "group-hover:shadow-emerald-200/60",
  },
  {
    key: "protect",
    href: "/protect-pdf", label: "Protect / Unlock PDF", desc: "Password-protect or unlock your PDF.", icon: Lock,
    iconBg: "bg-indigo-50", iconText: "text-indigo-600", accent: "from-indigo-500 to-blue-400", hoverBorder: "hover:border-indigo-300/70", hoverGlow: "group-hover:shadow-indigo-200/60",
  },
];

const TRUST_BADGES = [
  { icon: Zap, label: "No signup required" },
  { icon: ShieldCheck, label: "256-bit encryption" },
  { icon: Clock, label: "Files auto-deleted in 12h" },
];

const WHY_TRUST = [
  {
    icon: Zap, title: "Fast by default", desc: "Most jobs finish in under a second.",
    iconBg: "bg-amber-50", iconText: "text-amber-600", accent: "from-amber-500 to-yellow-400", hoverBorder: "hover:border-amber-300/70", hoverGlow: "group-hover:shadow-amber-200/60",
  },
  {
    icon: ShieldCheck, title: "Private by design", desc: "Files are encrypted in transit and never shared.",
    iconBg: "bg-emerald-50", iconText: "text-emerald-600", accent: "from-emerald-500 to-teal-400", hoverBorder: "hover:border-emerald-300/70", hoverGlow: "group-hover:shadow-emerald-200/60",
  },
  {
    icon: Clock, title: "Nothing lingers", desc: "Every file — input and output — is deleted after 12 hours.",
    iconBg: "bg-indigo-50", iconText: "text-indigo-600", accent: "from-indigo-500 to-violet-400", hoverBorder: "hover:border-indigo-300/70", hoverGlow: "group-hover:shadow-indigo-200/60",
  },
] as const;

const FLOAT_CHIPS = [
  { icon: Combine, label: "Merge", delay: "0s" },
  { icon: Minimize2, label: "Compress", delay: "0.6s" },
  { icon: Lock, label: "Protect", delay: "1.2s" },
  { icon: Droplet, label: "Watermark", delay: "1.8s" },
] as const;

async function getEnabledTools(): Promise<Record<string, boolean>> {
  try {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://api.itspdfthings.com";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${apiUrl}/api/tools/status`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return {};
    const data = await res.json();
    return (data.tools_enabled as Record<string, boolean>) ?? {};
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const [toolsEnabled, seo] = await Promise.all([getEnabledTools(), getSeoData()]);
  const homepageData = seo.pages["homepage"];

  // If the settings object is empty (never saved yet), treat all as enabled.
  const hasSettings = Object.keys(toolsEnabled).length > 0;
  const visibleTools = hasSettings
    ? TOOLS.filter((t) => toolsEnabled[t.key] !== false)
    : TOOLS;

  return (
    <div>
      {/* ── Cinematic dark hero ─────────────────────────────────────────── */}
      <section className="hero-dark relative overflow-hidden">
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="blob blob-a absolute -top-24 left-[8%] h-80 w-80 bg-brand/40" aria-hidden="true" />
        <div className="blob blob-b absolute top-10 right-[5%] h-96 w-96 bg-fuchsia-600/20" aria-hidden="true" />
        <div className="blob blob-a absolute bottom-0 left-1/3 h-72 w-72 bg-indigo-600/20" aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-28 text-center">
          <span className="fade-up inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-sm mb-7">
            <Sparkles size={12} className="text-brand" />
            {visibleTools.length} free tool{visibleTools.length !== 1 ? "s" : ""}, zero install
          </span>

          <h1
            className="fade-up text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance"
            style={{ animationDelay: "0.08s" }}
          >
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Every PDF tool
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-red-500 to-orange-400 bg-clip-text text-transparent">
              you&apos;ll ever need
            </span>
          </h1>
          <p
            className="fade-up text-lg text-zinc-400 max-w-xl mx-auto text-balance"
            style={{ animationDelay: "0.16s" }}
          >
            Merge, split, compress, and convert PDFs in seconds — right in your browser.
            No install, no watermarks, no catch.
          </p>

          <div
            className="fade-up mt-9 flex items-center justify-center gap-3 flex-wrap"
            style={{ animationDelay: "0.24s" }}
          >
            <Link
              href="/merge-pdf"
              className="glow-cta inline-flex items-center gap-2 bg-brand text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-brand-dark transition-colors"
            >
              Start with Merge PDF
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              View pricing
            </Link>
          </div>

          <div
            className="fade-up mt-8 flex items-center justify-center gap-6 flex-wrap text-sm text-zinc-500"
            style={{ animationDelay: "0.32s" }}
          >
            {TRUST_BADGES.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5">
                <b.icon size={14} className="text-brand" />
                {b.label}
              </span>
            ))}
          </div>

          <div
            className="fade-up mt-16 flex items-center justify-center gap-4 flex-wrap"
            style={{ animationDelay: "0.4s" }}
          >
            {FLOAT_CHIPS.map((chip) => (
              <div
                key={chip.label}
                className="drift inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                style={{ animationDelay: chip.delay }}
              >
                <chip.icon size={16} className="text-red-400" />
                <span className="text-sm font-medium text-zinc-200">{chip.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-page" aria-hidden="true" />
      </section>

      {/* Tool grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20 pt-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Pick a tool, get to work</h2>
          <p className="text-ink-2 mt-2">
            {visibleTools.length} tool{visibleTools.length !== 1 ? "s" : ""}. One click to start. No account needed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={[
                "group relative block rounded-2xl border border-border-soft bg-white p-6 overflow-hidden",
                "shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl",
                tool.hoverBorder,
                tool.hoverGlow,
              ].join(" ")}
            >
              <span
                className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${tool.accent} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300`}
                aria-hidden="true"
              />

              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl ${tool.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon size={22} className={tool.iconText} />
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-ink-2 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                />
              </div>
              <h3 className="font-semibold text-ink mb-1">{tool.label}</h3>
              <p className="text-sm text-ink-2">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border-soft bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Built to be trusted</h2>
            <p className="text-ink-2 mt-2">No accounts, no tracking, nothing kept longer than it has to be.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {WHY_TRUST.map((item) => (
              <div
                key={item.title}
                className={[
                  "group relative rounded-2xl border border-border-soft bg-white p-7 text-center overflow-hidden",
                  "shadow-[0_1px_2px_rgba(24,24,27,0.04)] transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-xl",
                  item.hoverBorder,
                  item.hoverGlow,
                ].join(" ")}
              >
                <span
                  className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${item.accent} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300`}
                  aria-hidden="true"
                />
                <div className={`h-14 w-14 rounded-2xl ${item.iconBg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={24} className={item.iconText} />
                </div>
                <h3 className="font-semibold text-ink mb-1.5">{item.title}</h3>
                <p className="text-sm text-ink-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <FaqSection faqs={homepageData?.faq ?? []} pageSlug="homepage" />
      </div>

      {/* Structured data */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "PDFThings",
        url: "https://itspdfthings.com",
        description: "Merge, split, compress, and convert PDFs online. Fast, free, and private.",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://itspdfthings.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "PDFThings",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        url: "https://itspdfthings.com",
        description: "Free online PDF tools — merge, split, compress, convert, watermark, and protect PDFs.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "PDFThings",
        url: "https://itspdfthings.com",
        logo: "https://itspdfthings.com/file.svg",
        description: "PDFThings provides free online PDF tools including merge, split, compress, convert, watermark, and protect PDFs. No signup required, 256-bit encryption, files auto-deleted after 12 hours.",
        sameAs: [
          "https://itspdfthings.com/about",
          "https://itspdfthings.com/llms.txt",
        ],
      }} />
    </div>
  );
}
