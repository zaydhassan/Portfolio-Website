import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve optimized modern image formats. The project screenshots are
  // ~1.3MB PNGs in /public; next/image will serve AVIF/WebP at the requested
  // width instead, cutting transfer size dramatically on supported clients.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // lucide-react ships thousands of icons; without this the whole icon set
  // can end up in the module graph. Tree-shake to only the icons actually
  // imported, shrinking the client bundle.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;