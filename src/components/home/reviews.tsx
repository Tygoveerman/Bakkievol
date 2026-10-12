import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/ui/stars";
import { rating, reviews } from "@/content/home";

export function Reviews() {
  return (
    <section
      id="ervaringen"
      aria-labelledby="ervaringen-title"
      className="scroll-mt-20 bg-navy-900 py-16 text-white lg:py-24"
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="ervaringen-title"
            tone="dark"
            eyebrow="Ervaringen"
            title={`${rating.count} klanten gingen je voor`}
          />

          <div data-reveal="up" className="mt-8 flex items-center gap-5">
            <p className="font-display text-6xl font-extrabold tracking-[-0.04em]">
              {rating.score}
            </p>
            <div>
              <Stars className="size-5" />
              <p className="mt-1 text-sm text-navy-200">
                Gemiddeld uit {rating.count} beoordelingen
              </p>
            </div>
          </div>

        </div>

        <ul data-reveal="stagger" className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {reviews.map((review, index) => (
            <li
              key={review.name}
              className={`relative flex flex-col overflow-hidden rounded-2xl p-6 ring-1 ${index === 0 ? "bg-accent-600 ring-accent-500 sm:col-span-2" : "bg-navy-800 ring-white/5"}`}
            >
              <Stars className={index === 0 ? "size-4 text-white" : "size-4"} />
              <blockquote
                className={`mt-4 leading-relaxed text-pretty text-white ${index === 0 ? "text-xl font-medium sm:text-2xl" : "text-base"}`}
              >
                “{review.quote}”
              </blockquote>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6 text-sm">
                <p>
                  <span className="font-semibold">{review.name}</span>
                  <span className="text-white/75"> · {review.place}</span>
                </p>
                <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs text-white">
                  {review.product}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
