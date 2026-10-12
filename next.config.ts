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
