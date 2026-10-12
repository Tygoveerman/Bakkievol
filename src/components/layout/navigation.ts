import { routes } from "@/lib/routes";

/** Hoofdnavigatie: echte pagina's (geen onepager-ankers). */
export const mainNavigation = [
  { href: routes.containers, label: "Containers" },
  { href: routes.sizes, label: "Formaten" },
  { href: routes.howItWorks, label: "Hoe het werkt" },
  { href: routes.support, label: "Klantenservice" },
];
