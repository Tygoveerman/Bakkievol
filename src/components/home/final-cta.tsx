import Image from "next/image";

import { RevealText } from "@/components/motion/reveal-text";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { includedInPrice } from "@/content/home";
import { formatMoney, getProducts } from "@/lib/commerce";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

/**
 * Slot-CTA: witte kaart die half over de (navy) footer valt, zodat de pagina
 * zonder losse witte strook in de footer overgaat. Altijd als laatste sectie
 * vóór de footer gebruiken. `tone` = achtergrond van de sectie erboven, zodat
 * die kleur naadloos doorloopt tot achter de kaart.
 */
const tones = {
  white: "bg-[linear-gradient(to_bottom,#ffffff_55%,var(--color-navy-950)_55%)]",
  warm: "bg-[linear-gradient(to_bottom,var(--color-accent-50)_55%,var(--color-navy-950)_55%)]",
} as const;

export async function FinalCta({
  tone = "white",
  title = "Binnen 1 minuut weet je wat je container kost",
  eyebrow = "Bakkie vol?",
  ctaLabel = "Stel je container samen",
  ctaHref = routes.order,
}: {
  tone?: keyof typeof tones;
  title?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const products = await getProducts();
  const lowest = products
    .map((product) => product.priceRange.minVariantPrice)
    .reduce((min, price) => (Number(price.amount) < Number(min.amount) ? price : min));

  return (
    <section
      aria-labelledby="cta-title"
      className={`${tones[tone]} ${tone === "white" ? "pt-8 lg:pt-12" : "pt-0"}`}
    >
      <Container>
        <div data-reveal="up" className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-white p-6 shadow-float ring-1 ring-navy-100 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:p-14">
          <div>
            <p className="inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] text-accent-700 uppercase">
              <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-accent-500" />
              {eyebrow}
            </p>
            <h2
              id="cta-title"
              data-reveal="text"
              aria-label={title}
              className="mt-3 font-display text-3xl leading-[1.05] font-extrabold tracking-[-0.03em] text-balance text-navy-900 sm:text-[2.75rem]"
            >
              <RevealText segments={[title]} delay={80} />
            </h2>
            <ul className="mt-6 grid gap-2.5 text-[15px] text-navy-700 sm:grid-cols-2">
              {includedInPrice.slice(0, 4).map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-600">
                    <Icon name="check" className="size-3.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={ctaHref} size="lg">
                {ctaLabel}
                <Icon name="arrow-right" className="size-5" />
              </ButtonLink>
              <a href={siteConfig.contact.phoneHref} className={buttonStyles({ variant: "outline", size: "lg" })}>
                <Icon name="phone" className="size-5" />
                {siteConfig.contact.phone}
              </a>
            </div>
          </div>

          <div className="relative hidden rounded-3xl bg-gradient-to-b from-navy-50 to-white px-8 pt-10 pb-8 sm:block">
            <p className="absolute top-6 right-6 z-10 rounded-2xl bg-white px-4 py-2.5 text-right leading-none shadow-card">
              <span className="block text-xs text-navy-500">vanaf</span>
              <span className="mt-1 block font-display text-2xl font-extrabold tracking-[-0.03em] text-navy-900">
                {formatMoney(lowest, { compact: true })}
              </span>
              <span className="mt-1 block text-[11px] font-medium text-navy-500">all-in · incl. btw</span>
            </p>
            <div className="relative mt-16 flex items-end justify-center">
              <span aria-hidden="true" className="absolute bottom-0 h-5 w-3/4 rounded-[50%] bg-navy-900/20 blur-md" />
              <Image
                src="/images/temp/container-cutout.png"
                alt="Blauwe Bakkievol-afvalcontainer"
                width={637}
                height={249}
                sizes="(min-width: 1024px) 420px, 60vw"
                className="relative w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
