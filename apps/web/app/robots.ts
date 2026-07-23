import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/login", "/register", "/profile", "/billing"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "anthropic-ai", "ClaudeBot"],
        allow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
    ],
    sitemap: "https://itspdfthings.com/sitemap.xml",
  };
}
