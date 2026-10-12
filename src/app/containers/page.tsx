import type { Metadata } from "next";

import { FinalCta } from "@/components/home/final-cta";
import { WasteTypes } from "@/components/home/waste-types";
import { PageHeader } from "@/components/layout/page-header";
import { getProducts } from "@/lib/commerce";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Container huren per afvalsoort",
  description:
    "Container huren voor bouw- en sloopafval, grofvuil, puin, groenafval, hout, grond of dakafval. Zie per afvalsoort wat erin mag en de all-in prijs.",
  alternates: { canonical: routes.containers },
};

export default async function ContainersPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader
        title="Container huren"
        intro="Kies je afvalsoort. Per soort zie je direct wat er wel en niet in mag, en vanaf welke all-in prijs."
        breadcrumbs={[{ label: "Containers" }]}
      />
      <WasteTypes products={products} showHeading={false} />
      <FinalCta />
    </>
  );
}
