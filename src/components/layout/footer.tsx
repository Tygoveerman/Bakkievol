import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { PaymentMethods } from "@/components/ui/payment-methods";
import { getProducts } from "@/lib/commerce";
import { siteConfig } from "@/lib/site";

import { Logo } from "./logo";
import { routes } from "@/lib/routes";

const serviceLinks = [
  { href: routes.containers, label: "Alle containers" },
  { href: routes.sizes, label: "Containerformaten" },
  { href: routes.howItWorks, label: "Hoe het werkt" },
  { href: routes.support, label: "Klantenservice" },
  { href: "/winkelwagen", label: "Winkelwagen" },
];

const linkClass =
  "text-navy-200 transition-colors hover:text-white focus-visible:text-white";

export async function Footer() {
  "use cache";
  cacheLife("days");

  const products = await getProducts();

  return (
    <footer className="bg-navy-950 text-sm text-navy-200">
      <Container className="grid gap-12 pt-14 pb-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:pt-16 lg:pb-20">
        <div className="lg:col-span-4">
          <Logo tone="dark" />
          <p className="mt-4 max-w-xs leading-relaxed">
            Container huren zonder gedoe in {siteConfig.contact.area}. All-in
            prijzen, snelle levering en persoonlijk advies.
          </p>
        </div>

        <FooterColumn title="Afvalsoorten" className="lg:col-span-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link href={routes.container(product.handle)} className={linkClass}>
                {product.title}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Service" className="lg:col-span-2">
          {serviceLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact" className="lg:col-span-3">
          <li>
            <a href={siteConfig.contact.phoneHref} className={`${linkClass} inline-flex items-center gap-2 text-base font-semibold text-white`}>
              <Icon name="phone" className="size-4 text-navy-300" />
              {siteConfig.contact.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${siteConfig.contact.email}`} className={`${linkClass} inline-flex items-center gap-2`}>
              <Icon name="mail" className="size-4 text-navy-300" />
              {siteConfig.contact.email}
            </a>
          </li>
          <li className="inline-flex items-center gap-2">
            <Icon name="clock" className="size-4 text-navy-300" />
            {siteConfig.contact.hours}
          </li>
        </FooterColumn>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bakkievol. Alle prijzen zijn all-in en inclusief btw.</p>
          <PaymentMethods />
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h2 className="mb-4 font-display text-base font-semibold text-white">{title}</h2>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}
