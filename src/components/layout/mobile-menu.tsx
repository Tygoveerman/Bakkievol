"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site";

import { Logo } from "./logo";
import { mainNavigation } from "./navigation";
import { NavLink } from "./nav-link";
import { routes } from "@/lib/routes";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-navy-50"
      >
        <Icon name="menu" className="size-6" />
        <span className="sr-only">Menu openen</span>
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-white motion-safe:animate-rise"
        >
          <div className="flex h-16 items-center justify-between border-b border-navy-100 px-4 sm:px-6">
            <Link href="/" onClick={close} aria-label="Bakkievol, naar de homepage">
              <Logo />
            </Link>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="inline-flex size-11 items-center justify-center rounded-full text-navy-900 hover:bg-navy-50"
            >
              <Icon name="close" className="size-6" />
              <span className="sr-only">Menu sluiten</span>
            </button>
          </div>
          <nav aria-label="Hoofdmenu mobiel" className="px-4 pt-2 pb-8 sm:px-6">
            <ul className="divide-y divide-navy-100">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    onClick={close}
                    className="flex items-center justify-between py-4 font-display text-xl font-semibold text-navy-900"
                    activeClassName="!text-accent-700"
                  >
                    {item.label}
                    <Icon name="arrow-right" className="size-5 text-navy-300" />
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <Link
                href={routes.order}
                onClick={close}
                className={buttonStyles({ size: "lg", className: "w-full" })}
              >
                Container bestellen
              </Link>
              <a
                href={siteConfig.contact.phoneHref}
                className={buttonStyles({ variant: "outline", size: "lg", className: "w-full" })}
              >
                <Icon name="phone" className="size-5" />
                Bel {siteConfig.contact.phone}
              </a>
            </div>
            <p className="mt-6 text-center text-sm text-navy-500">
              Bereikbaar {siteConfig.contact.hours.toLowerCase()}
            </p>
          </nav>
        </div>
      )}
    </div>
  );
}
