import Image from "next/image";

import type { ContainerSize } from "@/content/home";

/** Hoogte van het vlak t.o.v. de breedte; ruim genoeg voor het hoogste formaat. */
const BOX_RATIO = 0.32;

/**
 * Toont de juiste container per formaat (3–10 m³ portaal, 15–20 m³ afzet).
 * Alle formaten liggen op elkaar; bij wisselen vervaagt de oude foto terwijl
 * alle lagen meeschalen naar de omvang van het nieuwe formaat. Zo "groeit"
 * de container vloeiend door, ook als de vorm verandert. De breedte volgt
 * de (indicatieve) lengte, dus de formaten kloppen onderling op schaal.
 */
export function ContainerVisual({
  sizes,
  active,
  sizesAttr = "(min-width: 1024px) 420px, 90vw",
  priority = false,
  className = "",
}: {
  sizes: ContainerSize[];
  /** Waarde van het gekozen formaat, bijv. "6 m³". */
  active: string | null | undefined;
  sizesAttr?: string;
  priority?: boolean;
  className?: string;
}) {
  const maxLength = Math.max(...sizes.map((s) => s.lengthM));
  const box = (s: ContainerSize) => {
    const width = s.lengthM / maxLength;
    return { width, height: (width * s.image.height) / s.image.width };
  };
  const current = sizes.find((s) => s.value === active) ?? sizes.find((s) => s.popular) ?? sizes[0];
  const target = box(current);

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: `1 / ${BOX_RATIO}` }}
    >
      <span
        aria-hidden="true"
        style={{ width: `${target.width * 80}%` }}
        className="absolute bottom-0 left-1/2 h-4 -translate-x-1/2 rounded-[50%] bg-navy-900/15 blur-md transition-[width] duration-500 ease-out motion-reduce:transition-none"
      />
      {sizes.map((s) => {
        const own = box(s);
        const isActive = s === current;
        // Pas binnen het vlak van het actieve formaat (nooit groter dan dat).
        const scale = Math.min(target.width / own.width, target.height / own.height);
        return (
          <Image
            key={s.value}
            src={s.image.src}
            alt={isActive ? `Container van ${s.value}` : ""}
            aria-hidden={!isActive}
            width={s.image.width}
            height={s.image.height}
            sizes={sizesAttr}
            priority={priority && isActive}
            style={{
              width: `${own.width * 100}%`,
              opacity: isActive ? 1 : 0,
              transform: `translateX(-50%) scale(${scale})`,
              // Nieuwe foto snel erin, oude iets later eruit: nooit een "gat".
              transition: isActive
                ? "opacity 250ms ease-out, transform 500ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "opacity 350ms ease-in 150ms, transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="absolute bottom-0 left-1/2 h-auto origin-bottom motion-reduce:!transition-none"
          />
        );
      })}
    </div>
  );
}
