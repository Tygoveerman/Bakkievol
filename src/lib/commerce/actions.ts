"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";

import { checkDeliveryDate, checkPostcode, isDeliveryComplete } from "@/lib/delivery";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

import {
  addToCart,
  getCart,
  removeFromCart,
  setDeliveryPostcode,
  updateCartAttributes,
  updateCartLine,
} from "./cart";

/**
 * Server Actions voor de winkelwagen. Formulieren in de UI posten hierheen,
 * zodat toevoegen/aanpassen ook zonder client-side JavaScript werkt.
 *
 * De cart leeft in Shopify, dus een mutatie zet niet altijd een cookie;
 * `refresh()` zorgt dat header-teller en winkelwagen direct bijwerken.
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
  refresh();
}

export async function removeFromCartAction(formData: FormData): Promise<void> {
  const lineId = formData.get("lineId");
  if (typeof lineId !== "string") return;

  await removeFromCart(lineId);
  refresh();
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
  refresh();
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
  if (check === "outside") {
    return {
      status: "error",
      field: "postcode",
      message: `Helaas, op deze postcode leveren we niet online. Bel ${siteConfig.contact.phone}, dan kijken we wat er kan.`,
    };
  }
  if (timing === "date") {
    const dateCheck = checkDeliveryDate(date, new Date());
    if (dateCheck !== "ok") {
      const messages = {
        invalid: "Kies een leverdatum.",
        "too-early": "Kies een datum vanaf morgen. Vandaag nog? Kies dan ‘Zo snel mogelijk’.",
        "no-delivery-day": "Op zondag leveren we niet. Kies een dag van maandag t/m zaterdag.",
      };
      return { status: "error", field: "date", message: messages[dateCheck] };
    }
  }

  // Eén leverdatum per bestelling: de gegevens staan op de hele winkelwagen.
  await updateCartAttributes({
    Postcode: postcode,
    Levering: timing === "date" ? "Op gekozen datum" : "Zo snel mogelijk",
    Leverdatum: timing === "date" ? date : "",
    Plaatsing: get("placement") === "openbare-weg" ? "Openbare weg (vergunning nodig)" : "Eigen terrein / oprit",
    Opmerking: get("notes"),
  });
  await setDeliveryPostcode(postcode);
  refresh();
  return { status: "saved" };
}

/**
 * Naar de Shopify-checkout. Controleert server-side of de levergegevens
 * compleet en geldig zijn (postcode in het levergebied, geldige datum);
 * anders terug naar de winkelwagen.
 */
export async function checkoutAction(): Promise<void> {
  const cart = await getCart();
  const attributes = Object.fromEntries(cart.attributes.map((a) => [a.key, a.value]));

  if (cart.lines.length === 0 || !cart.checkoutUrl || !isDeliveryComplete(attributes, new Date())) {
    redirect(routes.cart);
  }
  redirect(cart.checkoutUrl);
}
