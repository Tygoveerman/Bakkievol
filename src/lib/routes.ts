/**
 * Alle interne routes op één plek. Gebruik deze helpers in plaats van
 * losse strings, zodat een URL-wijziging maar op één plek hoeft.
 */
export const routes = {
  home: "/",
  /** De bestelwidget in de hero van de homepage. */
  order: "/#bestellen",
  containers: "/containers",
  container: (handle: string) => `/containers/${handle}`,
  sizes: "/formaten",
  sizeHelper: "/formaten#formaatkeuzehulp",
  howItWorks: "/hoe-het-werkt",
  support: "/klantenservice",
  faq: "/klantenservice#veelgestelde-vragen",
  cart: "/winkelwagen",
} as const;
