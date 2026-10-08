import { ImageResponse } from "next/og"
import { mark } from "@/lib/brand"

export const size = { width: 192, height: 192 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<img src={mark(false)} width={192} height={192} alt="" />, size)
}
