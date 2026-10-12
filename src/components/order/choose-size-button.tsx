"use client";

import { useRouter } from "next/navigation";

import { Icon } from "@/components/ui/icon";

import { goToConfigurator } from "./order-store";

/** Kiest een formaat in de configurator en scrollt erheen. */
export function ChooseSizeButton({ size, stretched = false }: { size: string; stretched?: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        goToConfigurator({ size }, router.push);
      }}
      className={`inline-flex items-center gap-1 rounded-full border border-navy-200 px-3 py-1.5 text-sm font-semibold text-navy-900 transition-colors group-hover:border-accent-600 group-hover:bg-accent-600 group-hover:text-white ${stretched ? "after:absolute after:inset-0 after:rounded-2xl" : ""}`}
    >
      Kies {size}
      <Icon name="arrow-right" className="size-4" />
    </button>
  );
}
