"use server";

import { redirect } from "next/navigation";

import { checkPostcode } from "@/lib/delivery";

import { addToCart, removeFromCart, updateCartAttributes, updateCartLine } from "./cart";

/**
 * Server Actions voor de winkelwagen. Formulieren in de UI posten hierheen,
 * zodat toevoegen/aanpassen ook zonder client-side JavaScript werkt.
 */

export async function addToCartAction(formData: FormData): Promise<void> {
  const variantId = formData.get("variantId");
  if (typeof variantId !== "string" || !variantId) return;

  await addToCart(variantId, 1);
  redirect("/winkelwagen");
}

export async function updateCartLineAction(formData: FormData): Promise<void> {
  const lineId = formData.get("lineId");
  const quantity = Number(formData.get("quantity"));
  if (typeof lineId !== "string" || !Number.isInteger(quantity)) return;

  await updateCartLine(lineId, quantity);
}

export async function removeFromCartAction(formData: FormData): Promise<void> {
  const lineId = formData.get("lineId");
  if (typeof lineId !== "string") return;

  await removeFromCart(lineId);
}

export type AddToCartState =
  | { status: "idle" }
  | { status: "success"; variantId: string; id: string }
  | { status: "error"; message: string };

/**
 * Variant voor `useActionState`: voegt toe zonder redirect en geeft het
 * resultaat terug, zodat de UI een bevestiging kan tonen.
 */
export async function addToCartInlineAction(
  _previous: AddToCartState,
  formData: FormData,
): Promise<AddToCartState> {
  const variantId = formData.get("variantId");
  if (typeof variantId !== "string" || !variantId) {
    return { status: "error", message: "Kies eerst een container." };
  }

  try {
    await addToCart(variantId, 1);
  } catch {
    return {
      status: "error",
      message: "Deze container is nu niet beschikbaar. Bel ons, we denken graag mee.",
    };
  }
  return { status: "success", variantId, id: crypto.randomUUID() };
}

export type DeliveryState =
  | { status: "idle" }
  | { status: "saved" }
  | { status: "error"; field: "postcode" | "date"; message: string };

/** Leveringsgegevens in de winkelwagen opslaan (Shopify: cart attributes). */
export async function saveDeliveryAction(
  _previous: DeliveryState,
  formData: FormData,
): Promise<DeliveryState> {
  const get = (name: string) => String(formData.get(name) ?? "").trim();
  const postcode = get("postcode").toUpperCase();
  const timing = get("timing");
  const date = get("date");

  const check = checkPostcode(postcode);
  if (check === "invalid") {
    return { status: "error", field: "postcode", message: "Vul een geldige postcode in, bijv. 1811 AB." };
  }
  if (timing === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { status: "error", field: "date", message: "Kies een leverdatum." };
  }

  await updateCartAttributes({
    Postcode: postcode,
    Levering: timing === "date" ? "Op gekozen datum" : "Zo snel mogelijk",
    Leverdatum: timing === "date" ? date : "",
    Plaatsing: get("placement") === "openbare-weg" ? "Openbare weg (vergunning nodig)" : "Eigen terrein / oprit",
    Opmerking: get("notes"),
  });
  return { status: "saved" };
}
