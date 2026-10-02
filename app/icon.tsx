import { ImageResponse } from "next/og"
import { mark } from "@/lib/brand"

export const size = { width: 96, height: 96 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<img src={mark(false)} width={96} height={96} alt="" />, size)
}
