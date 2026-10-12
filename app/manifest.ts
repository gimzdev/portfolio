import type { MetadataRoute } from "next"
import { site } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  return { name: site.name, short_name: site.name, start_url: "/", display: "standalone", background_color: "#0a0a0d", theme_color: "#0a0a0d", icons: [{ src: "/icon", sizes: "192x192", type: "image/png" }] }
}
