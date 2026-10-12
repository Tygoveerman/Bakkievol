import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { siteConfig } from "@/lib/site";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    locale: "nl_NL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#16293a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: browserextensies zetten attributen op <body>. */}
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-white font-sans text-navy-900"
      >
        {/* Motion: alleen aan met JS en zonder "minder beweging"; valt na 8s terug op zichtbaar als de JS-bundle niet laadt */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.classList.add("motion-ready");setTimeout(function(){if(!d.classList.contains("motion-live"))d.classList.remove("motion-ready")},8000)})();`,
          }}
        />
        <SmoothScroll />
        <RevealObserver />
        <a
          href="#inhoud"
          className="sr-only z-[60] rounded-full bg-navy-900 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Naar de inhoud
        </a>
        <Header />
        <main id="inhoud" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
