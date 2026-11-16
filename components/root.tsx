import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import { person, skillGroups } from "@/lib/content"
import { site } from "@/lib/site"
import { Header, PointerGlow, SiteFooter } from "@/components/client"

// The frame of every page (app/layout.tsx).

// Mono only appears in small labels below the fold: one weight, not preloaded, so it never delays the first paint
const mono = localFont({ src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2", variable: "--font-geist-mono", preload: false, fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"] })

/** What every page shares: the address the others are relative to, the title's shape, the icon. Each page adds its own
 * title, description, canonical address and link picture (lib/meta.ts) */
export const rootMeta: Metadata = {
  metadataBase: new URL(site.url), title: { default: site.name, template: `%s | ${site.name}` }, applicationName: site.name, authors: [{ name: site.name, url: site.url }], robots: { index: true, follow: true },
  icons: { icon: [{ url: "/icon", sizes: "192x192", type: "image/png" }], shortcut: "/icon", apple: [{ url: "/icon", sizes: "192x192", type: "image/png" }] }, // one icon for every device
}
export const rootViewport: Viewport = { viewportFit: "cover", themeColor: "#0a0a0d" }

// Before first paint: dark unless the visitor picked light, and JS marked as available (no flash, no blank page without
// JS). The contact form is sent by script only: a click on Send before the page is interactive must never put a name, an
// email and a message in the address bar
const boot = `try{var d=document.documentElement;d.classList.add("js");addEventListener("submit",function(e){e.preventDefault()},true);if(localStorage.getItem("theme")==="light")d.dataset.theme="light";if(localStorage.getItem("glow")==="off")d.dataset.glow="off"}catch(e){}`

export function Root({ children }: { children: React.ReactNode }) {
  // Who made the site and what the site is, for search engines: the case studies and service pages point back to these
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": `${site.url}/#person`, name: site.name, url: site.url, jobTitle: person.role, email: `mailto:${site.email}`,
        address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" }, sameAs: [`https://github.com/${site.github}`, `https://x.com/${site.x}`], knowsAbout: skillGroups.flatMap((g) => g.items) },
      { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url: site.url, description: person.description, inLanguage: "en-CA", publisher: { "@id": `${site.url}/#person` } },
    ],
  }
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${GeistSans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain">
        <PointerGlow />
        <Header />
        <main id="main" tabIndex={-1} className="relative z-[1] outline-none">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
