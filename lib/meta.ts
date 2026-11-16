import type { Metadata } from "next"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { site } from "@/lib/site"

// The link picture: app/opengraph-image.jpg, which gimzdev.sh writes from media/gimzdev/gimzdev-social-preview.jpg and
// the site serves at /opengraph-image.jpg. Every page names it itself, with its size and what it shows (a page's own
// Open Graph block replaces any inherited one, picture included), except the case studies, which draw their own
const file = (name: string) => join(process.cwd(), "app", name)
/** A JPEG's width and height, read from its first start-of-frame marker */
function jpegSize(b: Buffer): { width: number; height: number } | undefined {
  for (let i = 2; i + 9 < b.length; ) {
    if (b[i] !== 0xff) return
    const marker = b[i + 1]
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) }
    i += 2 + b.readUInt16BE(i + 2)
  }
}
const picture = existsSync(file("opengraph-image.jpg"))
  ? [{ url: "/opengraph-image.jpg", type: "image/jpeg", ...jpegSize(readFileSync(file("opengraph-image.jpg"))), alt: existsSync(file("opengraph-image.alt.txt")) ? readFileSync(file("opengraph-image.alt.txt"), "utf8").trim() : site.name }]
  : undefined

/** A description cut for search results: whole sentences when they fit, otherwise whole words and an ellipsis */
export function clip(text: string, max = 160): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max + 1), stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "))
  if (stop > max * 0.5) return cut.slice(0, stop + 1)
  return `${cut.slice(0, cut.lastIndexOf(" ", max - 1)).replace(/[,;:\s]+$/, "")}…`
}

/** A page's title, description and address. `own`: the page draws its own link picture (an opengraph-image file
 * beside it), so the site's is not named */
export function pageMeta({ title, description, path, absolute = false, own = false }: { title: string; description: string; path: string; absolute?: boolean; own?: boolean }): Metadata {
  const images = own ? undefined : picture
  return {
    title: absolute ? { absolute: title } : title, description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: site.name, title, description, locale: "en_CA", ...(images && { images }) },
    twitter: { card: "summary_large_image", title, description, creator: `@${site.x}`, ...(images && { images }) },
  }
}
