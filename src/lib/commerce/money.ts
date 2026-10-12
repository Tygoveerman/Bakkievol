import type { Money } from "./types";

const formatters = new Map<string, Intl.NumberFormat>();

function getFormatter(currencyCode: string, fractionDigits: number) {
  const key = `${currencyCode}:${fractionDigits}`;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: 2,
    });
    formatters.set(key, formatter);
  }
  return formatter;
}

/**
 * Formatteert een bedrag als "€ 279,00". Met `compact` worden hele bedragen
 * zonder centen getoond ("€ 279") — bedoeld voor "vanaf"-prijzen.
 */
export function formatMoney(
  { amount, currencyCode }: Money,
  { compact = false }: { compact?: boolean } = {},
): string {
  const value = Number(amount);
  const fractionDigits = compact && Number.isInteger(value) ? 0 : 2;
  return getFormatter(currencyCode, fractionDigits).format(value);
}
