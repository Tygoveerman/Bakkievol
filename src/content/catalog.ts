import type { ProductImage, WasteGuide } from "@/lib/commerce/types";

/**
 * Redactionele inhoud per afvalsoort, gekoppeld op Shopify-handle.
 *
 * Prijzen, varianten, titels en beschikbaarheid komen uit Shopify; dit
 * bestand vult aan wat (nog) niet in Shopify staat: wat wel/niet mag, het
 * merchandising-label en de tijdelijke afbeeldingen. Heeft een product in
 * Shopify eigen afbeeldingen, dan gaan die voor.
 *
 * `allowed`/`notAllowed` zijn CONCEPTTEKSTEN — laten controleren.
 */

export type CatalogEntry = {
  imageFile: string;
  badge?: string;
  wasteGuide: WasteGuide;
};

export const catalog: Record<string, CatalogEntry> = {
  "bouw-en-sloopafval-container": {
    imageFile: "afval-bouw-en-sloopafval.webp",
    badge: "Meest gekozen",
    wasteGuide: {
      allowed: ["Hout, kunststof en metaal", "Gips en gipsplaten", "Isolatiemateriaal en glaswol", "Deuren, kozijnen en keukenkastjes", "Sanitair en tegels (in kleine hoeveelheden)", "Vloerbedekking en laminaat"],
      notAllowed: ["Geen asbest of chemisch afval", "Geen verf, kit of oplosmiddelen", "Geen autobanden", "Geen elektrische apparaten"],
    },
  },
  "grofvuil-container": {
    imageFile: "afval-grofvuil.webp",
    wasteGuide: {
      allowed: ["Meubels en matrassen", "Vloerbedekking en huisraad", "Banken, kasten en bedden", "Speelgoed en tuinmeubelen", "Kleding en textiel", "Kunststof en hout uit huis"],
      notAllowed: ["Geen puin, grond of elektra", "Geen koelkasten of wasmachines", "Geen verf of chemisch afval", "Geen asbest"],
    },
  },
  "puinafval-container": {
    imageFile: "afval-puinafval.webp",
    wasteGuide: {
      allowed: ["Stenen, beton en tegels", "Klinkers en dakpannen", "Metselwerk en baksteen", "Natuursteen en grind"],
      notAllowed: ["Geen gips, hout of grond", "Geen gasbeton (Ytong) of cellenbeton", "Geen kunststof of isolatie", "Geen asbest"],
    },
  },
  "groenafval-container": {
    imageFile: "afval-groenafval.webp",
    badge: "Voor tuinafval",
    wasteGuide: {
      allowed: ["Takken, bladeren en gras", "Snoei- en heggenafval", "Struiken en planten", "Fruit- en bloemresten uit de tuin"],
      notAllowed: ["Geen grond of stenen", "Geen boomstronken of wortels", "Geen bielzen of behandeld hout", "Geen kunststof (zoals plantenpotten)"],
    },
  },
  "houtafval-a-container": {
    imageFile: "afval-houtafval-a.webp",
    badge: "Voordeligste keuze",
    wasteGuide: {
      allowed: ["Onbehandeld hout en pallets", "Balken en planken", "Kisten en kratten", "Massief houten meubels zonder verf"],
      notAllowed: ["Geen geverfd of geïmpregneerd hout", "Geen spaanplaat of MDF", "Geen hout met glas of kunststof", "Geen bielzen"],
    },
  },
  "schone-grond-container": {
    imageFile: "afval-schone-grond.webp",
    wasteGuide: {
      allowed: ["Zand en aarde", "Zonder bijmenging", "Tuingrond zonder wortels"],
      notAllowed: ["Geen puin, wortels of groen", "Geen vervuilde grond", "Geen klei met puin", "Geen kunststof of afval"],
    },
  },
  "houtafval-c-container": {
    imageFile: "afval-houtafval-c.webp",
    wasteGuide: {
      allowed: ["Geïmpregneerd en geverfd hout", "Schuttingen en tuinhout", "Spaanplaat, MDF en multiplex", "Kozijnen zonder glas"],
      notAllowed: ["Geen ander afval", "Geen bielzen (spoorbiels)", "Geen hout met glas", "Geen asbest"],
    },
  },
  "gemengd-groenafval-container": {
    imageFile: "afval-gemengd-groenafval.webp",
    wasteGuide: {
      allowed: ["Groen met wortels en stronken", "Tuinafval met wat grond", "Takken en snoeiafval", "Graszoden"],
      notAllowed: ["Geen puin of bouwafval", "Geen kunststof of afval", "Geen behandeld hout", "Geen chemisch afval"],
    },
  },
  "gemengde-grond-container": {
    imageFile: "afval-gemengde-grond.webp",
    wasteGuide: {
      allowed: ["Grond met stenen of puin", "Grond met wortels", "Zand met grind"],
      notAllowed: ["Geen vervuilde grond", "Geen bouwafval met hout of kunststof", "Geen asbest", "Geen chemisch afval"],
    },
  },
  "dakafval-container": {
    imageFile: "afval-dakafval.webp",
    wasteGuide: {
      allowed: ["Dakleer en bitumen", "Dakgrind en isolatie", "Dakbeschot en panlatten", "Dakgoten (zink/kunststof)"],
      notAllowed: ["Geen asbesthoudend materiaal", "Geen teerhoudend dakafval", "Geen chemisch afval", "Geen ander bouwafval"],
    },
  },
};

const filledContainer: ProductImage = {
  url: "/images/temp/container-gevuld.webp",
  altText: "Gevulde blauwe Bakkievol-container op een oprit",
  width: 973,
  height: 628,
};

/** Tijdelijke afbeelding van de afvalsoort (uitgesneden van de oude site). */
export function catalogImage(handle: string, title: string): ProductImage | null {
  const entry = catalog[handle];
  if (!entry) return null;
  return { url: `/images/temp/${entry.imageFile}`, altText: title, width: 548, height: 330 };
}

/** Productpagina: eerst de gevulde container, dan de afvalsoort. */
export function catalogImages(handle: string, title: string): ProductImage[] {
  const image = catalogImage(handle, title);
  return image ? [filledContainer, image] : [];
}
