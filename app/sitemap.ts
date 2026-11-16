import type { MetadataRoute } from "next"
import { offerHref, offers, projects, updated, workHref } from "@/lib/content"
import { site } from "@/lib/site"

// Every page, dated by the content (lib/content.ts `updated`), not by the build
export default function sitemap(): MetadataRoute.Sitemap {
  const at = new Date(updated), page = (path: string, priority: number) => ({ url: path === "/" ? site.url : `${site.url}${path}`, lastModified: at, priority })
  return [page("/", 1), ...offers.map((o) => page(offerHref(o), 0.8)), ...projects.map((p) => page(workHref(p.id), 0.7)), page("/support", 0.4)]
}
