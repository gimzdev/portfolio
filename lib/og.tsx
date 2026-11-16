import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { projects, ui } from "@/lib/content"
import { site } from "@/lib/site"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// A case study's link picture, drawn at build time from lib/content.ts: the project's name, what it is and its
// address. No file to keep up to date: change the content and the picture follows.
export async function card(id: string) {
  const p = projects.find((x) => x.id === id) ?? projects[0]
  const font = (file: string) => readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans", file))
  const [regular, semibold] = await Promise.all([font("Geist-Regular.ttf"), font("Geist-SemiBold.ttf")])
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", backgroundColor: "#0a0a0d", backgroundImage: "radial-gradient(circle at 88% -10%, rgba(139, 92, 246, 0.42), rgba(10, 10, 13, 0) 55%), radial-gradient(circle at -5% 110%, rgba(109, 40, 217, 0.3), rgba(10, 10, 13, 0) 50%)", color: "#f4f3f8", fontFamily: "Geist" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 600, letterSpacing: -1.5, color: "#a78bfa" }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#9b98a8" }}>{ui.caseStudy}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 116, fontWeight: 600, letterSpacing: -5, lineHeight: 1 }}>{p.title}</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 42, letterSpacing: -1, color: "#c4b5fd" }}>{p.tagline}</div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid rgba(255, 255, 255, 0.16)", paddingTop: 30, fontSize: 28, color: "#9b98a8" }}>{p.link.replace(/^https?:\/\/(www\.)?/, "")}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: regular, weight: 400, style: "normal" }, { name: "Geist", data: semibold, weight: 600, style: "normal" }] },
  )
}
