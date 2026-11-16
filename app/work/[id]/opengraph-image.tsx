import { projects } from "@/lib/content"
import { card, contentType, size } from "@/lib/og"

export { contentType, size }
export const alt = "A case study on gimzdev.com: the project’s name, what it is and its address"
export const dynamicParams = false
export const generateStaticParams = () => projects.map((p) => ({ id: p.id }))

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  return card((await params).id)
}
