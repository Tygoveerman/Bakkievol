import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "dark" | "white" | "outline" | "outline-dark" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0 [&>svg[data-icon=arrow-right]]:transition-transform [&>svg[data-icon=arrow-right]]:duration-300 hover:[&>svg[data-icon=arrow-right]]:translate-x-1";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-600 text-white shadow-cta hover:bg-accent-700 hover:shadow-none",
  white: "bg-white text-navy-950 hover:bg-navy-50",
  dark: "bg-navy-900 text-white hover:bg-navy-800",
  outline:
    "border border-navy-200 bg-white text-navy-900 hover:border-navy-900",
  // Secundaire actie op een donker (navy) vlak.
  "outline-light":
    "border border-white/30 text-white hover:border-white hover:bg-white/5",
  // Secundaire actie op een oranje vlak.
  "outline-dark":
    "border border-white/50 text-white hover:border-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props} />
  );
}
