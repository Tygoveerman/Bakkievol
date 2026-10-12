import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { steps as defaultSteps } from "@/content/home";
import { routes } from "@/lib/routes";

export function HowItWorks({
  moreLink = false,
  steps = defaultSteps,
  title = "In vier stappen geregeld",
  intro = "Van bestellen tot ophalen: jij vult, wij doen de rest.",
  ctaLabel = "Start met kiezen",
  ctaHref = routes.order,
}: {
  moreLink?: boolean;
  steps?: { icon: IconName; title: string; text: string }[];
  title?: string;
  intro?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section
      id="hoe-het-werkt"
      aria-labelledby="hoe-het-werkt-title"
      className="scroll-mt-20 py-16 lg:py-24"
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading
            id="hoe-het-werkt-title"
            eyebrow="Hoe het werkt"
            title={title}
            intro={intro}
          />
          <div data-reveal="up" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={ctaHref} size="lg">
              {ctaLabel}
              <Icon name="arrow-right" className="size-5" />
            </ButtonLink>
            {moreLink && (
              <Link
                href={routes.howItWorks}
                className="inline-flex items-center gap-1 font-semibold text-navy-900 underline-offset-4 hover:underline"
              >
                Meer over hoe het werkt
                <Icon name="arrow-right" className="size-4" />
              </Link>
            )}
          </div>
        </div>

        <ol data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {steps.map((step, index) => (
            <li key={step.title} className="relative rounded-2xl bg-navy-50 p-6">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-full bg-accent-600 font-display text-lg font-extrabold text-white shadow-cta">
                  {index + 1}
                </span>
                <Icon name={step.icon} className="size-7 text-accent-500" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.015em] text-navy-900">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-navy-500">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
