import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return ["/original", "/night", "/gallery", "/neon"].map((source) => ({ source, destination: "/", permanent: false }));
  },
};

export default nextConfig;
