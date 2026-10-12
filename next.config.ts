import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/producten", destination: "/containers", permanent: true },
      { source: "/producten/:handle", destination: "/containers/:handle", permanent: true },
    ];
  },
  images: {
    // Productafbeeldingen komen straks van het Shopify CDN.
    remotePatterns: [new URL("https://cdn.shopify.com/**")],
    // Zuinig met Vercel Image Optimization: minder breedtes = minder
    // transformaties, en geoptimaliseerde beelden 31 dagen cachen (default 4 uur).
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [48, 96, 128, 256, 384],
    minimumCacheTTL: 2_678_400,
  },
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
