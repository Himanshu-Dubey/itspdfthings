import type { MetadataRoute } from "next";

const BASE_URL = "https://app.itspdfthings.com";

const TOOL_PAGES = [
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "organize-pdf",
  "image-to-pdf",
  "pdf-to-image",
  "watermark-pdf",
  "page-numbers",
  "protect-pdf",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...TOOL_PAGES.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
