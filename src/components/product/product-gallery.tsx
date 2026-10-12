"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductImage } from "@/lib/commerce/types";

/** Productfoto's met miniaturen. Eerste foto laadt met prioriteit (LCP). */
export function ProductGallery({ images, badge }: { images: ProductImage[]; badge: string | null }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-navy-50">
        <Image
          key={current.url}
          src={current.url}
          alt={current.altText}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 680px, 100vw"
          className="value-swap object-cover"
        />
        {badge && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-navy-900 shadow-sm">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-600" />
            {badge}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Toon foto ${index + 1}: ${image.altText}`}
              aria-pressed={active === index}
              className={`relative aspect-[4/3] w-24 overflow-hidden rounded-xl transition-[box-shadow,opacity] sm:w-28 ${
                active === index ? "ring-2 ring-accent-600" : "opacity-70 ring-1 ring-navy-100 hover:opacity-100"
              }`}
            >
              <Image src={image.url} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
