import type {
  Money,
  Product,
  ProductImage,
  ProductVariant,
} from "@/lib/commerce/types";

/**
 * Tijdelijke mock-producten. Alleen de commerce-laag (src/lib/commerce) mag
 * dit bestand importeren; componenten en pagina's nooit rechtstreeks.
 *
 * Model (Shopify-conform): één product per afvalsoort, met de optie
 * "Formaat" en een variant per containerformaat. Prijzen zijn all-in en
 * incl. btw. Alle prijzen en afbeeldingen zijn TIJDELIJK.
 *
 * `productType` = categorie voor filtering (Verbouwen, Tuin & grond, Hout,
 * Opruimen). `allowed`/`notAllowed` zijn CONCEPTTEKSTEN — laten controleren.
 */

const eur = (amount: number): Money => ({
  amount: amount.toFixed(2),
  currencyCode: "EUR",
});

const image = (file: string, altText: string): ProductImage => ({
  url: `/images/temp/${file}`,
  altText,
  width: 548,
  height: 330,
});

const filledContainer: ProductImage = {
  url: "/images/temp/container-gevuld.webp",
  altText: "Gevulde blauwe Bakkievol-container op een oprit",
  width: 973,
  height: 628,
};

type ProductInput = {
  id: number;
  handle: string;
  title: string;
  description: string;
  imageFile: string;
  category: "Verbouwen" | "Tuin & grond" | "Hout" | "Opruimen";
  allowed: string[];
  notAllowed: string[];
  badge?: string;
  tags?: string[];
  /** Prijs per formaat in m³. */
  prices: Partial<Record<3 | 6 | 10 | 15 | 20, number>>;
  soldOut?: number[];
};

function buildProduct(input: ProductInput): Product {
  const featuredImage = image(input.imageFile, input.title);

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
    featuredImage,
    // Productpagina: eerst de gevulde container, dan de afvalsoort.
    images: [filledContainer, featuredImage],
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
    wasteGuide: { allowed: input.allowed, notAllowed: input.notAllowed },
    badge: input.badge ?? null,
  };
}

export const mockProducts: Product[] = [
  buildProduct({
    id: 2001,
    handle: "bouw-en-sloopafval-container",
    title: "Bouw- en sloopafval",
    description: "Gemengd afval uit verbouwing of renovatie.",
    imageFile: "afval-bouw-en-sloopafval.webp",
    category: "Verbouwen",
    allowed: ["Hout, kunststof en metaal", "Gips en gipsplaten", "Isolatiemateriaal en glaswol", "Deuren, kozijnen en keukenkastjes", "Sanitair en tegels (in kleine hoeveelheden)", "Vloerbedekking en laminaat"],
    notAllowed: ["Geen asbest of chemisch afval", "Geen verf, kit of oplosmiddelen", "Geen autobanden", "Geen elektrische apparaten"],
    badge: "Meest gekozen",
    tags: ["featured"],
    prices: { 3: 279, 6: 370, 10: 449, 15: 689, 20: 789 },
  }),
  buildProduct({
    id: 2002,
    handle: "grofvuil-container",
    title: "Grofvuil",
    description: "Meubels, huisraad en groot gemengd afval.",
    imageFile: "afval-grofvuil.webp",
    category: "Opruimen",
    allowed: ["Meubels en matrassen", "Vloerbedekking en huisraad", "Banken, kasten en bedden", "Speelgoed en tuinmeubelen", "Kleding en textiel", "Kunststof en hout uit huis"],
    notAllowed: ["Geen puin, grond of elektra", "Geen koelkasten of wasmachines", "Geen verf of chemisch afval", "Geen asbest"],
    tags: ["featured"],
    prices: { 3: 299, 6: 399, 10: 489, 15: 729, 20: 829 },
  }),
  buildProduct({
    id: 2003,
    handle: "puinafval-container",
    title: "Puin",
    description: "Stenen, beton, tegels en schoon puin.",
    imageFile: "afval-puinafval.webp",
    category: "Verbouwen",
    allowed: ["Stenen, beton en tegels", "Klinkers en dakpannen", "Metselwerk en baksteen", "Natuursteen en grind"],
    notAllowed: ["Geen gips, hout of grond", "Geen gasbeton (Ytong) of cellenbeton", "Geen kunststof of isolatie", "Geen asbest"],
    tags: ["featured"],
    prices: { 3: 239, 6: 329 },
  }),
  buildProduct({
    id: 2004,
    handle: "groenafval-container",
    title: "Groenafval",
    description: "Bladeren, gras, takken en snoeiafval.",
    imageFile: "afval-groenafval.webp",
    category: "Tuin & grond",
    allowed: ["Takken, bladeren en gras", "Snoei- en heggenafval", "Struiken en planten", "Fruit- en bloemresten uit de tuin"],
    notAllowed: ["Geen grond of stenen", "Geen boomstronken of wortels", "Geen bielzen of behandeld hout", "Geen kunststof (zoals plantenpotten)"],
    badge: "Voor tuinafval",
    tags: ["featured"],
    prices: { 3: 209, 6: 279, 10: 359, 15: 499 },
  }),
  buildProduct({
    id: 2005,
    handle: "houtafval-a-container",
    title: "Houtafval (A-hout)",
    description: "Schoon en onbehandeld hout.",
    imageFile: "afval-houtafval-a.webp",
    category: "Hout",
    allowed: ["Onbehandeld hout en pallets", "Balken en planken", "Kisten en kratten", "Massief houten meubels zonder verf"],
    notAllowed: ["Geen geverfd of geïmpregneerd hout", "Geen spaanplaat of MDF", "Geen hout met glas of kunststof", "Geen bielzen"],
    badge: "Voordeligste keuze",
    tags: ["featured"],
    prices: { 3: 199, 6: 269, 10: 349, 15: 489, 20: 589 },
  }),
  buildProduct({
    id: 2006,
    handle: "schone-grond-container",
    title: "Schone grond",
    description: "Aarde en zand zonder vervuiling.",
    imageFile: "afval-schone-grond.webp",
    category: "Tuin & grond",
    allowed: ["Zand en aarde", "Zonder bijmenging", "Tuingrond zonder wortels"],
    notAllowed: ["Geen puin, wortels of groen", "Geen vervuilde grond", "Geen klei met puin", "Geen kunststof of afval"],
    tags: ["featured"],
    prices: { 3: 219, 6: 309 },
  }),
  buildProduct({
    id: 2007,
    handle: "houtafval-c-container",
    title: "Houtafval (C-hout)",
    description: "Behandeld of geïmpregneerd hout.",
    imageFile: "afval-houtafval-c.webp",
    category: "Hout",
    allowed: ["Geïmpregneerd en geverfd hout", "Schuttingen en tuinhout", "Spaanplaat, MDF en multiplex", "Kozijnen zonder glas"],
    notAllowed: ["Geen ander afval", "Geen bielzen (spoorbiels)", "Geen hout met glas", "Geen asbest"],
    prices: { 3: 229, 6: 299, 10: 389, 15: 549, 20: 649 },
  }),
  buildProduct({
    id: 2008,
    handle: "gemengd-groenafval-container",
    title: "Gemengd groenafval",
    description: "Tuinafval gemengd met groene resten.",
    imageFile: "afval-gemengd-groenafval.webp",
    category: "Tuin & grond",
    allowed: ["Groen met wortels en stronken", "Tuinafval met wat grond", "Takken en snoeiafval", "Graszoden"],
    notAllowed: ["Geen puin of bouwafval", "Geen kunststof of afval", "Geen behandeld hout", "Geen chemisch afval"],
    prices: { 3: 229, 6: 299, 10: 379 },
  }),
  buildProduct({
    id: 2009,
    handle: "gemengde-grond-container",
    title: "Gemengde grond",
    description: "Grond gemengd met andere materialen.",
    imageFile: "afval-gemengde-grond.webp",
    category: "Tuin & grond",
    allowed: ["Grond met stenen of puin", "Grond met wortels", "Zand met grind"],
    notAllowed: ["Geen vervuilde grond", "Geen bouwafval met hout of kunststof", "Geen asbest", "Geen chemisch afval"],
    prices: { 3: 259, 6: 359 },
  }),
  buildProduct({
    id: 2010,
    handle: "dakafval-container",
    title: "Dakafval",
    description: "Dakleer, bitumen en dakmaterialen.",
    imageFile: "afval-dakafval.webp",
    category: "Verbouwen",
    allowed: ["Dakleer en bitumen", "Dakgrind en isolatie", "Dakbeschot en panlatten", "Dakgoten (zink/kunststof)"],
    notAllowed: ["Geen asbesthoudend materiaal", "Geen teerhoudend dakafval", "Geen chemisch afval", "Geen ander bouwafval"],
    prices: { 3: 319, 6: 449, 10: 599 },
    soldOut: [10],
  }),
];
