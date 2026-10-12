"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site";
import { routes } from "@/lib/routes";

export type MegaMenuItem = {
  href: string;
  title: string;
  image: string | null;
  fromPrice: string;
  badge: string | null;
};

/** Desktop mega-menu "Containers": afvalsoorten met foto en prijs. */
export function MegaMenu({ items, sizes }: { items: MegaMenuItem[]; sizes: string[] }) {
  const [open, setOpen] = useState(false);
  const inSection = usePathname().startsWith(routes.containers);
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 150);
  };
  const close = () => setOpen(false);

  return (
    <li ref={rootRef} onMouseEnter={show} onMouseLeave={hide}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[15px] font-medium whitespace-nowrap transition-colors ${open || inSection ? "bg-navy-50 font-semibold text-navy-900" : "text-navy-700 hover:bg-navy-50 hover:text-navy-900"}`}
      >
        Containers
        <Icon
          name="chevron-down"
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-t border-navy-100 bg-white shadow-[0_24px_48px_-24px_rgb(14_28_41/0.35)] motion-safe:animate-rise"
      >
        <Container className="grid grid-cols-12 gap-8 py-8">
          <div className="col-span-9">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-[13px] font-bold tracking-[0.08em] text-accent-700 uppercase">
                Kies je afvalsoort
              </p>
              <Link
                href={routes.containers}
                onClick={close}
                className="inline-flex items-center gap-1 text-sm font-semibold text-navy-900 underline-offset-4 hover:underline"
              >
                Alle containers bekijken
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-5 gap-3">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={close} className="group block">
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-navy-50">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="180px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      {item.badge && (
                        <span className="absolute top-2 left-2 rounded-full bg-accent-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block text-sm leading-tight font-bold text-navy-900 group-hover:text-accent-700">
                      {item.title}
                    </span>
                    <span className="text-xs text-navy-500">vanaf {item.fromPrice}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-3 flex flex-col gap-4">
            <div>
              <p className="text-[13px] font-bold tracking-[0.08em] text-accent-700 uppercase">
                Formaten
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <li key={size}>
                    <Link
                      href={routes.sizes}
                      onClick={close}
                      className="inline-flex rounded-full px-3 py-1.5 text-sm font-semibold text-navy-900 ring-1 ring-navy-200 hover:bg-navy-900 hover:text-white hover:ring-navy-900"
                    >
                      {size}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto rounded-2xl bg-accent-600 p-5 text-white">
              <p className="font-display text-lg font-bold">Twijfel je?</p>
              <p className="mt-1 text-sm text-white/90">
                We helpen je binnen 1 minuut aan de juiste container.
              </p>
              <div className="mt-4 flex flex-col gap-2 text-sm font-bold">
                <Link href={routes.sizeHelper} onClick={close} className="inline-flex items-center gap-1.5 hover:underline">
                  Help mij kiezen <Icon name="arrow-right" className="size-4" />
                </Link>
                <a href={siteConfig.contact.phoneHref} className="inline-flex items-center gap-1.5 hover:underline">
                  <Icon name="phone" className="size-4" /> {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </li>
  );
}
