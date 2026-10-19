import { catalog, catalogImage, catalogImages } from "@/content/catalog";
import type { Money, Product, ProductVariant } from "@/lib/commerce/types";

/**
 * Tijdelijke mock-producten, alleen gebruikt zolang Shopify niet is
 * geconfigureerd (lokaal zonder token). Alleen de commerce-laag
 * (src/lib/commerce) mag dit bestand importeren.
 *
 * Model (Shopify-conform): één product per afvalsoort, met de optie
 * "Formaat" en een variant per containerformaat. Prijzen zijn all-in en
 * incl. btw. In productie komen prijzen uitsluitend uit Shopify.
 *
 * Redactionele inhoud (wat mag erin, label, afbeeldingen) staat in
 * src/content/catalog.ts en wordt ook voor Shopify-producten gebruikt.
 */

const eur = (amount: number): Money => ({
  amount: amount.toFixed(2),
  currencyCode: "EUR",
});

type ProductInput = {
  id: number;
  handle: string;
  title: string;
  description: string;
  category: "Verbouwen" | "Tuin & grond" | "Hout" | "Opruimen";
  tags?: string[];
  /** Prijs per formaat in m³. */
  prices: Partial<Record<3 | 6 | 10 | 15 | 20, number>>;
  soldOut?: number[];
};

function buildProduct(input: ProductInput): Product {
  const entry = catalog[input.handle];

  const variants: ProductVariant[] = Object.entries(input.prices).map(
    ([size, price], index) => {
      const value = `${size} m³`;
      return {
        id: `gid://shopify/ProductVariant/${input.id}${String(index + 1).padStart(2, "0")}`,
        title: value,
        sku: `BV-${input.handle}-${size}`,
        availableForSale: !input.soldOut?.includes(Number(size)),
        selectedOptions: [{ name: "Formaat", value }],
        price: eur(price),
        compareAtPrice: null,
        image: null,
      };
    },
  );

  const amounts = variants.map((variant) => Number(variant.price.amount));

  return {
    id: `gid://shopify/Product/${input.id}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    vendor: "Bakkievol",
    productType: input.category,
    tags: input.tags ?? [],
    availableForSale: variants.some((variant) => variant.availableForSale),
    featuredImage: catalogImage(input.handle, input.title),
    images: catalogImages(input.handle, input.title),
    options: [
      {
        id: `gid://shopify/ProductOption/${input.id}1`,
        name: "Formaat",
        values: variants.map((variant) => variant.title),
      },
    ],
    variants,
    priceRange: {
      minVariantPrice: eur(Math.min(...amounts)),
      maxVariantPrice: eur(Math.max(...amounts)),
    },
    seo: { title: null, description: null },
    updatedAt: "2026-10-01T00:00:00Z",
    wasteGuide: entry?.wasteGuide ?? null,
    badge: entry?.badge ?? null,
  };
}

export const mockProducts: Product[] = [
  buildProduct({
    id: 2001,
    handle: "bouw-en-sloopafval-container",
    title: "Bouw- en sloopafval",
    description: "Gemengd afval uit verbouwing of renovatie.",
    category: "Verbouwen",
    tags: ["featured"],
    prices: { 3: 279, 6: 370, 10: 449, 15: 689, 20: 789 },
  }),
  buildProduct({
    id: 2002,
    handle: "grofvuil-container",
    title: "Grofvuil",
    description: "Meubels, huisraad en groot gemengd afval.",
    category: "Opruimen",
    tags: ["featured"],
    prices: { 3: 299, 6: 399, 10: 489, 15: 729, 20: 829 },
  }),
  buildProduct({
    id: 2003,
    handle: "puinafval-container",
    title: "Puin",
    description: "Stenen, beton, tegels en schoon puin.",
    category: "Verbouwen",
    tags: ["featured"],
    prices: { 3: 239, 6: 329 },
  }),
  buildProduct({
    id: 2004,
    handle: "groenafval-container",
    title: "Groenafval",
    description: "Bladeren, gras, takken en snoeiafval.",
    category: "Tuin & grond",
    tags: ["featured"],
    prices: { 3: 209, 6: 279, 10: 359, 15: 499 },
  }),
  buildProduct({
    id: 2005,
    handle: "houtafval-a-container",
    title: "Houtafval (A-hout)",
    description: "Schoon en onbehandeld hout.",
    category: "Hout",
    tags: ["featured"],
    prices: { 3: 199, 6: 269, 10: 349, 15: 489, 20: 589 },
  }),
  buildProduct({
    id: 2006,
    handle: "schone-grond-container",
    title: "Schone grond",
    description: "Aarde en zand zonder vervuiling.",
    category: "Tuin & grond",
    tags: ["featured"],
    prices: { 3: 219, 6: 309 },
  }),
  buildProduct({
    id: 2007,
    handle: "houtafval-c-container",
    title: "Houtafval (C-hout)",
    description: "Behandeld of geïmpregneerd hout.",
    category: "Hout",
    prices: { 3: 229, 6: 299, 10: 389, 15: 549, 20: 649 },
  }),
  buildProduct({
    id: 2008,
    handle: "gemengd-groenafval-container",
    title: "Gemengd groenafval",
    description: "Tuinafval gemengd met groene resten.",
    category: "Tuin & grond",
    prices: { 3: 229, 6: 299, 10: 379 },
  }),
  buildProduct({
    id: 2009,
    handle: "gemengde-grond-container",
    title: "Gemengde grond",
    description: "Grond gemengd met andere materialen.",
    category: "Tuin & grond",
    prices: { 3: 259, 6: 359 },
  }),
  buildProduct({
    id: 2010,
    handle: "dakafval-container",
    title: "Dakafval",
    description: "Dakleer, bitumen en dakmaterialen.",
    category: "Verbouwen",
    prices: { 3: 319, 6: 449, 10: 599 },
    soldOut: [10],
  }),
];
