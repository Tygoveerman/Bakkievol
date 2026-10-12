import type { Metadata } from "next";

import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyBakkievol } from "@/components/home/why-bakkievol";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Hoe werkt container huren?",
  description:
    "Container huren bij Bakkievol in vier stappen: afvalsoort kiezen, formaat kiezen, wij leveren en wij halen op. All-in prijs, tot 6 weken huur.",
  alternates: { canonical: routes.howItWorks },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        title="Zo werkt container huren bij Bakkievol"
        intro="Van bestellen tot ophalen: jij kiest en vult, wij regelen de rest."
        breadcrumbs={[{ label: "Hoe het werkt" }]}
      />
      <HowItWorks />
      <WhyBakkievol />
      <Faq limit={4} />
      <FinalCta />
    </>
  );
}
