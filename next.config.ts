import type { NextConfig } from "next"

const cache = (source: string, value: string) => ({ source, headers: [{ key: "Cache-Control", value }] })
const security = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "DENY", "Permissions-Policy": "camera=(), microphone=(), geolocation=()", "Strict-Transport-Security": "max-age=31536000; includeSubDomains" }

export default {
  poweredByHeader: false,
  productionBrowserSourceMaps: true, // the code is public anyway (the repository): a visitor's dev tools show it readable
  images: { formats: ["image/avif", "image/webp"] },
  // Screenshots and clips keep their names when they are replaced, so browsers check them again on each visit (an
  // unchanged one is a 304) instead of keeping an old copy for up to a week
  async headers() {
    return [{ source: "/(.*)", headers: Object.entries(security).map(([key, value]) => ({ key, value })) }, cache("/media/(.*)", "public, max-age=0, must-revalidate"), cache("/hdri/(.*)", "public, max-age=31536000, immutable")]
  },
  // /favicon.ico gets the same G as the tabs, never an old file in public/
  async rewrites() { return { beforeFiles: [{ source: "/favicon.ico", destination: "/icon" }] } },
  // gimzdev.com/mosaik opens Mosaik's site: a link without the accented i, which Messenger's app trips over.
  // The site had French pages under /fr for a few days in November 2026: their addresses lead to the same page
  async redirects() {
    return [
      { source: "/mosaik", destination: "https://xn--mosak-fta.com/", permanent: false },
      { source: "/fr", destination: "/", permanent: true },
      { source: "/fr/services/developpeur-applications-web-montreal", destination: "/services/web-app-developer-montreal", permanent: true },
      { source: "/fr/services/conception-site-web-montreal", destination: "/services/website-developer-montreal", permanent: true },
      { source: "/fr/services/corrections-et-mises-a-jour", destination: "/services/web-app-fixes-and-updates", permanent: true },
      { source: "/fr/:path*", destination: "/:path*", permanent: true },
    ]
  },
} satisfies NextConfig
