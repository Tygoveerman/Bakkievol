import type { CSSProperties, ReactNode } from "react";

export type RevealSegment = string | { text: string; className?: string } | { br: true };

/**
 * Tekst die met een zachte blur in beeld komt (stijl: per woord, of per
 * letter voor korte koppen). Server component: splitst de tekst in spans;
 * de trigger komt van <RevealObserver>.
 *
 * - `by="word"`  (standaard) — voor sectie- en paginatitels
 * - `by="letter"` — voor korte, grote koppen (hero). Regels (na {br}) starten
 *   tegelijk met een kleine verschuiving, zodat je nergens op hoeft te wachten.
 *
 * Gebruik binnen een element met `data-reveal="text"` en `aria-label`, zodat
 * screenreaders de zin in één keer voorlezen.
 */
export function RevealText({
  segments,
  delay = 0,
  by = "word",
  step = by === "letter" ? 55 : 90,
  lineOffset = 160,
}: {
  segments: RevealSegment[];
  /** Startvertraging in ms. */
  delay?: number;
  by?: "word" | "letter";
  /** Tijd tussen opeenvolgende woorden/letters in ms. */
  step?: number;
  /** Extra vertraging per nieuwe regel (alleen bij {br}) in ms. */
  lineOffset?: number;
}) {
  const parts: ReactNode[] = [];
  let line = 0;
  let index = 0;
  const nextDelay = () => `${delay + line * lineOffset + index++ * step}ms`;

  segments.forEach((segment, s) => {
    if (typeof segment === "object" && "br" in segment) {
      line += 1;
      index = 0;
      parts.push(<br key={s} />);
      return;
    }
    const { text, className } =
      typeof segment === "string" ? { text: segment, className: undefined } : segment;

    const words: ReactNode[] = [];
    text.split(/(\s+)/).forEach((word, w) => {
      if (word === "" || /^\s+$/.test(word)) {
        words.push(word);
      } else if (by === "word") {
        words.push(
          <span key={w} className="rv-char" style={{ "--t": nextDelay() } as CSSProperties}>
            {word}
          </span>,
        );
      } else {
        const letters = [...word].map((char, c) => (
          <span key={c} className="rv-char" style={{ "--t": nextDelay() } as CSSProperties}>
            {char}
          </span>
        ));
        words.push(
          <span key={w} className="inline-block whitespace-nowrap">
            {letters}
          </span>,
        );
      }
    });
    parts.push(
      <span key={s} className={className}>
        {words}
      </span>,
    );
  });

  return <span aria-hidden="true">{parts}</span>;
}

/** Platte tekst van segmenten, voor `aria-label`. */
export function segmentsToText(segments: RevealSegment[]) {
  return segments
    .map((segment) =>
      typeof segment === "string" ? segment : "br" in segment ? " " : segment.text,
    )
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}
