import type { CSSProperties } from "react";

import { RevealText, segmentsToText, type RevealSegment } from "@/components/motion/reveal-text";
import { OrderConfigurator, type ConfiguratorProduct } from "@/components/order/order-configurator";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Stars } from "@/components/ui/stars";
import { containerSizes, heroProofPoints, includedInPrice, rating } from "@/content/home";
import { formatMoney, type Product } from "@/lib/commerce";

const heroTitle: RevealSegment[] = [
  "Container huren?",
  { br: true },
  { text: "Morgen", className: "text-accent-500" },
  " voor de deur.",
];

function toConfiguratorProduct(product: Product): ConfiguratorProduct {
  return {
    handle: product.handle,
    title: product.title,
    image: product.featuredImage?.url ?? null,
    fromPrice: formatMoney(product.priceRange.minVariantPrice, { compact: true }),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      size: variant.selectedOptions.find((o) => o.name === "Formaat")?.value ?? variant.title,
      price: formatMoney(variant.price, { compact: true }),
      available: variant.availableForSale,
    })),
  };
}

/**
 * Hero: navy band met belofte en vertrouwenspunten, en een bestelwidget
 * waarvan de onderkant bewust uitsteekt in het witte vlak eronder.
 */
export function Hero({
  products,
  quickPicks,
}: {
  products: Product[];
  quickPicks: Product[];
}) {
  // Het navy vlak bestaat uit twee lagen (links: tot onder de tekst, rechts:
  // tot ~70% van de widget). Samen vormen ze één band waarvan de onderrand
  // altijd onder de tekst ligt én de widget altijd duidelijk laat uitsteken.
  // De linkerlaag draagt een zeer vage foto (.hero-band) en ligt bovenop.
  const band =
    "before:absolute before:-inset-x-[100vw] before:-z-10 before:content-[''] hero-band";

  const lowestPrice = formatMoney(
    products
      .map((product) => product.priceRange.minVariantPrice)
      .reduce((min, price) => (Number(price.amount) < Number(min.amount) ? price : min)),
    { compact: true },
  );

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-x-clip bg-white pb-8 lg:pb-12"
    >
      <Container className="grid grid-cols-[minmax(0,1fr)] items-start gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
        <div
          className={`relative pt-10 pb-24 text-white sm:pt-14 lg:pt-20 lg:pb-20 ${band} before:top-0 before:bottom-0`}
          style={{ "--hero-photo": "url(/images/hero/hero-groenafval.webp)" } as CSSProperties}
        >
          <div>
            <a
              href="#ervaringen"
              data-reveal="up"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pr-3 pl-2 text-sm text-navy-100 ring-1 ring-white/10 transition-colors hover:bg-white/15"
            >
              <span className="rounded-full bg-accent-600 px-2 py-0.5 text-xs font-bold text-white">
                {rating.score}
              </span>
              <Stars className="size-3.5" />
              <span>
                {rating.count}
                <span className="hidden sm:inline"> tevreden</span> klanten
              </span>
            </a>

            <h1
              id="hero-title"
              data-reveal="text"
              aria-label={segmentsToText(heroTitle)}
              className="mt-7 font-display text-[2.6rem] leading-[0.98] font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-[3.2rem] xl:text-[3.75rem]"
            >
              <RevealText segments={heroTitle} by="word" delay={0} step={70} lineOffset={110} />
            </h1>
            <p
              data-reveal="up"
              style={{ "--d": "350ms" } as CSSProperties}
              className="mt-6 max-w-md text-lg leading-relaxed text-pretty text-navy-100">
              Kies je afvalsoort en formaat, en zie direct je all-in prijs. Wij
              brengen, halen op en verwerken.
            </p>

            <ul
              data-reveal="stagger"
              style={{ "--d": "450ms" } as CSSProperties}
              className="mt-9 space-y-3"
            >
              {heroProofPoints.map((point) => (
                <li key={point} className="flex items-center gap-3 text-[15px] font-medium text-white">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-600">
                    <Icon name="check" className="size-3.5 text-white" strokeWidth={3} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="relative -mt-14 lg:mt-14 lg:before:absolute lg:before:-inset-x-[100vw] lg:before:-top-14 lg:before:bottom-[30%] lg:before:-z-20 lg:before:bg-navy-900 lg:before:content-['']"
        >
          <div data-reveal="up" style={{ "--d": "150ms" } as CSSProperties}>
          <OrderConfigurator
            products={products.map(toConfiguratorProduct)}
            quickPickHandles={quickPicks.map((p) => p.handle)}
            sizes={containerSizes}
            included={includedInPrice}
            fromPrice={lowestPrice}
          />
          </div>
        </div>
      </Container>
    </section>
  );
}
