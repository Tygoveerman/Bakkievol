import { CategoryFilter } from "@/components/product/category-filter";
import { ProductCard } from "@/components/product/product-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/lib/commerce";

export function WasteTypes({
  products,
  showHeading = true,
}: {
  products: Product[];
  /** false op /containers, waar de paginakop de H1 is. */
  showHeading?: boolean;
}) {
  return (
    <section
      id="afvalsoorten"
      aria-labelledby={showHeading ? "afvalsoorten-title" : undefined}
      aria-label={showHeading ? undefined : "Afvalsoorten"}
      className="scroll-mt-20 pt-10 pb-16 lg:pt-14 lg:pb-24"
    >
      <Container>
        {showHeading && (
        <SectionHeading
            id="afvalsoorten-title"
            eyebrow="Afvalsoorten"
            title="Welke container past bij jouw afval?"
            intro="Per afvalsoort zie je direct wat er wel en niet in mag. Zo kies je meteen goed en betaal je nooit onverwacht bij."
          />
        )}
        <div className={showHeading ? "mt-8" : ""}>
          <CategoryFilter
            allLabel="Alle afvalsoorten"
            items={products.map((product) => ({
              key: product.id,
              category: product.productType,
              node: <ProductCard product={product} />,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
