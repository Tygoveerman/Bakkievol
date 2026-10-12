"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { ContainerSize } from "@/content/home";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

import { goToConfigurator } from "./order-store";

export function SizeHelper({
  jobs,
  sizes,
  prices,
  onChoose,
  available,
  compact = false,
  source = "formaten",
}: {
  jobs: { label: string; size: string; note: string }[];
  sizes: ContainerSize[];
  /** Vanaf-prijs per formaat, al geformatteerd. */
  prices: Record<string, string>;
  /** Formaten die hier te bestellen zijn; zonder = alle formaten. */
  available?: string[];
  /** Zonder: door naar de bestelmodule. Met: formaat direct overnemen (pop-up). */
  onChoose?: (size: string) => void;
  /** Eén kolom, voor de pop-up. */
  compact?: boolean;
  /** Waar de keuzehulp staat, voor analytics. */
  source?: string;
}) {
  const router = useRouter();
  const [jobIndex, setJobIndex] = useState<number | null>(null);
  const job = jobIndex === null ? null : jobs[jobIndex];
  // Bestaat het geadviseerde formaat hier niet? Dan het eerstvolgende
  // grotere formaat dat wel kan (of anders het grootste).
  const offered = sizes.filter((s) => !available || available.includes(s.value));
  const advised = job ? sizes.find((s) => s.value === job.size) : null;
  const size = advised
    ? offered.includes(advised)
      ? advised
      : offered.find((s) => sizes.indexOf(s) > sizes.indexOf(advised)) ?? offered.at(-1) ?? null
    : null;
  const substituted = Boolean(advised && size && size !== advised);

  return (
    <div className={compact ? "grid gap-5" : "grid gap-6 lg:grid-cols-12 lg:gap-10"}>
      <fieldset className={compact ? "" : "lg:col-span-7"}>
        <legend className="font-display text-lg font-bold text-navy-900">Wat ga je doen?</legend>
        <div className={`mt-4 grid gap-2 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}>
          {jobs.map((option, index) => {
            const checked = jobIndex === index;
            return (
              <label
                key={option.label}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl font-medium ${compact ? "px-3 py-2.5 text-sm leading-snug" : "px-4 py-3 text-[15px]"} transition-[box-shadow,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-navy-900 ${
                  checked ? "bg-accent-50 ring-2 ring-accent-600" : "bg-white ring-1 ring-navy-100 hover:ring-navy-900"
                }`}
              >
                <input
                  type="radio"
                  name="klus"
                  checked={checked}
                  onChange={() => {
                    setJobIndex(index);
                    track("size_helper_select_job", { source, job: option.label, item_variant: option.size });
                  }}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? "border-accent-600 bg-accent-600" : "border-navy-200"}`}
                >
                  {checked && <span className="size-2 rounded-full bg-white" />}
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className={compact ? "" : "lg:col-span-5"} aria-live="polite">
        {job && size ? (
          <div className="h-full rounded-2xl bg-navy-900 p-6 text-white motion-safe:animate-rise">
            <p className="text-sm text-navy-200">Ons advies</p>
            <p className="mt-1 font-display text-4xl font-extrabold tracking-[-0.03em]">{size.value}</p>
            <p className="mt-1 text-navy-100">
              {size.label} · ± {size.wheelbarrows} kruiwagens
              {prices[size.value] && <> · vanaf {prices[size.value]}</>}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-navy-200">
              {substituted
                ? sizes.indexOf(size) < sizes.indexOf(advised!)
                  ? `Voor deze klus adviseren we meestal ${advised?.value}, maar voor deze afvalsoort is ${size.value} het grootste formaat. Veel afval? Bestel er twee of bel ons even.`
                  : `Voor deze klus adviseren we meestal ${advised?.value}. Dat formaat is er niet voor deze afvalsoort, ${size.value} komt het dichtst in de buurt.`
                : job.note}
            </p>
            <button
              type="button"
              onClick={() => {
                track("size_helper_choose_size", { source, job: job.label, item_variant: size.value });
                if (onChoose) onChoose(size.value);
                else goToConfigurator({ size: size.value }, router.push);
              }}
              className={buttonStyles({ size: "lg", className: "mt-6 w-full" })}
            >
              {onChoose ? `Kies ${size.value}` : `Kies afvalsoort voor ${size.value}`}
              <Icon name="arrow-right" className="size-5" />
            </button>
            <p className="mt-3 text-center text-sm text-navy-200">
              Twijfel je nog?{" "}
              <a href={siteConfig.contact.phoneHref} className="font-semibold text-white underline underline-offset-4">
                Bel {siteConfig.contact.phone}
              </a>
            </p>
          </div>
        ) : (
          <div className={`${compact ? "hidden" : "flex"} h-full flex-col justify-center rounded-2xl border border-dashed border-navy-200 p-6 text-navy-500`}>
            <Icon name="box" className="size-7 text-navy-300" />
            <p className="mt-3 font-semibold text-navy-900">Kies je klus</p>
            <p className="mt-1 text-sm leading-relaxed">
              We adviseren direct het juiste formaat. Twijfel je tussen twee maten? Kies de grootste,
              dan hoef je niet bij te bestellen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
