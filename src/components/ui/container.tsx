import type { ComponentProps } from "react";

/** Vaste paginabreedte en gutters voor alle secties. */
export function Container({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    />
  );
}
