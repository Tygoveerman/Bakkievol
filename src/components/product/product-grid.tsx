import type { Product } from "@/lib/commerce";

import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
