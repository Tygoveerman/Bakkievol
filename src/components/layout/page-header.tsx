import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { RevealText } from "@/components/motion/reveal-text";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export type Crumb = { label: string; href?: string };

/**
 * Kop voor binnenpagina's: breadcrumbs (+ schema), H1, intro en optionele
 * actie. Zelfde navy-identiteit als de hero, maar compact.
 */
export function PageHeader({
  title,
  intro,
  breadcrumbs,
  children,
}: {
  title: string;
  intro?: ReactNode;
  breadcrumbs: Crumb[];
  children?: ReactNode;
}) {
  const trail: Crumb[] = [{ label: "Home", href: routes.home }, ...breadcrumbs];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${siteConfig.url}${crumb.href === "/" ? "" : crumb.href}` } : {}),
    })),
  };

  return (
    <header className="bg-navy-900 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container className="py-10 sm:py-14 lg:py-16">
        <nav aria-label="Kruimelpad" data-reveal="up">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-navy-200">
            {trail.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <Icon name="chevron-down" className="size-3.5 -rotate-90 text-navy-300" />}
                {crumb.href && index < trail.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-white hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-white">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1
          data-reveal="text"
          aria-label={title}
          className="mt-5 max-w-3xl font-display text-4xl leading-[1.02] font-extrabold tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.5rem]">
          <RevealText segments={[title]} delay={40} />
        </h1>
        {intro && (
          <p
            data-reveal="up"
            style={{ "--d": "200ms" } as CSSProperties}
            className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-navy-100">{intro}</p>
        )}
        {children && (
          <div data-reveal="up" style={{ "--d": "280ms" } as CSSProperties} className="mt-8">
            {children}
          </div>
        )}
      </Container>
    </header>
  );
}
