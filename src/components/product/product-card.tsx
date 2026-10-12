import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/ui/icon";
import { formatMoney, type Product } from "@/lib/commerce";
import { routes } from "@/lib/routes";

/**
 * Productkaart in het overzicht. Eén beslissing: welke afvalsoort?
 * Het formaat kies je pas op de productpagina.
 *
 * Hiërarchie: afbeelding → (max. één) label → naam → max. 2× wel / 1× niet
 * → "Vanaf €xxx all-in" → "Bekijk containers". De hele kaart is klikbaar.
 * Mobiel horizontaal (compact), vanaf sm verticaal.
 */
export function ProductCard({ product }: { product: Product }) {
  const allowed = product.wasteGuide?.allowed.slice(0, 2) ?? [];
  const notAllowed = product.wasteGuide?.notAllowed.slice(0, 1) ?? [];

  return (
    <article className="group relative flex h-full cursor-pointer gap-4 rounded-2xl bg-white p-3 ring-1 ring-navy-100 transition-[box-shadow] duration-300 hover:shadow-card-hover hover:ring-navy-200 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent-700 sm:flex-col sm:gap-0 sm:p-0">
      <div className="relative aspect-square w-28 shrink-0 self-start overflow-hidden rounded-xl bg-navy-50 sm:aspect-[4/3] sm:w-full sm:rounded-none sm:rounded-t-2xl">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt=""
            fill
            sizes="(min-width: 1280px) 232px, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 112px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 hidden items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] leading-none font-bold text-navy-900 shadow-sm sm:inline-flex">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-600" />
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col sm:p-5">
        {product.badge && (
          <span className="mb-1.5 inline-flex items-center gap-1.5 self-start text-xs font-bold text-accent-700 sm:hidden">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-600" />
            {product.badge}
          </span>
        )}
        <h3 className="font-display text-[17px] leading-snug font-bold tracking-[-0.01em] text-navy-900 sm:text-lg">
          {product.title}
        </h3>

        {(allowed.length > 0 || notAllowed.length > 0) && (
          <ul className="mt-2 space-y-1 text-sm leading-snug text-navy-700 sm:mt-3 sm:space-y-1.5">
            {allowed.map((item) => (
              <li key={item} className="flex gap-2">
                <Icon name="check" className="mt-0.5 size-4 shrink-0 text-success-600" strokeWidth={2.5} />
                <span className="sr-only">Mag erin: </span>
                {item}
              </li>
            ))}
            {notAllowed.map((item) => (
              <li key={item} className="flex gap-2 text-navy-500">
                <Icon name="close" className="mt-0.5 size-4 shrink-0 text-danger-600" strokeWidth={2.5} />
                <span className="sr-only">Mag er niet in: </span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-4 sm:pt-5">
          <p className="flex items-baseline gap-1.5 text-navy-500">
            <span className="text-sm">Vanaf</span>
            <span className="font-display text-xl font-extrabold tracking-[-0.02em] text-navy-900">
              {formatMoney(product.priceRange.minVariantPrice, { compact: true })}
            </span>
            <span className="text-sm font-medium">all-in</span>
          </p>
          <Link
            href={routes.container(product.handle)}
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-bold text-accent-700 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none sm:mt-3 sm:min-h-0"
          >
            Bekijk containers
            <span className="sr-only"> voor {product.title.toLowerCase()}</span>
            <Icon
              name="arrow-right"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
