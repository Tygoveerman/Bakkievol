import "server-only";

import { cookies } from "next/headers";

import { mockProducts } from "@/lib/mock-data/products";

import type { Cart, CartItem, Money } from "./types";

/**
 * Winkelwagen.
 *
 * Mock-implementatie: de regels (variant + aantal) staan in een httpOnly
 * cookie. Met Shopify wordt dit: een cart-ID in de cookie, en de cart zelf
 * leeft in Shopify (cartCreate / cartLinesAdd / cartLinesUpdate /
 * cartLinesRemove). De functies hieronder houden dezelfde signatuur.
 *
 * Mutaties zetten cookies en mogen dus alleen vanuit Server Actions worden
 * aangeroepen (zie ./actions.ts).
 */

const CART_COOKIE = "bakkievol_cart";
const ATTRIBUTES_COOKIE = "bakkievol_cart_attributes";
const MAX_QUANTITY = 99;

type StoredLine = { variantId: string; quantity: number };

async function readLines(): Promise<StoredLine[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is StoredLine =>
        typeof line?.variantId === "string" &&
        Number.isInteger(line?.quantity) &&
        line.quantity > 0,
    );
  } catch {
    return [];
  }
}

async function writeLines(lines: StoredLine[]): Promise<void> {
  const cookieStore = await cookies();
  if (lines.length === 0) {
    cookieStore.delete(CART_COOKIE);
    return;
  }
  cookieStore.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function findVariant(variantId: string) {
  for (const product of mockProducts) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

const toCents = (money: Money) => Math.round(Number(money.amount) * 100);
const fromCents = (cents: number): Money => ({
  amount: (cents / 100).toFixed(2),
  currencyCode: "EUR",
});

async function readAttributes(): Promise<Cart["attributes"]> {
  const raw = (await cookies()).get(ATTRIBUTES_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (a): a is { key: string; value: string } =>
        typeof a?.key === "string" && typeof a?.value === "string",
    );
  } catch {
    return [];
  }
}

/**
 * Bestelgegevens op de winkelwagen zetten (Shopify: cartAttributesUpdate).
 * Lege waarden worden weggelaten.
 */
export async function updateCartAttributes(attributes: Record<string, string>): Promise<void> {
  const list = Object.entries(attributes)
    .filter(([, value]) => value.trim() !== "")
    .map(([key, value]) => ({ key, value: value.trim().slice(0, 500) }));
  (await cookies()).set(ATTRIBUTES_COOKIE, JSON.stringify(list), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getCart(): Promise<Cart> {
  const items: CartItem[] = [];

  for (const line of await readLines()) {
    const match = findVariant(line.variantId);
    if (!match) continue;
    const { product, variant } = match;

    items.push({
      id: variant.id,
      quantity: line.quantity,
      cost: { totalAmount: fromCents(toCents(variant.price) * line.quantity) },
      merchandise: {
        id: variant.id,
        title: variant.title,
        selectedOptions: variant.selectedOptions,
        product: {
          id: product.id,
          handle: product.handle,
          title: product.title,
          featuredImage: product.featuredImage,
        },
      },
    });
  }

  const subtotal = fromCents(
    items.reduce((sum, item) => sum + toCents(item.cost.totalAmount), 0),
  );

  return {
    id: "mock-cart",
    checkoutUrl: null,
    attributes: await readAttributes(),
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    lines: items,
    cost: { subtotalAmount: subtotal, totalAmount: subtotal },
  };
}

export async function addToCart(variantId: string, quantity = 1): Promise<void> {
  const match = findVariant(variantId);
  if (!match || !match.variant.availableForSale) {
    throw new Error("Deze variant is niet beschikbaar.");
  }

  const lines = await readLines();
  const existing = lines.find((line) => line.variantId === variantId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, MAX_QUANTITY);
  } else {
    lines.push({ variantId, quantity: Math.min(quantity, MAX_QUANTITY) });
  }
  await writeLines(lines);
}

export async function updateCartLine(
  lineId: string,
  quantity: number,
): Promise<void> {
  const lines = await readLines();
  const next =
    quantity <= 0
      ? lines.filter((line) => line.variantId !== lineId)
      : lines.map((line) =>
          line.variantId === lineId
            ? { ...line, quantity: Math.min(quantity, MAX_QUANTITY) }
            : line,
        );
  await writeLines(next);
}

export async function removeFromCart(lineId: string): Promise<void> {
  await updateCartLine(lineId, 0);
}
