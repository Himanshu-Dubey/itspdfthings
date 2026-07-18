import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the admin subdomain to access /_next/ dev assets (fonts, HMR).
  // Next.js 15.1+ blocks cross-origin /_next/ requests by default.
  allowedDevOrigins: [
    "admin.itspdfthings.com",
    "admin.itspdfthings.com:3001",
    "localhost:3001",
  ],
};

export default nextConfig;
