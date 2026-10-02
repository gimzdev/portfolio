import type { MetadataRoute } from "next"
import { site } from "@/lib/site"

export default function manifest(): MetadataRoute.Manifest {
  const icons = [{ src: "/icon", sizes: "96x96", type: "image/png" }, { src: "/apple-icon", sizes: "180x180", type: "image/png" }]
  return { name: site.name, short_name: site.name, start_url: "/", display: "standalone", background_color: "#0a0a0d", theme_color: "#0a0a0d", icons }
}
