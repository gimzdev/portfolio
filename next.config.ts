import type { NextConfig } from "next"

const cache = (source: string, value: string) => ({ source, headers: [{ key: "Cache-Control", value }] })

export default {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
      cache("/images/(.*)", "public, max-age=86400, stale-while-revalidate=604800"),
      cache("/hdri/(.*)", "public, max-age=31536000, immutable"),
    ]
  },
  // Anything that asks for /favicon.ico directly gets the same G as the tabs, never an old file in public/
  async rewrites() {
    return { beforeFiles: [{ source: "/favicon.ico", destination: "/icon" }] }
  },
} satisfies NextConfig
