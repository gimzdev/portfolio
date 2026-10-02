import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { site } from "@/lib/site"
import { person } from "@/lib/content"
import { Header, PointerGlow } from "@/components/client"

// Mono only appears in small labels below the fold: one weight, not preloaded, so it never delays the first paint
const mono = localFont({ src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2", variable: "--font-geist-mono", preload: false, fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"] })

const title = `${site.name} | ${person.role}`
const description = "Software engineer in Montréal building web apps, tools and games. Available for new projects."

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: site.url, siteName: site.name, title, description, locale: "en_CA" },
  twitter: { card: "summary_large_image", title, description, creator: `@${site.x}` },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { viewportFit: "cover", themeColor: "#0a0a0d" }

// Runs before first paint: dark unless the visitor picked light, and marks JS as available (no flash, no blank page without JS)
const boot = `try{var d=document.documentElement;d.classList.add("js");if(localStorage.getItem("theme")==="light")d.dataset.theme="light";if(localStorage.getItem("glow")==="off")d.dataset.glow="off"}catch(e){}`

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: person.role,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Montréal", addressRegion: "QC", addressCountry: "CA" },
  sameAs: [`https://github.com/${site.github}`, `https://x.com/${site.x}`],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${GeistSans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain">
        <PointerGlow />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <Header />
        <main id="main" className="relative z-[1]">{children}</main>
        <footer className="py-10">
          <div className="wrap flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} {site.name}dev</p>
            <p className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
              <a href={site.repo} target="_blank" rel="noopener noreferrer" className="transition hover:text-fg">Source</a>
              <a href="#top" className="transition hover:text-fg">Back to top ↑</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
