import { ImageResponse } from "next/og"
import { mark } from "@/lib/brand"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(<img src={mark(true)} width={180} height={180} alt="" />, size)
}
