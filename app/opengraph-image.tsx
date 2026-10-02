import { ImageResponse } from "next/og"
import { site } from "@/lib/site"
import { person } from "@/lib/content"

export const alt = `${site.name} | ${person.role}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0a0a0d", color: "#f4f3f8", position: "relative" }}>
        <div style={{ position: "absolute", top: -240, right: -120, width: 900, height: 900, borderRadius: 900, background: "radial-gradient(closest-side, rgba(139,92,246,0.42), rgba(139,92,246,0))" }} />
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -1, color: "#c4b5fd" }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, lineHeight: 1.02, letterSpacing: -5, fontWeight: 600 }}>Hi, I&rsquo;m {site.name}</div>
          <div style={{ marginTop: 20, fontSize: 38, color: "#9b98a8", display: "flex" }}>{person.role} · {person.location}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8b5cf6" }}>{site.url.replace("https://", "")}</div>
      </div>
    ),
    size,
  )
}
