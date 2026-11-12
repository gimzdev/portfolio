import type { MetadataRoute } from "next"
import { offers, projects, updated } from "@/lib/content"
import { site } from "@/lib/site"

// Every page in both languages, dated by the content (lib/content.ts `updated`), not by the build
export default function sitemap(): MetadataRoute.Sitemap {
  const at = new Date(updated), u = (p: string) => (p === "/" ? site.url : `${site.url}${p}`)
  const pair = (en: string, fr: string, priority: number) => [en, fr].map((p) => ({ url: u(p), lastModified: at, priority, alternates: { languages: { "en-CA": u(en), "fr-CA": u(fr) } } }))
  return [
    ...pair("/", "/fr", 1),
    ...offers.flatMap((o) => pair(`/services/${o.en.slug}`, `/fr/services/${o.fr.slug}`, 0.8)),
    ...projects.flatMap((p) => pair(`/work/${p.id}`, `/fr/work/${p.id}`, 0.7)),
    { url: u("/support"), lastModified: at, priority: 0.4 },
  ]
}
