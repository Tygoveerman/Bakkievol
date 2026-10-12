"use client";

import { useSyncExternalStore } from "react";

import { getDeliveryEstimate } from "@/lib/delivery";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(timer);
}
const currentMinute = () => Math.floor(Date.now() / 60_000);

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} u ${rest} min` : `${rest} min`;
}

/**
 * Levermelding op basis van de actuele tijd (NL). Bewust voorzichtig
 * geformuleerd ("mogelijk", "meestal"): het is een indicatie, geen garantie.
 */
export function DeliveryPromise({
  className = "",
  tone = "success",
}: {
  className?: string;
  tone?: "success" | "light";
}) {
  const minute = useSyncExternalStore(subscribe, currentMinute, () => null);

  let message = "Voor 11:00 besteld? Vaak vandaag nog geleverd.";
  if (minute !== null) {
    const estimate = getDeliveryEstimate(new Date(minute * 60_000));
    message =
      estimate.kind === "today"
        ? `Bestel binnen ${formatDuration(estimate.minutesLeft)}, dan leveren we mogelijk vandaag nog.`
        : `Bestel nu, dan leveren we meestal ${estimate.dayLabel}.`;
  }

  return (
    <p
      className={`flex items-start gap-2 text-sm ${tone === "light" ? "text-white" : "text-success-700"} ${className}`}
    >
      <span className="relative mt-1.5 flex size-2 shrink-0">
        <span
          className={`absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping ${tone === "light" ? "bg-white" : "bg-success-600"}`}
        />
        <span
          className={`relative inline-flex size-2 rounded-full ${tone === "light" ? "bg-white" : "bg-success-600"}`}
        />
      </span>
      <span aria-live="polite">{message}</span>
    </p>
  );
}
