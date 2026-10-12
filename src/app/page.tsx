import type { Metadata } from "next";

import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Reviews } from "@/components/home/reviews";
import { SizeGuide } from "@/components/home/size-guide";
import { WasteTypes } from "@/components/home/waste-types";
import { WhyBakkievol } from "@/components/home/why-bakkievol";
import {
  getFeaturedProducts,
  getMinPriceByOption,
  getProducts,
} from "@/lib/commerce";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [products, featured] = await Promise.all([
    getProducts(),
    getFeaturedProducts(6),
  ]);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
    areaServed: siteConfig.contact.area,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero products={products} quickPicks={featured} />
      <WasteTypes products={products} />
      <SizeGuide minPrices={getMinPriceByOption(products, "Formaat")} showHelper={false} />
      <HowItWorks moreLink />
      <WhyBakkievol />
      <Reviews />
      <Faq limit={4} />
      <FinalCta />
    </>
  );
}
