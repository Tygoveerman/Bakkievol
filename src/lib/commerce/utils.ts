import type { Money, Product } from "./types";

/**
 * Laagste prijs per optiewaarde over meerdere producten heen,
 * bijv. de "vanaf"-prijs per containerformaat.
 */
export function getMinPriceByOption(
  products: Product[],
  optionName: string,
): Map<string, Money> {
  const result = new Map<string, Money>();

  for (const product of products) {
    for (const variant of product.variants) {
      const option = variant.selectedOptions.find((o) => o.name === optionName);
      if (!option) continue;
      const current = result.get(option.value);
      if (!current || Number(variant.price.amount) < Number(current.amount)) {
        result.set(option.value, variant.price);
      }
    }
  }

  return result;
}

/** Alle waarden van een optie, bijv. ["3 m³", "6 m³", "10 m³"]. */
export function getOptionValues(product: Product, optionName: string): string[] {
  return product.options.find((o) => o.name === optionName)?.values ?? [];
}
