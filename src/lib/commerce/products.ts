import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { mockProducts } from "@/lib/mock-data/products";

import type { Product } from "./types";

/**
 * Product-data voor de storefront.
 *
 * Dit is de enige plek waar productdata vandaan komt. Nu uit mock-data;
 * bij de Shopify-koppeling vervangen we alleen de body van deze functies
 * door Storefront API-queries. Signaturen en return-types blijven gelijk.
 *
 * `cacheTag("products")` maakt het later mogelijk om via een Shopify-webhook
 * gericht te revalideren.
 */

export const PRODUCTS_CACHE_TAG = "products";

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRODUCTS_CACHE_TAG);

  return mockProducts;
}

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRODUCTS_CACHE_TAG);

  return mockProducts.find((product) => product.handle === handle) ?? null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRODUCTS_CACHE_TAG);

  // In Shopify wordt dit waarschijnlijk een collectie (bijv. "uitgelicht").
  return mockProducts
    .filter((product) => product.tags.includes("featured"))
    .slice(0, limit);
}
