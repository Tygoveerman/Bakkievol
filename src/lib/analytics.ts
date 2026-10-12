/**
 * Minimale event-tracking: pusht naar `window.dataLayer` (GA4 / Google Tag
 * Manager / Vercel kunnen hierop aansluiten). Zonder tag-manager gebeurt er
 * niets. Eventnamen volgen GA4-e-commerce: view_item, add_to_cart, …
 */
type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
