import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { DeliveryForm } from "@/components/cart/delivery-form";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { PaymentMethods } from "@/components/ui/payment-methods";
import { includedInPrice } from "@/content/home";
import { formatMoney, getCart, getFeaturedProducts, type Cart } from "@/lib/commerce";
import { checkoutAction, removeFromCartAction, updateCartLineAction } from "@/lib/commerce/actions";
import { earliestDeliveryDate, isDeliveryComplete } from "@/lib/delivery";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Winkelwagen",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="bg-navy-50/60">
      <Container className="py-8 lg:py-12">
        <nav aria-label="Kruimelpad" className="text-sm text-navy-500">
          <Link href={routes.home} className="hover:text-navy-900">
            Home
          </Link>
          <span aria-hidden="true" className="mx-1.5 text-navy-300">/</span>
          <span aria-current="page" className="font-medium text-navy-900">
            Winkelwagen
          </span>
        </nav>
        <Suspense fallback={<CartSkeleton />}>
          <CartContents />
        </Suspense>
      </Container>
    </div>
  );
}

async function CartContents() {
  const cart = await getCart();

  if (cart.lines.length === 0) return <EmptyCart />;

  const attributes = Object.fromEntries(cart.attributes.map((a) => [a.key, a.value]));
  const now = new Date();
  const deliveryDone = isDeliveryComplete(attributes, now);

  return (
    <>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-navy-900 sm:text-4xl">
          Je bestelling
        </h1>
        <Steps current={deliveryDone ? 3 : 2} />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          {/* Containers */}
          <section aria-labelledby="lines-title" className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-7">
            <h2 id="lines-title" className="font-display text-lg font-bold text-navy-900">
              Je container{cart.totalQuantity > 1 ? "s" : ""}
            </h2>
            <ul className="mt-4 divide-y divide-navy-100">
              {cart.lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <Link
                    href={routes.container(line.merchandise.product.handle)}
                    className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-navy-50 sm:size-24"
                  >
                    {line.merchandise.product.featuredImage && (
                      <Image
                        src={line.merchandise.product.featuredImage.url}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={routes.container(line.merchandise.product.handle)}
                          className="font-display text-[17px] leading-snug font-bold text-navy-900"
                        >
                          {line.merchandise.product.title}
                        </Link>
                        <p className="text-sm text-navy-500">
                          {line.merchandise.title} · all-in, incl. btw
                        </p>
                      </div>
                      <p className="shrink-0 font-display text-lg font-extrabold text-navy-900">
                        {formatMoney(line.cost.totalAmount, { compact: true })}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <QuantityStepper lineId={line.id} quantity={line.quantity} />
                      <form action={removeFromCartAction}>
                        <input type="hidden" name="lineId" value={line.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-navy-500 transition-colors hover:text-danger-600"
                        >
                          <Icon name="close" className="size-4" />
                          Verwijderen
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-navy-100 pt-4">
              <Link
                href={routes.order}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900"
              >
                <Icon name="plus" className="size-4" />
                Nog een container toevoegen
              </Link>
            </div>
          </section>

          {/* Levering */}
          <section aria-labelledby="delivery-title" className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-7">
            <h2 id="delivery-title" className="sr-only">
              Levering
            </h2>
            <DeliveryForm defaults={attributes} minDate={earliestDeliveryDate(now)} />
          </section>
        </div>

        {/* Overzicht */}
        <aside className="lg:sticky lg:top-28 lg:col-span-4">
          <Summary cart={cart} attributes={attributes} deliveryDone={deliveryDone} />
        </aside>
      </div>
    </>
  );
}

function Summary({
  cart,
  attributes,
  deliveryDone,
}: {
  cart: Cart;
  attributes: Record<string, string>;
  deliveryDone: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-100 sm:p-6">
      <h2 className="font-display text-lg font-bold text-navy-900">Overzicht</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-navy-500">Container{cart.totalQuantity > 1 ? `s (${cart.totalQuantity})` : ""}</dt>
          <dd className="font-semibold text-navy-900">{formatMoney(cart.cost.subtotalAmount, { compact: true })}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-navy-500">Brengen en ophalen</dt>
          <dd className="font-semibold text-success-700">Inbegrepen</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-navy-500">Verwerking van je afval</dt>
          <dd className="font-semibold text-success-700">Inbegrepen</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-end justify-between gap-4 border-t border-navy-100 pt-4">
        <p className="leading-tight">
          <span className="block font-display text-lg font-bold text-navy-900">Totaal</span>
          <span className="text-xs text-navy-500">incl. btw</span>
        </p>
        <p className="font-display text-[2rem] leading-none font-extrabold tracking-[-0.03em] text-navy-900">
          {formatMoney(cart.cost.totalAmount, { compact: true })}
        </p>
      </div>

      {attributes.Postcode && (
        <dl className="mt-4 space-y-1 rounded-2xl bg-navy-50 p-4 text-sm">
          {["Postcode", "Levering", "Leverdatum", "Plaatsing"].map((key) =>
            attributes[key] ? (
              <div key={key} className="flex justify-between gap-3">
                <dt className="text-navy-500">{key}</dt>
                <dd className="text-right font-medium text-navy-900">
                  {key === "Leverdatum" ? formatDate(attributes[key]) : attributes[key]}
                </dd>
              </div>
            ) : null,
          )}
        </dl>
      )}

      {cart.checkoutUrl && deliveryDone ? (
        <form action={checkoutAction}>
          <button type="submit" className={buttonStyles({ size: "lg", className: "mt-5 w-full" })}>
            <Icon name="shield" className="size-5" />
            Veilig afrekenen
          </button>
        </form>
      ) : (
        <>
          <button
            type="button"
            disabled
            aria-describedby="checkout-note"
            className={buttonStyles({ size: "lg", className: "mt-5 w-full" })}
          >
            <Icon name="shield" className="size-5" />
            Veilig afrekenen
          </button>
          <p id="checkout-note" className="mt-2 text-center text-xs text-navy-500">
            {cart.checkoutUrl
              ? "Vul eerst je leveringsgegevens in en sla ze op."
              : "Afrekenen via Shopify Checkout wordt binnenkort gekoppeld."}
          </p>
        </>
      )}

      <ul className="mt-5 space-y-1.5 text-sm text-navy-700">
        {includedInPrice.slice(2).map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Icon name="check" className="size-4 shrink-0 text-success-600" strokeWidth={2.5} />
            {item}
          </li>
        ))}
        <li className="flex items-center gap-2">
          <Icon name="check" className="size-4 shrink-0 text-success-600" strokeWidth={2.5} />
          Geen account nodig
        </li>
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-4">
        <PaymentMethods />
      </div>
      <a href={siteConfig.contact.phoneHref} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
        <Icon name="phone" className="size-4" />
        Hulp nodig? {siteConfig.contact.phone}
      </a>
    </div>
  );
}

function QuantityStepper({ lineId, quantity }: { lineId: string; quantity: number }) {
  const step = (value: number, label: string, icon: "plus" | "close") => (
    <form action={updateCartLineAction}>
      <input type="hidden" name="lineId" value={lineId} />
      <input type="hidden" name="quantity" value={value} />
      <button
        type="submit"
        aria-label={label}
        disabled={value > 99}
        className="flex size-9 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-navy-50 disabled:opacity-40"
      >
        {icon === "plus" ? (
          <Icon name="plus" className="size-4" />
        ) : (
          <span aria-hidden="true" className="block h-0.5 w-3.5 rounded-full bg-current" />
        )}
      </button>
    </form>
  );

  return (
    <div className="inline-flex items-center rounded-full ring-1 ring-navy-200">
      {step(quantity - 1, quantity === 1 ? "Verwijderen" : "Eén minder", "close")}
      <span className="w-8 text-center text-sm font-bold text-navy-900" aria-label={`Aantal: ${quantity}`}>
        {quantity}
      </span>
      {step(quantity + 1, "Eén meer", "plus")}
    </div>
  );
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Container", "Levering", "Afrekenen"];
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Bestelstappen">
      {steps.map((label, index) => {
        const n = index + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="h-px w-5 bg-navy-200 sm:w-8" />}
            <span
              aria-current={active ? "step" : undefined}
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                done ? "bg-success-600 text-white" : active ? "bg-navy-900 text-white" : "bg-white text-navy-500 ring-1 ring-navy-200"
              }`}
            >
              {done ? <Icon name="check" className="size-3.5" strokeWidth={3} /> : n}
            </span>
            <span className={`hidden sm:inline ${active ? "font-semibold text-navy-900" : "text-navy-500"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

async function EmptyCart() {
  const popular = await getFeaturedProducts(4);
  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-navy-100 sm:p-12">
      <Image
        src="/images/temp/container-cutout.png"
        alt=""
        width={637}
        height={249}
        className="mx-auto w-56 opacity-90"
      />
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-[-0.03em] text-navy-900">
        Je winkelwagen is nog leeg
      </h1>
      <p className="mt-2 text-navy-500">Kies je afvalsoort en formaat en zie direct je all-in prijs.</p>
      <ButtonLink href={routes.order} size="lg" className="mt-6">
        Stel je container samen
        <Icon name="arrow-right" className="size-5" />
      </ButtonLink>
      <div className="mt-8 border-t border-navy-100 pt-6">
        <p className="text-sm font-semibold text-navy-900">Veel gekozen</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {popular.map((product) => (
            <li key={product.id}>
              <Link
                href={routes.container(product.handle)}
                className="inline-flex rounded-full px-3.5 py-2 text-sm font-semibold text-navy-900 ring-1 ring-navy-200 transition-colors hover:bg-navy-50"
              >
                {product.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** "2026-10-12" → "ma 12 oktober" */
function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "long" }).format(date);
}

function CartSkeleton() {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-12" aria-busy="true">
      <div className="h-80 animate-pulse rounded-3xl bg-white lg:col-span-8" />
      <div className="h-96 animate-pulse rounded-3xl bg-white lg:col-span-4" />
    </div>
  );
}
