import type { Metadata } from "next";

import { FinalCta } from "@/components/home/final-cta";
import { SizeGuide } from "@/components/home/size-guide";
import { PageHeader } from "@/components/layout/page-header";
import { getMinPriceByOption, getProducts } from "@/lib/commerce";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Containerformaten: 3 tot 20 m³",
  description:
    "Welk containerformaat heb je nodig? Vergelijk 3, 6, 10, 15 en 20 m³ op afmeting, aantal kruiwagens en type klus, of laat je adviseren door de keuzehulp.",
  alternates: { canonical: routes.sizes },
};

export default async function SizesPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        title="Welk containerformaat heb je nodig?"
        intro="In 1 m³ passen zo’n 8 kruiwagens. Vergelijk de formaten op schaal naast een persoon van 1,80 m, of kies je klus en krijg direct advies."
        breadcrumbs={[{ label: "Formaten" }]}
      />
      <SizeGuide minPrices={getMinPriceByOption(products, "Formaat")} showHeading={false} />
      <FinalCta tone="warm" />
    </>
  );
}
