// Generated from the settings at the top of gimzdev.sh
export const site = {
  name: "Gimz", url: "https://gimzdev.com", email: "contact@gimzdev.com", github: "gimzdev", repo: "https://github.com/gimzdev/gimzdev", x: "gimzdev", discord: "https://discord.gg/gY5PsymH", patreon: "https://www.patreon.com/gimzdev",
  hdr: ["/hdri/city.hdr", "https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr"], // the orb's lighting, or the original from a CDN if that copy is missing
  prices: { website: "500", webApp: "1,500", hourly: "80" }, // USD, from the price block
  supportOnce: "", booking: "", // empty = not shown
} as const
