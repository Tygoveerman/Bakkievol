import type { CSSProperties, ReactNode } from "react";

import { RevealText } from "@/components/motion/reveal-text";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  tone = "light",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && (
        <p
          data-reveal="up"
          className={`mb-3 inline-flex items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase ${dark ? "text-accent-500" : "text-accent-700"}`}
        >
          <span aria-hidden="true" className="h-0.5 w-5 rounded-full bg-accent-500" />
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        {...(typeof title === "string"
          ? { "data-reveal": "text", "aria-label": title }
          : { "data-reveal": "up" })}
        style={{ "--d": eyebrow ? "40ms" : "0ms" } as CSSProperties}
        className={`font-display text-3xl leading-[1.08] font-bold tracking-[-0.025em] text-balance sm:text-4xl lg:text-[2.75rem] ${dark ? "text-white" : "text-navy-900"}`}
      >
        {typeof title === "string" ? <RevealText segments={[title]} delay={eyebrow ? 40 : 0} step={70} /> : title}
      </h2>
      {intro && (
        <p
          data-reveal="up"
          style={{ "--d": "200ms" } as CSSProperties}
          className={`mt-4 text-base leading-relaxed text-pretty sm:text-lg ${dark ? "text-navy-200" : "text-navy-500"}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
