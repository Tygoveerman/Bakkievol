/**
 * Marketingcontent voor de homepage.
 *
 * Bewust gescheiden van de commerce-laag: dit is redactionele content, geen
 * product- of prijsdata. Prijzen komen altijd uit "@/lib/commerce".
 *
 * LET OP — vóór livegang controleren:
 * - `rating` en `reviews` zijn VOORBEELDEN. Vervangen door echte,
 *   verifieerbare reviews met bron (bijv. Google of Kiyoh).
 * - Claims (iDEAL, levertijden, vergunning) laten bevestigen door Bakkievol.
 * - Afmetingen per formaat zijn indicatief.
 */

import type { IconName } from "@/components/ui/icon";

export const rating = {
  score: "4,8",
  outOf: "5",
  count: "1.000+",
};

/** Kort, direct onder de hero. Alleen claims die Bakkievol waarmaakt. */
export const trustItems: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "truck",
    title: "Snelle levering",
    text: "Voor 11:00 besteld, vaak vandaag nog",
  },
  {
    icon: "euro",
    title: "Transparante all-in prijs",
    text: "Geen verborgen kosten achteraf",
  },
  {
    icon: "star",
    title: `${rating.score}/${rating.outOf} klantbeoordeling`,
    text: `${rating.count} tevreden klanten`,
  },
  {
    icon: "phone",
    title: "Persoonlijk advies",
    text: "Ma – za van 07:00 tot 20:00",
  },
];

/** Drie bewijsregels in de hero (geen herhaling van de reviewscore erboven). */
export const heroProofPoints = [
  "Morgen geleverd mogelijk",
  "All-in prijzen: brengen, ophalen, verwerking en btw",
  "Persoonlijk advies van ma t/m za",
];

/** Wat er in de all-in prijs zit — getoond naast de bestelknop. */
export const includedInPrice = [
  "Inclusief brengen en ophalen",
  "Verwerking van je afval",
  "Tot 6 weken huur",
  "Inclusief btw",
];

export type ContainerSize = {
  value: string;
  label: string;
  wheelbarrows: number;
  suitedFor: string;
  /** Indicatieve buitenmaten in meters, voor de visuele vergelijking. */
  lengthM: number;
  heightM: number;
  /** Vrijstaande foto van precies dit formaat (portaal- of afzetcontainer). */
  image: { src: string; width: number; height: number };
  popular?: boolean;
};

export const containerSizes: ContainerSize[] = [
  {
    value: "3 m³",
    label: "Kleine klus",
    wheelbarrows: 25,
    suitedFor: "Badkamer slopen, kleine opruiming of tuinklus",
    lengthM: 3,
    heightM: 0.9,
    image: { src: "/images/containers/3m3.webp", width: 1000, height: 509 },
  },
  {
    value: "6 m³",
    label: "Gemiddelde verbouwing",
    wheelbarrows: 50,
    suitedFor: "Keuken vervangen, zolder of schuur leegmaken",
    lengthM: 3.6,
    heightM: 1.25,
    image: { src: "/images/containers/6m3.webp", width: 1000, height: 400 },
    popular: true,
  },
  {
    value: "10 m³",
    label: "Grote renovatie",
    wheelbarrows: 80,
    suitedFor: "Meerdere ruimtes tegelijk of een flinke tuinklus",
    lengthM: 4.2,
    heightM: 1.5,
    image: { src: "/images/containers/10m3.webp", width: 1000, height: 409 },
  },
  {
    value: "15 m³",
    label: "Extra groot",
    wheelbarrows: 120,
    suitedFor: "Woning ontruimen of grootschalige werkzaamheden",
    lengthM: 5.5,
    heightM: 1.55,
    image: { src: "/images/containers/15m3.webp", width: 1000, height: 289 },
  },
  {
    value: "20 m³",
    label: "Zeer groot",
    wheelbarrows: 160,
    suitedFor: "Complete verbouwing of grote projecten",
    lengthM: 6,
    heightM: 1.8,
    image: { src: "/images/containers/20m3.webp", width: 1000, height: 297 },
  },
];

/** Formaatkeuzehulp: klus → aanbevolen formaat. */
export const sizeHelperJobs: { label: string; size: string; note: string }[] = [
  { label: "Badkamer slopen", size: "3 m³", note: "Tegels, sanitair en wat leidingwerk passen ruim in 3 m³." },
  { label: "Keuken vervangen", size: "6 m³", note: "Kasten, blad en tegelwerk nemen meer ruimte in dan je denkt." },
  { label: "Zolder of schuur leegmaken", size: "6 m³", note: "Huisraad is luchtig en volumineus — 6 m³ is meestal genoeg." },
  { label: "Tuin opknappen", size: "6 m³", note: "Snoeiafval en struiken zijn volumineus. Veel grond? Kies daarvoor een aparte 3 m³." },
  { label: "Meerdere ruimtes verbouwen", size: "10 m³", note: "Bij een renovatie van meerdere ruimtes voorkom je hiermee een tweede container." },
  { label: "Woning ontruimen", size: "15 m³", note: "Een complete woning ontruimen vraagt om een grote container." },
];

export const steps: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "recycle",
    title: "Kies je afvalsoort",
    text: "Zo weet je zeker dat je afval goed en zonder extra kosten wordt verwerkt.",
  },
  {
    icon: "box",
    title: "Kies het formaat",
    text: "Je ziet direct de all-in prijs per formaat. Twijfel je? Kies één maat groter.",
  },
  {
    icon: "truck",
    title: "Wij leveren",
    text: "Voor 11:00 besteld is vaak dezelfde dag geleverd, of kies zelf je datum.",
  },
  {
    icon: "calendar",
    title: "Wij halen op",
    text: "Klaar? Laat het weten en we halen de container op. Tot 6 weken huur inbegrepen.",
  },
];

export type ContentPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** true = tijdelijke foto; toont een zichtbaar label tot hij vervangen is. */
  placeholder: boolean;
};

/**
 * "Waarom Bakkievol". CONCEPT — laat de claims bevestigen en vervang de
 * foto's door ECHTE foto's (bijv. in /public/images/echt/) en zet
 * `placeholder` dan op false.
 */
export const whyBakkievol: {
  title: string;
  intro: string;
  photo: ContentPhoto;
  secondaryPhoto: ContentPhoto;
  photoCaption: string;
  reasons: { icon: IconName; title: string; text: string }[];
} = {
  title: "Een lokaal bedrijf, geen tussenpersoon",
  intro:
    "Bij Bakkievol bestel je direct bij de mensen die je container brengen en ophalen. Korte lijnen, duidelijke afspraken.",
  photo: {
    src: "/images/temp/container-gevuld.webp",
    alt: "Bakkievol-container geplaatst op een oprit",
    width: 973,
    height: 628,
    placeholder: true,
  },
  secondaryPhoto: {
    src: "/images/temp/afval-bouw-en-sloopafval.webp",
    alt: "Bouw- en sloopafval klaar om af te voeren",
    width: 548,
    height: 330,
    placeholder: true,
  },
  photoCaption: "Elke week tientallen containers in heel Noord-Holland",
  reasons: [
    {
      icon: "truck",
      title: "Eigen wagens en chauffeurs",
      text: "Wij brengen en halen zelf. Geen onderaannemers, wel vaste gezichten.",
    },
    {
      icon: "map-pin",
      title: "Lokaal in Noord-Holland",
      text: "We kennen de regio, dus snel geleverd en netjes geplaatst.",
    },
    {
      icon: "euro",
      title: "Wat je ziet is wat je betaalt",
      text: "Eén all-in prijs, vooraf duidelijk. Geen verrassingen op de factuur.",
    },
    {
      icon: "phone",
      title: "Echt persoonlijk contact",
      text: "Bel of mail en je spreekt direct iemand die je klus begrijpt.",
    },
  ],
};

/** VOORBEELDEN — vervangen door echte reviews met bron. */
export const reviews: {
  name: string;
  place: string;
  product: string;
  quote: string;
}[] = [
  {
    name: "Sanne",
    place: "Alkmaar",
    product: "6 m³ bouw- en sloopafval",
    quote:
      "Gisteren besteld en vandaag stond de container al op de oprit. De prijs was precies wat er op de site stond.",
  },
  {
    name: "Mark",
    place: "Hoorn",
    product: "10 m³ grofvuil",
    quote: "Duidelijke prijs, snel geleverd en netjes opgehaald.",
  },
  {
    name: "Fatima",
    place: "Zaandam",
    product: "3 m³ groenafval",
    quote:
      "Twijfelde over het formaat, even gebeld en direct goed advies gekregen.",
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Hoe snel kan mijn container geleverd worden?",
    answer:
      "Bestel je voor 11:00, dan leveren we in Noord-Holland vaak dezelfde dag. Anders meestal de volgende werkdag. Je kunt bij het bestellen ook zelf een leverdatum kiezen.",
  },
  {
    question: "Wat zit er in de all-in prijs?",
    answer:
      "Brengen en ophalen, de verwerking van je afval, tot 6 weken huur en btw. Je betaalt dus nooit onverwachte toeslagen achteraf.",
  },
  {
    question: "Welk formaat container heb ik nodig?",
    answer:
      "Als vuistregel past er in 1 m³ ongeveer 8 kruiwagens. Een 3 m³ container is geschikt voor een badkamer, 6 m³ voor een keuken of zolder. Twijfel je, kies dan één formaat groter of gebruik de formaatkeuzehulp.",
  },
  {
    question: "Heb ik een vergunning nodig?",
    answer:
      "Staat de container op eigen terrein, zoals je oprit, dan is een vergunning meestal niet nodig. Op de openbare weg heb je vaak wel toestemming van de gemeente nodig.",
  },
  {
    question: "Wat mag er niet in de container?",
    answer:
      "Gevaarlijk afval zoals asbest, chemisch afval (verf, olie, accu’s) en elektrische apparaten mag nooit in de container. Per afvalsoort zie je precies wat wel en niet is toegestaan.",
  },
  {
    question: "Hoe lang mag ik de container houden?",
    answer:
      "Tot 6 weken huur is inbegrepen in de prijs. Ben je eerder klaar? Laat het ons weten, dan halen we hem op.",
  },
];
