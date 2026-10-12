/**
 * Commerce domain types.
 *
 * Deze types volgen bewust de structuur van de Shopify Storefront API
 * (Product → options/variants, Money als string-bedrag + valuta, Cart → lines),
 * zodat de mock-implementatie later 1-op-1 vervangen kan worden door
 * Storefront API-calls zonder dat componenten hoeven te veranderen.
 */

export type CurrencyCode = "EUR";

export interface Money {
  /** Decimaal bedrag als string, zoals Shopify het teruggeeft (bijv. "12.95"). */
  amount: string;
  currencyCode: CurrencyCode;
}

export interface ProductImage {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  /** Shopify GID, bijv. "gid://shopify/ProductVariant/123". */
  id: string;
  title: string;
  sku: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: ProductImage | null;
}

export interface Seo {
  title: string | null;
  description: string | null;
}

/**
 * Wat wel/niet in een container mag. In Shopify: product-metafields
 * (bijv. `custom.allowed_waste` en `custom.forbidden_waste`, list.single_line_text).
 */
export interface WasteGuide {
  allowed: string[];
  notAllowed: string[];
}

export interface Product {
  /** Shopify GID, bijv. "gid://shopify/Product/123". */
  id: string;
  /** URL-slug, gebruikt in /containers/[handle]. */
  handle: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  seo: Seo;
  updatedAt: string;
  wasteGuide: WasteGuide | null;
  /** Eén optioneel merchandising-label (Shopify-metafield `custom.badge`). */
  badge: string | null;
}

export interface CartItem {
  /** Cart line ID. */
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: Pick<Product, "id" | "handle" | "title" | "featuredImage">;
  };
}

export interface Cart {
  id: string;
  /** Shopify-hosted checkout URL. `null` zolang Shopify nog niet gekoppeld is. */
  checkoutUrl: string | null;
  totalQuantity: number;
  lines: CartItem[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  /**
   * Extra bestelgegevens (Shopify: cart attributes), bijv. postcode,
   * leverdatum en plaatsing. Gaan mee naar de checkout en de order.
   */
  attributes: { key: string; value: string }[];
}
