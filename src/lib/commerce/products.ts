import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { catalog } from "@/content/catalog";
import { mockProducts } from "@/lib/mock-data/products";

import {
  isShopifyConfigured,
  PRODUCT_FRAGMENT,
  shopifyFetch,
  toProduct,
  type ShopifyProduct,
} from "./shopify";
import type { Product } from "./types";

/**
 * Product-data voor de storefront.
 *
 * Dit is de enige plek waar productdata vandaan komt: uit Shopify (Storefront
 * API) zodra het token is ingesteld, anders uit mock-data (lokaal).
 * Signaturen en return-types zijn voor beide gelijk.
 *
 * `cacheTag("products")` maakt het mogelijk om via een Shopify-webhook
 * gericht te revalideren. De winkelwagen en checkout gebruiken altijd de
 * actuele Shopify-prijs, los van deze cache.
 */

export const PRODUCTS_CACHE_TAG = "products";

const handleOrder = Object.keys(catalog);

/** Vaste volgorde van de site aanhouden; onbekende producten achteraan. */
function byCatalogOrder(a: Product, b: Product) {
  const rank = (p: Product) => {
    const index = handleOrder.indexOf(p.handle);
    return index === -1 ? handleOrder.length : index;
  };
  return rank(a) - rank(b);
}

async function fetchAllProducts(): Promise<Product[]> {
  if (!isShopifyConfigured()) return mockProducts;

  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(
    /* GraphQL */ `
      query Products {
        products(first: 100) { nodes { ...ProductFields } }
      }
      ${PRODUCT_FRAGMENT}
    `,
  );
  return data.products.nodes.map(toProduct).sort(byCatalogOrder);
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRODUCTS_CACHE_TAG);

  return fetchAllProducts();
}

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRODUCTS_CACHE_TAG);

  if (!isShopifyConfigured()) {
    return mockProducts.find((product) => product.handle === handle) ?? null;
  }

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    /* GraphQL */ `
      query Product($handle: String!) {
        product(handle: $handle) { ...ProductFields }
      }
      ${PRODUCT_FRAGMENT}
    `,
    { handle },
  );
  return data.product ? toProduct(data.product) : null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PRODUCTS_CACHE_TAG);

  // Tag "featured" in Shopify bepaalt de uitgelichte afvalsoorten.
  return (await fetchAllProducts())
    .filter((product) => product.tags.includes("featured"))
    .slice(0, limit);
}
