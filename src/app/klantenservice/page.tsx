import type { Metadata } from "next";

import { Faq } from "@/components/home/faq";
import { PageHeader } from "@/components/layout/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Klantenservice en veelgestelde vragen",
  description: `Vragen over bestellen, levering, formaten of afvalsoorten? Bel ${siteConfig.contact.phone} of bekijk de veelgestelde vragen.`,
  alternates: { canonical: routes.support },
};

export default function SupportPage() {
  return (
    <>
      <PageHeader
        title="We helpen je snel verder"
        intro={`Vragen over bestellen, levering, formaten of afvalsoorten? We zijn bereikbaar ${siteConfig.contact.hours.toLowerCase()}.`}
        breadcrumbs={[{ label: "Klantenservice" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={siteConfig.contact.phoneHref} className={buttonStyles({ size: "lg" })}>
            <Icon name="phone" className="size-5" />
            Bel {siteConfig.contact.phone}
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className={buttonStyles({ variant: "outline-light", size: "lg" })}
          >
            <Icon name="mail" className="size-5" />
            {siteConfig.contact.email}
          </a>
        </div>
      </PageHeader>
      <Faq />
    </>
  );
}
