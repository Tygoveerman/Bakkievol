"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Eén observer voor de hele site: elementen met `data-reveal` krijgen
 * `data-revealed` zodra ze in beeld komen (eenmalig). De animaties zelf
 * staan in globals.css. Nieuwe elementen (route-wissel, filters) worden
 * automatisch meegenomen.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.add("motion-ready", "motion-live");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      // Vroeg triggeren: zodra de bovenkant net in beeld komt.
      { rootMargin: "0px 0px -24px 0px", threshold: 0 },
    );

    // Pas observeren als React het element heeft gehydrateerd. Gestreamde
    // delen (Suspense) hydrateren later dan deze layout-component; een
    // attribuut zetten op nog niet gehydrateerde HTML geeft een hydration-
    // mismatch. Nog niet klaar? Dan kort daarna opnieuw proberen.
    let retry = 0;
    let retries = 0;
    const scan = () => {
      let pending = false;
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((element) => {
        if (isHydrated(element)) io.observe(element);
        else pending = true;
      });
      window.clearTimeout(retry);
      if (pending && retries++ < 100) retry = window.setTimeout(scan, 50);
    };

    scan();
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        retries = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, [pathname]);

  return null;
}

/** React koppelt bij hydratie een interne `__reactFiber$…`-sleutel aan elk DOM-element. */
function isHydrated(element: Element) {
  return Object.keys(element).some((key) => key.startsWith("__reactFiber$"));
}
