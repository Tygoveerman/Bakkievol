import "server-only";

import { cache } from "react";

import * as mock from "./mock-cart";
import { isShopifyConfigured } from "./shopify";
import * as shopify from "./shopify-cart";
import type { Cart } from "./types";

/**
 * Winkelwagen: Shopify zodra het Storefront-token is ingesteld, anders de
 * mock-winkelwagen (lokaal). Mutaties zetten cookies en mogen alleen vanuit
 * Server Actions worden aangeroepen (zie ./actions.ts).
 */

const provider = () => (isShopifyConfigured() ? shopify : mock);

/** Eén keer per request ophalen (header en winkelwagenpagina delen hem). */
export const getCart = cache((): Promise<Cart> => provider().getCart());

export const addToCart = (variantId: string, quantity = 1) =>
  provider().addToCart(variantId, quantity);

export const updateCartLine = (lineId: string, quantity: number) =>
  provider().updateCartLine(lineId, quantity);

export const removeFromCart = (lineId: string) => provider().removeFromCart(lineId);

export const updateCartAttributes = (attributes: Record<string, string>) =>
  provider().updateCartAttributes(attributes);

/** Postcode vooraf invullen in de Shopify-checkout (mock: niets te doen). */
export async function setDeliveryPostcode(postcode: string): Promise<void> {
  if (isShopifyConfigured()) await shopify.setDeliveryPostcode(postcode);
}
