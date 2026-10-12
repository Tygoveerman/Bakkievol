"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

let instance: Lenis | null = null;

/** Huidige Lenis-instantie (null bij "minder beweging"). */
export function getLenis() {
  return instance;
}

/**
 * Zacht scrollen, afgestemd op de Kanva-referentie (gemeten: ±55% van de
 * scrollafstand na 165 ms, stil na ±1 s → Lenis-standaard lerp 0.1).
 * Touch blijft native. Bij `prefers-reduced-motion` doen we niets.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      autoRaf: true,
      autoToggle: true, // stopt vanzelf als een menu overflow:hidden zet
      anchors: { offset: -96 },
    });
    instance = lenis;

    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);

  useResetOnNavigate();

  return null;
}

/**
 * Lenis houdt een eigen (geanimeerde) scrollpositie bij. Bij een
 * paginawissel zet Next het venster bovenaan, maar Lenis scrollde daarna
 * door naar zijn oude doel: je landde halverwege de nieuwe pagina. Daarom
 * bij elke nieuwe route Lenis direct naar boven zetten. Uitzonderingen:
 * terug/vooruit (de browser herstelt de positie) en links met een #anker.
 */
function useResetOnNavigate() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const onPopState = () => {
      popped = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // Eerste keer laden: niets doen (de browser herstelt bij verversen zelf).
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const lenis = instance;
    if (popped) {
      popped = false;
      lenis?.resize();
      return;
    }
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);
}

let popped = false;
