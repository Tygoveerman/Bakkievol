"use client";

import { useActionState, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { saveDeliveryAction, type DeliveryState } from "@/lib/commerce/actions";
import { checkPostcode } from "@/lib/delivery";
import { siteConfig } from "@/lib/site";

const initial: DeliveryState = { status: "idle" };

/**
 * Korte bestelstap vóór de checkout: postcode, leverdatum, plaatsing.
 * Wordt opgeslagen als cart-attributen (Shopify) — het adres zelf vult de
 * klant pas in de checkout in, zodat niets dubbel gevraagd wordt.
 */
export function DeliveryForm({
  defaults,
  minDate,
}: {
  defaults: Record<string, string>;
  /** Vroegst kiesbare datum (YYYY-MM-DD). */
  minDate: string;
}) {
  const [state, action, pending] = useActionState(saveDeliveryAction, initial);
  const [postcode, setPostcode] = useState(defaults.Postcode ?? "");
  const [timing, setTiming] = useState(defaults.Levering === "Op gekozen datum" ? "date" : "asap");
  const check = postcode.trim().length >= 4 ? checkPostcode(postcode) : null;

  const radio = (name: string, value: string, label: string, hint: string, checked: boolean, onChange?: () => void) => (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-[box-shadow,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-900 ${
        checked ? "bg-accent-50 ring-2 ring-accent-600" : "bg-white ring-1 ring-navy-100 hover:ring-navy-300"
      }`}
    >
      <input type="radio" name={name} value={value} defaultChecked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-accent-600 bg-accent-600" : "border-navy-200"}`}
      >
        {checked && <span className="size-2 rounded-full bg-white" />}
      </span>
      <span className="leading-snug">
        <span className="block font-semibold text-navy-900">{label}</span>
        <span className="text-sm text-navy-500">{hint}</span>
      </span>
    </label>
  );

  const [placement, setPlacement] = useState(
    defaults.Plaatsing?.startsWith("Openbare") ? "openbare-weg" : "eigen-terrein",
  );

  return (
    <form action={action} className="space-y-8" noValidate>
      {/* Postcode */}
      <div>
        <label htmlFor="postcode" className="block font-display text-lg font-bold text-navy-900">
          Waar moet de container komen?
        </label>
        <p className="mt-1 text-sm text-navy-500">Het volledige adres vul je in bij het afrekenen.</p>
        <div className="mt-3 max-w-xs">
          <input
            id="postcode"
            name="postcode"
            value={postcode}
            onChange={(event) => setPostcode(event.target.value)}
            autoComplete="postal-code"
            placeholder="Postcode, bijv. 1811 AB"
            maxLength={7}
            aria-invalid={state.status === "error" && state.field === "postcode"}
            aria-describedby="postcode-hint"
            className="h-12 w-full rounded-xl border border-navy-200 bg-white px-4 text-navy-900 uppercase placeholder:text-navy-300 placeholder:normal-case focus-visible:border-navy-900 focus-visible:outline-none"
          />
        </div>
        <p id="postcode-hint" className="mt-2 min-h-5 text-sm" aria-live="polite">
          {state.status === "error" && state.field === "postcode" ? (
            <span className="text-danger-600">{state.message}</span>
          ) : check === "deliverable" ? (
            <span className="inline-flex items-center gap-1.5 text-success-700">
              <Icon name="check" className="size-4" strokeWidth={2.5} /> We leveren in jouw regio.
            </span>
          ) : check === "outside" ? (
            <span className="text-navy-700">
              Hier leveren we niet online. Bel {siteConfig.contact.phone}, dan kijken we wat er kan.
            </span>
          ) : null}
        </p>
      </div>

      {/* Leverdatum */}
      <fieldset>
        <legend className="font-display text-lg font-bold text-navy-900">Wanneer wil je hem hebben?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {radio("timing", "asap", "Zo snel mogelijk", "Voor 11:00 besteld: vaak vandaag nog", timing === "asap", () => setTiming("asap"))}
          {radio("timing", "date", "Zelf een datum kiezen", "Ma t/m za", timing === "date", () => setTiming("date"))}
        </div>
        {timing === "date" && (
          <div className="mt-3 max-w-xs motion-safe:animate-rise">
            <label htmlFor="date" className="sr-only">
              Leverdatum
            </label>
            <input
              id="date"
              name="date"
              type="date"
              min={minDate}
              defaultValue={defaults.Leverdatum ?? ""}
              aria-invalid={state.status === "error" && state.field === "date"}
              className="h-12 w-full rounded-xl border border-navy-200 bg-white px-4 text-navy-900 focus-visible:border-navy-900 focus-visible:outline-none"
            />
            {state.status === "error" && state.field === "date" && (
              <p className="mt-2 text-sm text-danger-600">{state.message}</p>
            )}
          </div>
        )}
      </fieldset>

      {/* Plaatsing */}
      <fieldset>
        <legend className="font-display text-lg font-bold text-navy-900">Waar plaatsen we hem?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {radio("placement", "eigen-terrein", "Eigen terrein of oprit", "Meestal geen vergunning nodig", placement === "eigen-terrein", () => setPlacement("eigen-terrein"))}
          {radio("placement", "openbare-weg", "Openbare weg", "Vergunning van de gemeente nodig", placement === "openbare-weg", () => setPlacement("openbare-weg"))}
        </div>
      </fieldset>

      {/* Opmerking */}
      <div>
        <label htmlFor="notes" className="font-display text-lg font-bold text-navy-900">
          Opmerking <span className="text-sm font-medium text-navy-500">(optioneel)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaults.Opmerking ?? ""}
          placeholder="Bijv. graag links op de oprit, poort is open"
          className="mt-3 w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 placeholder:text-navy-300 focus-visible:border-navy-900 focus-visible:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={buttonStyles({ variant: "dark", size: "lg" })}>
          {pending ? "Opslaan…" : "Gegevens opslaan"}
        </button>
        {state.status === "saved" && (
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-success-700" role="status">
            <Icon name="check" className="size-4" strokeWidth={2.5} /> Opgeslagen
          </p>
        )}
      </div>
    </form>
  );
}
