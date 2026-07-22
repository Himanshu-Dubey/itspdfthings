import type { Metadata } from "next";

export interface SeoFaqItem {
  q: string;
  a: string;
}

export interface SeoPageData {
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  keywords: string[];
  faq: SeoFaqItem[];
}

export interface SeoGlobalData {
  site_name: string;
  site_description: string;
  default_og_image: string;
  twitter_handle: string;
  facebook_app_id: string;
}

export interface SeoData {
  global: SeoGlobalData;
  pages: Record<string, SeoPageData | null>;
}

const SITE_URL = "https://itspdfthings.com";

const FALLBACK_GLOBAL: SeoGlobalData = {
  site_name: "PDFThings",
  site_description: "Merge, split, compress, and convert PDFs online. Fast, free, and private — files deleted after 12 hours.",
  default_og_image: "/og/default.png",
  twitter_handle: "@pdfthings",
  facebook_app_id: "",
};

export async function getSeoData(): Promise<SeoData> {
  try {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://api.itspdfthings.com";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${apiUrl}/api/seo`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return { global: FALLBACK_GLOBAL, pages: {} };
    return res.json();
  } catch {
    return { global: FALLBACK_GLOBAL, pages: {} };
  }
}

function resolveOgImage(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

const TOOL_NAMES: Record<string, { name: string; desc: string }> = {
  "merge-pdf": { name: "Merge PDF", desc: "Combine multiple PDF files into a single document." },
  "split-pdf": { name: "Split PDF", desc: "Extract pages or split a PDF into separate files." },
  "compress-pdf": { name: "Compress PDF", desc: "Reduce PDF file size without losing quality." },
  "organize-pdf": { name: "Organize PDF", desc: "Reorder, rotate, and delete pages from your PDF." },
  "image-to-pdf": { name: "Image to PDF", desc: "Convert JPG and PNG images to PDF documents." },
  "pdf-to-image": { name: "PDF to Image", desc: "Export PDF pages as high-quality JPG or PNG images." },
  "watermark-pdf": { name: "Watermark PDF", desc: "Add custom text watermarks to PDF files." },
  "page-numbers": { name: "Add Page Numbers", desc: "Add customizable page numbers to PDF documents." },
  "protect-pdf": { name: "Protect PDF", desc: "Add or remove password protection from PDF files." },
};

export function buildToolJsonLd(slug: string): Record<string, unknown> {
  const tool = TOOL_NAMES[slug] ?? { name: slug, desc: "" };
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: `${SITE_URL}/${slug}`,
    description: tool.desc,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function buildPageMetadata(
  pageSlug: string,
  seo: SeoData,
  overrides?: { title?: string; description?: string }
): Metadata {
  const page = seo.pages[pageSlug];
  const global = seo.global;

  const title = overrides?.title || page?.title || `${pageSlug} | PDFThings`;
  const description = overrides?.description || page?.description || global.site_description;
  const ogImage = resolveOgImage(page?.og_image || global.default_og_image);

  return {
    title,
    description,
    keywords: page?.keywords,
    alternates: {
      canonical: `${SITE_URL}/${pageSlug === "homepage" ? "" : pageSlug}`,
    },
    openGraph: {
      title: page?.og_title || title,
      description: page?.og_description || description,
      url: `${SITE_URL}/${pageSlug === "homepage" ? "" : pageSlug}`,
      siteName: global.site_name,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page?.twitter_title || title,
      description: page?.twitter_description || description,
      images: [ogImage],
    },
  };
}
