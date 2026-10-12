import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { containerSizes } from "@/content/home";
import { formatMoney, getProducts } from "@/lib/commerce";
import { siteConfig } from "@/lib/site";

import { AnnouncementBar } from "./announcement-bar";
import { CartLink } from "./cart-link";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";
import { mainNavigation } from "./navigation";
import { routes } from "@/lib/routes";

export async function Header() {
  const products = await getProducts();
  const megaMenuItems = products.map((product) => ({
    href: routes.container(product.handle),
    title: product.title,
    image: product.featuredImage?.url ?? null,
    fromPrice: formatMoney(product.priceRange.minVariantPrice, { compact: true }),
    badge: product.badge,
  }));

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white">
        <Container className="flex h-16 items-center gap-4 lg:h-[76px] lg:gap-8">
          <Link href="/" aria-label="Bakkievol, naar de homepage" className="shrink-0">
            <Logo animated />
          </Link>

          <nav aria-label="Hoofdmenu" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <MegaMenu items={megaMenuItems} sizes={containerSizes.map((s) => s.value)} />
              {mainNavigation
                .filter((item) => item.href !== routes.containers) // desktop: mega-menu
                .map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="rounded-full px-3.5 py-2 text-[15px] whitespace-nowrap font-medium text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-900"
                    activeClassName="bg-navy-50 !text-navy-900 !font-semibold"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a
              href={siteConfig.contact.phoneHref}
              className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-navy-50 whitespace-nowrap xl:size-auto xl:gap-2 xl:px-3 xl:py-2 xl:text-[15px] xl:font-semibold"
            >
              <Icon name="phone" className="size-5" />
              <span className="sr-only xl:not-sr-only">{siteConfig.contact.phone}</span>
            </a>
            <CartLink />
            <div className="ml-2 hidden sm:block">
              <ButtonLink href={routes.order}>Container bestellen</ButtonLink>
            </div>
            <MobileMenu />
          </div>
        </Container>
      </header>
    </>
  );
}
