import { ChooseSizeButton } from "@/components/order/choose-size-button";
import { SizeHelper } from "@/components/order/size-helper";
import { SizeVisual } from "@/components/order/size-visual";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { containerSizes, sizeHelperJobs } from "@/content/home";
import { formatMoney, type Money } from "@/lib/commerce";
import { routes } from "@/lib/routes";

export function SizeGuide({
  minPrices,
  showHeading = true,
  showHelper = true,
}: {
  minPrices: Map<string, Money>;
  showHeading?: boolean;
  /** false op de homepage: daar linken we naar de keuzehulp op /formaten. */
  showHelper?: boolean;
}) {
  const prices = Object.fromEntries(
    [...minPrices].map(([size, money]) => [size, formatMoney(money, { compact: true })]),
  );

  return (
    <section
      id="formaten"
      aria-labelledby={showHeading ? "formaten-title" : undefined}
      aria-label={showHeading ? undefined : "Containerformaten"}
      className={`scroll-mt-20 bg-accent-50 ${showHeading ? "py-16 lg:py-24" : "pt-10 pb-16 lg:pt-14 lg:pb-24"}`}
    >
      <Container>
        {showHeading && (
        <SectionHeading
            id="formaten-title"
            eyebrow="Containerformaten"
            title="Welk formaat heb je nodig?"
            intro="In 1 m³ passen zo’n 8 kruiwagens. Vergelijk de formaten op schaal naast een persoon van 1,80 m, met de lengte in meters."
          />
        )}

        <ul data-reveal="stagger" className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:gap-4 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {containerSizes.map((size) => (
            <li key={size.value} className="w-[78%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-auto">
              <article
                className={`group relative flex h-full flex-col rounded-2xl bg-white p-5 transition-shadow hover:shadow-card-hover ${
                  size.popular ? "shadow-card ring-2 ring-accent-600" : "ring-1 ring-accent-100"
                }`}
              >
                {size.popular && (
                  <span className="absolute -top-3 left-5 rounded-full bg-accent-600 px-3 py-1 text-xs font-bold text-white shadow-cta">
                    Meest gekozen
                  </span>
                )}
                <div className="-mx-1 rounded-xl bg-navy-50 px-2 pt-3 pb-1">
                  <SizeVisual lengthM={size.lengthM} heightM={size.heightM} className="h-auto w-full" />
                </div>
                <p className="mt-2 flex justify-between text-xs font-semibold text-navy-700">
                  <span>↔ {size.lengthM.toLocaleString("nl-NL", { minimumFractionDigits: 1 })} m lang</span>
                  <span>↕ {size.heightM.toLocaleString("nl-NL", { minimumFractionDigits: 1 })} m hoog</span>
                </p>
                <h3 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-navy-900">
                  {size.value}
                </h3>
                <p className="mt-1 text-sm font-semibold text-navy-700">{size.label}</p>
                <p className="text-sm text-navy-500">± {size.wheelbarrows} kruiwagens</p>
                <p className="mt-3 mb-5 text-sm leading-relaxed text-navy-500">{size.suitedFor}</p>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-2 border-t border-navy-100 pt-4">
                  <p className="leading-tight">
                    <span className="block text-xs text-navy-500">vanaf</span>
                    <span className="font-display text-lg font-bold text-navy-900">
                      {prices[size.value] ?? "Op aanvraag"}
                    </span>
                  </p>
                  <ChooseSizeButton size={size.value} stretched />
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-navy-500">Afmetingen zijn indicatief.</p>

        {showHelper ? (
        <div
            id="formaatkeuzehulp"
            data-reveal="up"
            className="mt-12 scroll-mt-24 rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-8"
          >
            <div className="mb-6 max-w-2xl">
              <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-navy-900 sm:text-3xl">
                Geen idee welk formaat je nodig hebt?
              </h3>
              <p className="mt-2 text-navy-500">
                Kies je klus en we adviseren direct het juiste formaat.
              </p>
            </div>
            <SizeHelper jobs={sizeHelperJobs} sizes={containerSizes} prices={prices} />
          </div>
        ) : (
          <div data-reveal="up" className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-white p-6 shadow-card ring-1 ring-navy-100 sm:flex-row sm:items-center sm:p-8">
            <div>
              <p className="font-display text-xl font-bold text-navy-900">
                Geen idee welk formaat je nodig hebt?
              </p>
              <p className="mt-1 text-navy-500">Kies je klus en we adviseren direct het juiste formaat.</p>
            </div>
            <ButtonLink href={routes.sizeHelper} variant="outline" className="shrink-0">
              Help mij kiezen
              <Icon name="arrow-right" className="size-4" />
            </ButtonLink>
          </div>
        )}
      </Container>
    </section>
  );
}
