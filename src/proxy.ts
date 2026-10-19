import { NextResponse, type NextRequest } from "next/server";

/**
 * Tijdelijke toegangsbeveiliging vóór de lancering. Veilig-standaard: op
 * Vercel is elk domein (bakkievol.nl, www, *.vercel.app, deployment-URL's)
 * afgeschermd met Basic Auth.
 *
 * - TEST_BASIC_AUTH ("gebruiker:wachtwoord"): de inlog. Ontbreekt hij op
 *   Vercel, dan is de site dicht (503) in plaats van open.
 * - SITE_LIVE=true: lancering — de proxy doet niets meer.
 *
 * Lokaal (buiten Vercel, zonder TEST_BASIC_AUTH) is de proxy uit. Zolang de
 * beveiliging actief is, krijgt alles `noindex` en blokkeert robots.txt alles.
 */

const NOINDEX = "noindex, nofollow";

function noindex(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", NOINDEX);
  return response;
}

/** Vergelijking in constante tijd, zodat het wachtwoord niet te raden is via timing. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function isAuthorized(request: NextRequest, credentials: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return false;
  try {
    return safeEqual(atob(header.slice(6)), credentials);
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (process.env.SITE_LIVE === "true") return NextResponse.next();

  // Opschonen: bij plakken in Vercel komen er soms spaties, regeleinden of aanhalingstekens mee.
  const credentials = (process.env.TEST_BASIC_AUTH ?? "").trim().replace(/^(["'])(.*)\1$/, "$2");
  const onVercel = Boolean(process.env.VERCEL_ENV);
  if (!onVercel && !credentials) return NextResponse.next();

  // Crawlers mogen zonder inlog lezen dat ze niets mogen indexeren.
  if (request.nextUrl.pathname === "/robots.txt") {
    return noindex(
      new NextResponse("User-agent: *\nDisallow: /\n", {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }),
    );
  }

  if (!credentials.includes(":")) {
    return noindex(
      new NextResponse("Bakkievol is tijdelijk niet beschikbaar.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
      }),
    );
  }

  if (!isAuthorized(request, credentials)) {
    return noindex(
      new NextResponse("Toegang alleen voor het Bakkievol-team.", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Bakkievol", charset="UTF-8"',
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }),
    );
  }

  return noindex(NextResponse.next());
}

export const config = {
  // Alles behalve gehashte build-assets (JS/CSS, geen data) en het favicon.
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
