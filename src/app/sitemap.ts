import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/commerce";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;

  return [
    { url: url(routes.home) },
    { url: url(routes.containers) },
    { url: url(routes.sizes) },
    { url: url(routes.howItWorks) },
    { url: url(routes.support) },
    ...products.map((product) => ({
      url: url(routes.container(product.handle)),
      lastModified: product.updatedAt,
    })),
  ];
}
