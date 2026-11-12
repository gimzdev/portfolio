import type { Metadata } from "next"
import { site } from "@/lib/site"

/** A page's title, description and its two language versions (hreflang both ways, English by default) */
export function pageMeta({ title, description, en, fr, lang, absolute = false }: { title: string; description: string; en: string; fr: string; lang: "en" | "fr"; absolute?: boolean }): Metadata {
  const url = lang === "fr" ? fr : en
  return {
    title: absolute ? { absolute: title } : title, description,
    alternates: { canonical: url, languages: { "en-CA": en, "fr-CA": fr, "x-default": en } },
    openGraph: { type: "website", url, siteName: site.name, title, description, locale: lang === "fr" ? "fr_CA" : "en_CA", alternateLocale: lang === "fr" ? "en_CA" : "fr_CA" },
    twitter: { card: "summary_large_image", title, description, creator: `@${site.x}` },
  }
}
