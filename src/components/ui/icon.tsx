import type { SVGProps } from "react";

/**
 * Eén lichtgewicht icon-set (inline SVG, 24×24, stroke = currentColor).
 * Geen icon-library nodig; voeg hier nieuwe iconen toe.
 */
const paths = {
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "arrow-left": <path d="M19 12H5m6-6-6 6 6 6" />,
  "map-pin": (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.25" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 5 6v5.5c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  phone: (
    <path d="M5 4h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2.2l2.3 11h10.8l2.2-8H6.4" />
      <circle cx="9" cy="19.5" r="1.25" />
      <circle cx="17" cy="19.5" r="1.25" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  euro: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 8.8a3.6 3.6 0 0 0-6 2.7 3.6 3.6 0 0 0 6 2.7M7.5 10.8h5M7.5 13h5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  permit: (
    <>
      <path d="M6 3.5h8l4 4v13H6Z" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" />
      <circle cx="6.5" cy="17.5" r="1.75" />
      <circle cx="17" cy="17.5" r="1.75" />
    </>
  ),
  recycle: (
    <>
      <path d="m8 9.5-2.7 4.6a2 2 0 0 0 1.7 3h4.5M10 4.8l1.3-.6a2 2 0 0 1 2.4.8l3 5M14.5 19.5l3.5-.1a2 2 0 0 0 1.6-3l-1.3-2.2" />
      <path d="m6 6.8 2 2.7 3.3-.4M18.7 12.3l-1.2-3.1-3.2 1M13 16.5l-1.5 3 2.5 2" />
    </>
  ),
  box: (
    <>
      <path d="M3 8.5h18l-2 10.5H5Z" />
      <path d="M3 8.5 5 5h14l2 3.5" />
    </>
  ),
  star: (
    <path
      d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8Z"
      fill="currentColor"
      stroke="none"
    />
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "size-5",
  ...props
}: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-icon={name}
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
