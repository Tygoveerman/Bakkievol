import { useSyncExternalStore } from "react";

import { getLenis } from "@/components/motion/smooth-scroll";

/**
 * Gedeelde keuze (afvalsoort + formaat) tussen de hero-configurator,
 * de formaatkaarten en de formaatkeuzehulp. Alleen in client components.
 */
export type OrderSelection = { handle: string | null; size: string | null };

const initial: OrderSelection = { handle: null, size: null };
let selection = initial;
const listeners = new Set<() => void>();

export function setOrderSelection(patch: Partial<OrderSelection>) {
  selection = { ...selection, ...patch };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOrderSelection() {
  return useSyncExternalStore(subscribe, () => selection, () => initial);
}

export const CONFIGURATOR_ID = "bestellen";

/**
 * Scrollt naar de configurator en zet de focus op de actieve stap.
 * Geeft `false` terug als de configurator niet op deze pagina staat.
 */
export function focusConfigurator(): boolean {
  const element = document.getElementById(CONFIGURATOR_ID);
  if (!element) return false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(element, { offset: -headerHeight - 16 });
  else window.scrollTo({
    top: element.getBoundingClientRect().top + window.scrollY - headerHeight - 16,
    behavior: reduceMotion ? "auto" : "smooth",
  });
  window.setTimeout(
    () => element.querySelector<HTMLElement>("[data-step-heading]")?.focus({ preventScroll: true }),
    reduceMotion ? 0 : 400,
  );
  return true;
}

/**
 * Kies (een deel van) de bestelling en ga naar de configurator: op de
 * homepage scrollen, op andere pagina's navigeren (de keuze blijft bewaard).
 */
export function goToConfigurator(
  patch: Partial<OrderSelection>,
  navigate: (href: string) => void,
) {
  setOrderSelection(patch);
  if (!focusConfigurator()) navigate(`/#${CONFIGURATOR_ID}`);
}
