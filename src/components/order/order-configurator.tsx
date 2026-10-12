"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PaymentMethods } from "@/components/ui/payment-methods";
import type { ContainerSize } from "@/content/home";
import {
  addToCartInlineAction,
  type AddToCartState,
} from "@/lib/commerce/actions";

import { ContainerVisual } from "./container-visual";
import { DeliveryPromise } from "./delivery-promise";
import { SizeHelperDialog } from "./size-helper-dialog";
import { CONFIGURATOR_ID, setOrderSelection, useOrderSelection } from "./order-store";
import { routes } from "@/lib/routes";

/** Serialiseerbare productdata, server-side voorbereid in de hero. */
export type ConfiguratorProduct = {
  handle: string;
  title: string;
  image: string | null;
  fromPrice: string;
  variants: { id: string; size: string; price: string; available: boolean }[];
};

const initialState: AddToCartState = { status: "idle" };

export function OrderConfigurator({
  products,
  quickPickHandles,
  sizes,
  included,
  fromPrice,
}: {
  products: ConfiguratorProduct[];
  quickPickHandles: string[];
  sizes: ContainerSize[];
  included: string[];
  /** Laagste all-in prijs, al geformatteerd (bijv. "€ 199"). */
  fromPrice: string;
}) {
  const formId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const selection = useOrderSelection();
  const [state, formAction, pending] = useActionState(addToCartInlineAction, initialState);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const [cardInView, setCardInView] = useState(true);

  // Stap 1 eerst: pas na het kiezen van een afvalsoort verschijnt de rest.
  // Het formaat staat dan standaard op "meest gekozen", zodat er direct een prijs staat.
  const product = products.find((p) => p.handle === selection.handle) ?? null;
  const variantFor = (size: string) => product?.variants.find((v) => v.size === size);
  const isAvailable = (size: string) => Boolean(variantFor(size)?.available);
  // Alleen formaten tonen die voor deze afvalsoort echt te bestellen zijn.
  const offeredSizes = sizes.filter((s) => isAvailable(s.value));
  const popular = sizes.find((s) => s.popular)?.value;
  const size =
    (selection.size && isAvailable(selection.size) && selection.size) ||
    (popular && isAvailable(popular) && popular) ||
    product?.variants.find((v) => v.available)?.size ||
    null;
  const variant = size ? variantFor(size) ?? null : null;
  const sizeMeta = product ? sizes.find((s) => s.value === size) : undefined;
  const requestedUnavailable =
    product && selection.size !== null && selection.size !== size ? selection.size : null;

  const confirmed =
    state.status === "success" && state.id !== dismissedId ? state : null;

  const quickPicks = quickPickHandles
    .map((h) => products.find((p) => p.handle === h))
    .filter((p): p is ConfiguratorProduct => Boolean(p));
  const allProducts = [
    ...quickPicks,
    ...products.filter((p) => !quickPickHandles.includes(p.handle)),
  ];

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setCardInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const reset = () => {
    if (state.status === "success") setDismissedId(state.id);
    setOrderSelection({ handle: null, size: null });
  };

  return (
    <div
      id={CONFIGURATOR_ID}
      ref={cardRef}
      className="scroll-mt-24 overflow-hidden rounded-3xl bg-white text-navy-900 shadow-float ring-1 ring-black/5"
    >
      {/* Productpaneel: de container als product, met live prijs */}
      <div className="bg-gradient-to-b from-navy-50 to-white px-5 pt-5 sm:px-7 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold tracking-[0.08em] text-accent-700 uppercase">
              {product ? "Stap 2 van 2" : "Stap 1 van 2"}
            </p>
            <p className="mt-1 font-display text-2xl leading-tight font-extrabold tracking-[-0.02em]">
              {product ? "Kies je formaat" : "Kies je afvalsoort"}
            </p>
            <p className="mt-1 max-w-[16rem] text-sm leading-snug text-navy-500">
              {product
                ? `${product.title}: zie direct je exacte all-in prijs.`
                : "Bekijk direct welk formaat je nodig hebt en wat het kost."}
            </p>
          </div>
          <p className="shrink-0 text-right leading-none" aria-live="polite">
            <span className="block text-xs text-navy-500">{variant ? `${variant.size}` : "vanaf"}</span>
            <span
              key={variant ? variant.id : "vanaf"}
              className="value-swap mt-1 block font-display text-[2rem] font-extrabold tracking-[-0.04em]"
            >
              {variant ? variant.price : fromPrice}
            </span>
            <span className="mt-1 block text-xs font-medium text-navy-500">all-in · incl. btw</span>
          </p>
        </div>

        <div className="mx-auto mt-3 w-[88%]">
          <ContainerVisual sizes={sizes} active={sizeMeta?.value} priority sizesAttr="(min-width: 1024px) 360px, 80vw" />
        </div>
        <p className="pt-2 pb-4 text-center text-xs font-semibold text-navy-500">
          {sizeMeta
            ? `${sizeMeta.value} · ca. ${sizeMeta.lengthM.toLocaleString("nl-NL", { minimumFractionDigits: 1 })} m lang · ± ${sizeMeta.wheelbarrows} kruiwagens`
            : "Brengen, ophalen en verwerking inbegrepen"}
        </p>
      </div>

      <div className="border-t border-navy-100 p-5 sm:p-7">
        {/* STAP 1 — afvalsoort (na keuze ingeklapt tot één regel) */}
        {!product ? (
          <fieldset>
            <legend
              data-step-heading
              tabIndex={-1}
              className="sr-only"
            >
              Wat wil je afvoeren?
            </legend>
            {selection.size && (
              <p className="mb-4 text-sm text-navy-500">
                Gekozen formaat: <strong className="text-navy-900">{selection.size}</strong>. Kies nu
                je afvalsoort.
              </p>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {allProducts.map((p) => (
                <label
                  key={p.handle}
                  className="group flex cursor-pointer items-center gap-3 rounded-2xl p-2 pr-3 ring-1 ring-navy-100 transition-[box-shadow,background-color] hover:bg-accent-50 hover:ring-accent-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-900"
                >
                  <input
                    type="radio"
                    name="afvalsoort"
                    value={p.handle}
                    onChange={() => setOrderSelection({ handle: p.handle })}
                    className="sr-only"
                  />
                  {p.image && (
                    <Image
                      src={p.image}
                      alt=""
                      width={40}
                      height={40}
                      sizes="40px"
                      className="size-10 shrink-0 rounded-xl object-cover"
                    />
                  )}
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block text-[13px] font-semibold text-balance sm:text-sm">
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-navy-500">
                      vanaf{" "}
                      <strong className="text-sm font-bold text-navy-900">{p.fromPrice}</strong>
                      <span className="hidden sm:inline"> all-in</span>
                    </span>
                  </span>
                  <Icon
                    name="arrow-right"
                    className="hidden size-4 shrink-0 text-accent-600 opacity-0 transition-opacity group-hover:opacity-100 sm:block"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl bg-navy-50 p-2 pr-3">
            {product.image && (
              <Image
                src={product.image}
                alt=""
                width={44}
                height={44}
                sizes="44px"
                className="size-11 rounded-lg object-cover"
              />
            )}
            <p className="min-w-0 flex-1 leading-tight">
              <span className="block text-xs text-navy-500">Afvalsoort</span>
              <span className="block truncate text-sm font-semibold">{product.title}</span>
            </p>
            <button
              type="button"
              onClick={() => setOrderSelection({ handle: null })}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-accent-700 underline-offset-4 hover:underline"
            >
              Wijzig
            </button>
          </div>
        )}

        {/* STAP 2 — formaat, prijs en bestellen */}
        {product && (
        <div className="motion-safe:animate-rise">
        <fieldset className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <legend
              data-step-heading
              tabIndex={-1}
              className="text-sm font-semibold text-navy-700 focus:outline-none"
            >
              Formaat
            </legend>
            <SizeHelperDialog
              sizes={sizes}
              prices={Object.fromEntries(product.variants.map((v) => [v.size, v.price]))}
              available={offeredSizes.map((s) => s.value)}
              onChoose={(value) => setOrderSelection({ size: value })}
              source="bestelmodule"
            />
          </div>
          <div
            className="mt-3 grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${offeredSizes.length}, minmax(0, 1fr))` }}
          >
            {offeredSizes.map((s) => {
              const v = variantFor(s.value);
              const available = Boolean(v?.available);
              const checked = s.value === size;
              return (
                <label
                  key={s.value}
                  className={`relative flex flex-col items-center rounded-xl px-1 pt-2.5 pb-2 text-center transition-[box-shadow,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-900 ${
                    !available
                      ? "cursor-not-allowed bg-navy-50 text-navy-300"
                      : checked
                        ? "cursor-pointer bg-accent-600 text-white shadow-cta"
                        : "cursor-pointer bg-white ring-1 ring-navy-100 hover:ring-navy-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="formaat"
                    value={s.value}
                    checked={checked}
                    disabled={!available}
                    onChange={() => setOrderSelection({ size: s.value })}
                    className="sr-only"
                  />
                  {s.popular && available && (
                    <span
                      className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 text-[10px] leading-[18px] font-bold whitespace-nowrap ${checked ? "bg-navy-900 text-white" : "bg-accent-600 text-white"}`}
                    >
                      Meest gekozen
                    </span>
                  )}
                  <span className="font-display text-base leading-none font-extrabold sm:text-lg">
                    {s.value.replace(" m³", "")}
                    <span className="text-xs font-bold"> m³</span>
                  </span>
                  <span
                    className={`mt-1 text-[11px] font-semibold ${!available ? "" : checked ? "text-white/90" : "text-navy-500"}`}
                  >
                    {available ? v?.price : "n.v.t."}
                  </span>
                </label>
              );
            })}
          </div>
          {requestedUnavailable && (
            <p className="mt-2 text-xs text-navy-500">
              {requestedUnavailable} is niet beschikbaar voor {product.title.toLowerCase()}; we
              tonen {size}.
            </p>
          )}

        </fieldset>

        {/* PRIJS + BESTELLEN */}
        {variant && (
          <div className="mt-5" aria-live="polite">
            {confirmed ? (
              <div className="rounded-2xl bg-success-50 p-4 ring-1 ring-success-600/20 sm:p-5">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-success-700">
                  <span className="flex size-6 items-center justify-center rounded-full bg-success-600 text-white">
                    <Icon name="check" className="size-4" strokeWidth={2.5} />
                  </span>
                  Container toegevoegd!
                </p>
                <p className="mt-1 text-sm text-navy-700">
                  {variant.size} {product.title.toLowerCase()} — {variant.price} all-in
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link href="/winkelwagen" className={buttonStyles({ className: "w-full" })}>
                    Bestelling afronden
                    <Icon name="arrow-right" className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className={buttonStyles({ variant: "outline", className: "w-full" })}
                  >
                    Nog een container
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form id={formId} action={formAction}>
                  <input type="hidden" name="variantId" value={variant.id} />
                  <button
                    type="submit"
                    disabled={pending}
                    className={buttonStyles({ size: "lg", className: "w-full text-[17px]" })}
                  >
                    {pending ? "Toevoegen…" : `Bestellen · ${variant.price}`}
                    {!pending && <Icon name="arrow-right" className="size-5" />}
                  </button>
                </form>
                {state.status === "error" && (
                  <p role="alert" className="mt-2 text-sm text-danger-600">
                    {state.message}
                  </p>
                )}
                <p className="mt-3 text-center text-[13px] text-navy-500">
                  All-in: {included.slice(0, 2).join(", ").toLowerCase()} en btw
                </p>
                <DeliveryPromise className="mt-2 justify-center text-[13px]" />
              </>
            )}
          </div>
        )}
        </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-navy-100 bg-navy-50/70 px-5 py-3.5 text-[13px] sm:px-7">
        <PaymentMethods />
        <Link
          href={routes.containers}
          className="inline-flex items-center gap-1 font-semibold text-navy-900 underline-offset-4 hover:underline"
        >
          Alle containers
          <Icon name="arrow-right" className="size-4" />
        </Link>
      </div>

      {/* Sticky bestelbalk op mobiel */}
      {product && variant && !cardInView && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy-100 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(22_41_58/0.25)] motion-safe:animate-rise lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3" aria-live="polite">
            {confirmed ? (
              <>
                <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-success-700">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-600 text-white">
                    <Icon name="check" className="size-4" strokeWidth={2.5} />
                  </span>
                  Container toegevoegd!
                </p>
                <Link href="/winkelwagen" className={buttonStyles({ className: "shrink-0" })}>
                  Naar bestellen
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-sm text-navy-700">
                    {variant.size} {product.title.toLowerCase()}
                  </span>
                  <span className="font-display text-xl font-extrabold">{variant.price}</span>
                  <span className="ml-1 text-xs text-navy-500">all-in</span>
                </p>
                <button
                  type="submit"
                  form={formId}
                  disabled={pending}
                  className={buttonStyles({ className: "shrink-0" })}
                >
                  {pending ? "Toevoegen…" : "Bestellen"}
                  {!pending && <Icon name="arrow-right" className="size-4" />}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
