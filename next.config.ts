import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
