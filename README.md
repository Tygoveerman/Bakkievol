# Bakkievol webshop

Headless storefront voor Bakkievol. Next.js (App Router), TypeScript, Tailwind CSS.
Shopify wordt later de backend (producten, voorraad, cart, checkout, betalingen, orders).
Voorlopig draait alles op lokale mock-data.

## Lokaal draaien

```bash
npm install
cp .env.example .env.local   # optioneel, alleen nodig om waarden te overschrijven
npm run dev                  # http://localhost:3000
```

| Script              | Doel                         |
| ------------------- | ---------------------------- |
| `npm run dev`       | Development server           |
| `npm run build`     | Productiebuild               |
| `npm run start`     | Productiebuild serveren      |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | TypeScript-check (`tsc`)     |

## Structuur

```
src/
  app/                    Routes (Server Components)
    page.tsx              /
    producten/page.tsx    /producten
    producten/[handle]/   /producten/[handle]  (statisch gegenereerd)
    winkelwagen/page.tsx  /winkelwagen         (dynamisch, leest cart-cookie)
    sitemap.ts, robots.ts
  components/
    ui/                   Basisbouwstenen: Button, Container, SectionHeading, Icon, Stars
    layout/               Header, mobiel menu, USP-balk, footer, logo
    product/              ProductCard, ProductGrid, CategoryFilter
    order/                Bestel-keuzehulp (configurator), formaatkeuzehulp, levermelding, postcodecheck
    home/                 Homepage-secties
  content/home.ts         Redactionele homepage-content (USP's, FAQ, reviews — reviews zijn VOORBEELDEN)
  lib/
    commerce/             Commerce-laag: de enige bron van data voor de UI
      types.ts            Product, ProductVariant, ProductImage, Money, Cart, CartItem
      products.ts         getProducts(), getProduct(handle), getFeaturedProducts()
      cart.ts             getCart(), addToCart(), updateCartLine(), removeFromCart()
      actions.ts          Server Actions voor cart-formulieren
      money.ts            formatMoney()
      index.ts            Publieke API — importeer uit "@/lib/commerce"
    mock-data/            Tijdelijke data, alleen gebruikt door lib/commerce
    site.ts               Site-config (naam, URL, contact)
    delivery.ts           Leverregels: cutoff 11:00, leverdagen, postcodegebied (CONCEPT)
```

### Design tokens

Gedefinieerd in `src/app/globals.css` (`@theme`): `navy-*` en `accent-*` (oranje),
`font-display` (Inter Tight) en `font-sans` (Inter), `shadow-card`. Oranje vlakken
krijgen navy tekst (AA-contrast); oranje tekst op wit gebruikt `accent-700`.

### Productmodel

Eén Shopify-product per afvalsoort, met optie **Formaat** (3–20 m³) als varianten.
Afbeeldingen in `public/images/temp/` zijn tijdelijk uit screenshots van de oude site gesneden.

### Regels

- Componenten en pagina's importeren alleen uit `@/lib/commerce`, nooit uit `mock-data`.
- Types volgen de Shopify Storefront API (GIDs, `Money` met string-bedrag, options/variants, cart lines).
- Productdata wordt gecachet met `'use cache'` + `cacheTag('products')`, zodat een Shopify-webhook later gericht kan revalideren.
- Afrekenen bouwen we niet zelf. `Cart.checkoutUrl` wordt de Shopify-checkout.

## Shopify koppelen (later)

1. Vul de `SHOPIFY_*`-variabelen in `.env.local` en in Vercel in.
2. Vervang de bodies in `lib/commerce/products.ts` en `lib/commerce/cart.ts` door Storefront API-queries/mutations. De signaturen blijven gelijk.
3. In `cart.ts` bewaart de cookie dan alleen het Shopify cart-ID.
4. Verwijder `lib/mock-data`.
