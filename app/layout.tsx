import "./globals.css"
import { Root, rootMeta, rootViewport } from "@/components/root"

export const metadata = rootMeta
export const viewport = rootViewport

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Root>{children}</Root>
}
