/**
 * Leverregels. Client-safe (geen server-only imports).
 *
 * LET OP — CONCEPT: het levergebied hieronder is een benadering van
 * Noord-Holland op basis van postcodereeksen en moet door Bakkievol
 * worden bevestigd. Later kan dit uit Shopify (delivery zones) komen.
 */

export const deliveryConfig = {
  timeZone: "Europe/Amsterdam",
  /** Uur (24u) waarvoor besteld moet zijn voor levering op dezelfde dag. */
  sameDayCutoffHour: 11,
  /** Leverdagen: 1 = maandag … 6 = zaterdag. */
  deliveryDays: [1, 2, 3, 4, 5, 6],
  postcodeRanges: [
    [1000, 1299],
    [1380, 1384],
    [1400, 1999],
    [2000, 2165],
  ] as [number, number][],
};

export type PostcodeResult = "deliverable" | "outside" | "invalid";

export function checkPostcode(input: string): PostcodeResult {
  const match = input.trim().match(/^(\d{4})\s?([a-zA-Z]{2})?$/);
  if (!match) return "invalid";
  const digits = Number(match[1]);
  if (digits < 1000) return "invalid";
  return deliveryConfig.postcodeRanges.some(
    ([from, to]) => digits >= from && digits <= to,
  )
    ? "deliverable"
    : "outside";
}

export type DeliveryEstimate =
  | { kind: "today"; minutesLeft: number }
  | { kind: "next"; dayLabel: string };

const dayNames = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

/** Schatting van de eerstvolgende leverdag op basis van de huidige tijd in NL. */
export function getDeliveryEstimate(now: Date): DeliveryEstimate {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: deliveryConfig.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const cutoff = deliveryConfig.sameDayCutoffHour * 60;

  if (deliveryConfig.deliveryDays.includes(day) && minutes < cutoff) {
    return { kind: "today", minutesLeft: cutoff - minutes };
  }

  for (let offset = 1; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    if (deliveryConfig.deliveryDays.includes(next)) {
      return { kind: "next", dayLabel: offset === 1 ? "morgen" : dayNames[next] };
    }
  }
  return { kind: "next", dayLabel: "morgen" };
}

/**
 * Eerstvolgende mogelijke leverdag als leesbare tekst, bijv. "vandaag",
 * "morgen" of "maandag 12 oktober". CONCEPT: gebaseerd op cutoff en
 * leverdagen; vervang later door echte beschikbaarheid (planning/Shopify).
 */
export function getEarliestDeliveryLabel(now: Date): string {
  const estimate = getDeliveryEstimate(now);
  if (estimate.kind === "today") return "vandaag";
  if (estimate.dayLabel === "morgen") return "morgen";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: deliveryConfig.timeZone,
    weekday: "short",
  }).formatToParts(now);
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    parts.find((p) => p.type === "weekday")?.value ?? "",
  );
  for (let offset = 1; offset <= 7; offset++) {
    if (deliveryConfig.deliveryDays.includes((day + offset) % 7)) {
      const date = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000);
      return new Intl.DateTimeFormat("nl-NL", {
        timeZone: deliveryConfig.timeZone,
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(date);
    }
  }
  return "binnenkort";
}

/** Datum in NL-tijd als YYYY-MM-DD. */
function toIsoDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: deliveryConfig.timeZone }).format(date);
}

/** Morgen (NL-tijd) als vroegst kiesbare leverdatum, in YYYY-MM-DD. */
export function earliestDeliveryDate(now: Date): string {
  return toIsoDate(new Date(now.getTime() + 24 * 60 * 60 * 1000));
}

export type DeliveryDateResult = "ok" | "invalid" | "too-early" | "no-delivery-day";

/** Controle van een gekozen leverdatum (ook server-side gebruikt). */
export function checkDeliveryDate(iso: string, now: Date): DeliveryDateResult {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "invalid";
  const date = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) return "invalid";
  if (iso < earliestDeliveryDate(now)) return "too-early";
  // Niet verder dan een jaar vooruit.
  if (iso > toIsoDate(new Date(now.getTime() + 366 * 24 * 60 * 60 * 1000))) return "invalid";
  if (!deliveryConfig.deliveryDays.includes(date.getUTCDay())) return "no-delivery-day";
  return "ok";
}

/**
 * Zijn de bestelgegevens op de winkelwagen compleet en geldig? Postcode in
 * het levergebied en, bij een gekozen datum, een geldige leverdatum.
 */
export function isDeliveryComplete(attributes: Record<string, string>, now: Date): boolean {
  if (!attributes.Postcode || checkPostcode(attributes.Postcode) !== "deliverable") return false;
  if (attributes.Leverdatum && checkDeliveryDate(attributes.Leverdatum, now) !== "ok") return false;
  return true;
}
