"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PaymentMethods } from "@/components/ui/payment-methods";
import { Stars } from "@/components/ui/stars";
import type { ContainerSize } from "@/content/home";
import { addToCartInlineAction, type AddToCartState } from "@/lib/commerce/actions";
import { track } from "@/lib/analytics";

import { ContainerVisual } from "@/components/order/container-visual";
import { SizeHelperDialog } from "@/components/order/size-helper-dialog";

import { DeliveryLine } from "./delivery-line";
import { routes } from "@/lib/routes";

const initialState: AddToCartState = { status: "idle" };

export type BuyBoxVariant = { id: string; size: string; price: string; available: boolean };

/**
 * Bestelblok op de productpagina: formaat kiezen → exacte all-in prijs →
 * in winkelwagen (doorsturen naar de winkelwagen). Mobiel: sticky balk.
 */
export function ProductBuyBox({
  title,
  description,
  badge,
  variants,
  sizes,
  included,
  rating,
}: {
  title: string;
  description: string;
  badge: string | null;
  variants: BuyBoxVariant[];
  sizes: ContainerSize[];
  included: string[];
  rating: { score: string; count: string };
}) {
  const popular = sizes.find((s) => s.popular)?.value;
  // Niet-bestelbare formaten tonen we niet (geen grijze "uitverkocht"-knoppen).
  const offered = variants.filter((v) => v.available);
  const firstAvailable = variants.find((v) => v.available);
  const initial =
    variants.find((v) => v.size === popular && v.available) ?? firstAvailable ?? variants[0];
  const [selectedId, setSelectedId] = useState(initial?.id);
  const [state, formAction, pending] = useActionState(addToCartInlineAction, initialState);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const confirmed = state.status === "success" && state.id !== dismissedId;

  useEffect(() => {
    track("view_item", { item_name: title });
  }, [title]);
  useEffect(() => {
    if (state.status === "success") track("add_to_cart", { item_name: title, item_variant: state.variantId });
  }, [state, title]);
  const variant = variants.find((v) => v.id === selectedId) ?? initial;
  const meta = sizes.find((s) => s.value === variant?.size);

  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(true);
  useEffect(() => {
    const element = ctaRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setCtaVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!variant) return null;
  const formId = "product-order";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-bold text-accent-700">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-600" />
            {badge}
          </span>
        )}
        <Link
          href={`${routes.home}#ervaringen`}
          className="group/rv inline-flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-900"
        >
          <Stars className="size-3.5" />
          <span className="font-semibold text-navy-900">{rating.score}/5</span>
          <span>· Bekijk beoordelingen</span>
          <Icon name="arrow-right" className="size-3.5 transition-transform group-hover/rv:translate-x-0.5" />
        </Link>
      </div>

      <h1 className="mt-3 font-display text-[2rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance text-navy-900 sm:text-[2.5rem]">
        {title} container huren
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-navy-500">{description}</p>

      {/* Formaat */}
      <fieldset className="mt-8">
        <div className="flex items-baseline justify-between">
          <legend className="text-sm font-semibold text-navy-900">Kies je formaat</legend>
          <SizeHelperDialog
            sizes={sizes}
            prices={Object.fromEntries(variants.map((v) => [v.size, v.price]))}
            available={offered.map((v) => v.size)}
            onChoose={(value) => {
              const match = variants.find((v) => v.size === value && v.available);
              if (match) setSelectedId(match.id);
            }}
            source="productpagina"
          />
        </div>
        <div
          className="mt-3 grid gap-1.5 sm:gap-2"
          style={{ gridTemplateColumns: `repeat(${offered.length}, minmax(0, 1fr))` }}
        >
          {offered.map((v) => {
            const checked = v.id === variant.id;
            const isPopular = v.size === popular;
            return (
              <label
                key={v.id}
                className={`relative flex flex-col items-center rounded-xl px-0.5 pt-3 pb-2.5 text-center transition-[box-shadow,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-900 ${
                  !v.available
                    ? "cursor-not-allowed bg-navy-50 text-navy-300"
                    : checked
                      ? "cursor-pointer bg-accent-600 text-white shadow-cta"
                      : "cursor-pointer bg-white ring-1 ring-navy-100 hover:ring-navy-300"
                }`}
              >
                <input
                  type="radio"
                  name="formaat"
                  value={v.id}
                  checked={checked}
                  disabled={!v.available}
                  onChange={() => {
                    setSelectedId(v.id);
                    track("select_container_size", { item_name: title, item_variant: v.size });
                  }}
                  className="sr-only"
                />
                {isPopular && v.available && (
                  <span
                    className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 text-[10px] leading-[18px] font-bold whitespace-nowrap ${checked ? "bg-navy-900 text-white" : "bg-accent-600 text-white"}`}
                  >
                    <span className="sm:hidden">Top keuze</span>
                    <span className="hidden sm:inline">Meest gekozen</span>
                  </span>
                )}
                <span className="font-display text-base leading-none font-extrabold sm:text-lg">
                  {v.size.replace(" m³", "")}
                  <span className="text-xs font-bold"> m³</span>
                </span>
                <span className={`mt-1 text-xs font-semibold ${!v.available ? "" : checked ? "text-white/90" : "text-navy-500"}`}>
                  {v.available ? v.price : "Uitverkocht"}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Het gekozen formaat in beeld: de juiste container, op schaal */}
      <div className="mt-4 rounded-2xl bg-navy-50 px-4 pt-4 pb-3">
        <div className="mx-auto w-full sm:w-[90%]">
          <ContainerVisual sizes={sizes} active={variant.size} sizesAttr="(min-width: 1024px) 340px, 75vw" />
        </div>
        {meta && (
          <p className="mt-2 text-center text-xs text-navy-500">
            <span className="font-semibold text-navy-900">{meta.label}</span> · ± {meta.wheelbarrows}{" "}
            kruiwagens · ca. {meta.lengthM.toLocaleString("nl-NL", { minimumFractionDigits: 1 })} ×{" "}
            {meta.heightM.toLocaleString("nl-NL")} m
          </p>
        )}
      </div>

      {/* Prijs + bestellen: geen extra kaart, één scheidingslijn */}
      <div id="bestellen-product" className="mt-7 scroll-mt-28 border-t border-navy-100 pt-7">
        <div className="flex items-baseline gap-3">
          <p
            key={variant.id}
            className="value-swap font-display text-[2.75rem] leading-none font-extrabold tracking-[-0.04em] text-navy-900"
          >
            {variant.price}
          </p>
          <p className="text-sm text-navy-500">all-in · {variant.size}</p>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-navy-700">
          {included.map((item) => (
            <li key={item} className="flex items-center gap-2 whitespace-nowrap">
              <Icon name="check" className="size-4 shrink-0 text-success-600" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
        <div ref={ctaRef} className="mt-5" aria-live="polite">
          {confirmed ? (
            <div className="rounded-2xl bg-success-50 p-4 ring-1 ring-success-600/20">
              <p className="flex items-center gap-2 font-display text-lg font-bold text-success-700">
                <span className="flex size-6 items-center justify-center rounded-full bg-success-600 text-white">
                  <Icon name="check" className="size-4" strokeWidth={2.5} />
                </span>
                Container toegevoegd!
              </p>
              <p className="mt-1 text-sm text-navy-700">
                {variant.size} {title.toLowerCase()} · {variant.price} all-in
              </p>
              <div className="mt-4 grid gap-2">
                <Link href={routes.cart} className={buttonStyles({ className: "w-full" })}>
                  Bestelling afronden
                  <Icon name="arrow-right" className="size-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => state.status === "success" && setDismissedId(state.id)}
                  className={buttonStyles({ variant: "outline", className: "w-full" })}
                >
                  Nog een container
                </button>
              </div>
            </div>
          ) : (
            <form id={formId} action={formAction}>
              <input type="hidden" name="variantId" value={variant.id} />
              <button
                type="submit"
                disabled={pending}
                className={buttonStyles({ size: "lg", className: "w-full text-[17px]" })}
              >
                {pending ? "Toevoegen…" : `In winkelwagen · ${variant.price}`}
                {!pending && <Icon name="arrow-right" className="size-5" />}
              </button>
              <DeliveryLine className="mt-3" />
              {state.status === "error" && (
                <p role="alert" className="mt-2 text-sm text-danger-600">
                  {state.message}
                </p>
              )}
            </form>
          )}
        </div>
        <PaymentMethods className="mt-5 justify-center" />
      </div>

      {/* Sticky bestelbalk op mobiel */}
      {!ctaVisible && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-navy-100 bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(22_41_58/0.25)] motion-safe:animate-rise lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3" aria-live="polite">
            {confirmed ? (
              <>
                <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-success-700">
                  <Icon name="check" className="size-5" strokeWidth={2.5} />
                  Container toegevoegd!
                </p>
                <Link href={routes.cart} className={buttonStyles({ className: "shrink-0" })}>
                  Afronden
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <p className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate text-sm text-navy-700">
                    {variant.size} {title.toLowerCase()}
                  </span>
                  <span className="font-display text-xl font-extrabold">{variant.price}</span>
                  <span className="ml-1 text-xs text-navy-500">all-in</span>
                </p>
                <button type="submit" form={formId} disabled={pending} className={buttonStyles({ className: "shrink-0" })}>
                  {pending ? "Toevoegen…" : "In winkelwagen"}
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
