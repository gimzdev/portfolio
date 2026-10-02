import type { SVGProps } from "react"

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const
const solid = { fill: "currentColor" } as const
const icon = (d: string, style: typeof line | typeof solid = line) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
    return <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden {...style} {...props}><path d={d} /></svg>
  }

export const ArrowUpRight = icon("M7 17 17 7M8 7h9v9")
export const ArrowRight = icon("M5 12h14M13 6l6 6-6 6")
export const ArrowDown = icon("M12 5v14M6 13l6 6 6-6")
export const Check = icon("m5 12.5 4.5 4.5L19 7.5")
export const Copy = icon("M11.5 9h6a2.5 2.5 0 0 1 2.5 2.5v6a2.5 2.5 0 0 1-2.5 2.5h-6A2.5 2.5 0 0 1 9 17.5v-6A2.5 2.5 0 0 1 11.5 9ZM5 15V6.5A2.5 2.5 0 0 1 7.5 4H15")
export const Expand = icon("M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7")
export const Shrink = icon("M4 14h6v6M20 10h-6V4M14 10l6-6M10 14l-6 6")
export const Sun = icon("M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4")
export const Moon = icon("M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z")
export const Menu = icon("M4 8h16M4 16h16")
export const Close = icon("M6 6l12 12M18 6 6 18")
export const Github = icon("M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.9.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z", solid)
export const X = icon("M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.15h1.7L7.4 4.75H5.58l11.09 14.4Z", solid)
export const Discord = icon("M19.27 5.33A16.6 16.6 0 0 0 15.1 4l-.2.4a15 15 0 0 1 3.7 1.2 12.5 12.5 0 0 0-5-1.3h-3.2a12.5 12.5 0 0 0-5 1.3A15 15 0 0 1 9.1 4.4L8.9 4a16.6 16.6 0 0 0-4.17 1.33C2.1 9.2 1.4 13 1.75 16.7A16.7 16.7 0 0 0 6.8 19.3l1.1-1.8a10.9 10.9 0 0 1-1.7-.8l.4-.3c3.3 1.5 6.9 1.5 10.2 0l.4.3c-.55.3-1.1.57-1.7.8l1.1 1.8a16.7 16.7 0 0 0 5.05-2.6c.42-4.3-.7-8.1-2.38-11.37ZM9.5 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z", solid)
