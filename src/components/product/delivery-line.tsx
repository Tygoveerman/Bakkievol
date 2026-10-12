"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { Icon } from "@/components/ui/icon";
import { getDeliveryEstimate } from "@/lib/delivery";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(timer);
}
const currentMinute = () => Math.floor(Date.now() / 60_000);

type Region = "inside" | "outside" | "unknown";

/**
 * Leverregel onder de bestelknop: "Vandaag geleverd" (voor 11:00 op een
 * leverdag) of "Morgen geleverd". Het levergebied wordt bepaald via de
 * IP-regio (zie /api/regio); onbekend = we gaan uit van Noord-Holland.
 */
export function DeliveryLine({ className = "" }: { className?: string }) {
  const minute = useSyncExternalStore(subscribe, currentMinute, () => null);
  const [region, setRegion] = useState<Region>("unknown");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/regio")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { country: string | null; region: string | null } | null) => {
        if (cancelled || !data?.country) return;
        setRegion(data.country === "NL" && data.region === "NH" ? "inside" : "outside");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (region === "outside") {
    return (
      <p className={`flex items-center justify-center gap-2 text-sm text-navy-500 ${className}`}>
        <Icon name="truck" className="size-4 shrink-0" />
        We leveren in heel Noord-Holland
      </p>
    );
  }

  const estimate = minute === null ? null : getDeliveryEstimate(new Date(minute * 60_000));
  const day = estimate === null ? "Snel" : estimate.kind === "today" ? "Vandaag" : capitalize(estimate.dayLabel);

  return (
    <p className={`flex items-center justify-center gap-2 text-sm text-navy-700 ${className}`}>
      <Icon name="truck" className="size-4 shrink-0 text-success-600" />
      <span>
        <strong className="font-semibold text-success-700">{day} geleverd</strong> in Noord-Holland
        {estimate?.kind === "today" && <span className="text-navy-500"> · bestel voor 11:00</span>}
      </span>
    </p>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
