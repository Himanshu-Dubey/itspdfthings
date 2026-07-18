import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "app.itspdfthings.com",
    "app.itspdfthings.com:3000",
    "localhost:3000",
  ],
};

export default nextConfig;
