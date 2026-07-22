import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "itspdfthings.com",
    "app.itspdfthings.com",
    "app.itspdfthings.com:3000",
    "localhost:3000",
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: "/sanctum/:path*",
        destination: `${API_URL}/sanctum/:path*`,
      },
    ];
  },
};

export default nextConfig;
