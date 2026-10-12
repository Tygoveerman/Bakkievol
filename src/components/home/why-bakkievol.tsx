import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { whyBakkievol, type ContentPhoto } from "@/content/home";
import { siteConfig } from "@/lib/site";

/** "Waarom Bakkievol": vertrouwen via echte foto's en concrete redenen. */
export function WhyBakkievol() {
  const { title, intro, photo, secondaryPhoto, photoCaption, reasons } = whyBakkievol;

  return (
    <section
      id="waarom-bakkievol"
      aria-labelledby="waarom-title"
      className="scroll-mt-20 bg-navy-50 py-16 lg:py-24"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Foto's */}
        <div data-reveal="up" className="relative pb-10 sm:pb-14 lg:pr-10">
          <Photo
            photo={photo}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[4/3] rounded-3xl shadow-card-hover"
          />
          <div className="absolute right-0 bottom-0 hidden w-[42%] sm:block">
            <Photo
              photo={secondaryPhoto}
              sizes="240px"
              className="aspect-square rounded-2xl ring-6 ring-navy-50"
            />
          </div>
          <p className="absolute bottom-4 left-4 max-w-[48%] rounded-2xl bg-white/95 px-4 py-3 text-sm leading-snug font-semibold text-navy-900 shadow-card sm:bottom-18">
            {photoCaption}
          </p>
        </div>

        {/* Redenen */}
        <div>
          <SectionHeading
            id="waarom-title"
            eyebrow="Waarom Bakkievol"
            title={title}
            intro={intro}
          />

          <ul data-reveal="stagger" className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {reasons.map((reason) => (
              <li key={reason.title}>
                <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-accent-600 shadow-card">
                  <Icon name={reason.icon} className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-[-0.01em] text-navy-900">
                  {reason.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-navy-500">{reason.text}</p>
              </li>
            ))}
          </ul>

          <a
            href={siteConfig.contact.phoneHref}
            data-reveal="up"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 shadow-card ring-1 ring-navy-100 transition-shadow hover:shadow-card-hover"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-navy-900 text-white">
              <Icon name="phone" className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs text-navy-500">Liever eerst even overleggen?</span>
              <span className="font-display font-bold text-navy-900">
                Bel {siteConfig.contact.phone}
              </span>
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}

function Photo({
  photo,
  sizes,
  className,
}: {
  photo: ContentPhoto;
  sizes: string;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-navy-100 ${className}`}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      {photo.placeholder && (
        <span className="absolute top-3 left-3 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-semibold text-white">
          Tijdelijke foto
        </span>
      )}
    </div>
  );
}
