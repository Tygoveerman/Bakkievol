import type { CSSProperties } from "react";

const TYPE_START = 150; // ms na laden
const TYPE_STEP = 45; // ms per letter
const LETTERS = [..."BAKKIE"];
const VOL_AT = TYPE_START + LETTERS.length * TYPE_STEP + 60;
const NL_AT = VOL_AT + 300;

/**
 * Woordmerk BAKKIEVOL.nl, als tekst zodat het scherp en licht blijft.
 *
 * `animated` (alleen in de header): bij het laden wordt "BAKKIE" getypt
 * (met cursor), springt "VOL" groot in beeld en veert terug, en schuift
 * ".nl" aan. Pure CSS (zie .logo-* in globals.css); speelt alleen bij een
 * volledige pagina-load omdat de header bij navigatie blijft staan.
 * Bij hover veert "VOL" subtiel op.
 */
export function Logo({
  tone = "light",
  animated = false,
}: {
  tone?: "light" | "dark";
  animated?: boolean;
}) {
  const base = tone === "dark" ? "text-white" : "text-navy-900";
  const className = `font-display text-[1.375rem] leading-none font-extrabold tracking-[-0.03em] whitespace-nowrap ${base}`;

  if (!animated) {
    return (
      <span className={className}>
        BAKKIE<span className="text-accent-500">VOL</span>
        <span className="font-bold">.nl</span>
      </span>
    );
  }

  return (
    <span className={`logo-animated group/logo ${className}`}>
      {LETTERS.map((letter, index) => (
        <span
          key={index}
          className="logo-char"
          style={
            {
              "--t": `${TYPE_START + index * TYPE_STEP}ms`,
              // De cursor blijft na de laatste letter staan tot VOL verschijnt.
              "--hold": `${index === LETTERS.length - 1 ? VOL_AT - (TYPE_START + index * TYPE_STEP) : TYPE_STEP}ms`,
            } as CSSProperties
          }
        >
          {letter}
        </span>
      ))}
      <span className="logo-vol text-accent-500" style={{ "--t": `${VOL_AT}ms` } as CSSProperties}>
        <span className="logo-vol-inner">VOL</span>
      </span>
      <span className="logo-nl font-bold" style={{ "--t": `${NL_AT}ms` } as CSSProperties}>
        .nl
      </span>
    </span>
  );
}
