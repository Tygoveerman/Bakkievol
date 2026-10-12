"use client";

import { useRef } from "react";

import { Icon } from "@/components/ui/icon";
import { sizeHelperJobs, type ContainerSize } from "@/content/home";
import { track } from "@/lib/analytics";

import { SizeHelper } from "./size-helper";

/**
 * "Help mij kiezen" als pop-up op de huidige pagina (geen paginawissel).
 * Mobiel een bottom sheet, desktop een gecentreerd venster. Meetbaar via
 * size_helper_open / _select_job / _choose_size / _close (met `source`).
 */
export function SizeHelperDialog({
  sizes,
  prices,
  available,
  onChoose,
  source,
  className = "",
}: {
  sizes: ContainerSize[];
  prices: Record<string, string>;
  available?: string[];
  onChoose: (size: string) => void;
  source: string;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const chosen = useRef(false);

  function open() {
    chosen.current = false;
    dialogRef.current?.showModal();
    track("size_helper_open", { source });
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className={`shrink-0 text-xs font-semibold text-accent-700 underline-offset-4 hover:underline ${className}`}
      >
        Help mij kiezen
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${source}-size-helper-title`}
        onClose={() => {
          if (!chosen.current) track("size_helper_close", { source });
        }}
        onClick={(event) => {
          // Klik op de achtergrond sluit de pop-up.
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
        className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-0 text-navy-900 shadow-float backdrop:bg-navy-950/50 backdrop:backdrop-blur-[2px] open:motion-safe:animate-rise sm:m-auto sm:max-w-xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy-100 bg-white px-5 pt-5 pb-4 sm:px-7">
          <div>
            <p id={`${source}-size-helper-title`} className="font-display text-xl font-bold tracking-[-0.02em]">
              Welk formaat heb je nodig?
            </p>
            <p className="mt-0.5 text-sm text-navy-500">Kies je klus, dan adviseren we direct.</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Sluiten"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-900 transition-colors hover:bg-navy-100"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>
        <div className="px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7 sm:pb-7">
          <SizeHelper
            jobs={sizeHelperJobs}
            sizes={sizes}
            prices={prices}
            compact
            available={available}
            source={source}
            onChoose={(size) => {
              chosen.current = true;
              onChoose(size);
              dialogRef.current?.close();
            }}
          />
        </div>
      </dialog>
    </>
  );
}
