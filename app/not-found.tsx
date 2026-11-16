import type { Metadata } from "next"
import { NotFound } from "@/components/client"
import { ui } from "@/lib/content"

// The 404 page: every address no page answers gets it, with the status 404
export const metadata: Metadata = { title: ui.notFound.name, description: ui.notFound.text, robots: { index: false, follow: true } }

export default function Page() {
  return <NotFound />
}
