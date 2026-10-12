import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/content/home";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export function Faq({
  limit,
  items: customItems,
  title = "Veelgestelde vragen",
  intro = "Twijfel je over formaat, afvalsoort of levering? Hier vind je de snelle antwoorden.",
}: {
  limit?: number;
  /** Eigen vragen (bijv. per afvalsoort); dan ook als FAQ-schema. */
  items?: { question: string; answer: string }[];
  title?: string;
  intro?: string;
}) {
  const items = customItems ?? (limit ? faqs.slice(0, limit) : faqs);
  const withSchema = Boolean(customItems) || !limit;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section
      id="veelgestelde-vragen"
      aria-labelledby="faq-title"
      className="scroll-mt-20 py-16 lg:py-24"
    >
      {withSchema && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      )}
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading
            id="faq-title"
            eyebrow="Klantenservice"
            title={title}
            intro={intro}
          />

          <div data-reveal="up" className="mt-8 rounded-2xl bg-accent-50 p-6 ring-1 ring-accent-100">
            <p className="font-display text-lg font-bold text-navy-900">
              Liever even persoonlijk advies?
            </p>
            <p className="mt-1 text-sm text-navy-500">
              Bereikbaar {siteConfig.contact.hours.toLowerCase()}
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <a
                href={siteConfig.contact.phoneHref}
                className="group/link flex items-center gap-3 font-semibold text-navy-900"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white transition-colors duration-200 group-hover/link:bg-navy-900 group-hover/link:text-white">
                  <Icon name="phone" className="size-4" />
                </span>
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group/link flex items-center gap-3 font-semibold text-navy-900"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-white transition-colors duration-200 group-hover/link:bg-navy-900 group-hover/link:text-white">
                  <Icon name="mail" className="size-4" />
                </span>
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
        <div data-reveal="stagger" className="divide-y divide-navy-100 border-y border-navy-100">
          {items.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="group/q flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-5 font-display text-lg font-semibold text-navy-900 focus-visible:outline-offset-4 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-900 ring-navy-200 transition-[transform,background-color,color,box-shadow] duration-300 group-open:rotate-45 group-open:bg-accent-600 group-open:text-white group-hover/q:ring-1">
                  <Icon name="plus" className="size-4" />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-navy-500">{faq.answer}</p>
            </details>
          ))}
        </div>
        {(customItems || (limit && faqs.length > limit)) && (
          <Link
            href={routes.faq}
            className="group/all mt-6 inline-flex items-center gap-1.5 font-semibold text-navy-900"
          >
            {customItems ? "Alle veelgestelde vragen" : `Alle ${faqs.length} veelgestelde vragen`}
            <Icon
              name="arrow-right"
              className="size-4 transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:group-hover/all:translate-x-0"
            />
          </Link>
        )}
        </div>
      </Container>
    </section>
  );
}
