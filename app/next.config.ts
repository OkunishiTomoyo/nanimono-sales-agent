import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/nanimono-sales-agent/app",
  images: { unoptimized: true },
};

export default nextConfig;
