import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/register"],
    },
    sitemap: "https://app.itspdfthings.com/sitemap.xml",
  };
}
