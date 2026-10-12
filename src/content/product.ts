/**
 * Redactionele content voor productpagina's (per categorie / productType).
 * CONCEPT — laat antwoorden over gewicht, verkeerd afval en vergunningen
 * controleren door Bakkievol. Later kan dit per product uit Shopify
 * (metafields) komen.
 */

import type { IconName } from "@/components/ui/icon";

export type Faq = { question: string; answer: string };

const shared: Faq[] = [
  {
    question: "Wat gebeurt er als er verkeerd afval in de container zit?",
    answer:
      "Dan moet het afval apart worden gesorteerd en verwerkt. Daarvoor kunnen extra kosten in rekening worden gebracht. Twijfel je? Bel ons vooraf, dan denken we mee.",
  },
  {
    question: "Kan de container op mijn oprit staan?",
    answer:
      "Ja, op eigen terrein heb je meestal geen vergunning nodig. Zorg voor een vrije, verharde ondergrond en voldoende ruimte voor de vrachtwagen. Op de openbare weg heb je toestemming van de gemeente nodig.",
  },
  {
    question: "Hoe regel ik het ophalen?",
    answer:
      "Bel of mail ons wanneer je klaar bent. We halen de container dan zo snel mogelijk op. Tot 6 weken huur is inbegrepen.",
  },
];

export const faqsByCategory: Record<string, Faq[]> = {
  Opruimen: [
    {
      question: "Mag er een matras of bankstel in een grofvuilcontainer?",
      answer: "Ja, meubels zoals matrassen, banken, kasten en bedden mogen in een grofvuilcontainer.",
    },
    {
      question: "Mag ik elektrische apparaten weggooien?",
      answer:
        "Nee. Koelkasten, wasmachines en andere elektrische apparaten horen niet in de container. Lever die in bij de milieustraat of de winkel waar je een nieuw apparaat koopt.",
    },
    ...shared,
  ],
  Verbouwen: [
    {
      question: "Mag puin in een container voor bouw- en sloopafval?",
      answer:
        "Een kleine hoeveelheid puin mag meestal mee. Heb je vooral stenen, beton of tegels? Kies dan een puincontainer, die is voordeliger.",
    },
    {
      question: "Hoe zwaar mag de container worden?",
      answer:
        "Vul de container niet boven de rand en houd rekening met zwaar materiaal zoals puin en grond. Bij twijfel adviseren we je graag over het juiste formaat.",
    },
    ...shared,
  ],
  "Tuin & grond": [
    {
      question: "Mogen boomstronken en wortels in een groenafvalcontainer?",
      answer:
        "Nee, daarvoor kies je een container voor gemengd groenafval. In een gewone groenafvalcontainer horen alleen takken, bladeren, gras en snoeiafval.",
    },
    {
      question: "Waarom is een grondcontainer kleiner?",
      answer:
        "Grond is erg zwaar. Daarom zijn grondcontainers er in kleinere formaten: zo blijft de container veilig te vervoeren.",
    },
    ...shared,
  ],
  Hout: [
    {
      question: "Wat is het verschil tussen A-hout en C-hout?",
      answer:
        "A-hout is schoon, onbehandeld hout zoals pallets en planken. C-hout is geverfd of geïmpregneerd hout, zoals schuttingen en tuinhout. Gescheiden aanleveren is voordeliger.",
    },
    {
      question: "Mag spaanplaat of MDF bij A-hout?",
      answer: "Nee, spaanplaat, MDF en multiplex horen bij C-hout (of B-hout).",
    },
    ...shared,
  ],
};

/** Stappen op de productpagina: de afvalsoort is al gekozen. */
export const productSteps: { icon: IconName; title: string; text: string }[] = [
  { icon: "box", title: "Kies je formaat", text: "Selecteer de container die bij jouw klus past en zie direct de all-in prijs." },
  { icon: "calendar", title: "Kies je leverdatum", text: "Geef aan waar en wanneer je de container nodig hebt: zo snel mogelijk of op een gekozen datum." },
  { icon: "truck", title: "Wij plaatsen de container", text: "We bezorgen hem op de afgesproken plek, ook op een krappe oprit." },
  { icon: "recycle", title: "Klaar? Wij halen hem op", text: "Laat het weten en we halen op en verwerken je afval. Tot 6 weken huur inbegrepen." },
];

/** Prijsopbouw op de productpagina. */
export const productIncluded = [
  "Bezorgen & ophalen",
  "Afvalverwerking",
  "Tot 6 weken huur",
  "Inclusief btw",
];

/**
 * Vergelijking Bakkievol vs. een andere containerverhuurder.
 * CONCEPT — laat elke regel bevestigen door Bakkievol. Vergelijkende
 * reclame moet objectief en controleerbaar zijn: noem geen concurrent bij
 * naam en houd de "anderen"-kolom algemeen ("vaak", "soms").
 */
export const comparison: { topic: string; us: string; others: string }[] = [
  {
    topic: "Prijs",
    us: "All-in: brengen, ophalen, verwerking en btw",
    others: "Vaak extra transport- of milieutoeslag",
  },
  {
    topic: "Levering",
    us: "Voor 11:00 besteld, vandaag geleverd",
    others: "Vaak pas na een paar werkdagen",
  },
  {
    topic: "Huurtermijn",
    us: "Tot 6 weken inbegrepen",
    others: "Soms 1–2 weken, daarna huur per dag",
  },
  {
    topic: "Contact",
    us: "Persoonlijk advies, ma – za 07:00 – 20:00",
    others: "Vaak alleen op kantoortijden",
  },
  {
    topic: "Bestellen",
    us: "In 2 minuten, zonder account",
    others: "Soms offerte aanvragen of account nodig",
  },
];
