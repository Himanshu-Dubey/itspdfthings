import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the admin subdomain to access /_next/ dev assets (fonts, HMR).
  // Next.js 15.1+ blocks cross-origin /_next/ requests by default.
  allowedDevOrigins: [
    "admin.itspdfthings.com",
    "admin.itspdfthings.com:3001",
    "localhost:3001",
  ],
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.itspdfthings.com";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: "/sanctum/:path*",
        destination: `${apiUrl}/sanctum/:path*`,
      },
    ];
  },
};

export default nextConfig;
