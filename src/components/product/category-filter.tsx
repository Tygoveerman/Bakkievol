"use client";

import { useState, type ReactNode } from "react";

/**
 * Filterchips boven een productlijst. De kaarten worden server-side
 * gerenderd en als nodes doorgegeven; standaard is alles zichtbaar (SEO).
 */
export function CategoryFilter({
  items,
  allLabel = "Alle",
}: {
  items: { key: string; category: string; node: ReactNode }[];
  allLabel?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const categories = [...new Set(items.map((item) => item.category))];
  const visible = active ? items.filter((item) => item.category === active) : items;

  const chip = (label: string, value: string | null, count: number) => {
    const pressed = active === value;
    return (
      <button
        key={label}
        type="button"
        aria-pressed={pressed}
        onClick={() => setActive(value)}
        className={`inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-2 focus-visible:outline-none ${
          pressed
            ? "bg-navy-900 text-white"
            : "bg-white text-navy-700 ring-1 ring-navy-200 hover:bg-navy-50 hover:ring-navy-300"
        }`}
      >
        {label}
        <span
          className={`rounded-full px-1.5 text-xs tabular-nums ${pressed ? "bg-white/20 text-white" : "bg-navy-50 text-navy-500"}`}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <>
      <div
        role="group"
        aria-label="Filter op soort klus"
        data-reveal="up"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {chip(allLabel, null, items.length)}
        {categories.map((category) =>
          chip(category, category, items.filter((item) => item.category === category).length),
        )}
      </div>
      <ul
        aria-live="polite"
        data-reveal="stagger"
        className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-5"
      >
        {visible.map((item) => (
          <li key={item.key}>{item.node}</li>
        ))}
      </ul>
    </>
  );
}
