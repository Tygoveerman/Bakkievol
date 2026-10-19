import "server-only";

import { catalog, catalogImage, catalogImages } from "@/content/catalog";

import type { Money, Product, ProductImage } from "./types";

/**
 * Shopify Storefront API-client. Alleen server-side: het token gaat nooit
 * naar de browser, en prijzen worden altijd door Shopify berekend.
 *
 * Omgeving:
 * - NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN  openbaar Storefront-token (Headless-kanaal)
 * - SHOPIFY_STORE_DOMAIN                  optioneel, standaard het myshopify-domein
 * - SHOPIFY_STOREFRONT_API_VERSION        optioneel, standaard hieronder
 *
 * Zonder token draait de commerce-laag op mock-data (alleen lokaal bedoeld).
 */

const API_VERSION = "2026-10";

export const shopifyConfig = {
  domain: process.env.SHOPIFY_STORE_DOMAIN || "b1a9qw-p2.myshopify.com",
  token:
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    "",
  apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION || API_VERSION,
};

export function isShopifyConfigured(): boolean {
  return shopifyConfig.token !== "";
}

export class ShopifyError extends Error {}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { cache?: RequestCache } = {},
): Promise<T> {
  const { domain, token, apiVersion } = shopifyConfig;
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: options.cache,
  });

  const body = (await response.json().catch(() => null)) as {
    data?: T;
    errors?: { message: string }[];
  } | null;

  if (!response.ok || !body?.data || body.errors?.length) {
    const message = body?.errors?.map((e) => e.message).join("; ") || response.statusText;
    throw new ShopifyError(`Shopify Storefront API (${response.status}): ${message}`);
  }
  return body.data;
}

/* ------------------------------------------------------------------ */
/* Producten                                                           */
/* ------------------------------------------------------------------ */

export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    vendor
    productType
    tags
    availableForSale
    updatedAt
    seo { title description }
    featuredImage { url altText width height }
    images(first: 10) { nodes { url altText width height } }
    options { id name optionValues { name } }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 50) {
      nodes {
        id
        title
        sku
        availableForSale
        selectedOptions { name value }
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        image { url altText width height }
      }
    }
  }
`;

type ShopifyImage = { url: string; altText: string | null; width: number | null; height: number | null };

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  updatedAt: string;
  seo: { title: string | null; description: string | null };
  featuredImage: ShopifyImage | null;
  images: { nodes: ShopifyImage[] };
  options: { id: string; name: string; optionValues: { name: string }[] }[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  variants: {
    nodes: {
      id: string;
      title: string;
      sku: string | null;
      availableForSale: boolean;
      selectedOptions: { name: string; value: string }[];
      price: Money;
      compareAtPrice: Money | null;
      image: ShopifyImage | null;
    }[];
  };
};

export function toImage(image: ShopifyImage | null, fallbackAlt: string): ProductImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText || fallbackAlt,
    width: image.width ?? 1200,
    height: image.height ?? 800,
  };
}

/**
 * Shopify-product → domeinmodel. Afbeeldingen uit Shopify gaan voor; zonder
 * eigen afbeeldingen vallen we terug op de redactionele catalogus.
 */
export function toProduct(product: ShopifyProduct): Product {
  const shopifyImages = product.images.nodes
    .map((image) => toImage(image, product.title))
    .filter((image): image is ProductImage => image !== null);
  const entry = catalog[product.handle];

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    vendor: product.vendor,
    productType: product.productType,
    tags: product.tags,
    availableForSale: product.availableForSale,
    featuredImage:
      toImage(product.featuredImage, product.title) ?? catalogImage(product.handle, product.title),
    images: shopifyImages.length > 0 ? shopifyImages : catalogImages(product.handle, product.title),
    options: product.options.map((option) => ({
      id: option.id,
      name: option.name,
      values: option.optionValues.map((value) => value.name),
    })),
    variants: product.variants.nodes.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku ?? "",
      availableForSale: variant.availableForSale,
      selectedOptions: variant.selectedOptions,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      image: toImage(variant.image, product.title),
    })),
    priceRange: product.priceRange,
    seo: product.seo,
    updatedAt: product.updatedAt,
    wasteGuide: entry?.wasteGuide ?? null,
    badge: entry?.badge ?? null,
  };
}
