import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getVariant } from "@/lib/programmatic/catalog";
import { PdfToolWidget } from "@/components/tools/PdfToolWidget";
import { JsonLd } from "@/components/tools/JsonLd";
import { FaqSection } from "@/components/tools/FaqSection";
import type { SeoFaqItem } from "@/lib/seo";

const SITE_URL = "https://itspdfthings.com";

function buildFaqItems(faqs: { q: string; a: string }[]): SeoFaqItem[] {
  return faqs.map((f) => ({ q: f.q, a: f.a }));
}

export async function generateVariantMetadata(
  toolSlug: string,
  variantSlug: string,
): Promise<Metadata> {
  const found = getVariant(toolSlug, variantSlug);
  if (!found) return {};

  const { tool, variant } = found;
  const url = `${SITE_URL}${tool.canonicalPath}/${variant.slug}`;

  return {
    title: variant.metaTitle,
    description: variant.metaDescription,
    keywords: variant.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: variant.metaTitle,
      description: variant.metaDescription,
      url,
      siteName: "PDFThings",
      type: "website",
      images: [{ url: `${SITE_URL}/og/default.png`, width: 1200, height: 630, alt: variant.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: variant.metaTitle,
      description: variant.metaDescription,
      images: [`${SITE_URL}/og/default.png`],
    },
  };
}

export function VariantPage({
  toolSlug,
  variantSlug,
}: {
  toolSlug: string;
  variantSlug: string;
}) {
  const found = getVariant(toolSlug, variantSlug);
  if (!found) notFound();

  const { tool, variant } = found;
  const pageUrl = `${SITE_URL}${tool.canonicalPath}/${variant.slug}`;

  const relatedVariants = variant.related
    .map((slug) => tool.variants.find((v) => v.slug === slug))
    .filter((v): v is (typeof tool.variants)[number] => Boolean(v));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: tool.label, item: `${SITE_URL}${tool.canonicalPath}` },
      { "@type": "ListItem", position: 3, name: variant.h1, item: pageUrl },
    ],
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="max-w-3xl mx-auto px-4 pt-6 text-sm text-ink-2" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
          </li>
          <li aria-hidden="true"><ChevronRight size={14} className="text-ink-2/50" /></li>
          <li>
            <Link href={tool.canonicalPath} className="hover:text-brand transition-colors">
              {tool.label}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight size={14} className="text-ink-2/50" /></li>
          <li className="text-ink truncate max-w-[200px]">{variant.h1}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="relative max-w-3xl mx-auto px-4 pt-8 pb-6 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-5 shadow-soft">
          <variant.icon size={28} className="text-red-600" strokeWidth={1.75} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3 tracking-tight text-balance">
          {variant.h1}
        </h1>
        <p className="text-ink-2 text-lg max-w-xl mx-auto text-balance">{variant.heroDescription}</p>
      </header>

      {/* Tool widget */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <PdfToolWidget config={tool.toolConfig} />

        {/* Intro copy */}
        <section className="mt-12 space-y-4 text-ink-2 leading-relaxed">
          {variant.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        {/* Benefits */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink mb-5">Why use this merger</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {variant.benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border-soft bg-surface p-5">
                <h3 className="font-semibold text-ink mb-1.5">{b.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How-to steps */}
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink mb-5">How to {variant.h1.replace(/^Merge/, "merge").toLowerCase()}</h2>
          <ol className="space-y-4">
            {variant.steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 h-8 w-8 rounded-full bg-red-50 text-red-600 font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{s.title}</h3>
                  <p className="text-sm text-ink-2 mt-0.5 leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Related variants (internal linking) */}
        {relatedVariants.length > 0 && (
          <section className="mt-12 rounded-2xl border border-border-soft bg-page p-6">
            <h2 className="text-sm font-semibold text-ink mb-3">Related ways to merge PDFs</h2>
            <div className="flex flex-wrap gap-2">
              {relatedVariants.map((rv) => (
                <Link
                  key={rv.slug}
                  href={`${tool.canonicalPath}/${rv.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-ink-2 hover:border-red-300 hover:text-brand transition-colors"
                >
                  <rv.icon size={14} className="text-red-500" />
                  {rv.h1}
                </Link>
              ))}
              <Link
                href={tool.canonicalPath}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1.5 text-xs font-medium text-ink-2 hover:border-red-300 hover:text-brand transition-colors"
              >
                <ArrowLeft size={14} className="text-red-500" />
                All {tool.label} features
              </Link>
            </div>
          </section>
        )}

        {/* FAQ */}
        <FaqSection faqs={buildFaqItems(variant.faq)} pageSlug={`${tool.slug}/${variant.slug}`} />

        {/* Structured data */}
        <JsonLd data={breadcrumbLd} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: variant.h1,
            url: pageUrl,
            description: variant.metaDescription,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            isAccessibleForFree: true,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
            about: {
              "@type": "SoftwareApplication",
              name: tool.label,
              url: `${SITE_URL}${tool.canonicalPath}`,
            },
          }}
        />
      </div>
    </div>
  );
}
