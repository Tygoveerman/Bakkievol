import { NextResponse, type NextRequest } from "next/server";

/**
 * Domeingestuurde testfase vóór de lancering. Veilig-standaard: op Vercel
 * ziet iedereen de tijdelijke pagina, tenzij expliciet anders ingesteld.
 *
 * - SITE_LIVE=true: lancering — de proxy doet niets, webshop op elk domein.
 * - SHOP_HOSTS (bijv. "test.bakkievol.nl"): alleen hier draait de webshop,
 *   en alleen als TEST_BASIC_AUTH ("gebruiker:wachtwoord") is gezet. Zonder
 *   wachtwoord blijft ook het testdomein dicht.
 * - Alle andere domeinen (bakkievol.nl, www, *.vercel.app) tonen de
 *   statische pagina public/binnenkort.html.
 *
 * Lokaal (buiten Vercel, zonder SHOP_HOSTS) is de proxy uit. Zolang de
 * testfase actief is, krijgt alles `noindex` en blokkeert robots.txt alles.
 */

const COMING_SOON_PAGE = "/binnenkort.html";
const NOINDEX = "noindex, nofollow";

function list(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function noindex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", NOINDEX);
  return response;
}

const disallowAll = () =>
  noindex(
    new NextResponse("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }),
  );

function isAuthorized(request: NextRequest, credentials: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  try {
    return atob(header.slice(6)) === credentials;
  } catch {
    return false;
  }
}

function comingSoon(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  // Geen formulieren of Server Actions (winkelwagen) via de publieke domeinen.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return noindex(new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD" } }));
  }
  if (pathname === "/robots.txt") return disallowAll();
  if (pathname === COMING_SOON_PAGE || pathname.startsWith("/images/")) {
    return noindex(NextResponse.next());
  }
  return noindex(NextResponse.rewrite(new URL(COMING_SOON_PAGE, request.url)));
}

export function proxy(request: NextRequest) {
  if (process.env.SITE_LIVE === "true") return NextResponse.next();

  const shopHosts = list(process.env.SHOP_HOSTS);
  const onVercel = Boolean(process.env.VERCEL_ENV);
  if (!onVercel && shopHosts.length === 0) return NextResponse.next();

  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const credentials = process.env.TEST_BASIC_AUTH ?? "";

  // Webshop alleen op een testdomein mét wachtwoord; anders tijdelijke pagina.
  if (!shopHosts.includes(host) || !credentials.includes(":")) {
    return comingSoon(request);
  }

  if (!isAuthorized(request, credentials)) {
    return noindex(
      new NextResponse("Toegang alleen voor het Bakkievol-team.", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Bakkievol test", charset="UTF-8"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      }),
    );
  }
  if (request.nextUrl.pathname === "/robots.txt") return disallowAll();
  return noindex(NextResponse.next());
}

export const config = {
  // Niet voor build-assets en het favicon; die zijn nodig en onschuldig.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
