export const siteConfig = {
  name: "Bakkievol",
  title: "Bakkievol — Container huren in Noord-Holland",
  description:
    "Container huren zonder gedoe. All-in prijzen, voor 11:00 besteld is vaak dezelfde dag geleverd in Noord-Holland. Kies je afvalsoort en formaat.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  contact: {
    phone: "085 123 4563",
    phoneHref: "tel:+31851234563",
    email: "info@bakkievol.nl",
    hours: "Ma – za, 07:00 – 20:00",
    area: "Noord-Holland",
  },
};
