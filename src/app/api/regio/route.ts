import { headers } from "next/headers";

/**
 * Regio van de bezoeker op basis van IP, via de geo-headers van Vercel
 * (`x-vercel-ip-country` = "NL", `x-vercel-ip-country-region` = "NH").
 * Lokaal of bij een andere host ontbreken deze headers: dan `null`.
 */
export async function GET() {
  const headerList = await headers();
  const country = headerList.get("x-vercel-ip-country");
  const region = headerList.get("x-vercel-ip-country-region");

  return Response.json(
    { country, region },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
