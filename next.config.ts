import type { NextConfig } from "next"

const cache = (source: string, value: string) => ({ source, headers: [{ key: "Cache-Control", value }] })
const security = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "DENY", "Permissions-Policy": "camera=(), microphone=(), geolocation=()", "Strict-Transport-Security": "max-age=31536000; includeSubDomains" }

export default {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // Screenshots and clips keep their names when they are replaced, so browsers check them again on each visit (an
  // unchanged one is a 304) instead of keeping an old copy for up to a week
  async headers() {
    return [{ source: "/(.*)", headers: Object.entries(security).map(([key, value]) => ({ key, value })) }, cache("/media/(.*)", "public, max-age=0, must-revalidate"), cache("/hdri/(.*)", "public, max-age=31536000, immutable")]
  },
  // /favicon.ico gets the same G as the tabs, never an old file in public/
  async rewrites() { return { beforeFiles: [{ source: "/favicon.ico", destination: "/icon" }] } },
} satisfies NextConfig
