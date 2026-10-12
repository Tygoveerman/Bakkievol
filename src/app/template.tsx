import type { ReactNode } from "react";

/**
 * Elke route-wissel (her)mount deze template: de nieuwe pagina komt zacht
 * in beeld. Geen effect bij "minder beweging" (zie .page-enter in globals.css).
 */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
