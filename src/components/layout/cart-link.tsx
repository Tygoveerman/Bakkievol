import Link from "next/link";
import { Suspense } from "react";

import { Icon } from "@/components/ui/icon";
import { getCart } from "@/lib/commerce";

const linkClass =
  "relative inline-flex size-11 items-center justify-center rounded-full text-navy-900 transition-colors hover:bg-navy-50";

/** Winkelwagen-icoon. Het aantal leest de cart-cookie en streamt dus apart. */
export function CartLink() {
  return (
    <Suspense fallback={<CartIcon count={0} />}>
      <CartLinkWithCount />
    </Suspense>
  );
}

async function CartLinkWithCount() {
  const cart = await getCart();
  return <CartIcon count={cart.totalQuantity} />;
}

function CartIcon({ count }: { count: number }) {
  return (
    <Link
      href="/winkelwagen"
      className={linkClass}
      aria-label={
        count > 0 ? `Winkelwagen, ${count} item${count === 1 ? "" : "s"}` : "Winkelwagen"
      }
    >
      <Icon name="cart" className="size-6" />
      {count > 0 && (
        <span className="absolute top-1 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[11px] leading-5 font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
