import "server-only";

import { cookies } from "next/headers";

import { catalogImage } from "@/content/catalog";

import { shopifyFetch, ShopifyError, toImage } from "./shopify";
import type { Cart, Money } from "./types";

/**
 * Winkelwagen in Shopify. De cookie bevat alleen het cart-ID; regels,
 * prijzen en bestelgegevens (cart attributes) leven in Shopify. Prijzen
 * worden dus altijd door Shopify berekend, nooit door de browser.
 *
 * Mutaties zetten cookies en mogen alleen vanuit Server Actions worden
 * aangeroepen (zie ./actions.ts).
 */

const CART_ID_COOKIE = "bakkievol_cart_id";
const MAX_QUANTITY = 99;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    attributes { key value }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions { name value }
            product {
              id
              handle
              title
              featuredImage { url altText width height }
            }
          }
        }
      }
    }
  }
`;

type ShopifyImage = { url: string; altText: string | null; width: number | null; height: number | null };

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  attributes: { key: string; value: string | null }[];
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      merchandise: {
        id: string;
        title: string;
        selectedOptions: { name: string; value: string }[];
        product: { id: string; handle: string; title: string; featuredImage: ShopifyImage | null };
      };
    }[];
  };
};

type UserError = { field: string[] | null; message: string };

function toCart(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    // Checkout-domein bepaalt Shopify (nu checkout.bakkievol.nl, CNAME naar Shopify).
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    attributes: cart.attributes
      .filter((a): a is { key: string; value: string } => typeof a.value === "string")
      .map(({ key, value }) => ({ key, value })),
    cost: cart.cost,
    lines: cart.lines.nodes.map((line) => {
      const { product } = line.merchandise;
      return {
        id: line.id,
        quantity: line.quantity,
        cost: line.cost,
        merchandise: {
          id: line.merchandise.id,
          title: line.merchandise.title,
          selectedOptions: line.merchandise.selectedOptions,
          product: {
            id: product.id,
            handle: product.handle,
            title: product.title,
            featuredImage:
              toImage(product.featuredImage, product.title) ?? catalogImage(product.handle, product.title),
          },
        },
      };
    }),
  };
}

const emptyCart: Cart = {
  id: "",
  checkoutUrl: null,
  totalQuantity: 0,
  lines: [],
  attributes: [],
  cost: {
    subtotalAmount: { amount: "0.00", currencyCode: "EUR" },
    totalAmount: { amount: "0.00", currencyCode: "EUR" },
  },
};

function assertNoUserErrors(errors: UserError[]) {
  if (errors.length > 0) {
    throw new ShopifyError(errors.map((e) => e.message).join("; "));
  }
}

async function readCartId(): Promise<string | null> {
  return (await cookies()).get(CART_ID_COOKIE)?.value ?? null;
}

async function writeCartId(cartId: string): Promise<void> {
  (await cookies()).set(CART_ID_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 10,
  });
}

/** Huidige Shopify-cart, of `null` als er geen is (of hij verlopen/afgerekend is). */
async function fetchShopifyCart(): Promise<ShopifyCart | null> {
  const cartId = await readCartId();
  if (!cartId) return null;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(
    /* GraphQL */ `
      query Cart($cartId: ID!) { cart(id: $cartId) { ...CartFields } }
      ${CART_FRAGMENT}
    `,
    { cartId },
    { cache: "no-store" },
  );
  return data.cart;
}

export async function getCart(): Promise<Cart> {
  const cart = await fetchShopifyCart();
  return cart ? toCart(cart) : emptyCart;
}

export async function addToCart(variantId: string, quantity = 1): Promise<void> {
  // Bestaat de variant en is hij te koop? Prijs bepaalt Shopify zelf.
  const { node } = await shopifyFetch<{ node: { availableForSale?: boolean } | null }>(
    /* GraphQL */ `
      query Variant($id: ID!) {
        node(id: $id) { ... on ProductVariant { availableForSale } }
      }
    `,
    { id: variantId },
    { cache: "no-store" },
  );
  if (!node?.availableForSale) {
    throw new Error("Deze variant is niet beschikbaar.");
  }

  const cart = await fetchShopifyCart();

  if (!cart) {
    const data = await shopifyFetch<{
      cartCreate: { cart: { id: string } | null; userErrors: UserError[] };
    }>(
      /* GraphQL */ `
        mutation CartCreate($input: CartInput!) {
          cartCreate(input: $input) { cart { id } userErrors { field message } }
        }
      `,
      {
        input: {
          lines: [{ merchandiseId: variantId, quantity: Math.min(quantity, MAX_QUANTITY) }],
          buyerIdentity: { countryCode: "NL" },
        },
      },
      { cache: "no-store" },
    );
    assertNoUserErrors(data.cartCreate.userErrors);
    if (!data.cartCreate.cart) throw new ShopifyError("Winkelwagen aanmaken mislukt.");
    await writeCartId(data.cartCreate.cart.id);
    return;
  }

  const existing = cart.lines.nodes.find((line) => line.merchandise.id === variantId);
  if (existing) {
    await updateCartLine(existing.id, existing.quantity + quantity);
    return;
  }

  const data = await shopifyFetch<{ cartLinesAdd: { userErrors: UserError[] } }>(
    /* GraphQL */ `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) { userErrors { field message } }
      }
    `,
    { cartId: cart.id, lines: [{ merchandiseId: variantId, quantity: Math.min(quantity, MAX_QUANTITY) }] },
    { cache: "no-store" },
  );
  assertNoUserErrors(data.cartLinesAdd.userErrors);
}

export async function updateCartLine(lineId: string, quantity: number): Promise<void> {
  const cartId = await readCartId();
  if (!cartId) return;

  if (quantity <= 0) {
    const data = await shopifyFetch<{ cartLinesRemove: { userErrors: UserError[] } }>(
      /* GraphQL */ `
        mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { userErrors { field message } }
        }
      `,
      { cartId, lineIds: [lineId] },
      { cache: "no-store" },
    );
    assertNoUserErrors(data.cartLinesRemove.userErrors);
    return;
  }

  const data = await shopifyFetch<{ cartLinesUpdate: { userErrors: UserError[] } }>(
    /* GraphQL */ `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) { userErrors { field message } }
      }
    `,
    { cartId, lines: [{ id: lineId, quantity: Math.min(quantity, MAX_QUANTITY) }] },
    { cache: "no-store" },
  );
  assertNoUserErrors(data.cartLinesUpdate.userErrors);
}

export async function removeFromCart(lineId: string): Promise<void> {
  await updateCartLine(lineId, 0);
}

/**
 * Bestelgegevens op de cart zetten. Shopify vervangt de volledige set, dus
 * weggelaten (lege) waarden verdwijnen. Ze komen in de order terecht als
 * "Aanvullende gegevens".
 */
export async function updateCartAttributes(attributes: Record<string, string>): Promise<void> {
  const cartId = await readCartId();
  if (!cartId) return;

  const list = Object.entries(attributes)
    .filter(([, value]) => value.trim() !== "")
    .map(([key, value]) => ({ key, value: value.trim().slice(0, 500) }));

  const data = await shopifyFetch<{ cartAttributesUpdate: { userErrors: UserError[] } }>(
    /* GraphQL */ `
      mutation CartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
        cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { userErrors { field message } }
      }
    `,
    { cartId, attributes: list },
    { cache: "no-store" },
  );
  assertNoUserErrors(data.cartAttributesUpdate.userErrors);
}

/**
 * Postcode alvast als bezorgadres in de checkout zetten, zodat de klant
 * niet per ongeluk een ander adres invult. Best effort: mislukt dit, dan
 * vult de klant het adres gewoon zelf in.
 */
export async function setDeliveryPostcode(postcode: string): Promise<void> {
  const cartId = await readCartId();
  if (!cartId) return;

  try {
    const data = await shopifyFetch<{ cartDeliveryAddressesReplace: { userErrors: UserError[] } }>(
      /* GraphQL */ `
        mutation CartDeliveryAddressesReplace($cartId: ID!, $addresses: [CartSelectableAddressInput!]!) {
          cartDeliveryAddressesReplace(cartId: $cartId, addresses: $addresses) {
            userErrors { field message }
          }
        }
      `,
      {
        cartId,
        addresses: [
          {
            address: { deliveryAddress: { zip: postcode, countryCode: "NL" } },
            selected: true,
            oneTimeUse: true,
          },
        ],
      },
      { cache: "no-store" },
    );
    assertNoUserErrors(data.cartDeliveryAddressesReplace.userErrors);
  } catch (error) {
    console.warn("[shopify] Bezorgadres vooraf invullen mislukt:", error);
  }
}
