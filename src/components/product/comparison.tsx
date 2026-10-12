import type { CSSProperties } from "react";

import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { comparison } from "@/content/product";

/**
 * Bakkievol vs. een andere verhuurder: voor- en nadelen naast elkaar.
 *
 * Vanaf `sm` één grid met expliciete rijen, zodat de Bakkievol-kolom als
 * opgetilde kaart achter alle rijen kan liggen. Mobiel is elke rij een
 * eigen blok (onderwerp, Bakkievol, elders) in één kaart.
 */
export function Comparison() {
  return (
    <section aria-labelledby="comparison-title" className="py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            id="comparison-title"
            eyebrow="Vergelijk"
            title="Bakkievol of een andere verhuurder?"
            intro="Dezelfde container, een wereld van verschil in wat je ervoor krijgt."
          />

          <div
            data-reveal="up"
            style={{ gridTemplateRows: `repeat(${comparison.length + 1}, auto)` }}
            className="mt-10 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-100 sm:mt-14 sm:grid sm:grid-cols-[9rem_1fr_1fr] sm:overflow-visible sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0 lg:grid-cols-[11rem_1fr_1fr]"
          >
            {/* Opgetilde Bakkievol-kolom, loopt boven en onder de tabel uit. */}
            <div aria-hidden="true" className="relative hidden sm:col-start-2 sm:row-span-full sm:row-start-1 sm:block">
              <div className="absolute -inset-y-5 inset-x-0 overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-accent-200">
                <div className="h-1 bg-accent-500" />
              </div>
            </div>

            <div className="hidden sm:col-start-1 sm:row-start-1 sm:block" />
            <div className="relative hidden flex-col gap-1.5 px-6 pt-3 pb-5 sm:col-start-2 sm:row-start-1 sm:flex lg:px-8">
              <Logo />
              <span className="text-xs font-semibold text-accent-700">Alles geregeld, één prijs</span>
            </div>
            <div className="hidden flex-col justify-end px-6 pt-3 pb-5 sm:col-start-3 sm:row-start-1 sm:flex lg:px-8">
              <span className="text-base font-bold text-navy-500">Andere verhuurder</span>
            </div>

            <dl className="divide-y divide-navy-100 sm:contents">
              {comparison.map((row, index) => {
                const gridRow = index + 2;
                return (
                  <div key={row.topic} className="grid gap-2.5 px-5 py-5 sm:contents">
                    <dt
                      style={{ "--row": gridRow } as CSSProperties}
                      className="sm:[grid-row:var(--row)] text-xs font-bold tracking-[0.08em] text-navy-500 uppercase sm:col-start-1 sm:flex sm:items-center sm:border-t sm:border-navy-100 sm:py-6 sm:pr-4 sm:text-[15px] sm:tracking-normal sm:text-navy-900 sm:normal-case"
                    >
                      {row.topic}
                    </dt>
                    <dd style={{ "--row": gridRow } as CSSProperties} className="sm:[grid-row:var(--row)] relative sm:col-start-2 sm:px-6 lg:px-8">
                      <div
                        className={`flex items-start gap-3 text-[15px] leading-snug font-semibold text-navy-900 sm:h-full sm:items-center sm:py-6 ${index > 0 ? "sm:border-t sm:border-navy-100" : ""}`}
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success-600 text-white">
                          <Icon name="check" className="size-3.5" strokeWidth={3} />
                        </span>
                        <span className="pt-0.5 sm:pt-0">{row.us}</span>
                      </div>
                    </dd>
                    <dd
                      style={{ "--row": gridRow } as CSSProperties}
                      className="sm:[grid-row:var(--row)] flex items-start gap-3 text-sm leading-snug text-navy-500 sm:col-start-3 sm:items-center sm:border-t sm:border-navy-100 sm:px-6 sm:py-6 lg:px-8"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-navy-100 text-navy-500">
                        <Icon name="close" className="size-3" strokeWidth={3} />
                      </span>
                      <span className="pt-0.5 sm:pt-0">
                        <span className="font-semibold sm:hidden">Elders: </span>
                        {row.others}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
