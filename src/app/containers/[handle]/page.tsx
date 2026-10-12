import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Faq } from "@/components/home/faq";
import { FinalCta } from "@/components/home/final-cta";
import { HowItWorks } from "@/components/home/how-it-works";
import { Comparison } from "@/components/product/comparison";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductCard } from "@/components/product/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { containerSizes, rating } from "@/content/home";
import { faqsByCategory, productIncluded, productSteps } from "@/content/product";
import { formatMoney, getProduct, getProducts, type Product } from "@/lib/commerce";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ handle: product.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/containers/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const from = formatMoney(product.priceRange.minVariantPrice, { compact: true });
  const image = product.featuredImage;
  return {
    title: product.seo.title ?? `${product.title} container huren vanaf ${from}`,
    description:
      product.seo.description ??
      `${product.title} container huren? Kies je formaat en zie direct de all-in prijs vanaf ${from}. Inclusief bezorgen, ophalen en afvalverwerking. Bestel bij Bakkievol.`,
    alternates: { canonical: routes.container(product.handle) },
    openGraph: image
      ? { images: [{ url: image.url, width: image.width, height: image.height, alt: image.altText }] }
      : undefined,
  };
}

export default function ProductPage({ params }: PageProps<"/containers/[handle]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({
  params,
}: Pick<PageProps<"/containers/[handle]">, "params">) {
  const { handle } = await params;
  const [product, products] = await Promise.all([getProduct(handle), getProducts()]);
  if (!product) notFound();

  const related = relatedProducts(product, products);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} container`,
    description: product.description,
    image: product.featuredImage?.url,
    brand: { "@type": "Brand", name: product.vendor },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      offerCount: product.variants.length,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Kruimelpad */}
      <div className="border-b border-navy-100">
        <Container>
          <nav aria-label="Kruimelpad" className="py-3.5 text-sm text-navy-500">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={routes.home} className="hover:text-navy-900">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <Icon name="chevron-down" className="size-3.5 -rotate-90 text-navy-300" />
              </li>
              <li>
                <Link href={routes.containers} className="hover:text-navy-900">
                  Containers
                </Link>
              </li>
              <li aria-hidden="true">
                <Icon name="chevron-down" className="size-3.5 -rotate-90 text-navy-300" />
              </li>
              <li aria-current="page" className="font-medium text-navy-900">
                {product.title}
              </li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Product */}
      <section className="py-8 lg:py-12">
        <Container className="grid items-start gap-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} badge={product.badge} />
          </div>

          {/* Mobiel: na het bestelblok; desktop: onder de foto's */}
          {product.wasteGuide && (
            <div className="order-3 lg:order-none lg:col-span-7 lg:row-start-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-success-50 p-5 ring-1 ring-success-600/15">
                  <p className="flex items-center gap-2 font-display font-bold text-navy-900">
                    <span className="flex size-6 items-center justify-center rounded-full bg-success-600 text-white">
                      <Icon name="check" className="size-3.5" strokeWidth={3} />
                    </span>
                    Dit mag erin
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-navy-700">
                    {product.wasteGuide.allowed.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-danger-50 p-5 ring-1 ring-danger-600/15">
                  <p className="flex items-center gap-2 font-display font-bold text-navy-900">
                    <span className="flex size-6 items-center justify-center rounded-full bg-danger-600 text-white">
                      <Icon name="close" className="size-3.5" strokeWidth={3} />
                    </span>
                    Dit mag er niet in
                  </p>
                  <ul className="mt-3 space-y-1.5 text-sm text-navy-700">
                    {product.wasteGuide.notAllowed.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <details className="group rounded-2xl ring-1 ring-navy-100 sm:col-span-2">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                    Bekijk de volledige afvalregels
                    <span className="flex size-7 items-center justify-center rounded-full bg-navy-50 transition-transform duration-300 group-open:rotate-45">
                      <Icon name="plus" className="size-4" />
                    </span>
                  </summary>
                  <div className="grid gap-6 border-t border-navy-100 px-5 py-5 text-sm sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-navy-900">Toegestaan</p>
                      <ul className="mt-2 space-y-1.5 text-navy-700">
                        {product.wasteGuide.allowed.map((item) => (
                          <li key={item} className="flex gap-2">
                            <Icon name="check" className="mt-0.5 size-4 shrink-0 text-success-600" strokeWidth={2.5} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-900">Niet toegestaan</p>
                      <ul className="mt-2 space-y-1.5 text-navy-700">
                        {product.wasteGuide.notAllowed.map((item) => (
                          <li key={item} className="flex gap-2">
                            <Icon name="close" className="mt-0.5 size-4 shrink-0 text-danger-600" strokeWidth={2.5} />
                            {item}
                          </li>
                        ))}
                        <li className="flex gap-2">
                          <Icon name="close" className="mt-0.5 size-4 shrink-0 text-danger-600" strokeWidth={2.5} />
                          Nooit: asbest, chemisch afval, gasflessen en elektrische apparaten
                        </li>
                      </ul>
                    </div>
                    <p className="rounded-xl bg-navy-50 p-4 text-navy-700 sm:col-span-2">
                      <strong className="font-semibold text-navy-900">Verkeerd afval in de container?</strong>{" "}
                      Dan moet het apart worden gesorteerd en kunnen er extra kosten in rekening worden
                      gebracht. Twijfel je? Bel ons vooraf, dan denken we mee.
                    </p>
                  </div>
                </details>

                <p className="text-sm text-navy-500 sm:col-span-2">
                  Twijfel je of je afval erin mag?{" "}
                  <a href={siteConfig.contact.phoneHref} className="font-semibold text-navy-900">
                    Bel {siteConfig.contact.phone}
                  </a>
                </p>
              </div>
            </div>
          )}

          <div className="order-2 lg:sticky lg:top-28 lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
            <ProductBuyBox
              title={product.title}
              description={product.description}
              badge={product.badge}
              variants={product.variants.map((variant) => ({
                id: variant.id,
                size: variant.selectedOptions.find((o) => o.name === "Formaat")?.value ?? variant.title,
                price: formatMoney(variant.price, { compact: true }),
                available: variant.availableForSale,
              }))}
              sizes={containerSizes}
              included={productIncluded}
              rating={rating}
            />
          </div>
        </Container>
      </section>

      <div className="border-t border-navy-100">
        <Comparison />
      </div>

      <div className="border-t border-navy-100">
        <HowItWorks
          steps={productSteps}
          title={`Zo huur je jouw ${product.title.toLowerCase()} container`}
          intro="Je afvalsoort heb je al gekozen. Nog drie stappen en je klus is geregeld."
          ctaLabel="Kies je formaat"
          ctaHref="#bestellen-product"
        />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-navy-50 py-16 lg:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                id="related-title"
                eyebrow="Andere afvalsoorten"
                title="Toch een andere afvalsoort?"
                intro="Bekijk welke container het beste past bij het afval dat je wilt afvoeren."
              />
              <Link href={routes.containers} className="inline-flex items-center gap-1.5 font-semibold text-navy-900">
                Alle containers
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
            <ul data-reveal="stagger" className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <Faq
        items={faqsByCategory[product.productType]}
        title={`Vragen over ${product.title.toLowerCase()}`}
        intro="De antwoorden op wat klanten ons het vaakst vragen over deze container."
      />
      <FinalCta
        eyebrow={product.title}
        title={`Klaar om je ${product.title.toLowerCase()} container te huren?`}
        ctaLabel="Kies je formaat en bestel"
        ctaHref="#bestellen-product"
      />
    </>
  );
}

/** Max. 4 andere afvalsoorten; dezelfde categorie eerst. */
function relatedProducts(product: Product, products: Product[]) {
  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.productType === product.productType) - Number(a.productType === product.productType))
    .slice(0, 4);
}

function ProductSkeleton() {
  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-12 lg:gap-14" aria-busy="true">
      <div className="aspect-[4/3] animate-pulse rounded-3xl bg-navy-50 lg:col-span-7" />
      <div className="space-y-4 lg:col-span-5">
        <div className="h-10 w-3/4 animate-pulse rounded-xl bg-navy-50" />
        <div className="h-24 animate-pulse rounded-2xl bg-navy-50" />
        <div className="h-48 animate-pulse rounded-3xl bg-navy-50" />
      </div>
    </Container>
  );
}
