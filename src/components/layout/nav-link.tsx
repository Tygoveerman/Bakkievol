"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/** Navigatielink die zichzelf markeert als actieve pagina (aria-current). */
export function NavLink({
  href,
  className = "",
  activeClassName = "",
  ...props
}: ComponentProps<typeof Link> & { href: string; activeClassName?: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${className} ${active ? activeClassName : ""}`}
      {...props}
    />
  );
}
